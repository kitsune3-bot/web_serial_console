FROM node:latest

RUN apt-get update && apt-get install -y wakeonlan
WORKDIR /src/serial-websocket
RUN npm init -y
RUN npm install serialport ws express express socket.io serialport

COPY server.js /src/serial-websocket/server.js
RUN mkdir public
COPY public/index.html /src/serial-websocket/public/index.html

ENTRYPOINT [ "node", "server.js" ]