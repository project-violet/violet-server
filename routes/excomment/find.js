// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const m_excomments = require('../../memory/excomments');
const p = require('../../pages/status');

module.exports = async function find(req, res, next) {
  const q = req.query.q;

  if (q == null) {
    res.status(400).type('html').send(p.p400);
    return;
  }

  const result = await m_excomments.find(q);
  if (result == null)
    res.status(400).type('html').send(p.p400);
  else {
    result.slice(0, Math.min(result.length, 1500));
    res.type('json').send({'msg': 'success', 'result': result});
  }
};