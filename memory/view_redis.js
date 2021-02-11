// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const a_database = require('../api/database');
const a_syncdatabase = require('../api/syncdatabase');

const logger = require('../etc/logger');
const redis = require('../api/redis');
const redis_sub = require('../api/redis_sub');

redis_sub.psubscribe('*').then(function(e) {
  redis_sub.on('pmessage', function(pattern, message, channel) {
    if (message.toString().startsWith('__keyevent') &&
        message.toString().endsWith('expire')) {
      // This method must called only one per keyevent.
      redis.zincrby(channel.split('-')[0], -1, channel.split('-')[1]);
    }
  });
});

function append(no) {
  var now = new Date();
  var key_name = no.toString() + '-' + now;

  redis.zincrby('alltime', 1, no);

  redis.zincrby('daily', 1, no);
  redis.set('daily-' + key_name, 1);
  redis.expire('daily-' + key_name, 1 * 1000 * 60 * 60 * 24);

  redis.zincrby('weekly', 1, no);
  redis.set('weekly-' + key_name, 1);
  redis.expire('weekly-' + key_name, 7 * 1000 * 60 * 60 * 24);

  redis.zincrby('monthly', 1, no);
  redis.set('monthly-' + key_name, 1);
  redis.expire('monthly-' + key_name, 30 * 1000 * 60 * 60 * 24);
}

function query(group, offset, count, resolve) {
  redis.zrange(group, offset, count, (err, reply) => {
    resolve(reply);
  });
}

var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };

module.exports = {
  append: function(no, userid) {
    try {
      logger.info('view-append %d %s', no, userid);
      append(no);
    } catch (e) {
      logger.error('view-append');
      logger.error(e);
      console.log(e);
    }

    var pool = a_database();
    pool.query(
        'INSERT INTO viewtotal SET ?', {
          ArticleId: no,
          TimeStamp: CURRENT_TIMESTAMP,
          UserAppId: userid,
        },
        function(error, results, fields) {
          if (error != null) {
            logger.error('viewdb', error);
          }
        });
  },

  query: function(offset, count, type) {
    if (count > 10000) {
      resolve(null);
      return;
    }
    return new Promise(function(resolve, reject) {
      switch (type) {
        case 'daily':
          query('daily', offset, count, resolve);
          break;
        case 'week':
          query('weekly', offset, count, resolve);
          break;
        case 'month':
          query('monthly', offset, count, resolve);
          break;
        case 'alltime':
          query('alltime', offset, count, resolve);
          break;
      }
      resolve(null);
    });
  },
};
