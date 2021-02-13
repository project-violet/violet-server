// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const m_view = require('../memory/view_redis');
const Joi = require('joi');
const p = require('../pages/status');

const r_auth = require('../auth/auth');

const querySchema = Joi.object({
  id: Joi.string().length(40).required(),
});

async function similarity_query(id) {
    return 'test';
}

module.exports = async function query(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }

  try {
    await querySchema.validateAsync(req.body);
    const result = await similarity_query(req.query.id);
    res.type('json').send({'msg': 'success', 'result': result});
  } catch {
    res.status(400).type('json').send({msg: 'bad request'});
  }
};