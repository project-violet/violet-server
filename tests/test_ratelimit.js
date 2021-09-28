
// {userAppId, dateTime}
var rateLimit = [];

function diff_minutes(dt2, dt1) {
  var diff = (dt2 - dt1) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

function removeExpired() {
  var now = Date.now();
  for (var i = 0; i < rateLimit.length; i++) {
    if (diff_minutes(rateLimit[i][1], now) >= 1) {
      rateLimit.splice(i, 1);
      i--;
    }
  }
}

function checkValid(userAppId) {
  for (var i = 0; i < rateLimit.length; i++) {
    if (rateLimit[i][0] == userAppId) {
      return false;
    }
  }
  return true;
}

function push(userAppId) {
  rateLimit.push([userAppId, Date.now()]);
}


push('asdf');
console.log(checkValid('asdf'));