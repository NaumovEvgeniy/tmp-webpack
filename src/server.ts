const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const port = 3000;

let users: any = {};

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req: any, res: any) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

server.listen(port, () => {
  console.log('listening on http://localhost:3000/');
});

io.on('connection', connected);

function connected(socket: any) {
  /*console.log("a user connected: " + socket.id);
  socket.emit('serverToClient', "Hi, client!");
  socket.on('clientToServer', (data: any) => {
    console.log(data);
  })
  socket.on('clientToClient', (data: any) => {
    socket.broadcast.emit('serverToClient', data);
  })*/

  socket.on('newUser', (data: any) => {
    console.log("a user connected: " + socket.id);
    users[socket.id] = data;
    console.log("Current number of players: " + Object.keys(users).length);
    io.emit('updateUsers', users);
  })
  socket.on('disconnect', () => {
    delete users[socket.id];
    console.log("Current number of players: " + Object.keys(users).length);
    io.emit('updateUsers', users);
  })
}