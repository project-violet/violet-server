// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();

const r_auth = require('../../auth/auth');
const a_database = require('../../api/database');
const a_redis = require('../../api/redis');
const p = require('../../pages/status');

const logger = require('../../etc/logger');

function _lookupBoard(res) {
  const pool = a_database();
  const qr =
      pool.query('SELECT * FROM board', function(error, results, fields) {
        if (error != null) {
          logger.error('read-board');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results});
        }
      });
}

function _lookupPage(res, page, board) {
  const pool = a_database();
  const qr = pool.query(
      'SELECT a.Id, a.TimeStamp, a.User, b.NickName, a.Comments, a.Title FROM ' +
          'article AS a LEFT JOIN user AS b ON a.User=b.Pid WHERE a.Board=' +
          board + ' ORDER BY Id DESC LIMIT 25 OFFSET ' + page * 25,
      function(error, results, fields) {
        if (error != null) {
          logger.error('read-page');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results});
        }
      });
}

function _lookupArticle(res, no) {
  const pool = a_database();
  const qr = pool.query(
      'SELECT Body, Etc FROM article WHERE Id=' + no,
      function(error, results, fields) {
        if (error != null) {
          logger.error('read-article');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results});
        }
      });
}

function _lookupComment(res, no) {
  const pool = a_database();
  const qr = pool.query(
      'SELECT a.Id, a.User, b.NickName, a.TimeStamp, a.Body FROM' +
          ' comment AS a LEFT JOIN user AS b ON a.User=b.Pid WHERE a.ArticleId=' +
          no,
      function(error, results, fields) {
        if (error != null) {
          logger.error('read-comment');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results});
        }
      });
}

// Lists all board list
router.get('/board', board);
function board(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  _lookupBoard(res);
}

// Read a post on the main board.
router.get('/page', page);
function page(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  const board = req.query.board;
  const page = req.query.p;

  if ((board == null) == (page == null) || isNaN(page) || isNaN(board)) {
    res.status(400).type('html').send(p.p400);
    return;
  }

  _lookupPage(res, page, board);
}

// Read specific article
router.get('/article', article);
function article(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  const no = req.query.no;

  if (no == null || isNaN(no) || no < 0) {
    res.status(400).type('html').send(p.p400);
    return;
  }

  _lookupArticle(res, no);
}

router.get('/comment', comment);
function comment(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  const no = req.query.no;

  if (no == null || isNaN(no) || no < 0) {
    res.status(400).type('html').send(p.p400);
    return;
  }

  _lookupComment(res, no);
}

module.exports = router;
