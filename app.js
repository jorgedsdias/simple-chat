const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.Server(app);
const io = socketio(server);

const clients = {};

io.on('connection', (client) => {
    client.on('join', (name) => {
        console.log(`Joined: ${name}`);
        clients[client.id] = name;
        client.emit('update', 'You have connected to the server.');
        client.broadcast.emit('update', `${name} has joined the server.`);
    });

    client.on('send', (msg) => {
        console.log(`Message: ${msg}`);
        client.broadcast.emit('chat', clients[client.id], msg);
    });

    client.on('disconnect', () => {
        console.log('Disconnect');
        client.emit('update', `${clients[client.id]} has left the server.`);
        delete clients[client.id];
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});