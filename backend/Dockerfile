FROM node:alpine3.18

WORKDIR /usr/share/app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 5000

CMD ["npm", "start"]

