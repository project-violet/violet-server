// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const a_database = require("../api/database");
const a_syncdatabase = require("../api/syncdatabase");

const logger = require("../etc/logger");
const redis = require("../api/redis");
const redis_sub = require("../api/redis_sub");

function init() {
  var conn = a_syncdatabase();
  var count = conn.query("SELECT COUNT(*) AS C FROM viewtotal")[0]['C'];

  const load_per = 50000;
  var offset = 0;

  var now = new Date();

  for (;;) {
    var qr = conn.query("SELECT * FROM viewtotal ORDER BY Id DESC LIMIT " + load_per.toString() + " OFFSET " + offset.toString());
    data = qr;

    for (var i = 0; i < data.length; i++) {
      var diff = now - new Date(data[i].TimeStamp);
      
      redis.zincrby('alltime', 1, data[i].ArticleId);
  
      var key_name = data[i].ArticleId + i.toString();
      
      if (diff < 1 * 1000 * 60 * 60 * 24 && diff > 0) {
        redis.zincrby('daily', 1, data[i].ArticleId);
        redis.set('daily-' + key_name, 1);
        redis.expire('daily-' + key_name, diff);
      }
      if (diff < 7 * 1000 * 60 * 60 * 24 && diff > 0) {
        redis.zincrby('weekly', 1, data[i].ArticleId);
        redis.set('weekly-' + key_name, 1);
        redis.expire('weekly-' + key_name, diff);
      }
      if (diff < 30 * 1000 * 60 * 60 * 24 && diff > 0) {
        redis.zincrby('monthly', 1, data[i].ArticleId);
        redis.set('monthly-' + key_name, 1);
        redis.expire('monthly-' + key_name, diff);
      }
    }

    offset += load_per;
    if (offset < count) break;
  }
}

redis_sub.psubscribe('*').then(function (e) {
  redis_sub.on('pmessage', function(pattern, message, channel) {
    if (message.toString().endsWith('expired')) {
      redis.zincrby(channel, -1)
    }
  });
});

init();

function append(no) {
}

module.exports = {
    append: function (no, userid) {
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
        "INSERT INTO viewtotal SET ?",
        {
          ArticleId: no,
          TimeStamp: CURRENT_TIMESTAMP,
          UserAppId: userid,
        },
        function (error, results, fields) {
          if (error != null) {
            logger.error("viewdb", error);
          }
        }
      );
    },
  
    query: function (offset, count, type) {
       return new Promise(function(resolve, reject) {
        switch (type) {
          case "daily":
            resolve(daily.query(offset, count).map((e) => [e.k, e.v]));
            break;
          case "week":
            resolve(week.query(offset, count).map((e) => [e.k, e.v]));
            break;
          case "month":
            resolve(month.query(offset, count).map((e) => [e.k, e.v]));
            break;
          case "alltime":
            resolve(alltime.query(offset, count).map((e) => [e.k, e.v]));
            break;
        }
        resolve(null);
      });
    },
  };
  