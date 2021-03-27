// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const {promisify} = require('util');

const a_database = require('../api/database');
const a_syncdatabase = require('../api/syncdatabase');

const logger = require('../etc/logger');
const redis = require('../api/redis');
const redis_sub = require('../api/redis_sub');

// redis_sub.psubscribe('*').then(function(e) {
//   redis_sub.on('pmessage', function(pattern, message, channel) {
//     console.log(message, channel);
//     if (message.toString().startsWith('__keyevent') &&
//         message.toString().endsWith('expired')) {
//       // This method must called only one per keyevent.
//       logger.info('expired %s', channel);
//       redis.zincrby(channel.split('-')[0], -1, channel.split('-')[1]);
//     }
//   });
// });

function append(no) {
  var now = new Date();
  var key_name = no.toString() + '-' + now;

  redis.zincrby('alltime', 1, no);

  redis.zincrby('daily', 1, no);
  redis.setex('daily-' + key_name, 1 * 60 * 60 * 24, '1');

  redis.zincrby('weekly', 1, no);
  redis.setex('weekly-' + key_name, 7 * 60 * 60 * 24, '1');

  redis.zincrby('monthly', 1, no);
  redis.setex('monthly-' + key_name, 30 * 60 * 60 * 24, '1');
}

var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };

module.exports = {
  append: function(no, userid, seconds) {
    try {
      logger.info('view-close-append %d %s %s', no, userid, seconds);
      append(no);
    } catch (e) {
      logger.error('view-close-append');
      logger.error(e);
      console.log(e);
    }

    var pool = a_database();
    pool.query(
        'INSERT INTO viewtime SET ?', {
          ArticleId: no,
          TimeStamp: CURRENT_TIMESTAMP,
          ViewSeconds: seconds,
          UserAppId: userid,
        },
        function(error, results, fields) {
          if (error != null) {
            logger.error('viewdb', error);
          }
        });
  },
};
