//===----------------------------------------------------------------------===//
//
//                       Violet API Server Initializer
//
//===----------------------------------------------------------------------===//
//
//  Copyright (C) 2021. violet-team. All Rights Reserved.
//
//===----------------------------------------------------------------------===//

const a_syncdatabase = require("./api/syncdatabase");

const path = require("path");
const redis = require("./api/redis");

const fs = require("fs");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function _cacheViewTime() {
  const conn = a_syncdatabase();

  for (var i = 0; i < 100; i++) {
    const data = conn.query(
      `SELECT TimeStamp, ArticleId, UserAppId FROM viewtime WHERE ViewSeconds>=24 
          order by Id limit 500000 offset ` + (i * 500000).toString()
    );
    const dataPath = path.resolve(
      __dirname,
      "viewtime-cache-" + i.toString() + ".json"
    );

    console.log(data.length);
    console.log(data[0]);

    fs.writeFileSync(
      dataPath,
      JSON.stringify(
        data.map((x) => "(" + x["ArticleId"] + "," + x["TimeStamp"] + "," + x["UserAppId"] + ")")
      ),
      function (err) {
        console.log(err);
        process.exit();
      }
    );
  }
}

async function init() {
  redis.get("initialized", async (err, reply) => {
    if (reply == "1") {
      console.log("[init] Memory is already ready!");
      //return;
    }

    // redis.flushall();

    // var conn = a_syncdatabase();
    // var count = conn.query("SELECT COUNT(*) AS C FROM viewtime")[0]["C"];
    var count = 0;

    console.log("[init] " + count + " datas ready to load.");

    const load_per = 500000;
    var offset = 0;

    var now = new Date();

    const w = fs.openSync("test.txt", "a");

    for (var j = 0; j < 39; j++) {
      // var data = conn.query(
      //   "SELECT ArticleId, TimeStamp, ViewSeconds FROM viewtime ORDER BY Id DESC LIMIT " +
      //     load_per.toString() +
      //     " OFFSET " +
      //     offset.toString()
      // );
      const dataPath = path.resolve(
        __dirname,
        "viewtime-cache-" + j.toString() + ".json"
      );
      var data = JSON.parse(fs.readFileSync(dataPath));

      for (var i = 0; i < data.length; i++) {
        var diff = now - new Date(data[i].split(",")[1].split(")")[0]);
        var articleId = data[i].split(",")[0].split("(")[1];

        fs.appendFileSync(w, "zincrby alltime 1 " + articleId + "\n");

        var key_name = articleId + "-" + i.toString();

        if (diff < 1 * 1000 * 60 * 60 * 24 && diff > 0) {
          fs.appendFileSync(w, "zincrby daily 1 " + articleId + "\n");
          fs.appendFileSync(
            w,
            "setex daily-" + key_name + " " + ((diff / 1000) | 0) + " 1\n"
          );
        }
        if (diff < 7 * 1000 * 60 * 60 * 24 && diff > 0) {
          fs.appendFileSync(w, "zincrby weekly 1 " + articleId + "\n");
          fs.appendFileSync(
            w,
            "setex weekly-" + key_name + " " + ((diff / 1000) | 0) + " 1\n"
          );
        }
        if (diff < 30 * 1000 * 60 * 60 * 24 && (diff > 0) | 0) {
          fs.appendFileSync(w, "zincrby monthly 1 " + articleId + "\n");
          fs.appendFileSync(
            w,
            "setex monthly-" + key_name + " " + ((diff / 1000) | 0) + " 1\n"
          );
        }
      }

      offset += load_per;
      console.log(
        "[init] " + offset + "/" + count + " (" + (offset / count) * 100 + "%)"
      );
    }

    await sleep(200);

    console.log("[init] Server is initialized successfully!");
  });
}

init();
// _cacheViewTime();
