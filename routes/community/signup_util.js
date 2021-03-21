// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();
const Joi = require('joi');

const r_auth = require('../../auth/auth');
const a_database2 = require('../../api/database2');
const p = require('../../pages/status');

const logger = require('../../etc/logger');

const idSchema = Joi.object({
  Id: Joi.string().max(50).required(),
});

const userAppIdSchema = Joi.object({
  UserAppId: Joi.string().max(150).required(),
});

const nickNameSchema = Joi.object({
  NickName: Joi.string().max(50).required(),
});

async function _run_qurey(attr, value) {
  const connection = await a_database2().getConnection(async conn => conn);

  try {
    const check = (await connection.query(
        'SELECT count(*) AS C FROM user WHERE ' + attr + '=?', [value]))[0][0].C;
    return check;
  } catch (err) {
    logger.error('signup-util-query', err);
    return -1;
  }
}

async function _check(what, scheme, value, res, req) {
  if (!r_auth.auth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await scheme.validateAsync(req.body);
    const q = await _run_qurey(what, value);
    if (q > 0)
      res.status(200).type('json').send({msg: 'overlap'});
    else if (q < 0)
      res.status(500).type('json').send({msg: 'internal server error'});
    else
      res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}

router.post('/checkid', checkid);
async function checkid(req, res, next) {
  await _check('Id', idSchema, req.body.Id, res, req);
}

router.post('/checkuserappid', checkUserAppId);
async function checkUserAppId(req, res, next) {
  await _check('UserAppId', userAppIdSchema, req.body.UserAppId, res, req);
}

router.post('/checknickname', checkNickName);
async function checkNickName(req, res, next) {
  await _check('NickName', nickNameSchema, req.body.NickName, res, req);
}

router.get('/checkid', function(req, res, next) {
  res.status(405).type('html').send(p.p405);
});
router.get('/checkuserappid', function(req, res, next) {
  res.status(405).type('html').send(p.p405);
});
router.get('/checknickname', function(req, res, next) {
  res.status(405).type('html').send(p.p405);
});

module.exports = router;