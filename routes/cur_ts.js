// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const p = require('../pages/status');

const a_database = require('../api/database');

// Gets the tags counted with the view function.
module.exports = async function top_ts(req, res, next) {
  const pool = a_database();
  const qr = pool.query(
      'select now() as TimeStamp',
      function(error, results, fields) {
        if (error != null) {
          logger.error('cur-ts');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send(
              {msg: 'success', result: results[0].TimeStamp});
        }
      });
};