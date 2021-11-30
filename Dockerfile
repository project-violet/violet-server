# FROM ubuntu:20.04
# RUN apt update
# RUN apt install -y nginx nodejs npm
# RUN mkdir -p /server
# COPY ./ /server
# COPY ./settings/default /etc/nginx/sites-available/
# RUN npm i
# EXPOSE 7788

FROM node:14.18.0
RUN mkdir -p /server
WORKDIR /server
ADD . /server
RUN npm install
RUN npm install pm2 -g
EXPOSE 7788
CMD ["pm2", "start", "server.js"]