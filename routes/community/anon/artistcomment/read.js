// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../../../auth/auth');
const a_database = require('../../../../api/database');

const logger = require('../../../../etc/logger');

const readSchema = Joi.object({
  name: Joi.string().max(100).required(),
});

function _lookupComment(res, name) {
  const pool = a_database();
  pool.query(
      'SELECT TimeStamp, Body, UserAppId, Parent FROM artistcomment WHERE ArtistName=? ORDER BY Id DESC LIMIT 100',
      [name], function(error, results, fields) {
        if (error != null) {
          logger.error('lookup-artist-comment');
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
    await readSchema.validateAsync(req.query);

    _lookupComment(res, req.query.name);
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}