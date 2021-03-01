// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const a_database = require('../api/database');

function _lookupViewTime(res) {
  const pool = a_database();
  const qr = pool.query(
      'SELECT ArticleId, sum(ViewSeconds) as A, count(UserAppId) from viewtime group by ArticleId order by A',
      function(error, results, fields) {
        if (error != null) {
          logger.error('lookup-viewtime');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results});
        }
      });
}

module.exports = async function test1144(req, res, next) {
  _lookupViewTime(res);
};
