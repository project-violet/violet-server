// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const crypto = require('crypto');
const config = require('config');
const logger = require('../etc/logger');

const testSalt = config.get('auth.salt') || 'salt';

let authTest = function (token, valid) {
  let mac = crypto.createHash('sha512');
  let hmac = mac.update(token + testSalt);
  let hash = hmac.digest('hex').substr(0, 7);

  return hash == valid;
}

let auth = function (req) {
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

  return authTest(token, valid);
}

module.exports = {
  authTest: authTest,
  auth: auth,
}