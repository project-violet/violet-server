// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const crypto = require('crypto');
const config = require('config');

const testSalt = config.get('auth.salt') || 'salt';

module.exports = function testAuth() {
  const serverTimestamp = new Date().getTime();
  let mac = crypto.createHash('sha512');
  let hmac = mac.update(serverTimestamp + testSalt);
  let hash = hmac.digest('hex').substr(0, 7);

  return {'v-token': serverTimestamp, 'v-valid': hash};
}