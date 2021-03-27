// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');
const p = require('../../../pages/status');

const logger = require('../../../etc/logger');

function _lookupBoard(res) {
  const pool = a_database();
  const qr =
      pool.query('SELECT * FROM board', function(error, results, fields) {
        if (error != null) {
          logger.error('read-board');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results});
        }
      });
}

module.exports = function list(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  _lookupBoard(res);
};