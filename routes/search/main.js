// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const Joi = require('joi');

const a_database = require('../../api/database');
const r_auth = require('../../auth/auth');
const m_search = require('../../memory/search');
const m_session = require('../../memory/session');

const searchSchema = Joi.object({
  Search: Joi.string().max(500).required(),
  Session: Joi.string().required(),
  Offset: Joi.number().integer().required(),
});

function _search(res, user, search, offset) {
  const query = m_search.searchToSQL(search);
  const pool = a_database();
  const qr = pool.query(
      'select GROUP_CONCAT(r.Id) as R from (' + query[0] + ' offset ' + offset +
          ') as r group by null',
      query[1], function(error, results, fields) {
        if (error != null) {
          logger.error('search');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          if (results == null || results[0].R == null)
            res.status(200).type('json').send({msg: 'results zero'});
          else
            res.status(200).type('json').send(
                {msg: 'success', result: results[0].R.split(',')});
        }
      });
}

async function _checkSession(body) {
  return await m_session.isExists(body.Session, null);
}

async function _sessionToUser(body) {
  let session = body['Session'];
  delete body['Session'];
  body['User'] = await m_session.sessionToUser(session);
  return body;
}

module.exports = async function(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  try {
    await searchSchema.validateAsync(req.body);

    if (!await _checkSession(req.body)) {
      res.status(200).type('json').send({msg: 'session not found'});
      return;
    }

    _search(
        res, await _sessionToUser(req.body), req.body.Search, req.body.Offset);
  } catch (e) {
    console.log(e);
    res.status(400).type('json').send({msg: 'bad request'});
  }
}