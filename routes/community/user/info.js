// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');
const p = require('../../../pages/status');

const logger = require('../../../etc/logger');

function _lookupUser(res, id) {
  const pool = a_database();
  const qr = pool.query(
      'SELECT NickName FROM user WHERE Id=?', [id],
      function(error, results, fields) {
        if (error != null) {
          logger.error('user-info');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results[0]});
        }
      });
}

module.exports = function info(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  _lookupUser(res, req.query.id);
}