// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();
const Joi = require('joi');

const r_auth = require('../../auth/auth');
const a_database = require('../../api/database');
const m_session = require('../../memory/session');
const p = require('../../pages/status');

const logger = require('../../etc/logger');

const CURRENT_TIMESTAMP = {
  toSqlString: function() {
    return 'CURRENT_TIMESTAMP()';
  },
};

const articleSchema = Joi.object({
  Board: Joi.number().integer().required(),
  Session: Joi.string().max(65).required(),
  Title: Joi.string().max(45).required(),
  Body: Joi.string().max(4995).required(),
  Etc: Joi.string().max(4995).required(),
});

const commentSchema = Joi.object({
  Session: Joi.string().max(65).required(),
  ArticleId: Joi.number().integer().required(),
  Etc: Joi.string().max(500).required(),
});

function _insertArticle(body) {
  const pool = a_database();
  pool.query(
      'INSERT INTO article SET ?', {
        TimeStamp: CURRENT_TIMESTAMP,
        ...body,
      },
      function(error, results, fields) {
        if (error != null) {
          logger.error('write-main', error);
        }
      });
}

function _insertComment(body) {
  const pool = a_database();
  pool.query(
      'INSERT INTO comment SET ?', {
        TimeStamp: CURRENT_TIMESTAMP,
        ...body,
      },
      function(error, results, fields) {
        if (error != null) {
          logger.error('write-comment', error);
        }
      });
}

async function _checkSession(body) {
  return await m_session.isExists(body.Session, null);
}

async function _sessionToUser(body) {
  let session = body['Session'];
  delete body['Session'];
  session['User'] = await m_session.sessionToUser(session);
  return session;
}

// Write a post on the main board.
router.post('/article', article);
async function article(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await articleSchema.validateAsync(req.body);

    if (!_checkSession(req.body)) {
      res.status(200).type('json').send({msg: 'session not found'});
      return;
    }

    _insertArticle(_sessionToUser(req.body));
    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}

router.post('/comment', comment);
async function comment(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await commentSchema.validateAsync(req.body);

    if (!_checkSession(req.body)) {
      res.status(200).type('json').send({msg: 'session not found'});
      return;
    }

    _insertComment(_sessionToUser(req.body));
    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}

router.get('/main', function(req, res, next) {
  res.status(405).type('html').send(p.p405);
});
router.get('/comment', function(req, res, next) {
  res.status(405).type('html').send(p.p405);
});

module.exports = router;
