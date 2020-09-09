// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

const page400 = `
<html>
<head><title>400 Bad Request</title></head>
<body bgcolor="white">
<center><h1>400 Bad Request</h1></center>
<center><img src="https://koromo.xyz/api-400.png"></center>
<hr><center>Violet API Server</center>
</body>
</html>
`;

const page403 = `
<html>
<head><title>403 Forbidden</title></head>
<body bgcolor="white">
<center><h1>403 Forbidden</h1></center>
<center><img src="https://koromo.xyz/api-403.jpg"></center>
<hr><center>Violet API Server</center>
</body>
</html>
`;

const page404 = `
<html>
<head><title>404 Not Found</title></head>
<body bgcolor="white">
<center><h1>404 Not Found</h1></center>
<center><img src="https://koromo.xyz/api-404.png"></center>
<hr><center>Violet API Server</center>
</body>
</html>
`;

module.exports = {
  p400: page400,
  p403: page403,
  p404: page404
};