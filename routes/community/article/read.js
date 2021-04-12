// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');
const p = require('../../../pages/status');

const logger = require('../../../etc/logger');

function _lookupArticle(res, no) {
  const pool = a_database();
  const qr = pool.query(
      'SELECT Body, Etc FROM article WHERE Id=' + no,
      function(error, results, fields) {
        if (error != null) {
          logger.error('read-article');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results});
        }
      });
  pool.query(
      'UPDATE article SET View=View+1 WHERE ArticleId=' + no,
      function(error, results, fields) {});
}

module.exports = function read(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  const no = req.query.no;

  if (no == null || isNaN(no) || no < 0) {
    res.status(400).type('html').send(p.p400);
    return;
  }

  _lookupArticle(res, no);
}