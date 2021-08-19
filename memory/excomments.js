// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const fs = require('fs');

// id, time, author, body
const jsonFile = fs.readFileSync('excomment-zip.json', 'utf8');
const exComments = JSON.parse(jsonFile);

function _find(what) {
  var results = [];
  var words = what.split(' ');
  Object.keys(exComments).forEach(function(key) {
    exComments[key].forEach(function(comment) {
      if (words.every((e) => comment.Item3.includes(e)))
        results.push({
          id: key,
          time: comment.Item1,
          author: comment.Item2,
          body: comment.Item3
        });
    });
  });
  results.sort((x, y) => y.id - x.id)
  return results;
}

function _findByAuthor(author) {
  var results = [];
  Object.keys(exComments).forEach(function(key) {
    exComments[key].forEach(function(comment) {
      if (comment.Item2 == author)
        results.push({
          id: key,
          time: comment.Item1,
          author: comment.Item2,
          body: comment.Item3
        });
    });
  });
  results.sort((x, y) => y.id - x.id)
  return results;
}

module.exports = {
  find: _find,
  findByAuthor: _findByAuthor,
}