FROM node:10.16.0-alpine
WORKDIR /app
COPY package*.json /app/
COPY ./*.js /app/
RUN export NG_CLI_ANALYTICS=ci && npm install --only=prod
EXPOSE 3000
CMD [ "npm", "start"]
