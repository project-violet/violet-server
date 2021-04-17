// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const a_database = require('../../api/database');
const logger = require('../../etc/logger');
const m_search = require('../../memory/search');

const searchSchema = Joi.object({
  q: Joi.string().max(500).required(),
  offset: Joi.number().integer().required(),
});

function _hybrid(res, search, offset) {
  const query = m_search.getHybridQuery(search, offset);
  const pool = a_database();
  logger.info('search: ' + search);
  const qr = pool.query(query[0], query[1], function(error, results, fields) {
    if (error != null) {
      logger.error('search');
      logger.error(error);
      res.status(500).type('json').send({msg: 'internal server error'});
    } else {
      res.status(200).type('json').send({msg: 'success', result: results});
    }
  });
}

module.exports = async function(req, res, next) {
  try {
    await searchSchema.validateAsync(req.query);

    _hybrid(res, req.query.q, req.query.offset);
  } catch (e) {
    console.log(e);
    res.status(400).type('json').send({msg: 'bad request'});
  }
}