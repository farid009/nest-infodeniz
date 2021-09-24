FROM node:14.17.5

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn cache clean && yarn install

COPY . .

RUN yarn prisma generate

RUN yarn build

EXPOSE $HTTP_SERVER_PORT