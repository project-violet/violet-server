// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const {promisify} = require('util');

const crypto = require('crypto');
const config = require('config');
const logger = require('../etc/logger');
const redis = require('../api/redis');

const setexAsync = promisify(redis.setex).bind(redis);
const getAsync = promisify(redis.get).bind(redis);
const delAsync = promisify(redis.del).bind(redis);

const testSalt = config.get('auth.salt') || 'salt';

module.exports = {
  createSession: async function(user) {
    const serverTimestamp = new Date().getTime();

    let mac = crypto.createHash('sha512');
    let hmac = mac.update(user + serverTimestamp.toString() + testSalt);
    let sess = hmac.digest('hex');

    logger.info('create-session %s, %s', user, sess);

    await setexAsync(sess, 60 * 60 * 24, user);
    await setexAsync(user, 60 * 60 * 24, sess);

    return sess;
  },
  closeSession: async function(session, user) {
    if (session != null) {
      const user = await getAsync(ssesion);

      // Already closed
      if (user == null) return;

      logger.info('close-session %s, %s', user, session);

      await delAsync(user);
      await delAsync(session);
    } else if (user != null) {
      const session = await getAsync(user);

      // Already closed
      if (session == null) return;

      logger.info('close-session %s, %s', user, session);

      await delAsync(session);
      await delAsync(user);
    }
  },
  isExists: async function(session, user) {
    if (session != null) {
      const user = await getAsync(ssesion);
      return user == null;
    } else if (user != null) {
      const ssesion = await getAsync(user);
      return ssesion == null;
    }
    return false;
  },
  sessionToUser: async function(session) {
    return await getAsync(session);
  },
};