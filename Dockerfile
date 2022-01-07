FROM alpine:3.14 AS base

ENV NODE_ENV=production \
    APP_PATH=/node/app
    
WORKDIR $APP_PATH

RUN apk add --no-cache --update nodejs=14.18.1-r0 npm=7.17.0-r0

FROM base AS install

COPY package.json ./

RUN npm install

FROM base

COPY --from=install $APP_PATH/node_modules ./node_modules

COPY . .

CMD [ "node", "app.js" ]