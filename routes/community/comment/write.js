// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');
const m_session = require('../../../memory/session');
const p = require('../../../pages/status');

const push = require('../../../service/push/community_comment_push');

const logger = require('../../../etc/logger');

const CURRENT_TIMESTAMP = {
  toSqlString: function() {
    return 'CURRENT_TIMESTAMP()';
  },
};

const commentSchema = Joi.object({
  Session: Joi.string().max(130).required(),
  ArticleId: Joi.number().integer().required(),
  Body: Joi.string().max(500).required(),
  Parent: Joi.number().integer(),
  Etc: Joi.string().max(4995).required(),
});

const etcSchema = Joi.object({
  Articles: Joi.array().items(Joi.string()),
  EHArticles: Joi.array().items(Joi.string()),
  Artists: Joi.array().items(Joi.string()),
  Groups: Joi.array().items(Joi.string()),
  Series: Joi.array().items(Joi.string()),
  Characters: Joi.array().items(Joi.string()),
  Tags: Joi.array().items(Joi.string()),
});

function _insertCommentEtc(conn, id, etc) {
  if (!('Articles' in etc))
    conn.query(
        'INSERT INTO comment_article_junction (Comment, Target) VALUES ?' +
            ' ON DUPLICATE KEY UPDATE Comment=VALUES(Comment), Target=VALUES(Target)',
        [etc['Articles'].map(e => [id, e])], function(error, results, fields) {
          logger.error('write-comment-etc', error);
        });
  if (!('EHArticles'))
    conn.query(
        'INSERT INTO comment_eharticle_junction (Comment, Target) VALUES ?' +
            ' ON DUPLICATE KEY UPDATE Comment=VALUES(Comment), Target=VALUES(Target)',
        [etc['EHArticles'].map(e => [id, e])],
        function(error, results, fields) {
          logger.error('write-comment-etc', error);
        });
  if (!('Artists'))
    conn.query(
        'INSERT INTO comment_artist_junction (Comment, Target) VALUES ' +
            etc['Artists']
                .map(
                    e => '(' + id +
                        ',(SELECT Id FROM eharticles_artists WHERE Name=?))')
                .join(',') +
            ' ON DUPLICATE KEY UPDATE Comment=VALUES(Comment), Target=VALUES(Target)',
        etc['Artists'], function(error, results, fields) {
          logger.error('write-comment-etc', error);
        });
  if (!('Groups'))
    conn.query(
        'INSERT INTO comment_group_junction (Comment, Target) VALUES ' +
            etc['Groups']
                .map(
                    e => '(' + id +
                        ',(SELECT Id FROM eharticles_groups WHERE Name=?))')
                .join(',') +
            ' ON DUPLICATE KEY UPDATE Comment=VALUES(Comment), Target=VALUES(Target)',
        etc['Groups'], function(error, results, fields) {
          logger.error('write-comment-etc', error);
        });
  if (!('Series'))
    conn.query(
        'INSERT INTO comment_series_junction (Comment, Target) VALUES ' +
            etc['Series']
                .map(
                    e => '(' + id +
                        ',(SELECT Id FROM eharticles_series WHERE Name=?))')
                .join(',') +
            ' ON DUPLICATE KEY UPDATE Comment=VALUES(Comment), Target=VALUES(Target)',
        etc['Series'], function(error, results, fields) {
          logger.error('write-comment-etc', error);
        });
  if (!('Characters'))
    conn.query(
        'INSERT INTO comment_character_junction (Comment, Target) VALUES ' +
            etc['Characters']
                .map(
                    e => '(' + id +
                        ',(SELECT Id FROM eharticles_characters WHERE Name=?))')
                .join(',') +
            ' ON DUPLICATE KEY UPDATE Comment=VALUES(Comment), Target=VALUES(Target)',
        etc['Characters'], function(error, results, fields) {
          logger.error('write-comment-etc', error);
        });
  if (!('Tags'))
    conn.query(
        'INSERT INTO comment_tag_junction (Comment, Target) VALUES ' +
            etc['Tags']
                .map(
                    e => '(' + id +
                        ',(SELECT Id FROM eharticles_tags WHERE Name=?))')
                .join(',') +
            ' ON DUPLICATE KEY UPDATE Comment=VALUES(Comment), Target=VALUES(Target)',
        etc['Tags'], function(error, results, fields) {
          logger.error('write-comment-etc', error);
        });
}

function _insertComment(body) {
  const pool = a_database();
  pool.getConnection(function(err, conn) {
    if (!err) {
      conn.beginTransaction(function(err) {
        if (err) {
          logger.error('write-comment-transaction', err);
          return;
        }
        conn.query(
            'INSERT INTO comment SET ? ',
            {TimeStamp: CURRENT_TIMESTAMP, ...body},
            function(err, results, fields) {
              if (err) {
                conn.rollback();
                logger.error('write-comment-query', err);
                return;
              }

              _insertCommentEtc(conn, results.insertId, body.etc);
              conn.commit();
            });
      });
    } else {
      logger.error('write-comment-connection', err);
    }

    conn.release();
  });
  pool.query(
      'UPDATE article SET Comments=Comments+1 WHERE ArticleId=' +
          body.ArticleId,
      function(error, results, fields) {});
  push.newComment(body);
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

module.exports = async function comment(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await commentSchema.validateAsync(req.body);
    await etcSchema.validateAsync(JSON.parse(req.body.Etc));

    if (!_checkSession(req.body)) {
      res.status(200).type('json').send({msg: 'session not found'});
      return;
    }

    if (req.body.Parent == 0)
      req.body.Parent = null;

    _insertComment(_sessionToUser(req.body));
    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
};
