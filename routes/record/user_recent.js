// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../auth/auth');
const a_database = require('../../api/database');

const logger = require('../../etc/logger');

const recentSchema = Joi.object({
  count: Joi.number().min(0).max(100).required(),
  limit: Joi.number().min(0).max(180),
  userid: Joi.string().max(150).required(),
});

function _lookupComment(res, query) {
  const pool = a_database();
  pool.query(
      'SELECT Id, ArticleId, ViewSeconds FROM viewtime WHERE ViewSeconds >= ' +
          query.limit + ' AND UserAppId=? ' +
          ' ORDER BY Id DESC LIMIT ' + query.count,
      [query.userid], function(error, results, fields) {
        if (error != null) {
          logger.error('lookup-user-record-recent');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({
            msg: 'success',
            result: results.map(e => [e.Id, e.ArticleId, e.ViewSeconds])
          });
        }
      });
}

module.exports = async function read(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await recentSchema.validateAsync(req.query);

    if (req.query.limit == undefined) req.query.limit = 0;

    _lookupComment(res, req.query);
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}