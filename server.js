const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Servir os arquivos estáticos (o seu HTML/CSS)
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('Dispositivo conectado');

    // Escuta comandos vindos de qualquer celular
    socket.on('comando', (cmd) => {
        console.log('Comando recebido: ' + cmd);
        // Repassa o comando para todos os dispositivos conectados
        io.emit('comando', cmd);
    });
});

http.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});