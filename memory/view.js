// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const a_database = require("../api/database");
const a_syncdatabase = require("../api/syncdatabase");

const logger = require("../etc/logger");

var data = [];

function init() {
  var conn = a_syncdatabase();
  var qr = conn.query("SELECT * FROM viewtotal");
  data = qr;
}

// init();

class Ranking {
  constructor(days) {
    this.days = days;

    var rankmap = {};
    var now = new Date();
    for (var i = 0; i < data.length; i++) {
      var diff = now - new Date(data[i].TimeStamp);
      if (diff > days * 1000 * 60 * 60 * 24 || diff < 0) continue;
      if (rankmap[data[i].ArticleId] == undefined)
        rankmap[data[i].ArticleId] = 1;
      else rankmap[data[i].ArticleId] += 1;
    }

    this.rank = [];
    this.rankindex = {};

    if (rankmap.length == 0) return;

    for (const [k, v] of Object.entries(rankmap)) {
      this.rank.push({ k: parseInt(k), v: v });
    }

    this.rank.sort((a, b) => b.v - a.v);

    for (var i = 0; i < this.rank.length; i++) {
      this.rankindex[this.rank[i].k] = i;
    }
  }
  append(no) {
    if (this.rankindex[no] == undefined) {
      this.rank.push({ k: no, v: 1 });
      this.rankindex[no] = this.rank.length - 1;
    } else {
      var index = this.rankindex[no];
      this.rank[index].v += 1;
      console.log('%d, %d, %d', no, this.rank[index].k, this.rank[index].v);
      if (index != 0 && this.rank[index - 1].v <= this.rank[index].v) {
        // Change one by one to keep the sequence of the existing array
        for (; index > 0; index--) {
          // Most recently updated item is brought to the top.
          if (this.rank[index - 1].v > this.rank[index].v) break;

          var tk = this.rank[index - 1].k;
          var tv = this.rank[index - 1].v;
          this.rank[index - 1].k = this.rank[index].k;
          this.rank[index - 1].v = this.rank[index].v;
          this.rank[index].k = tk;
          this.rank[index].v = tv;

          this.rankindex[this.rank[index - 1].k] = index - 1;
          this.rankindex[this.rank[index].k] = index;
        }
      }
    }
  }
  query(offset, count) {
    if (offset + count - 1 > this.rank.length) {
      return this.rank.slice(offset);
    }
    return this.rank.slice(offset, offset + count);
  }
}

var daily = new Ranking(1);
var week = new Ranking(7);
var month = new Ranking(31);
var alltime = new Ranking(365 * 999);

function sync() {
  var pool = a_database();
  var qr = pool.query("SELECT * FROM viewtotal", function (
    error,
    results,
    fields
  ) {
    if (error != null) {
      logger.error("view-sync");
      logger.error(error);
    } else {
      data = results;

      tdaily = new Ranking(1);
      tweek = new Ranking(7);
      tmonth = new Ranking(31);
      talltime = new Ranking(365 * 999);

      daily = tdaily;
      week = tweek;
      month = tmonth;
      alltime = talltime;
    }
  });
}

setInterval(sync, 1000 * 60 * 60);

function append(no) {
  daily.append(no);
  week.append(no);
  month.append(no);
  alltime.append(no);
}

var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };

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
