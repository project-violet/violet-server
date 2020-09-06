// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

// Gets the tags counted with the view function.
module.exports = async function top(req, res, next) {
  var offset = req.query.offset;
  var count = req.query.count;

  if (offset == null || count == null) {
    res.status(400).type('text').send('Use like https://koromo.xyz/top?offset=0&count=100');
    return;
  }

  res.type('json').send({'msg':'correct request'});
}; 