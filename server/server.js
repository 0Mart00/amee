const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Kiszolgáljuk a menüt a kliens mappából
app.use(express.static(path.join(__dirname, '../client/public')));

io.on('connection', (socket) => {
    console.log('Valaki csatlakozott a LAN-on!');
});

const PORT = 3000;
// A '0.0.0.0' kell ahhoz, hogy a többi gép is lássa a hálózaton!
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Szerver fut a 3000-es porton!`);
});
