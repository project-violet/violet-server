// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

const express = require("express");
const router = express.Router();

const r_auth = require("../auth/auth");
const a_database = require("../api/database");
const a_redis = require("../api/redis");
const p = require("../pages/status");

const logger = require("../etc/logger");

function _lookupPage(res, page) {
  const pool = a_database();
  const qr = pool.query(
    "SELECT Id, TimeStamp, Author, Comments, Title FROM " +
      "article ORDER BY Id DESC LIMIT 25 OFFSET " +
      page * 25,
    function (error, results, fields) {
      if (error != null) {
        logger.error("read-body");
        logger.error(error);
        res.status(500).type("json").send({ msg: "internal server error" });
      } else {
        res.status(200).type("json").send({ msg: "success", result: results });
      }
    }
  );
}

function _lookupArticle(res, no) {
  const pool = a_database();
  const qr = pool.query("SELECT Body, Etc FROM article WHERE Id=" + no, function (
    error,
    results,
    fields
  ) {
    if (error != null) {
      logger.error("view-sync");
      logger.error(error);
      res.status(500).type("json").send({ msg: "internal server error" });
    } else {
      res.status(200).type("json").send({ msg: "success", result: results });
    }
  });
}

function _lookupComment(res, no) {
  const pool = a_database();
  const qr = pool.query("SELECT * FROM comment WHERE ArticleId=" + no, function (
    error,
    results,
    fields
  ) {
    if (error != null) {
      logger.error("read-comment");
      logger.error(error);
      res.status(500).type("json").send({ msg: "internal server error" });
    } else {
      res.status(200).type("json").send({ msg: "success", result: results });
    }
  });
}

// Read a post on the main board.
router.get("/main", main);
function main(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("html").send(p.p403);
    return;
  }

  const page = req.query.p;
  const no = req.query.no;

  if ((page == null) == (no == null)) {
    res.status(400).type("html").send(p.p400);
    return;
  }

  if (page != null && !isNaN(page) && page >= 0) {
    _lookupPage(res, page);
    return;
  } else if (no != null && !isNaN(no) && no >= 0) {
    _lookupArticle(res, no);
    return;
  }

  res.status(400).type("html").send(p.p400);
}

router.get("/article", article);
function article(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("html").send(p.p403);
    return;
  }

}

router.get("/comment", comment);
function comment(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("html").send(p.p403);
    return;
  }

  const no = req.query.no;

  if (no == null || isNaN(no) || no < 0) {
    res.status(400).type("html").send(p.p400);
    return;
  }

  _lookupComment(res, no);
}

module.exports = router;
