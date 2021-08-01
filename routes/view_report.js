// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const r_auth = require('../auth/auth');
const a_database = require('../api/database');
const logger = require('../etc/logger');

const Joi = require('joi');

const reportSchema = Joi.object({
  user: Joi.string().max(500).required(),
  id: Joi.number().required(),
  startsTime: Joi.number().required(),
  endsTime: Joi.number().required(),
  pages: Joi.number().required(),
  lastPage: Joi.number().required(),
  validSeconds: Joi.number().required(),
  msPerPages: Joi.string().max(16777214).required(),
});

// This function is triggered when the user reads a specific article.
module.exports = async function view_report(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await reportSchema.validateAsync(req.body);
    var pool = a_database();
    pool.query(
        'INSERT INTO viewreport SET ?', {
          ArticleId: req.body.id,
          StartsTime: { toSqlString: function() { return 'FROM_UNIXTIME(' + (req.body.startsTime / 1000.0) + ')'; } },
          EndsTime: { toSqlString: function() { return 'FROM_UNIXTIME(' + (req.body.endsTime / 1000.0) + ')'; } },
          LastPage: req.body.lastPage,
          ValidSeconds: req.body.lastPage,
          Pages: req.body.pages,
          MsPerPages: req.body.msPerPages,
          UserAppId: req.body.user,
          TimeStamp: { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } },
        },
        function(error, results, fields) {
          if (error != null) {
            logger.error('viewreportdb', error);
          }
        });

    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    console.log(e);
    res.status(400).type('json').send({msg: 'bad request'});
  }
};
