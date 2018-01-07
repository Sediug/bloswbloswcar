/* global io */

// Announcements sockets config
const socket = io.connect('http://localhost:8080', {forceNew: true});

socket.on('announcements', function(data) {
    console.log(data);
});