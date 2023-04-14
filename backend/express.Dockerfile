FROM node:latest

WORKDIR /usr/src/app

COPY package*json ./

# dev
#RUN npm install 
# prod
RUN npm ci

COPY src/ src/
COPY .env.production .env

ENV NODE_ENV production
EXPOSE 8080
CMD [ "node", "src/server.js"]