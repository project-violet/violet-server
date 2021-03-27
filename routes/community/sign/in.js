// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');
const a_database2 = require('../../../api/database2');
const a_syncdatabase = require('../../../api/syncdatabase');
const m_session = require('../../../memory/session');

const crypto = require('crypto');
const logger = require('../../../etc/logger');

const signInSchema = Joi.object({
  Id: Joi.string().max(50).required(),
  Password: Joi.string().max(150).required(),
});

var CURRENT_TIMESTAMP = {
  toSqlString: function() {
    return 'CURRENT_TIMESTAMP()';
  }
};

async function _tryLogin(body, res) {
  // Check Password is validated
  const ck_password = body.Password;
  if (ck_password.length < 8) {
    res.status(200).type('json').send({msg: 'pw_too_short'});
    return;
  }

  // Hash to Password
  let mac = crypto.createHash('sha512');
  let hmac = mac.update(body.Password);
  let pw = hmac.digest('hex');

  const connection = await a_database2().getConnection(async conn => conn);

  try {
    const fail = (await connection.query(
        'SELECT count(*) AS C FROM user WHERE Id=? AND Password=?',
        [body.Id,
         pw]))[0][0].C;
    if (fail == 0) {
      connection.release();
      res.status(200).type('json').send({msg: 'fail'});
      return;
    }

    connection.release();
  } catch (err) {
    logger.error('signin-try', err);
    connection.release();
    res.status(500).type('json').send({msg: 'internal server error'});
    return;
  }

  const pid = (await connection.query(
      'SELECT Pid AS P FROM user WHERE Id=?', [body.Id]))[0][0]
                  .P;

  // Remove exists Session
  if (await m_session.isExists(null, pid))
    await m_session.closeSession(null, pid);

  let session = await m_session.createSession(pid);

  logger.info('signin %s(%d) %s', body.Id, pid, session);

  const pool = a_database();
  pool.query(
      'INSERT INTO loginrecord SET ?', {
        UserId: body.Id,
        Status: 1,
        Password: pw,
        TimeStamp: CURRENT_TIMESTAMP,
      },
      function(error, results, fields) {
        if (error != null) {
          logger.error('signin', error);
        }
      });

  res.status(200).type('json').send({msg: 'success', session: session});
}

module.exports = async function signin(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await signInSchema.validateAsync(req.body);
    await _tryLogin(req.body, res);
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
};