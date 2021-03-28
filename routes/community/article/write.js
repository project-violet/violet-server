// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');
const m_session = require('../../../memory/session');

const logger = require('../../../etc/logger');

const CURRENT_TIMESTAMP = {
  toSqlString: function() {
    return 'CURRENT_TIMESTAMP()';
  },
};

const articleSchema = Joi.object({
  Board: Joi.number().integer().required(),
  Session: Joi.string().max(130).required(),
  Title: Joi.string().max(45).required(),
  Body: Joi.string().max(4995).required(),
  Etc: Joi.string().max(4995).required(),
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

async function _checkSession(body) {
  return await m_session.isExists(body.Session, null);
}

async function _sessionToUser(body) {
  let session = body['Session'];
  delete body['Session'];
  body['User'] = await m_session.sessionToUser(session);
  return body;
}

module.exports = async function article(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await articleSchema.validateAsync(req.body);

    if (!await _checkSession(req.body)) {
      res.status(200).type('json').send({msg: 'session not found'});
      return;
    }

    _insertArticle(await _sessionToUser(req.body));
    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}
