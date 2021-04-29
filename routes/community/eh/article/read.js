// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../../../auth/auth');
const a_database = require('../../../../api/database');
const p = require('../../../../pages/status');

const logger = require('../../../../etc/logger');

const etcSchema =
    Joi.object({
         artist: Joi.string(),
         group: Joi.string(),
         series: Joi.string(),
         character: Joi.string(),
         tag: Joi.string(),
         article: Joi.number().integer(),
         id: Joi.number().integer(),
       })
        .xor('article', 'artist', 'group', 'series', 'character', 'tag', 'id');

function _lookupArticleEtc(res, etc) {
  const pool = a_database();
  const key = Object.keys(etc)[0];
  const value = etc[key];

  const keyv = {
    'article': ['article'],
    'artist': ['artist', 'eharticles_artists'],
    'group': ['group', 'eharticles_groups'],
    'series': ['character', 'eharticles_characters'],
    'tag': ['tag', 'eharticles_tags'],
    'id': ['eharticles'],
  }[key];

  if (['artist', 'group', 'series', 'tag'].includes(key)) {
    pool.query(
        'SELECT * FROM article_' + keyv[0] +
            '_junction WHERE Target=(SELECT Id FROM ' + keyv[1] +
            ' WHERE Name=?)',
        [value], function(error, results, fields) {
          if (error != null) {
            logger.error('read-eh-article');
            logger.error(error);
            res.status(500).type('json').send({msg: 'internal server error'});
          } else {
            res.status(200).type('json').send(
                {msg: 'success', result: results});
          }
        });
  } else {
    pool.query(
        'SELECT * FROM article_' + keyv[0] + '_junction WHERE Target=?',
        [value], function(error, results, fields) {
          if (error != null) {
            logger.error('read-eh-article');
            logger.error(error);
            res.status(500).type('json').send({msg: 'internal server error'});
          } else {
            res.status(200).type('json').send(
                {msg: 'success', result: results});
          }
        });
  }
}

module.exports = function read(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  try {
    await etcSchema.validateAsync(req.query);

    _lookupArticleEtc(res, no);
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}