FROM node

COPY lib /app
COPY package.json /app

WORKDIR /app

ENV NODE_ENV production

RUN npm install

CMD ["node", "main"]
