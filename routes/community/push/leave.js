// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');
const m_session = require('../../../memory/session');

const logger = require('../../../etc/logger');

const leaveSchema = Joi.object({
  TokenType: Joi.number().integer().required()
});

function _deleteEnroll(body) {
  const pool = a_database();
  pool.query(
      'DELETE FROM usertokens WHERE ?', {
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

module.exports = async function leave(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await leaveSchema.validateAsync(req.body);

    if (!await _checkSession(req.body)) {
      res.status(200).type('json').send({msg: 'session not found'});
      return;
    }

    _deleteEnroll(await _sessionToUser(req.body));
    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}