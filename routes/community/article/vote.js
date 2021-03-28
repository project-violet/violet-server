// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');

const redis = require('../../../api/redis');
const logger = require('../../../etc/logger');
const Joi = require('joi');

const redlock = require('redis-lock')(redis);

const CURRENT_TIMESTAMP = {
  toSqlString: function() {
    return 'CURRENT_TIMESTAMP()';
  },
};

const voteSchema = Joi.object({
  Article: Joi.number().integer().required(),
  Session: Joi.string().max(130).required(),
  Status: Joi.number().integer().required(),
});

function _voteArticle(res, body) {
  try {
    redlock(body['User'], function(done) {
      const connection = await a_database2().getConnection(async conn => conn);

      try {
        // Check already voting
        const info = (await connection.query(
            'SELECT count(*) as C FROM voterecord WHERE User=? AND Article=?',
            [body['User'], body['Id']]))[0][0]['C'];
        connection.release();

        if (info != 0) {
          res.status(200).type('json').send({msg: 'already vote'});
          return;
        }

        const pool = a_database();

        // Record to voterecord table
        pool.query(
            'INSERT INTO voterecord SET ?', {
              TimeStamp: CURRENT_TIMESTAMP,
              ...body,
            },
            function(error, results, fields) {});

        // Vote to article
        const type = ['UpVote', 'DownVote'][body['Status'] == 0];
        pool.query(
            'UPDATE article SET ' + type + '=' + type +
                '+1 WHERE Article=' + body['Article'],
            function(error, results, fields) {
              if (error != null) {
                logger.error('vote-article', error);
              }
            });

        res.status(200).type('json').send({msg: 'success'});
      } catch (err) {
        logger.error('vote', err);
        connection.release();
        res.status(500).type('json').send({msg: 'internal server error'});
      }

      done();
    });
  } catch (e) {
    logger.error('vote-lock', err);
    res.status(500).type('json').send({msg: 'internal server error'});
  }
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

module.exports = async function vote(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await voteSchema.validateAsync(req.body);

    if (!await _checkSession(req.body)) {
      res.status(200).type('json').send({msg: 'session not found'});
      return;
    }

    _voteArticle(await _sessionToUser(req.body));
    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}
