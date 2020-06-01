FROM node:alpine

EXPOSE 8081

WORKDIR /usr/app/server

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["node", "server"]