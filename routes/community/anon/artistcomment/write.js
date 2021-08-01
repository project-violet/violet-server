// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const r_auth = require('../../../../auth/auth');
const a_database = require('../../../../api/database');

const logger = require('../../../../etc/logger');

const writeSchema = Joi.object({
  UserAppId: Joi.string().max(150).required(),
  Body: Joi.string().max(500).required(),
  ArtistName: Joi.string().max(100).required(),
});

module.exports = async function read(req, res, next) {
  if (!r_auth.wauth(req)) {
    res.status(403).type('json').send({msg: 'forbidden'});
    return;
  }

  try {
    await writeSchema.validateAsync(req.body);

    var pool = a_database();
    pool.query(
        'INSERT INTO artistcomment SET ?', {
          ...req.body,
          TimeStamp: {
            toSqlString: function() {
              return 'CURRENT_TIMESTAMP()';
            }
          },
        },
        function(error, results, fields) {
          if (error != null) {
            logger.error('write-artist-comment', error);
          }
        });

    res.status(200).type('json').send({msg: 'success'});
  } catch (e) {
    res.status(400).type('json').send({msg: 'bad request'});
  }
}