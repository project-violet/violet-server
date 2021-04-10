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
  return _expr();
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

function _alignTreeNodeChilds(node) {
  if (node.contents.length == 0) return;

  function _compareContent(c1, c2) {
    //
    // Global Priority
    // nt => and => exclude => or
    //
    if (c1.op == c2.op) return 0;
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
      if (tokenType[c1.op.split(':')[0]][0] > tokenType[c2.op.split(':')[0]][0])
        return -1;
      else if (
          tokenType[c1.op.split(':')[0]][0] < tokenType[c2.op.split(':')[0]][0])
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
}

function _alignTree(node) {
  _alignTreeNodeChilds(node);
  for (var i = 0; i < node.contents.length; i++) {
    _alignTree(node.contents[i]);
  }
}

/*
    Search To SQL

    1. Split and Build Parse Tree
    2. Align using Tag Count Map
 */
function _searchToSQL(rawSearch, enableInjection = false) {
  function _createRandomString() {
    var result = [];
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 4; i++) {
      result.push(
          characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }

  function _split(what) {
    var result = [];
    var ga = [];
    var cur = '';
    var _ga = 0;
    for (var i = 0; i < what.length; i++) {
      //   if (!_checkValid(what[i])) continue;
      if (what[i] == '(') {
        _ga += 1;
      } else if (what[i] == ')') {
        _ga -= 1;
        if (cur != '' && _ga == 0) {
          ga.push(cur);
          cur = '';
        }
      } else if (what[i] == '-' && _ga == 0) {
        if (cur != '') {
          result.push(cur);
          cur = '';
        }
        result.push('-');
      } else if (what[i] == ' ' && _ga == 0) {
        if (cur != '') {
          result.push(cur);
          cur = '';
        }
      } else {
        cur += what[i];
      }
    }
    if (cur != '') result.push(cur);
    return [result, ga];
  }

  var split = _split(rawSearch);
  var queryDesc = {
    'artist': [],
    'group': [],
    'female': [],
    'male': [],
    'tag': [],
    'lang': [],
    'series': [],
    'uploader': [],
    'character': [],
    'type': [],
    'class': [],
    'title': [],
  };

  for (var i = 0; i < split[0].length; i++) {
    if (split[0][i].includes(':')) {
      var ss = split[0][i].split(':');
      var token = ss[0];
      // unknown token type
      if (!(token in tokenType)) continue;
      if (i >= 1 && split[0][i - 1] == '-') {
        if (token == 'female' || token == 'male')
          queryDesc[token].push('-' + token + ':' + ss[1].replace('_', ' '));
        else
          queryDesc[token].push('-' + ss[1].replace('_', ' '));
      } else {
        if (token == 'female' || token == 'male')
          queryDesc[token].push(token + ':' + ss[1].replace('_', ' '));
        else
          queryDesc[token].push(ss[1].replace('_', ' '));
      }
    } else if (split[0][i] == '-') {
      continue;
    } else {
      // Title Token
      if (i >= 1 && split[0][i - 1] == '-') {
        queryDesc['title'].push('-' + split[0][i]);
      } else {
        queryDesc['title'].push(split[0][i]);
      }
    }
  }

  var innerQuery = '';
  var outerQuery = '';
  var requireJoin = false;

  var innerExcepts = [];

  var innerQValues = [];
  var outerQValues = [];

  Object.entries(queryDesc).forEach(([key, value]) => {
    if (value.length == 0) return;

    if (tokenType[key][0] == 1) {
      value.forEach((val => {
        if (innerQuery != '') {
          innerQuery += ' left join ';
          requireJoin = true;
        } else if (val.startsWith('-')) {
          latestExcept = true;
        }

        var rs = _createRandomString();
        innerQuery += '(select * from ' + tokenType[key][1] + ' as a ' +
            'right join ' + tokenType[key][1] + '_junction as b on a.Id=b.' +
            tokenType[key][2] + ' ' +
            'where a.Name=?) as ' + key + rs;
        if (requireJoin) {
          innerQuery += ' on eh.Id=' + key + rs + '.Article';
        } else {
          if (val.startsWith('-'))
            innerQuery =
                '(select * from eharticles) as eh left join ' + innerQuery;
          else
            innerQuery =
                '(select * from eharticles) as eh inner join ' + innerQuery;
          innerQuery += ' on eh.Id=' + key + rs + '.Article';
        }
        latestTable = key + rs;
        if (val.startsWith('-'))
          innerExcepts.push(key + rs);
        else
          latestValidTable = key + rs;
        innerQValues.push(val.startsWith('-') ? val.slice(1) : val);
      }));
    } else {
      if (outerQuery != '') outerQuery += ' AND ';
      if (key == 'title') {
        outerQuery += 'match (Title) against (? in natural language mode)';
      } else {
        outerQuery += 'eh.' + tokenType[key][1] + '=?';
      }
      outerQValues.push(value);
    }
  });

  if (innerExcepts.length > 0) {
    innerQuery +=
        ' where ' + innerExcepts.map(e => e + '.Article IS NULL').join(' and ');
  }

  var tq = '';

  if (innerQuery != '' && outerQuery != '') {
    tq = 'select eh.Id from ' + innerQuery +
        (innerExcepts.length == 0 ? ' where ' : ' and ') + outerQuery +
        ' group by eh.Id order by eh.Id desc';
  } else if (innerQuery != '') {
    tq = 'select eh.Id from ' + innerQuery +
        ' group by eh.Id order by eh.Id desc';
  } else if (outerQuery != '') {
    tq = 'select Id from eharticles where ' + outerQuery +
        ' group by Id order by Id desc';
  }

  function _checkValid(ch) {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:()-_ '
        .includes(ch);
  }

  if (enableInjection) {
    innerQValues.forEach(x => {
      var i = tq.indexOf('?');
      tq = tq.slice(0, i) + '"' +
          x.replace('\\', '\\\\')
              .replace('"', '\\"')
              .replace('＼', '\\\\')
              .replace('＂', '\\"') +
          '"' + tq.slice(i + 1);
    });

    outerQValues.forEach(x => {
      var y = '';
      x.forEach(e => {
        if (y != '') y += ',';
        y += '"' +
            e.replace('\\', '\\\\')
                .replace('"', '\\"')
                .replace('＼', '\\\\')
                .replace('＂', '\\"') +
            '"';
      });
      var i = tq.indexOf('?');
      tq = tq.slice(0, i) + '(' + y + ')' + tq.slice(i + 1);
    });

    return tq;
  }

  return [tq, innerQValues.concat(outerQValues)];
}


// _makeTree('-female:loli');
var tree = _makeTree(
    '-female:loli male:sole_male  (lang:korean or lang:n/a) artist:michiking -tag:incest');
_alignTree(tree);

_printTree(tree);

/*
+- and
  |- and
  | |- and
  | | |- and
  | | | |- -
  | | | | +- female:loli
  | | | +- male:sole_male
  | | +- or
  | |   |- lang:korean
  | |   +- lang:n/a
  | +- artist:michiking
  +- -
    +- tag:incest

+- and
  |- artist:michiking
  |- male:sole_male
  |- -
  | +- female:loli
  |- -
  | +- tag:incest
  +- or
    |- lang:korean
    +- lang:n/a
*/
