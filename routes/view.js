// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

const config = require("config");

var r_auth = require("../auth/auth");
var r_database = require("../api/database");
const logger = require("../etc/logger");

var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };

// This function is triggered when the user reads a specific article.
module.exports = async function view(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("json").send({ msg: "forbidden" });
    return;
  }

  if (req.body["no"] == null || req.body["user"] == null) {
    res.status(400).type("json").send({ msg: "bad request" });
    return;
  }

  var no = parseInt(req.body["no"]);

  if (isNaN(no)) {
    res.status(400).type("json").send({ msg: "bad request" });
    return;
  }

  var pool = r_database();
  pool.query("INSERT INTO viewtotal SET ?", {
    'ArticleId': no,
    'TimeStamp': CURRENT_TIMESTAMP,
  }, function (
    error,
    results,
    fields
  ) {
    if (error != null) {
      logger.error('viewdb', error);
    }
  });
  res.status(200).type("json").send({ msg: "success" });
};
