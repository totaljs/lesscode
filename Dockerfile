FROM node:19-alpine
MAINTAINER totalplatform "info@totaljs.com"

VOLUME /www
WORKDIR /www
RUN mkdir -p /www/databases
RUN mkdir -p /www/definitions

COPY index.js .
COPY config .
COPY package.json .
COPY databases/ ./databases/
COPY definitions/ ./definitions/

RUN npm install
EXPOSE 8000

CMD [ "npm", "start" ]