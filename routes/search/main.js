// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const r_auth = require('../../auth/auth');

// (A or B) C D E (X or Y) F G -X

const tokenType = {
  'artist': [1, 'eharticles_artists', 'Artist'],
  'group': [1, 'eharticles_groups', 'Group'],
  'female': [1, 'eharticles_tags', 'Tag'],
  'male': [1, 'eharticles_tags', 'Tag'],
  'tag': [1, 'eharticles_tags', 'Tag'],
  'lang': [0, 'Language'],
  'language': [0, 'Language'],
  'series': [1, 'eharticles_series', 'Series'],
  'uploader': [0, 'Uploader'],
  'character': [1, 'eharticles_characters', 'Character'],
  'type': [0, 'Type'],
  'class': [0, 'Class'],
  'title': [0, 'Title'],
};

/*
 Example for "artist:michiking tag:incest lang:korean"

 select a.Id
 from
   eharticles as a
   right join (
     select artist.Article from
     (select * from
       eharticles_artists as a
       right join eharticles_artists_junction as b on a.Id=b.Artist
     where a.Name="michiking") as artist
     join
     (select * from
       eharticles_tags as a
       right join eharticles_tags_junction as b on a.Id=b.Tag
     where a.Name="incest") as tag on artist.Article=tag.Article
   ) as b on a.Id=b.Article
 where a.Language="korean"
 order by b.Article desc

 select a.Id
 from eharticles as a right join
 (
   select tagZEPh.Article
   from (
     select *
     from eharticles_artists as a right join
          eharticles_artists_junction as b
          on a.Id=b.Artist where a.Name="michiking"
     ) as artistGsi3 join (
     select *
     from eharticles_tags as a right join
          eharticles_tags_junction as b on a.Id=b.Tag
          where a.Name="female:loli"
     ) as femaleUKAp
     on artistGsi3.Article=femaleUKAp.Article join (
     select * from eharticles_tags as a right join
     eharticles_tags_junction as b on a.Id=b.Tag where a.Name<>"inxcest") as
 tagZEPh on femaleUKAp.Article=tagZEPh.Article and
 artistGsi3.Article=tagZEPh.Article) as b on a.Id=b.Article where
 a.Language=("korean") group by a.Id order by b.Article desc ;

     SELECT *
     FROM   (SELECT *
        FROM   eharticles_artists AS a
               RIGHT JOIN eharticles_artists_junction AS b
                       ON a.id = b.artist
        WHERE  a.NAME = "michiking") AS artistGsi3
       JOIN (SELECT *
             FROM   eharticles_tags AS a
                    RIGHT JOIN eharticles_tags_junction AS b
                            ON a.id = b.tag
             WHERE  a.NAME = "female:loli") AS femaleUKAp
         ON artistGsi3.article = femaleUKAp.article
       JOIN (SELECT *
             FROM   eharticles_tags AS a
                    RIGHT JOIN eharticles_tags_junction AS b
                            ON a.id = b.tag
             WHERE  a.NAME = "incest") AS femaleUKAp1
         ON femaleUKAp.article = femaleUKAp1.article
       JOIN (SELECT *
             FROM   eharticles_tags AS a
                    RIGHT JOIN eharticles_tags_junction AS b
                            ON a.id = b.tag
             WHERE  a.NAME = "male:sole malex") AS femaleUKAp12
         ON femaleUKAp1.article = femaleUKAp12.article

         SELECT Article
                   FROM   (SELECT *
                           FROM   eharticles_artists AS a
                                  RIGHT JOIN eharticles_artists_junction AS b
                                          ON a.id = b.artist
                           WHERE  a.NAME = "michiking") AS artistoyu4
                          JOIN (SELECT *
                                FROM   eharticles_tags AS a
                                       RIGHT JOIN eharticles_tags_junction AS b
                                               ON a.id = b.tag
                                WHERE  a.NAME = "female:loli") AS femaleb2ZE
                            ON USING(article)
                          LEFT JOIN (SELECT *
                                     FROM   eharticles_tags AS a
                                            RIGHT JOIN eharticles_tags_junction
                                                       AS b
                                                    ON a.id = b.tag
                                     WHERE  a.NAME = "incest") AS tagIBiT
                                 ON femaleb2ZE.article = tagIBiT.article
                   WHERE  tagIBiT.article IS NULL

SELECT artist00Ur.article
                   FROM   (SELECT *
                           FROM   eharticles_artists AS a
                                  RIGHT JOIN eharticles_artists_junction AS b
                                          ON a.id = b.artist
                           WHERE  a.NAME = "michiking") AS artist00Ur
                          LEFT JOIN (SELECT *
                                     FROM   eharticles_tags AS a
                                            RIGHT JOIN eharticles_tags_junction
                                                       AS b
                                                    ON a.id = b.tag
                                     WHERE  a.NAME <> "female:loli") AS
                                    femaledQpg
                                 ON artist00Ur.article = femaledQpg.article
group by (artist00Ur.article) LEFT JOIN (SELECT * FROM   eharticles_tags AS a
                                            RIGHT JOIN eharticles_tags_junction
                                                       AS b
                                                    ON a.id = b.tag
                                     WHERE  a.NAME <> "male:sole male") AS
                                    malePST0
                                 ON artist00Ur.article = malePST0.article
                          LEFT JOIN (SELECT *
                                     FROM   eharticles_tags AS a
                                            RIGHT JOIN eharticles_tags_junction
                                                       AS b
                                                    ON a.id = b.tag
                                     WHERE  a.NAME <> "incest") AS tagc01k
                                 ON artist00Ur.article = tagc01k.article


                          SELECT eh.Id
                   FROM
                   (SELECT Id
                           FROM   eharticles) AS eh JOIN
                   (SELECT *
                           FROM   eharticles_tags AS a
                                  RIGHT JOIN eharticles_tags_junction AS b
                                          ON a.id = b.tag
                           WHERE  a.NAME = "female:loli") AS femaleaVhv ON eh.Id
= femaleaVhv.article group by eh.Id order by eh.Id desc limit 10; where
femaleaVhv.article IS NULL WHERE  femaleaVhv.article IS NULL

EXPLAIN
SELECT a.id
FROM   eharticles AS a
       RIGHT JOIN (SELECT eh.id
                   FROM   (SELECT id, Language
                           FROM   eharticles) AS eh
                          LEFT JOIN (SELECT *
                                     FROM   eharticles_tags AS a
                                            RIGHT JOIN eharticles_tags_junction
                                                       AS b
                                                    ON a.id = b.tag
                                     WHERE  a.NAME = "female:loli") AS
                                    femaleNcsq
                                 ON eh.id = femaleNcsq.article
                          LEFT JOIN (SELECT *
                                      FROM   eharticles_tags AS a
                                             RIGHT JOIN eharticles_tags_junction
                                                        AS b
                                                     ON a.id = b.tag
                                      WHERE  a.NAME = "male:sole male") AS
                                     maleOdxC
                                  ON eh.id = maleOdxC.article
                          LEFT JOIN (SELECT *
                                      FROM   eharticles_tags AS a
                                             RIGHT JOIN eharticles_tags_junction
                                                        AS b
                                                     ON a.id = b.tag
                                      WHERE  a.NAME = "incest") AS tagUAsi
                                  ON eh.id = tagUAsi.article
                   WHERE  femaleNcsq.article IS NULL
                          AND maleOdxC.article IS NULL
                          AND tagUAsi.article IS NULL
                          AND eh.Language = ( "korean" )
                          GROUP  BY eh.id
                          ORDER  BY eh.id DESC
                          LIMIT 10;
                          ) AS b
               ON a.id = b.id
WHERE

     */

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

function _searchToSQL(rawSearch) {
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
  var latestTable = '';
  var latestValidTable = '';
  var latestExcept = false;

  var innerExcepts = [];

  var innerQValues = [];
  var outerQValues = [];

  Object.entries(queryDesc).forEach(([key, value]) => {
    if (value.length == 0) return;

    if (tokenType[key][0] == 1) {
      value.forEach((val => {
        if (innerQuery != '') {
          // if (!val.startsWith('-') && latestExcept == false)
          //   innerQuery += ' join ';
          // else if (!val.startsWith('-') && latestExcept)
          //   innerQuery += ' full outer join ';
          // else if (latestExcept)
          //   innerQuery += ' right join ';
          // else
          // innerQuery += ' left join ';
          innerQuery += ' left join ';
          requireJoin = true;
        } else if (val.startsWith('-')) {
          latestExcept = true;
        }

        // var include = value.some(e => !(String)(e).startsWith('-'));
        // var exclude = value.some(e => (String)(e).startsWith('-'));

        var where = '';

        // if (include && !exclude) {
        //   where = 'a.Name IN ?';
        // } else if (exclude && !include) {
        //   where = 'a.Name NOT IN ?';
        // } else if (include && exclude) {
        //   where = 'a.Name IN ? AND a.Name NOT IT ?';
        // }

        where = 'a.Name=?';

        var rs = _createRandomString();
        innerQuery += '(select * from ' + tokenType[key][1] + ' as a ' +
            'right join ' + tokenType[key][1] + '_junction as b on a.Id=b.' +
            tokenType[key][2] + ' ' +
            'where ' + where + ') as ' + key + rs;
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
        // innerQValues.push(value.map(e => e.startsWith('-') ? e.slice(1) :
        // e));
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

  // if (innerQuery != '' && outerQuery != '') {
  //   tq = 'select a.Id from eharticles as a right join (select ' +
  //       latestValidTable + '.' + (latestValidTable == 'eh' ? 'Id' :
  //       'Article') + ' from ' + innerQuery + ') as b on a.Id=b.' +
  //       (latestValidTable == 'eh' ? 'Id' : 'Article') + ' where ' +
  //       outerQuery + ' group by a.Id order by b.' + (latestValidTable == 'eh'
  //       ? 'Id' : 'Article') + ' desc ';
  // } else if (innerQuery != '') {
  //   tq = 'select a.Id from eharticles as a right join (select ' +
  //       latestValidTable + '.' + (latestValidTable == 'eh' ? 'Id' :
  //       'Article') + ' from ' + innerQuery + ') as b on a.Id=b.' +
  //       (latestValidTable == 'eh' ? 'Id' : 'Article') +
  //       ' group by a.Id order by b.' +
  //       (latestValidTable == 'eh' ? 'Id' : 'Article') + ' desc ';
  // } else if (outerQuery != '') {
  //   tq = 'select Id from eharticles where ' + outerQuery +
  //       ' group by Id order by Id desc';
  // }

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

  console.log(tq);

  function _checkValid(ch) {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:()-_ '
        .includes(ch);
  }

  innerQValues.forEach(x => {
    var i = tq.indexOf('?');
    tq = tq.slice(0, i) + '"' + x + '"' + tq.slice(i + 1);
  });

  outerQValues.forEach(x => {
    var y = '';
    x.forEach(e => {
      if (y != '') y += ',';
      y += '"' + e + '"';
    });
    var i = tq.indexOf('?');
    tq = tq.slice(0, i) + '(' + y + ')' + tq.slice(i + 1);
  });


  console.log(tq);
}

_searchToSQL(
    '-female:loli male:sole_male artist:michiking -tag:incest lang:korean');

module.exports = function(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('html').send(p.p403);
    return;
  }
}