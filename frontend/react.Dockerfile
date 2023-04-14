FROM node:latest as build

WORKDIR /app

COPY package*json ./

RUN npm ci
RUN npm install react-scripts@3.4.1 -g --silent

COPY . ./
COPY ./src/config.production.js ./src/config.js

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html/

ENV NODE_ENV production
ENV BACKEND_URL http://backend
ENV BACKEND_PORT 3001

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
