// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');
const m_session = require('../../../memory/session');

const logger = require('../../../etc/logger');

const enrollSchema = Joi.object({
  Token: Joi.string().required(),
  TokenType: Joi.number().integer().required()
});

function _insertEnroll(body) {
  const pool = a_database();
  pool.query(
      'INSERT INTO usertokens SET ?', {
        TimeStamp: CURRENT_TIMESTAMP,
        ...body,
      },
      function(error, results, fields) {
        if (error != null) {
          logger.error('enroll', error);
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

module.exports = async function enroll(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await enrollSchema.validateAsync(req.body);

    if (!await _checkSession(req.body)) {
      res.status(200).type('json').send({msg: 'session not found'});
      return;
    }

    _insertEnroll(await _sessionToUser(req.body));
    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}