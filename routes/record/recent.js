// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../auth/auth');
const a_database = require('../../api/database');

const logger = require('../../etc/logger');

const recentSchema = Joi.object({
  offset: Joi.number().min(0),
  count: Joi.number().min(0).max(20).required(),
  limit: Joi.number().min(0).max(180),
});

function _lookupComment(res, query) {
  const pool = a_database();
  pool.query(
      'SELECT Id, ArticleId, ViewSeconds FROM viewtime WHERE ViewSeconds >= ' + query.limit +
       ' AND Id >= ' + query.offset +
          ' ORDER BY Id DESC LIMIT ' + query.count,
      function(error, results, fields) {
        if (error != null) {
          logger.error('lookup-artist-comment-recent');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results});
        }
      });
}

module.exports = async function read(req, res, next) {
  //   if (!r_auth.wauth(req)) {
  //     res.status(403).type('json').send({msg: 'forbidden'});
  //     return;
  //   }

  try {
    await recentSchema.validateAsync(req.query);

    if (req.query.offset == undefined) req.query.offset = 0;
    if (req.query.limit == undefined) req.query.limit = 0;

    _lookupComment(res, req.query);
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}