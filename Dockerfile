FROM node:16-alpine

WORKDIR /opt/app
ADD package.json package.json
RUN npm install --only=prod
COPY /dist ./src

CMD ["node", "./src/main.js"]
