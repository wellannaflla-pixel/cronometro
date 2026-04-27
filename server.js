const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

// Configuração rígida de CORS
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Vamos testar com asterisco primeiro para descartar o erro de CORS
        methods: ["GET", "POST"]
    }
});

// Garante que o servidor sirva os arquivos da pasta raiz
app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('Cliente conectado: ' + socket.id);
    socket.on('comando', (cmd) => {
        io.emit('comando', cmd);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));