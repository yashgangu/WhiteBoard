const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  console.log('client connected', socket.id);

  socket.on('draw:start', (data) => socket.broadcast.emit('draw:start', data));
  socket.on('draw:update', (data) => socket.broadcast.emit('draw:update', data));
  socket.on('draw:undo', () => socket.broadcast.emit('draw:undo'));
  socket.on('draw:redo', (line) => socket.broadcast.emit('draw:redo', line));
  socket.on('draw:end', (data) => socket.broadcast.emit('draw:end', data));

  socket.on('chat:message', (msg) => io.emit('chat:message', msg));

  socket.on('disconnect', () => console.log('client disconnected', socket.id));
});

server.listen(4000, () => console.log(`WS server running on 4000`));
