// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const r_auth = require('../../auth/auth');
const m_excomments = require('../../memory/excomments');
const p = require('../../pages/status');

module.exports = async function find(req, res, next) {
  // if (!r_auth.wauth(req)) {
  //   res.status(403).type('json').send({msg: 'forbidden'});
  //   return;
  // }

  const q = req.query.q;

  if (q == null) {
    res.status(400).type('json').send({msg: 'bad request'});
    return;
  }

  const result = await m_excomments.find(q);
  if (result == null)
    res.status(400).type('json').send({msg: 'bad request'});
  else {
    res.type('json').send({
      'msg': 'success',
      'result': result.slice(0, Math.min(result.length, 1500))
    });
  }
};