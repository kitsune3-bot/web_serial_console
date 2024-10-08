const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort } = require('serialport')
const execSync = require('child_process').execSync;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const fs = require('fs');

const jsonString = fs.readFileSync('/run/secrets/config', 'utf8');
const config = JSON.parse(jsonString);

const port = new SerialPort({
  path: config["ttyPath"],
  baudRate: config["baudRate"]
});


app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('Client connected');

  const result = execSync(`wakeonlan ${config["macAddr"]}`);
  console.log(result)


  port.on('data', (data) => {
    socket.emit('data', data.toString());
  });

  socket.on('data', (data) => {
    port.write(data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(config["port"], () => {
  console.log(`Server is running on http://localhost:${config["port"]}`);
});