// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const crypto = require('crypto');
const config = require('config');
const logger = require('../etc/logger');

const testSalt = config.get('auth.salt') || 'salt';
const testWSalt = config.get('auth.wsalt') || 'wsalt';

let authTest = function (token, valid, salt, inv) {
  let mac = crypto.createHash('sha512');
  let hmac = mac.update(inv ? salt + token : token + salt);
  let hash = hmac.digest('hex').substr(0, 7);

  return hash == valid;
}

let auth = function (req, salt, inv) {
  const token = req.headers['v-token'];
  const valid = req.headers['v-valid'];

  if (token == null || valid == null) {
    logger.info('auth: token or valid is null');
    return false;
  }

  const clientTimestamp = parseInt(token);

  if (isNaN(clientTimestamp)) {
    logger.info('auth: token is not int');
    return false;
  }

  const serverTimestamp = new Date().getTime();

  if (Math.abs(serverTimestamp - clientTimestamp) > 10000) {
    logger.info('auth: timestamp error, st=%d, ct=%d', serverTimestamp, clientTimestamp);
    return false;
  }

  return authTest(token, valid, salt, inv);
}

module.exports = {
  authTest: function (token, valid) {
    return authTest(token, valid, testSalt, false);
  },
  auth: function (req) {
    return auth(req, testSalt, false);
  },
  wauthTest: function (token, valid) {
    return authTest(token, valid, testWSalt, true);
  },
  wauth: function (req) {
    return auth(req, testWSalt, true);
  },
}