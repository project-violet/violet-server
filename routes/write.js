// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

var express = require("express");
var router = express.Router();

var r_auth = require("../auth/auth");
const a_database = require("../api/database");

const logger = require("../etc/logger");

var CURRENT_TIMESTAMP = {
  toSqlString: function () {
    return "CURRENT_TIMESTAMP()";
  },
};

// Write a post on the main board.
router.post("/main", main);
function main(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("json").send({ msg: "forbidden" });
    return;
  }

  var author = req.body["author"];
  var title = req.body["title"];
  var body = req.body["body"];
  var etc = req.body["etc"];

  console.log(req.body);

  if (
    author == null ||
    title == null ||
    body == null ||
    etc == null ||
    !(
      typeof(author) === "string" &&
      typeof(title) === "string" &&
      typeof(body) === "string" &&
      typeof(etc) === "string"
    ) ||
    author.length > 45 ||
    title.length > 45 ||
    body.length > 4995 ||
    etc.length > 4995
  ) {
    res.status(400).type("json").send({ msg: "bad request" });
    return;
  }

  var pool = a_database();
  pool.query(
    "INSERT INTO article SET ?",
    {
      TimeStamp: CURRENT_TIMESTAMP,
      Author: author,
      Title: title,
      Body: body,
      Etc: etc,
    },
    function (error, results, fields) {
      if (error != null) {
        logger.error("write-main", error);
      }
    }
  );

  res.status(200).type("json").send({ msg: "success" });
}
router.get("/main", function (req, res, next) { res.status(405).type("html").send(p.p405); });

router.post("/comment", comment);
function comment(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("json").send({ msg: "forbidden" });
    return;
  }
  
  var author = req.body["author"];
  var articleid = req.body["articleid"];
  var body = req.body["body"];

  if (
    author == null ||
    articleid == null ||
    body == null ||
    !(
      typeof(author) === "string" &&
      !isNaN(articleid) &&
      typeof(body) === "string"
    ) ||
    author.length > 45 ||
    body.length > 500
  ) {
    res.status(400).type("json").send({ msg: "bad request" });
    return;
  }

  var pool = a_database();
  pool.query(
    "INSERT INTO comment SET ?",
    {
      TimeStamp: CURRENT_TIMESTAMP,
      Author: author,
      ArticleId: articleid,
      Body: body,
    },
    function (error, results, fields) {
      if (error != null) {
        logger.error("write-comment", error);
      }
    }
  );

  res.status(200).type("json").send({ msg: "success" });
}
router.get("/comment", function (req, res, next) { res.status(405).type("html").send(p.p405); });

module.exports = router;