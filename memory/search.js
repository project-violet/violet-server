// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const a_syncdatabase = require('../api/syncdatabase');

const tokenType = {
  // Allow Redundancy
  'artist': [1, 'eharticles_artists', 'Artist'],
  'group': [1, 'eharticles_groups', 'Group'],
  'female': [1, 'eharticles_tags', 'Tag'],
  'male': [1, 'eharticles_tags', 'Tag'],
  'tag': [1, 'eharticles_tags', 'Tag'],
  'series': [1, 'eharticles_series', 'Series'],
  'character': [1, 'eharticles_characters', 'Character'],
  // Disallow redundancy
  'uploader': [0, 'Uploader'],
  'lang': [0, 'Language'],
  'language': [0, 'Language'],
  'type': [0, 'Type'],
  'class': [0, 'Class'],
  'title': [0, 'Title'],
};

const tagCountMap = {};

//
//  Load Tag Map from Database Server
//
function _loadTagMap() {
  var conn = a_syncdatabase();
  var mm = [
    ['eharticles_tags', 'Tag'], ['eharticles_artists', 'Artist'],
    ['eharticles_series', 'Series'], ['eharticles_groups', 'Group'],
    ['eharticles_characters', 'Character']
  ];

  for (var i = 0; i < mm.length; i++) {
    var query = 'select b.Name as N, count(*) as C from ' + mm[i][0] +
        '_junction as a left join ' + mm[i][0] + ' as b on a.' + mm[i][1] +
        '=b.Id group by a.' + mm[i][1] + ' order by c desc';
    console.log(query);
    var rr = conn.query(query);

    for (var j = 0; j < rr.length; j++) {
      if (i == 0) tagCountMap[rr[j]['N'].replace(' ', '_')] = rr[j]['C'];
      tagCountMap[mm[i][1].toLowerCase() + ':' + rr[j]['N'].replace(' ', '_')] =
          rr[j]['C'];
    }
  }

  console.log(Object.keys(tagCountMap).length);
}

_loadTagMap();

class _treeNode {
  constructor(contents, parent, op) {
    this.parent = parent;
    this.op = op;
    this.contents = contents;
  }
}

function _makeTree(what) {
  var point = 0;
  var latestToken = '';

  //
  //  Set latestToken to Next Token
  //
  function _next() {
    latestToken = '';
    for (; point < what.length; point++) {
      if (what[point] == ' ')
        if (latestToken == '')
          continue;
        else {
          point++;
          return;
        }
      latestToken += what[point];
      if ('()-'.includes(what[point]) ||
          (point <= what.length && '()-'.includes(what[point + 1]))) {
        point++;
        return;
      }
    }
    // Finish Token Scan
    if (latestToken == '') latestToken = null;
  }

  //
  //  Test Tokenizer
  //
  // var tmp = '';
  //   while ((tmp = _next()) != null) console.log(tmp);

  //
  //  LL Based Tree Construction Routines
  //
  function _expr() {
    var l = _term();
    var n;
    while (latestToken == 'or') {
      _next();  // consume or
      var r = _term();
      if (n == null)
        n = new _treeNode([l, r], null, 'or');
      else
        n.contents.push(r);
      r.parent = n;
    }
    return n != null ? n : l;
  }
  function _term() {
    var l = _factor();
    var n;
    while (latestToken != 'or' && latestToken != ')' && latestToken != null) {
      var r = _factor();
      if (n == null)
        n = new _treeNode([l, r], null, 'and');
      else
        n.contents.push(r);
      r.parent = n;
    }
    return n != null ? n : l;
  }
  function _factor() {
    if (latestToken == '-') {
      _next();  // consume -
      var r = _factor();
      var n = new _treeNode([r], null, '-');
      r.parent = n;
      return n;
    } else if (latestToken == '(') {
      _next();  // consume (
      var r = _expr();
      if (latestToken != ')') throw 'Unpredicted character ' + latestToken;
      _next();  // consume )
      return r;
    }
    var n = new _treeNode([], null, latestToken);
    _next();  // consume Non-Terminal
    return n;
  }

  _next();
  var t = _expr();
  if (t.op != 'and') t = new _treeNode([t], null, 'and');
  return t;
}

//
//  Print Tree To Console Pretty
//
function _printTree(node) {
  function _innerPrintNode(builder, node, indent, last) {
    builder.s += indent;
    if (last) {
      builder.s += '+-';
      indent += '  ';
    } else {
      builder.s += '|-';
      indent += '| ';
    }

    if (node.op != null)
      builder.s += ' ' + node.op + '\r\n';
    else
      builder.s += '\r\n';

    for (var i = 0; i < node.contents.length; i++)
      _innerPrintNode(
          builder, node.contents[i], indent, i == node.contents.length - 1)
  }

  var x = {};
  x.s = '';
  _innerPrintNode(x, node, '', true);
  console.log(x.s);
}

function _optimizeTree(node) {
  /*
  Align Child Item for High Performance Query
  */
  function _alignTree(node) {
    if (node.contents.length == 0) return;

    function _compareContent(c1, c2) {
      //
      // Global Priority
      // nt => and => exclude => or
      //
      if (c1.op == c2.op) {
        if (c1.op == '-' && c2.op == '-') {
          // Compare with Contents
          return _compareContent(c1.contents[0], c2.contents[0]);
        }

        return 0;
      }
      var x = c1.op == '-' || c1.op == 'or' || c1.op == 'and';
      var y = c2.op == '-' || c2.op == 'or' || c2.op == 'and';

      //
      // Compare Content
      // tag (ar => dr) => title
      //
      if (!x && !y) {
        //
        // Compare Is Token Or TitleText
        //
        var tt1 = c1.op.includes(':');
        var tt2 = c2.op.includes(':');
        if (!tt1 && !tt2) return 0;
        if (tt1 != tt2) return tt1 ? -1 : 1;

        //
        // Compare Allow Redundancy
        //
        if (tokenType[c1.op.split(':')[0]][0] >
            tokenType[c2.op.split(':')[0]][0])
          return -1;
        else if (
            tokenType[c1.op.split(':')[0]][0] <
            tokenType[c2.op.split(':')[0]][0])
          return 1;

        //
        //  Compare with Counts (lower is unique)
        //
        var x = tagCountMap[c1.op];
        var y = tagCountMap[c2.op];
        if ((x == null) != (y == null)) return x == null ? -1 : 1;
        if (x == null && y == null) return 0;
        if (x < y)
          return -1;
        else if (x > y)
          return 1;
        return 0;
      }
      if (!x) return -1;
      if (!y) return 1;
      if (c1.op == 'and') return -1;
      if (c2.op == 'and') return 1;
      if (c1.op == '-') return -1;
      if (c2.op == '-') return 1;
      return 0;
    }

    function _nodeContentsSwap(node, p1, p2) {
      var tmp = node.contents[p1];
      node.contents[p1] = node.contents[p2];
      node.contents[p2] = tmp;
    }

    //
    //  Selection Sort
    //
    for (var i = 0; i < node.contents.length - 1; i++) {
      var least = i;
      for (var j = i + 1; j < node.contents.length; j++) {
        if (_compareContent(node.contents[j], node.contents[least]) < 0)
          least = j;
      }

      if (least != i) _nodeContentsSwap(node, least, i);
    }
    for (var i = 0; i < node.contents.length; i++) {
      _alignTree(node.contents[i]);
    }
  }

  /*
  Pull Sub Ands To Parent

  +- and
    |- artist:michiking
    +- and
      |- lang:korean
      |- type:artistcg
      +- and
        |- class:c99
        +- male:sole male

      ==>

  +- and
    |- artist:michiking
    |- lang:korean
    |- type:artistcg
    |- class:c99
    +- male:sole male
  */
  function _pullSubAndOrNodesRecursize(node) {
    for (var i = 0; i < node.contents.length; i++)
      _pullSubAndOrNodesRecursize(node.contents[i]);
    if (node.op == 'and') {
      for (var i = 0; i < node.contents.length; i++) {
        if (node.contents[i].op == 'and') {
          for (var j = node.contents[i].contents.length - 1; j >= 0; j--) {
            node.contents[i].contents[j].parent = node.parent;
            node.contents.push(node.contents[i].contents[j]);
          }
          node.contents.splice(i--, 1);
        }
      }
    } else if (node.op == 'or') {
      for (var i = 0; i < node.contents.length; i++) {
        if (node.contents[i].op == 'or') {
          for (var j = node.contents[i].contents.length - 1; j >= 0; j--) {
            node.contents[i].contents[j].parent = node.parent;
            node.contents.push(node.contents[i].contents[j]);
          }
          node.contents.splice(i--, 1);
        }
      }
    }
  }

  /*
  Unwind Minus Operation

  -(A or B)     ==>  -A and -B
  -(A   -B)     ==>  -A  or  B
  */
  function _unwindMinus(node) {
    // (A or B) => -A and -B
    function _propagate(node) {
      // -A => A
      if (node.op == '-') {
        node.op = node.contents[i].op;
        node.contents = node.contents[i].contents;
      }
      // A or B or C => -A and -B and -C
      else if (node.op == 'or') {
        node.op = 'and';
        for (var i = 0; i < node.contents.length; i++)
          _propagate(node.contents[i]);
      }
      // A and B and C => -A or -B or -C
      else if (node.op == 'and') {
        node.op = 'or';
        for (var i = 0; i < node.contents.length; i++)
          _propagate(node.contents[i]);
      }
      // Non-Terminal
      else {
        var n = new _treeNode([], node, node.op);
        node.op = '-';
        node.contents = [n];
      }
    }
    for (var i = 0; i < node.contents.length; i++)
      _unwindMinus(node.contents[i]);
    for (var i = 0; i < node.contents.length; i++) {
      if (node.contents[i].op == '-') {
        if (node.contents[i].contents[0].op != 'and' &&
            node.contents[i].contents[0].op != 'or' &&
            node.contents[i].contents[0].op != '-')
          continue;
        _propagate(node.contents[i].contents[0]);
        node.contents[i].contents[0].parent = node.parent;
        node.contents.push(node.contents[i].contents[0]);
        node.contents.splice(i--, 1);
      }
    }
  }

  /*
  Check Distributable

  A and (B or C)          => (A and B) or (A and C)
      (when c(A) < c(B) + c(C))
  (A and B) or (A and C)  => A and (B or C)
      (when )
  */

  /*
  Check Inconsistent

  A and -A    => false
  A or  -A    => true
  */

  // Run Optimization Passes
  _pullSubAndOrNodesRecursize(node);
  _alignTree(node);
  _unwindMinus(node);
  _alignTree(node);
  _pullSubAndOrNodesRecursize(node);
  _alignTree(node);
}


/*
    Search To SQL

    1. Build Parse Tree
    2. Align using Tag Count Map

    WHERE IN vs INNER JOIN
 */
function _innerNodeToSQL(node, or = false) {
  function _createRandomString() {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 4; i++) {
      result.push(
          characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }

  var sql = '(select * from eharticles) as eh';
  var wheres = [];
  var innerQValues = [];
  var outerQValues = [];

  for (var i = 0; i < node.contents.length; i++) {
    var target = node.contents[i];
    var neg = false;

    if (target.op == 'or') {
      wheres.push(
          '(' +
          node.contents[i]
              .contents
              .map(e => {
                if (e.op == 'and' || e.op == 'or' || e.op == '-')
                  throw 'Bad Query! Simple Query is accepted currently';
                if (e.op.includes(':')) {
                  var kv = e.op.split(':');
                  if (kv[0] == 'female' || kv[0] == 'male')
                    outerQValues.push(e.op.replace('_', ' '));
                  else
                    outerQValues.push(
                        e.op.slice(e.op.indexOf(':') + 1).replace('_', ' '));
                  return 'eh.' + tokenType[kv[0]][1] + '=?';
                } else {
                  outerQValues.push(e.op.replace('_', ' '));
                  return 'match (eh.Title) against (? in natural language mode)';
                }
              })
              .join(' or ') +
          ')');
      continue;
    }

    if (target.op == '-') {
      if (target.contents.length != 1) return;
      target = target.contents[0];
      neg = true;
    }

    if (target.op.includes(':')) {
      var kv = target.op.split(':');
      var rs = _createRandomString();

      if (tokenType[kv[0]][0] == 1) {
        var sub = '';

        sub = '(select * from ' + tokenType[kv[0]][1] + ' as a ' +
            'right join ' + tokenType[kv[0]][1] + '_junction as b on a.Id=b.' +
            tokenType[kv[0]][2] + ' ' +
            'where a.Name=?) as ' + kv[0] + rs;

        sql += ' ' + (neg ? 'left' : 'inner') + ' join ' + sub +
            ' on eh.Id=' + kv[0] + rs + '.Article';

        if (neg) wheres.push(kv[0] + rs + '.Article IS NULL');

        if (kv[0] == 'female' || kv[0] == 'male')
          innerQValues.push(target.op.replace('_', ' '));
        else
          innerQValues.push(
              target.op.slice(target.op.indexOf(':') + 1).replace('_', ' '));
      } else {
        wheres.push('eh.' + tokenType[kv[0]][1] + (neg ? '<>' : '=') + '?');
        if (kv[0] == 'female' || kv[0] == 'male')
          outerQValues.push(target.op.replace('_', ' '));
        else
          outerQValues.push(
              target.op.slice(target.op.indexOf(':') + 1).replace('_', ' '));
      }
    } else {
      wheres.push(
          (neg ? 'not ' : '') +
          'match (eh.Title) against (? in natural language mode)');
      outerQValues.push(target.op);
    }
  }

  if (wheres.length > 0) {
    sql += ' where ' + wheres.join(' and ');
  }

  const front = 'select eh.Id from ';
  const back = ' group by eh.Id order by Id desc limit 30';
  return [front + sql + back, innerQValues.concat(outerQValues)];
}

function _searchToSQL(rawSearch) {
  var tree = _makeTree(rawSearch);
  _optimizeTree(tree);
  return _innerNodeToSQL(tree);
}

function _injectValues(sql, values) {
  values.forEach(x => {
    var i = sql.indexOf('?');
    sql = sql.slice(0, i) + '"' +
        x.replace('\\', '\\\\')
            .replace('"', '\\"')
            .replace('＼', '\\\\')
            .replace('＂', '\\"') +
        '"' + sql.slice(i + 1);
  });
  return sql;
}

function _getDetailQuery(articleId) {
  return 'select a.Id, Title, EHash, Type, Language, Uploader, Published, Files, Class, ExistOnHitomi,' +
      'GROUP_CONCAT(DISTINCT c.Name) as Tags, ' +
      'GROUP_CONCAT(DISTINCT e.Name) as Artists, ' +
      'GROUP_CONCAT(DISTINCT g.Name) as Characters,' +
      'GROUP_CONCAT(DISTINCT i.Name) as Groups,' +
      'GROUP_CONCAT(DISTINCT k.Name) as Series ' +
      'from ' +
      '(select * from eharticles where Id=' + articleId + ') as a ' +
      'left join eharticles_tags_junction as b on a.Id=b.Article ' +
      'left join eharticles_tags as c on b.Tag=c.Id ' +
      'left join eharticles_artists_junction as d on a.Id=d.Article ' +
      'left join eharticles_artists as e on d.Artist=e.Id ' +
      'left join eharticles_characters_junction as f on a.Id=f.Article ' +
      'left join eharticles_characters as g on f.Character=g.Id ' +
      'left join eharticles_groups_junction as h on a.Id=h.Article ' +
      'left join eharticles_groups as i on h.Group=i.Id ' +
      'left join eharticles_series_junction as j on a.Id=j.Article ' +
      'left join eharticles_series as k on j.Series=k.Id ';
}

module.exports = {
  searchToSQL: _searchToSQL,
  injectValues: _injectValues,
  getDetailQuery: _getDetailQuery
}