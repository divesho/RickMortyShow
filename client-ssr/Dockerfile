FROM node:14.3.0-alpine

EXPOSE 8080

WORKDIR /usr/app/client

COPY ./package.json ./

RUN npm install

COPY ./ ./

RUN npm run build

CMD ["node", "server"]