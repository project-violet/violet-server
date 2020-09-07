// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

var m_view = require("../memory/view");

// Gets the tags counted with the view function.
module.exports = async function top(req, res, next) {
  var offset = req.query.offset;
  var count = req.query.count;
  var type = req.query.type || 'daily';

  if (offset == null || count == null || isNaN(offset) || isNaN(count)) {
    res.status(400).type('text').send('Use like https://koromo.xyz/top?offset=0&count=100&type={daily|week|month|alltime}');
    return;
  }

  var result = m_view.query(offset, count, type);
  if (result == null)
    res.status(400).type('text').send('Bad query.');
  else 
    res.type('json').send({'msg':'success', 'result': result});
}; 