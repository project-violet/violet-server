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

### Community

```
Auth (Auth Area: To use the api below, you need to authenticate.)
  |
  |=> SignUp (/signup， {"Id","Password","NickName","UserAppId","Etc"}, return success|ck_userappid|ck_id|ck_nickname|pw_too_short|internal server error)
         |
         |=> SignIn (/signin, {"Id"，"Password"}， return Session)
         |      |
         |      |=> Session (Session Area: To use the api below, you must have a session.)
         |            |
         |            |=> Board (/board)
         |            |     |
         |            |     |=> Pages (/page)
         |            |           |
         |            |           |=> Article (/read/article, /write/article, /del_article, /mod_article, /upvote, /downvote)
         |            |                  |
         |            |                  |=> Comment (/read/comment, /write/comment, /del_comment)
         |            |
         |            |=> SignOut (/signout)
         |
         |=> SignDown (/signdown)
```

#### Board

#### SignUp/Down/In/Out

#### Session

#### Article

```
Write Article: https://koromo.xyz/api/write/article
    {Board, Session, Title, Body, Etc}
View Article: https://koromo.xyz/api/read/article
    {no}
Delete Article: https://koromo.xyz/api/del_article
    {Session, no}
Modify Article: https://koromo.xyz/api/mod_article
    {Session, no}
Up Vote: https://koromo.xyz/api/upvote
    {Session, no}
Down Vote: https://koromo.xyz/api/downvote
    {Session, no}
```

## How to build

### Build frontend

```
cd frontend
yarn install
yarn build
```

You neee to set redis `notify-keyspace-events` parameter to `AKE`. 
