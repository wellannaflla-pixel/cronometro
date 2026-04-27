const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "https://cronometro-1.onrender.com", // Verifique se está igualzinho ao seu site
        methods: ["GET", "POST"]
    }
});

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('--- Um dispositivo conectou ao servidor! ---'); // Se isso não aparecer, o navegador nem chega a conectar

    socket.on('comando', (cmd) => {
        console.log('Comando recebido pelo servidor: ' + cmd);
        io.emit('comando', cmd); 
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));