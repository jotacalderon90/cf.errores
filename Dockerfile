FROM node:18-alpine

CMD mkdir /srv/cf.errores

COPY ["package.json","/srv/cf.errores/"]

WORKDIR /srv/cf.errores

RUN npm install --only=production

COPY [".", "/srv/cf.errores/"]

EXPOSE $PORT

CMD [ "npm", "run", "start" ]
