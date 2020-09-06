# Violet Server

This project is a server of project violet written in `nodejs`.

Domain: https://koromo.xyz

API Server: https://api.koromo.xyz/

## API Server

It is an api server that can collect informations from users and view that.

### Public Routes

```
1. GET https://api.koromo.xyz/
Hello api. Return your IP Address.

2. GET https://api.koromo.xyz/top
Get the view ranking.
ex) https://api.koromo.xyz/top?offset=0&count=100&month=9
```

`read`, `write` and `view` routes is protected by auth.

### Auth

Timestamp based hmac is used to prevent spoofing and replay attacks.
User needs to add `v-token` and `v-valid` headers in all api requests except `/top`.
Also, for the authenticity of the request body, you need to add a body hash.

For details, go https://github.com/project-violet/violet-server/blob/master/auth/auth.js

## How to build

### Build frontend

```
cd frontend
yarn install
yarn build
```

## Tools

### hsync - Database synchronizer
