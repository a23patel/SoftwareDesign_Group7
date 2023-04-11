FROM node:latest

WORKDIR /usr/src/app

COPY package*json ./

RUN npm install

#COPY src/ src/
COPY . ./

ENV NODE_ENV production
EXPOSE 3000
CMD [ "npm", "start"]


# Theoretical multi-stage build version...React Router doesn't like it
# FROM node:latest as BUILD
# WORKDIR /build

# COPY package.json package.json
# COPY package-lock.json package-lock.json
# RUN npm ci

# COPY public/ public
# COPY src/ src
# RUN npm run build

# FROM httpd:alpine
# WORKDIR /var/www/html
# COPY --from=BUILD /build/build/ .