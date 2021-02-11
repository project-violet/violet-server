// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const m_view = require("../memory/view_redis");
const p = require("../pages/status");

// Gets the tags counted with the view function.
module.exports = async function top(req, res, next) {
  const offset = req.query.offset;
  const count = req.query.count;
  const type = req.query.type || 'daily';

  if (offset == null || count == null || isNaN(offset) || isNaN(count)) {
    res.status(400).type("html").send(p.p400);
    return;
  }

  const result = await m_view.query(offset, count, type);
  if (result == null)
    res.status(400).type("html").send(p.p400);
  else {
    // In Flutter, only up to 999 items can be displayed.
    if (result.length == 1000)
      result.pop();
    res.type('json').send({'msg':'success', 'result': result});
  }
}; 