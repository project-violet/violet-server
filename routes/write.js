// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

const express = require("express");
const router = express.Router();
const Joi = require("joi");

const r_auth = require("../auth/auth");
const a_database = require("../api/database");
const p = require("../pages/status");

const logger = require("../etc/logger");

const CURRENT_TIMESTAMP = {
  toSqlString: function () {
    return "CURRENT_TIMESTAMP()";
  },
};

const articleSchema = Joi.object({
  Author: Joi.string().max(45).required(),
  Title: Joi.string().max(45).required(),
  Body: Joi.string().max(4995).required(),
  Etc: Joi.string().max(4995).required(),
});

const commentSchema = Joi.object({
  Author: Joi.string().max(45).required(),
  ArticleId: Joi.number().integer().required(),
  Etc: Joi.string().max(500).required(),
});

function _insertArticle(body) {
  const pool = a_database();
  pool.query(
    "INSERT INTO article SET ?",
    {
      TimeStamp: CURRENT_TIMESTAMP,
      ...body,
    },
    function (error, results, fields) {
      if (error != null) {
        logger.error("write-main", error);
      }
    }
  );
}

function _insertComment(body) {
  const pool = a_database();
  pool.query(
    "INSERT INTO comment SET ?",
    {
      TimeStamp: CURRENT_TIMESTAMP,
      ...body,
    },
    function (error, results, fields) {
      if (error != null) {
        logger.error("write-comment", error);
      }
    }
  );
}

// Write a post on the main board.
router.post("/article", article);
async function article(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("json").send({ msg: "forbidden" });
    return;
  }

  try {
    await articleSchema.validateAsync(req.body);
    _insertArticle(req.body);
    res.status(200).type("json").send({ msg: "success" });
  } catch (e) {
    res.status(400).type("json").send({ msg: "bad request" });
  }
}

router.post("/comment", comment);
async function comment(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("json").send({ msg: "forbidden" });
    return;
  }

  try {
    await commentSchema.validateAsync(req.body);
    _insertComment(req.body);
    res.status(200).type("json").send({ msg: "success" });
  } catch (e) {
    res.status(400).type("json").send({ msg: "bad request" });
  }
}

router.get("/main", function (req, res, next) {
  res.status(405).type("html").send(p.p405);
});
router.get("/comment", function (req, res, next) {
  res.status(405).type("html").send(p.p405);
});

module.exports = router;
