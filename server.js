const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http); // Sem opções extras, o Socket.io se auto-configura

app.use(express.static(__dirname)); // Serve todos os arquivos .html, .js, .mp3

io.on('connection', (socket) => {
    socket.on('comando', (cmd) => {
        io.emit('comando', cmd); // Repassa o comando para todos
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));