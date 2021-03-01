// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const a_database = require('../api/database');

function _lookupViewTimeAvg(res) {
  const pool = a_database();
  const qr = pool.query(
      'SELECT ArticleId, AvgOfViewSeconds, HowManyUserRead from ' +
      '(SELECT ArticleId, avg(ViewSeconds) as AvgOfViewSeconds, count(UserAppId) as HowManyUserRead from viewtime where HowManyUserRead <> 1 group by ArticleId order by AvgOfViewSeconds desc) as B'+
      'where HowManyUserRead <> 1',
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

module.exports = async function test1145(req, res, next) {
  _lookupViewTimeAvg(res);
};
