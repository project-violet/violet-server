// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

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

function _loadTagMap() {}

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
  function _getNextToken() {
    latestToken = '';
    for (; point < what.length; point++) {
      if (what[point] == ' ')
        if (latestToken == '')
          continue;
        else {
          point++;
          return latestToken;
        }
      latestToken += what[point];
      if ('()-'.includes(what[point]) ||
          (point <= what.length && '()-'.includes(what[point + 1]))) {
        point++;
        return latestToken;
      }
    }
    // Finish Token Scan
    if (latestToken == '') return latestToken = null;
    return latestToken;
  }

  function _getLookahead() {
    var tpt = point;
    var tlt = latestToken;
    var la = _getNextToken();
    point = tpt;
    latestToken = tlt;
    return la;
  }

  var tmp = '';
  //   while ((tmp = _getNextToken()) != null) console.log(tmp);

  function _expr() {
    var l = _term();
    var n;
    while (latestToken == 'or') {
      _getNextToken();  // consume or
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
      _getNextToken();  // consume -
      var r = _factor();
      var n = new _treeNode([r], null, '-');
      r.parent = n;
      return n;
    } else if (latestToken == '(') {
      _getNextToken();  // consume (
      var r = _expr();
      if (latestToken != ')') throw 'Unpredicted character ' + latestToken;
      _getNextToken();  // consume )
      return r;
    }
    var n = new _treeNode([], null, latestToken);
    _getNextToken();  // consume Non-Terminal
    return n;
  }

  _getNextToken();
  return _expr();
}

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
    // priority
    // nt => and => exclude => or
    if (c1.op == c2.op) return 0;
    var x = c1.op == '-' || c1.op == 'or' || c1.op == 'and';
    var y = c2.op == '-' || c2.op == 'or' || c2.op == 'and';
    if (!x && !y) return 0;
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

  // selection sort
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
*/
