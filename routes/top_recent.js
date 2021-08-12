// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const p = require('../pages/status');

const a_database = require('../api/database');

// https://daniel-hebn.github.io/2018/04/14/2018-04-14-MySQL-%EC%84%B1%EB%8A%A5%EC%B5%9C%EC%A0%81%ED%99%94-3/

// Gets the tags counted with the view function.
module.exports = async function top_recent(req, res, next) {
  const s = req.query.s;

  if (s == null || isNaN(s) || s > 100000) {
    res.status(400).type('html').send(p.p400);
    return;
  }

  // (select ArticleId from viewtotal where TimeStamp > DATE_SUB(NOW(), INTERVAL
  // 1 HOUR) AND TimeStamp <= NOW()) select * from viewtime where TimeStamp >
  // DATE_SUB(NOW(), INTERVAL 1 HOUR) AND TimeStamp <= NOW() order by TimeStamp
  // limit 1

  const pool = a_database();
  const qr = pool.query(
      'select count(*) as C, ArticleId from (select ArticleId from viewtime where ViewSeconds >= 24 order by Id desc limit ' +
          s + ') as a group by ArticleId order by C desc, ArticleId desc',
      function(error, results, fields) {
        if (error != null) {
          logger.error('top-recent');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send(
              {msg: 'success', result: results.map(e => [e.ArticleId, e.C])});
        }
      });
};