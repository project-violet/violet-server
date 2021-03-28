// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');
const a_database2 = require('../../../api/database2');
const m_session = require('../../../memory/session');

const logger = require('../../../etc/logger');

const CURRENT_TIMESTAMP = {
  toSqlString: function() {
    return 'CURRENT_TIMESTAMP()';
  },
};

const editSchema = Joi.object({
  Id: Joi.number().integer().required(),
  Board: Joi.number().integer().required(),
  Session: Joi.string().max(130).required(),
  Title: Joi.string().max(45).required(),
  Body: Joi.string().max(4995).required(),
  Etc: Joi.string().max(4995).required(),
});

function _editArticle(body) {
  const pool = a_database();
  pool.query(
      'INSERT INTO article SET ? ON DUPLICATE KEY UPDATE ?',
      [
        {
          TimeStamp: CURRENT_TIMESTAMP,
          ...body,
        },
        {
          TimeStamp: CURRENT_TIMESTAMP,
          ...body,
        }
      ],
      function(error, results, fields) {
        if (error != null) {
          logger.error('write-main', error);
        }
      });
}

async function _checkSession(body) {
  return await m_session.isExists(body.Session, null);
}

async function _checkValidRequestAndSessionToUser(body) {
  const connection = await a_database2().getConnection(async conn => conn);

  try {
    const info = (await connection.query(
        'SELECT User FROM article WHERE Id=?', [body['Id']]))[0][0];
    connection.release();

    if (info == null) {
      res.status(200).type('json').send({msg: 'fail'});
      return null;
    }

    var session = body['Session'];
    delete body['Session'];
    var user = await m_session.sessionToUser(session);
    body['User'] = user;

    if (info.User != user) return null;

    return body;
  } catch (err) {
    logger.error('signin-try', err);
    connection.release();
    res.status(500).type('json').send({msg: 'internal server error'});
  }

  return null;
}

module.exports = async function edit(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await editSchema.validateAsync(req.body);

    if (!await _checkSession(req.body)) {
      res.status(200).type('json').send({msg: 'session not found'});
      return;
    }

    _editArticle(await _checkValidRequestAndSessionToUser(req.body));
    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}