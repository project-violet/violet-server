// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../auth/auth');
const a_database = require('../../api/database');
const a_database2 = require('../../api/database2');
const a_syncdatabase = require('../../api/syncdatabase');

const logger = require('../../etc/logger');

const signUpSchema = Joi.object({
  Id: Joi.string().max(50).required(),
  Password: Joi.string().max(150).required(),
  UserAppId: Joi.string().max(150).required(),
  NickName: Joi.string().max(50).required(),
  Etc: Joi.string().max(150),
});

async function _trySignUp(body, res) {
  const connection = await a_database2().getConnection(async conn => conn);

  try {
    // Check UserAppId already exists
    const ck_userappid = await connection.query(
        'SELECT count(*) AS C FROM User WHERE UserAppId=?',
        [body.UserAppId])[0]['C'];
    if (ck_userappid != 0) {
      connection.release();
      res.status(200).type('json').send({msg: 'ck_userappid'});
      return;
    }

    // Check Id already exists
    const ck_id = await connection.query(
        'SELECT count(*) AS C FROM User WHERE Id=?', [body.Id]);
    if (ck_id != 0) {
      connection.release();
      res.status(200).type('json').send({msg: 'ck_id'});
      return;
    }

    // Check NickName already exists
    const ck_nickname = await connection.query(
        'SELECT count(*) AS C FROM User WHERE NickName=?', [body.NickName]);
    if (ck_nickname != 0) {
      connection.release();
      res.status(200).type('json').send({msg: 'ck_nickname'});
      return;
    }

    connection.release();
  } catch (err) {
    logger.error('signup-try', err);
    connection.release();
    res.status(500).type('json').send({msg: 'internal server error'});
    return;
  }

  // Check Password is validated
  const ck_password = body.Password;
  if (ck_password.length < 8) {
    res.status(200).type('json').send({msg: 'pw_too_short'});
    return;
  }

  // SignUp
  const pool = a_database();
  pool.query(
      'INSERT INTO user SET ?', {
        ...body,
      },
      function(error, results, fields) {
        if (error != null) {
          logger.error('signup', error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          logger.info('signup %s %s', body.Id, body.UserAppId);
          res.status(200).type('json').send({msg: 'success'});
        }
      });
}

module.exports = async function signup(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await signUpSchema.validateAsync(req.body);
    await _trySignUp(req.body);
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
};