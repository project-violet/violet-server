// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

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

const modifySchema = Joi.object({
  Id: Joi.number().integer().required(),
  Board: Joi.number().integer().required(),
  Session: Joi.string().max(65).required(),
  Title: Joi.string().max(45).required(),
  Body: Joi.string().max(4995).required(),
  Etc: Joi.string().max(4995).required(),
});

function _modfiyArticle(body) {
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

async function _checkValidRequest(body) {
  // Check article exists
  // Check User=Session

  let session = body['Session'];
  return await m_session.sessionToUser(session);
}

async function _checkUser(body) {

}

async function _sessionToUser(body) {
  let session = body['Session'];
  delete body['Session'];
  session['User'] = await m_session.sessionToUser(session);
  return session;
}

module.exports = async function article(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await modifySchema.validateAsync(req.body);

    if (!_checkSession(req.body)) {
      res.status(200).type('json').send({msg: 'session not found'});
      return;
    }

    _modfiyArticle(_sessionToUser(req.body));
    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}
