// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const r_auth = require('../../../auth/auth');
const a_database = require('../../../api/database');
const p = require('../../../pages/status');

const logger = require('../../../etc/logger');

function _lookupPage(res, page, board) {
  const pool = a_database();
  const qr = pool.query(
      'SELECT a.Id, a.TimeStamp, a.User, b.NickName, a.Comments, a.Title, a.View, a.UpVote, a.DownVote FROM ' +
          'article AS a LEFT JOIN user AS b ON a.User=b.Pid WHERE a.Board=' +
          board + ' ORDER BY Id DESC LIMIT 25 OFFSET ' + page * 25,
      function(error, results, fields) {
        if (error != null) {
          logger.error('read-page');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results});
        }
      });
}

module.exports = function page(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  const board = req.query.board;
  const page = req.query.p;

  if ((board == null) || (page == null) || isNaN(page) || isNaN(board)) {
    res.status(400).type('html').send(p.p400);
    return;
  }

  _lookupPage(res, page, board);
};