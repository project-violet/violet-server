//var express = require('express');
//var app = express();
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 80 });

/*
var server = app.listen(80, function(){
});

app.get('/', function(req, res){
    res.send('Error');
});



var crypto = require('crypto');
 
var PRIVKEY = '-----BEGIN RSA PRIVATE KEY-----\n'+
'MIIEpQIBAAKCAQEAuWscpDK1DgwC9fIE3EM7A5N1Aw2vMXZCGORYczoAZZOKNxhB\n'+
'OjADZcOsvCkTAEwtytE7cLS+k1Dpncy9KeD2WmywUicJWwwHfO+aDTbFb4kr+wpN\n'+
'E6WgzgWlkQbSHamj0T4Qq+KAuy38Gacg1a5E2pu0TDZs7AS6D55C6fHBM3WZ81ED\n'+
'pcH+Flmzr+DG3ejUZIKCrmmS6pIo4LpKNDeYhvNolgZF/zmm3OE+bn/aFa6klwQQ\n'+
'Wxow3lgK5Cl47tpTmv5/0hj1EsQ4puACkxuidyTsdU9bFVDBu1OqfFfAwlyumD4q\n'+
'kr0SNVo9t1Fz2PlJ1X8Hx0vkfUYJVyp7edE5KwIDAQABAoIBAQCRQ2lc+pz+NErd\n'+
'hI5qQgGp+4xgqAfpKE0AU2U4YOiOq9hM8aOogpUm1PYvM76/LO9zRhjbY78qiul7\n'+
'xzsr5CMdFKnOsuaRfgsfxldaot5rU3wxYRCho9EnlyTvSfizZIQDGizVfM591rj7\n'+
'IASJY85tti66xqju/4UFV2f1AIHsXY5UGnhSPYmLAyZjFsKx21icsInw65oSxYbz\n'+
'14uzCp8iZjSHyFlCF5NwBdUabg2Zj/ip6BfZRdIMwqtP9w48eZQG+NkOHym7nPXl\n'+
'pdTVrMO7aPWDWzwtBKJIQ8fymCD/p4vPs56TDugTFaW26qjRl6FfiCzKIBfLY4zv\n'+
'VnI8ZVwBAoGBAPT9ZMdHn/t515PSYbeKaYo9/S2pBhJeidJzrAllbnlSremFGYMx\n'+
'QkSDuWkamWE0iU7nBczSr1YxLJUgreICDwFhifNLeBtUJt/hJnRG9FWmEONGbyyE\n'+
'r9JeFN3R50P7w40c9J8OgQI1wfEYHFgpEpq1A7yJ45pQFJ61chI3+qphAoGBAMHA\n'+
'WXdrBvy+v5/fvohNhhkgz6ZiifqcoL2HeAm1tF6PloOLKBvcpBIiyDyOXC5UwLn+\n'+
'96I4QSelpbc/Cx1ougHjO7+gmB2o4d3TOmvG65S7y295TXoSQpBd7tz87VF/opEh\n'+
'n0/4evMwgjzDgOV1V/NhDWGlNgWDInT894F+q0cLAoGBAJwN9O4Dr+KuYCXnMxuI\n'+
'7WWDywwUyKtW0Q/fYsyxcceSZPmFMRUigYXHKonKybzjjDtYaZdo9QtAU5fCs0Bt\n'+
'80T77rWtcxplZkXh027p66XLHKLJMPP4qU6lY0FQ/bGOY6g1s5TF1mOj/qAmrZdy\n'+
'wkkN2Q12ACdBr4DRL5JvWhrBAoGAX/Ut2jENstud+EZODR+oDIXtkdA32gD8syGG\n'+
'1/hALp0axGeFI9dxAvJrDWLMUL30/alDZ/pIeqRVoJ3+mUAm74xlKREWhYoA42Yc\n'+
'Bwjr4CvqI3mGX7DveqSrCpPRzY1TLGHkjyzXZ95cgk+pZPtq5cTpZbT3Pl+mDx7C\n'+
'TkY3+eUCgYEAxqJjQmHLOUlOXFNw4t8ApZOcwy+2bZF8n4ezS80tlw8sEhZNoD06\n'+
'dnuPSmQtka6+rdVdEcAdv38AF96tqdyXNv3HrVptEXKe6Bjb02owR2CIxbQHaxFQ\n'+
'ZhoU704G0z8Dd2u5/P3vMZUdZ057NTTR3cjikNEK9KP5jDNLVs9CJP8=\n'+
'-----END RSA PRIVATE KEY-----\n';
 
var PUBKEY = '-----BEGIN PUBLIC KEY-----\n'+
'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuWscpDK1DgwC9fIE3EM7\n'+
'A5N1Aw2vMXZCGORYczoAZZOKNxhBOjADZcOsvCkTAEwtytE7cLS+k1Dpncy9KeD2\n'+
'WmywUicJWwwHfO+aDTbFb4kr+wpNE6WgzgWlkQbSHamj0T4Qq+KAuy38Gacg1a5E\n'+
'2pu0TDZs7AS6D55C6fHBM3WZ81EDpcH+Flmzr+DG3ejUZIKCrmmS6pIo4LpKNDeY\n'+
'hvNolgZF/zmm3OE+bn/aFa6klwQQWxow3lgK5Cl47tpTmv5/0hj1EsQ4puACkxui\n'+
'dyTsdU9bFVDBu1OqfFfAwlyumD4qkr0SNVo9t1Fz2PlJ1X8Hx0vkfUYJVyp7edE5\n'+
'KwIDAQAB\n'+
'-----END PUBLIC KEY-----\n';

function decrypt_d(msg) {
 return crypto.privateDecrypt(PRIVKEY, Buffer.from(msg, 'base64'));
}

function encrypt_d(msg, key) {
 return crypto.publicEncrypt(key, Buffer.from(msg, 'utf8')).toString('base64');
}

app.get('/api', function(req, res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var x = encrypt_d(ip, PUBKEY);
    var y = decrypt_d(x);
    res.send(x + '</br>' + y);
});
*/
wss.on("connection", function(ws) {
    wss.clients.forEach(function each(client) {
        client.send('count: '+ wss.clients.size);
    });
  //ws.send('count' + wss.clients.size);
  ws.on("count", function(message) {
     ws.send(wss.clients.size);
  });
  ws.on('close', function() {
    wss.clients.forEach(function each(client) {
        client.send('count: '+ wss.clients.size);
    });
  });
});
