// server.js (Node.js Backend)

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

const userCursors = {};

io.on('connection', (socket) => {
    console.log('client connected', socket.id);

    const authenticatedUsername = socket.handshake.query.username || socket.id.substring(0, 4);
    socket.data.username = authenticatedUsername; 

    socket.on('draw:start', (data) => socket.broadcast.emit('draw:start', data));
    socket.on('draw:update', (data) => socket.broadcast.emit('draw:update', data));
    socket.on('draw:undo', () => socket.broadcast.emit('draw:undo'));
    socket.on('draw:redo', (line) => socket.broadcast.emit('draw:redo', line));
    socket.on('draw:end', (data) => socket.broadcast.emit('draw:end', data));

    socket.on('chat:message', (msg) => io.emit('chat:message', msg));

    socket.on('cursor:move', (position) => {
        userCursors[socket.id] = { 
            user: socket.data.username, 
            x: position.x, 
            y: position.y 
        };

        socket.broadcast.emit('cursor:update', userCursors);
    });

    socket.on('disconnect', () => {
        console.log('client disconnected', socket.id);
        
        delete userCursors[socket.id];
        
        io.emit('cursor:update', userCursors);
    });
});

server.listen(4000, () => console.log(`WS server running on 4000`));