// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

const crypto = require('crypto');
const config = require('config');

const testSalt = config.get('auth.salt') || 'salt';

let authTest = function (token, valid) {
  let mac = crypto.createHash('sha512');
  let hmac = mac.update(token + testSalt);
  let hash = hmac.digest('hex').substr(0, 7);

  return hash == valid;
}

let auth = function (req) {
  var token = req.headers['v-token'];
  var valid = req.headers['v-valid'];
  if (token == null || valid == null) return false;
  
  var clientTimestamp = parseInt(token);

  if (isNaN(clientTimestamp)) return false;

  var serverTimestamp = new Date().getTime();

  if (Math.abs(serverTimestamp - clientTimestamp) > 2000)
    return false;

  return authTest(token, valid);
}

module.exports = {
  authTest: authTest,
  auth: auth,
}