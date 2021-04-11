// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const a_database = require('../../api/database');

const ehashSchema = Joi.object({
  id: Joi.number().integer().required(),
});

function _ehash(res, id) {
  const pool = a_database();
  const qr = pool.query(
      'select EHash from eharticles where Id=?', [id],
      function(error, results, fields) {
        if (error != null) {
          logger.error('ehash');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          if (results == null || results[0] == null ||
              !results[0].hasOwnProperty('EHash'))
            res.status(200).type('json').send({msg: 'results zero'});
          else
            res.status(200).type('json').send(
                {msg: 'success', result: results[0].EHash});
        }
      });
}

module.exports = async function(req, res, next) {
  try {
    await ehashSchema.validateAsync(req.query);

    _ehash(res, req.query.id);
  } catch (e) {
    console.log(e);
    res.status(400).type('json').send({msg: 'bad request'});
  }
}