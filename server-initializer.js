//===----------------------------------------------------------------------===//
//
//                       Violet API Server Initializer
//
//===----------------------------------------------------------------------===//
//
//  Copyright (C) 2021. violet-team. All Rights Reserved.
//
//===----------------------------------------------------------------------===//

const a_syncdatabase = require('./api/syncdatabase');

const redis = require('./api/redis');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function init() {
  redis.get('initialized', async (err, reply) => {
    if (reply == '1') {
        console.log('[init] Memory is already ready!')
        //return;
    }

    redis.flushall();

    var conn = a_syncdatabase();
    var count = conn.query('SELECT COUNT(*) AS C FROM viewtotal')[0]['C'];

    console.log('[init] ' + count + ' datas ready to load.');

    const load_per = 5000;
    var offset = 0;

    var now = new Date();

    for (;;) {
      var data = conn.query(
          'SELECT * FROM viewtotal ORDER BY Id DESC LIMIT ' +
          load_per.toString() + ' OFFSET ' + offset.toString());

      for (var i = 0; i < data.length; i++) {
        var diff = now - new Date(data[i].TimeStamp);

        redis.zincrby('alltime', 1, data[i].ArticleId);

        var key_name = data[i].ArticleId + '-' + i.toString();

        if (diff < 1 * 1000 * 60 * 60 * 24 && diff > 0) {
          redis.zincrby('daily', 1, data[i].ArticleId);
          redis.set('daily-' + key_name, 1);
          redis.expire('daily-' + key_name, diff / 1000);
        }
        if (diff < 7 * 1000 * 60 * 60 * 24 && diff > 0) {
          redis.zincrby('weekly', 1, data[i].ArticleId);
          redis.set('weekly-' + key_name, 1);
          redis.expire('weekly-' + key_name, diff / 1000);
        }
        if (diff < 30 * 1000 * 60 * 60 * 24 && diff > 0) {
          redis.zincrby('monthly', 1, data[i].ArticleId);
          redis.set('monthly-' + key_name, 1);
          redis.expire('monthly-' + key_name, diff / 1000);
        }
      }

      await sleep(200);

      offset += load_per;
      console.log(
          '[init] ' + offset + '/' + count + ' (' + (offset / count * 100) +
          '%)');
      if (offset > count || data.length == 0) break;
    }

    redis.set('initialized', '1');
    redis.set('latest-update', new Date().toString());

    await sleep(200);

    console.log('[init] Server is initialized successfully!');
  });
}

init();