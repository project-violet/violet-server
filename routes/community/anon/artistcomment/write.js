// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require("joi");

const r_auth = require("../../../../auth/auth");
const a_database = require("../../../../api/database");

const logger = require("../../../../etc/logger");

const writeSchema = Joi.object({
  UserAppId: Joi.string().max(150).required(),
  Body: Joi.string().max(500).required(),
  ArtistName: Joi.string().max(100).required(),
});

// {userAppId, dateTime}
var rateLimit = [];

function diff_minutes(dt2, dt1) {
  var diff = (dt2 - dt1) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

function removeExpired() {
  var now = Date.now();
  for (var i = 0; i < rateLimit.length; i++) {
    if (diff_minutes(rateLimit[i][1], now) >= 1) {
      rateLimit.splice(i, 1);
      i--;
    }
  }
}

function checkValid(userAppId) {
  for (var i = 0; i < rateLimit.length; i++) {
    if (rateLimit[i][0] == userAppId) {
      return false;
    }
  }
  return true;
}

function push(userAppId) {
  rateLimit.push([userAppId, Date.now()]);
}

module.exports = async function read(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type("json").send({ msg: "forbidden" });
    return;
  }

  try {
    await writeSchema.validateAsync(req.body);

    removeExpired();

    if (!checkValid(req.body.UserAppId)) {
      res.status(400).type("json").send({ msg: "too many requests" });
    }

    push(req.body.UserAppId);

    var pool = a_database();
    pool.query(
      "INSERT INTO artistcomment SET ?",
      {
        ...req.body,
        TimeStamp: {
          toSqlString: function () {
            return "CURRENT_TIMESTAMP()";
          },
        },
      },
      function (error, results, fields) {
        if (error != null) {
          logger.error("write-artist-comment", error);
        }
      }
    );

    res.status(200).type("json").send({ msg: "success" });
  } catch (e) {
    res.status(400).type("json").send({ msg: "bad request" });
  }
};
