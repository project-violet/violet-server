// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const a_database = require('../../api/database');
const m_search = require('../../memory/search');

const detailSchema = Joi.object({
  id: Joi.number().integer().required(),
});

function _detail(res, id) {
  const query = m_search.getDetailQuery(id);
  const pool = a_database();
  const qr = pool.query(query, function(error, results, fields) {
    if (error != null) {
      logger.error('search-detail');
      logger.error(error);
      res.status(500).type('json').send({msg: 'internal server error'});
    } else {
      res.status(200).type('json').send({msg: 'success', result: results[0]});
    }
  });
}

module.exports = async function(req, res, next) {
  try {
    await detailSchema.validateAsync(req.query);

    _detail(res, req.query.id);
  } catch (e) {
    console.log(e);
    res.status(400).type('json').send({msg: 'bad request'});
  }
}