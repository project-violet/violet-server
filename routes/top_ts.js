// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const p = require('../pages/status');

const a_database = require('../api/database');

// Gets the tags counted with the view function.
module.exports = async function top_ts(req, res, next) {
  const s = req.query.s;

  if (s == null || isNaN(s) || s > 100000) {
    res.status(400).type('html').send(p.p400);
    return;
  }

  const pool = a_database();
  const qr = pool.query(
      'select TimeStamp from viewtime where ViewSeconds >= 24 order by Id desc limit 1 offset ' +
          s,
      function(error, results, fields) {
        if (error != null) {
          logger.error('top-ts');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send(
              {msg: 'success', result: results[0].TimeStamp});
        }
      });
};