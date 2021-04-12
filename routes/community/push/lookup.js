// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const a_database = require('../../../api/database');
const m_session = require('../../../memory/session');
const p = require('../../../pages/status');

const lookupSchema = Joi.object({Session: Joi.string().required()});

function _lookupPush(res, user) {
  const pool = a_database();
  const qr = pool.query(
      'SELECT TokenType, Token FROM usertokens WHERE User=' + user,
      function(error, results, fields) {
        if (error != null) {
          logger.error('lookup-push');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results});
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

module.exports = async function lookup(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  try {
    await lookupSchema.validateAsync(req.query);

    if (!await _checkSession(req.query)) {
      res.status(403).type('html').send(p.p403);
      return;
    }

    _lookupPush(res, await _sessionToUser(req.query));
  } catch (e) {
    res.status(400).type('html').send(p.p400);
  }
}