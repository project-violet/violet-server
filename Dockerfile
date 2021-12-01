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
CMD ["pm2-runtime", "start", "ecosystem.config.js"]

# sudo docker images
# sudo docker build -t <package>:1.0 ./
# sudo docker tag <package>:1.0 <hub id>/<package>:1.1
# sudo docker push <hub id>/<package>:1.0

# sudo docker pull <hub id>/<package>:1.1
# sudo docker run 