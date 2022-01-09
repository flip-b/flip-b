FROM node:16

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ../../package*.json .

RUN npm ci --only=production

COPY ../../lib .
COPY ../../var .

CMD [ "npm", "run", "start" ]
