FROM node:16-alpine

WORKDIR /opt/app
ADD package.json package.json
RUN npm install
RUN npm run build
COPY /dist ./src

CMD ["node", "./src/main.js"]
