// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');
const m_session = require('../../../memory/session');

const logger = require('../../../etc/logger');

const CURRENT_TIMESTAMP = {
  toSqlString: function() {
    return 'CURRENT_TIMESTAMP()';
  },
};

const articleSchema = Joi.object({
  Board: Joi.number().integer().required(),
  Session: Joi.string().max(130).required(),
  Title: Joi.string().max(45).required(),
  Body: Joi.string().max(4995).required(),
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

function _insertArticleEtc(conn, id, etc) {
  if (!('Articles' in etc))
    conn.query(
        'INSERT INTO article_article_junction (Article, Target) VALUES ?' +
            ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
        [etc['Articles'].map(e => [id, e])], function(error, results, fields) {
          logger.error('write-main-etc', error);
        });
  if (!('EHArticles'))
    conn.query(
        'INSERT INTO article_eharticle_junction (Article, Target) VALUES ?' +
            ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
        [etc['EHArticles'].map(e => [id, e])],
        function(error, results, fields) {
          logger.error('write-main-etc', error);
        });
  if (!('Artists'))
    conn.query(
        'INSERT INTO article_artist_junction (Article, Target) VALUES ' +
            etc['Artists']
                .map(
                    e => '(' + id +
                        ',(SELECT Id FROM eharticles_artists WHERE Name=?))')
                .join(',') +
            ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
        etc['Artists'], function(error, results, fields) {
          logger.error('write-main-etc', error);
        });
  if (!('Groups'))
    conn.query(
        'INSERT INTO article_group_junction (Article, Target) VALUES ' +
            etc['Groups']
                .map(
                    e => '(' + id +
                        ',(SELECT Id FROM eharticles_groups WHERE Name=?))')
                .join(',') +
            ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
        etc['Groups'], function(error, results, fields) {
          logger.error('write-main-etc', error);
        });
  if (!('Series'))
    conn.query(
        'INSERT INTO article_series_junction (Article, Target) VALUES ' +
            etc['Series']
                .map(
                    e => '(' + id +
                        ',(SELECT Id FROM eharticles_series WHERE Name=?))')
                .join(',') +
            ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
        etc['Series'], function(error, results, fields) {
          logger.error('write-main-etc', error);
        });
  if (!('Characters'))
    conn.query(
        'INSERT INTO article_character_junction (Article, Target) VALUES ' +
            etc['Characters']
                .map(
                    e => '(' + id +
                        ',(SELECT Id FROM eharticles_characters WHERE Name=?))')
                .join(',') +
            ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
        etc['Characters'], function(error, results, fields) {
          logger.error('write-main-etc', error);
        });
  if (!('Tags'))
    conn.query(
        'INSERT INTO article_tag_junction (Article, Target) VALUES ' +
            etc['Tags']
                .map(
                    e => '(' + id +
                        ',(SELECT Id FROM eharticles_tags WHERE Name=?))')
                .join(',') +
            ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
        etc['Tags'], function(error, results, fields) {
          logger.error('write-main-etc', error);
        });
}

function _insertArticle(body) {
  const pool = a_database();
  pool.getConnection(function(err, conn) {
    if (!err) {
      conn.beginTransaction(function(err) {
        if (err) {
          logger.error('write-main-transaction', err);
          return;
        }
        conn.query(
            'INSERT INTO article SET ? ',
            {TimeStamp: CURRENT_TIMESTAMP, ...body},
            function(err, results, fields) {
              if (err) {
                conn.rollback();
                logger.error('write-main-query', err);
                return;
              }

              _insertArticleEtc(conn, results.insertId, body.etc);
              conn.commit();
            });
      });
    } else {
      logger.error('write-main-connection', err);
    }

    conn.release();
  });
  pool.query(
      'INSERT INTO article SET ?', {
        TimeStamp: CURRENT_TIMESTAMP,
        ...body,
      },
      function(error, results, fields) {
        if (error != null) {
          logger.error('write-main', error);
        }
      });
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

module.exports = async function article(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await articleSchema.validateAsync(req.body);
    await etcSchema.validateAsync(JSON.parse(req.body.Etc));

    if (!await _checkSession(req.body)) {
      res.status(200).type('json').send({msg: 'session not found'});
      return;
    }

    _insertArticle(await _sessionToUser(req.body));
    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}
