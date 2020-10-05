FROM node:10.16.0-alpine as build-stage
RUN npm install -g sass
WORKDIR /app
COPY ./ /app/
RUN ls -R > /app/test.txt
RUN sass style/style.scss style/style.css

FROM nginx:1.15.6
COPY --from=build-stage /app/index.html /usr/share/nginx/html/
COPY --from=build-stage /app/style/ /usr/share/nginx/html/style/
COPY --from=build-stage /app/scripts/ /usr/share/nginx/html/scripts/
COPY --from=build-stage /app/lib/ /usr/share/nginx/html/lib/
COPY --from=build-stage /app/test.txt /usr/share/nginx/html/

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/ssl.conf /etc/nginx/conf.d/ssl.conf
COPY ./nginx/nginxlog /etc/logrotate.d/nginx

VOLUME /var/log/nginx
