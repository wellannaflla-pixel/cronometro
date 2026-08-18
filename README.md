# Cronômetro

Este projeto é um cronômetro web para partidas de futsal (ou outro esporte), com visual em tela cheia, comando via Socket.IO e sincronização em tempo real. A ideia central é permitir que o cronômetro seja visualizado por todos. Ele foi pensado para uso em ambientes onde a exibição do tempo precisa ser grande,visível de longe e controlável no proprio dispositivo.

## Objetivo do projeto

O objetivo principal é criar um cronômetro no formato de painel grande, fácil de ler de longe, com interface mínima e ações rápidas. Além disso, o projeto também foi pensado para funcionar em modo de exibição voltado para tela cheia, ideal para quadras, apresentações, aulas, treinamento ou qualquer uso que demande um tempo visível e de fácil acompanhamento.

## Como funciona

O projeto usa um servidor Node.js com Express e Socket.IO.

- O servidor fica responsável por receber os comandos enviados pelo usiário.
- Qualquer usuario conectado ao Socket recebe os mesmos comandos.
- A página principal do cronômetro (`index.html`) houve os eventos do Socket e executa a ação em tempo real.

Em prática, o fluxo é:

1. O usuário envia um comando, como `iniciar`, `pausar`, `resetar` ou `acrescentar1`.
2. O servidor recebe esse comando por Socket.IO.
3. O servidor repassa o comando para o usuário conectado.
4. A página do cronômetro processa o comando e atualiza a interface.

## Tecnologias utilizadas

### Node.js
O servidor é executado em Node.js. Ele é responsável pelo gerenciamento de conexões e pela entrega dos comandos para todos o usuário conectado.

### Express
O Express serve os arquivos estáticos do projeto, como HTML, CSS e JavaScript, facilitando a exposição da aplicação em um navegador.

### Socket.IO
O Socket.IO permite comunicação bidirecional em tempo real entre usuário e o servidor. É o que torna possível sincronizar o cronômetro em vários dispositivos ao mesmo tempo.

### HTML
A interface da tela principal e da lógica visual do cronômetro foram construídas em HTML. A página exibe o tempo, os botões e o conteúdo principal da aplicação.

### CSS
O CSS define:

- o visual do cronômetro
- o tamanho dos números
- o efeito de neon no texto
- as cores de alerta
- o modo de tela cheia
- o comportamento dos botões
- o efeito de piscar em vermelho quando o tempo termina

### JavaScript
O JavaScript faz o controle real da lógica do cronômetro:

- inicializa o socket
- manda comandos para o servidor
- recebe comandos do servidor
- atualiza a contagem do tempo
- inicia, pausa, reseta e acrescenta tempo
- alterna tela cheia
- dispara sirene ao iniciar ou ao zerar
- muda a cor do glow do tempo conforme a faixa de tempo

## Estrutura do projeto

A estrutura atual do projeto é a seguinte:

```text
cronometro/
├── index.html
├── server.js
├── package.json
├── README.md
├── Apito.mp3
└── node_modules/   (gerado ao instalar dependências)
```

### `server.js`
Este é o arquivo principal do servidor. Ele cria o servidor HTTP, habilita a pasta pública e inicia o Socket.IO.

O código principal faz isso:

```javascript
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    socket.on('comando', (cmd) => {
        io.emit('comando', cmd);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
```

Esse trecho significa:

- o servidor serve todo o conteúdo estático do projeto
- qualquer usuário que se conectar ao Socket pode enviar comandos
- o servidor retransmite esse comando para todos os conectados

### `index.html`
Este é o arquivo principal da interface do cronômetro.

Ele contém:

- o layout visual da tela
- a estilização do texto grande em neon
- os botões de controle
- a música de sirene
- a lógica em JavaScript para rodar o temporizador

## Como a lógica do cronômetro funciona

A variável principal do projeto é:

```javascript
let tempo = 600;
```

Esse valor representa 600 segundos, ou seja, 10 minutos.

A lógica do cronômetro é simples:

- se o tempo for maior que zero, ele diminui 1 a cada segundo
- se o tempo chegar a zero, o cronômetro para
- a sirene toca
- o fundo da tela pisca em vermelho
- o estado `rodando` volta para `false`

### Função de atualização do display

```javascript
function atualizarDisplay() {
    let m = Math.floor(tempo / 60);
    let s = tempo % 60;
    display.innerText = `${m}:${s < 10 ? '0'+s : s}`;
    atualizarCorDisplay();
}
```

Essa função:

- calcula os minutos e segundos
- monta a string do tempo no formato `m:ss`
- atualiza o texto na tela
- chama a função que altera a cor do brilho conforme o valor atual

Exemplo:

- `tempo = 600` → `10:00`
- `tempo = 359` → `5:59`
- `tempo = 179` → `2:59`
- `tempo = 0` → `0:00`

## Sistema de cores do brilho do texto

O projeto também altera a cor do glow do número conforme o tempo restante.

### Faixa verde
Quando o tempo está em 10:00 até 6:00, o glow é verde:

```javascript
if (tempo >= 360) {
    display.style.textShadow = '0 0 5px #ffffff, 0 0 15px #04fa04, 0 0 30px #04fa04';
}
```

### Faixa amarela
Quando o tempo está entre 5:59 e 3:00, o glow fica amarelo:

```javascript
else if (tempo >= 180) {
    display.style.textShadow = '0 0 5px #ffffff, 0 0 15px #f5d300, 0 0 30px #f5d300';
}
```

### Faixa vermelha
Quando o tempo está entre 2:59 e 00:00, o glow fica vermelho:

```javascript
else {
    display.style.textShadow = '0 0 5px #ffffff, 0 0 15px #ff2a2a, 0 0 30px #ff2a2a';
}
```

Essa mudança visual ajuda a dar sensação de urgência e alerta visual conforme o tempo se esgota.

## Comandos do cronômetro

O cronômetro tem quatro ações principais:

### 1. Iniciar
Quando o usuário clica em "INICIAR":

- o estado `rodando` se torna `true`
- a sirene toca
- a tela entra em modo fullscreen
- os botões são ocultados
- o cronômetro começa a decrementar a cada segundo
- o fundo da página entra em efeito de piscar vermelho durante os 10 segundos iniciais

```javascript
if (cmd === 'iniciar' && !rodando) {
    rodando = true;
    if (sirene) sirene.play().catch(e => console.log(e));

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
    }

    controles.classList.add('ocultar-controles');
    document.body.classList.add('controles-ocultos');

    timer = setInterval(() => {
        if (tempo > 0) {
            tempo--;
            atualizarDisplay();
        } else {
            clearInterval(timer);
            rodando = false;
            if (sirene) sirene.play().catch(e => console.log(e));
            document.body.classList.add('piscar-vermelho');
        }
    }, 1000);
}
```

### 2. Pausar
Quando o comando `pausar` é enviado:

- limpa o intervalo do cronômetro
- coloca `rodando` em `false`
- interrompe a contagem

```javascript
if (cmd === 'pausar' && rodando) {
    clearInterval(timer);
    rodando = false;
}
```

### 3. Resetar
Quando o comando `resetar` é enviado:

- zera o tempo para 10:00
- limpa o timer
- retira o estado de execução
- mostra novamente os botões
- limpa o efeito de piscar e restaura a tela em preto

```javascript
if (cmd === 'resetar') {
    tempo = 600;
    clearInterval(timer);
    rodando = false;
    controles.classList.remove('ocultar-controles');
    document.body.classList.remove('controles-ocultos');
}
```

### 4. Acrescentar 1 minuto
Quando o comando `acrescentar1` é enviado:

- acrescenta 60 segundos ao tempo atual
- atualiza a tela
- mantém o restante do cronômetro intacto

```javascript
if (cmd === 'acrescentar1') {
    tempo += 60;
}
```

## Efeito visual de tela cheia e ocultação dos controles

A interface foi desenhada para maximizar o tempo em tela.

Quando o cronômetro começa, os botões ocultam-se para não atrapalhar a leitura do tempo. Quando o usuário toca na tela fora da área dos botões, o sistema faz o toggle e mostra ou esconde os controles:

```javascript
document.body.addEventListener('click', (e) => {
    if (!controles.contains(e.target)) {
        const ocultos = controles.classList.toggle('ocultar-controles');
        document.body.classList.toggle('controles-ocultos', ocultos);
    }
});
```

Esse comportamento cria uma experiência mais limpa, com foco total na exibição do tempo.

## Efeito visual de alerta

O corpo da página tem uma classe chamada `piscar-vermelho`, que ativa uma animação CSS em vermelho e preto:

```css
@keyframes piscar {
    0% { background-color: #ff0000; }
    50% { background-color: #000000; }
    100% { background-color: #ff0000; }
}

.piscar-vermelho {
    animation: piscar 0.5s infinite;
}
```

Esse efeito é usado para chamar atenção visual quando o cronômetro termina ou quando começa a contagem.

## Como rodar o projeto localmente

### 1. Instalar as dependências
No diretório do projeto, execute:

```bash
npm install
```

### 2. Iniciar o servidor
```bash
node server.js
```

### 3. Abrir no navegador
Acesse:

```text
http://localhost:3000/
```

A página principal do cronômetro será carregada em `index.html`.

## Observações importantes

- O projeto usa comunicação em tempo real; portanto, para testar em múltiplos dispositivos, todos devem estar na mesma rede e acessando o mesmo endereço local do servidor.
- O cronômetro foi construído para uma visão ampla e de alto contraste, então o texto grande e o glow neon ajudam na legibilidade em distâncias maiores.
- O arquivo `Apito.mp3` deve estar presente na pasta do projeto para que a sirene funcione corretamente.
- Como a interface usa fullscreen, a experiência fica mais completa em navegadores que permitem esse comportamento ao interagir com o usuário.

## Possíveis melhorias futuras

Algumas evoluções que poderiam ser feitas no projeto:

- adicionar tela de controle separada para um segundo dispositivo
- permitir customização do tempo inicial
- criar seleção de minutos e segundos em tempo real
- incluir uma área de registro ou log de ações
- adicionar suporte para múltiplos cronômetros ao mesmo tempo
- ajustar o som da sirene para opções com volume e intensidade

## Resumo

Este projeto é um cronômetro web de alta visibilidade, feito para funcionar em tempo real e em dispositivos diferentes. Ele combina:

- servidor em Node.js
- comunicação em tempo real com Socket.IO
- interface grande e legível
- controle por botão simples
- animações visuais e alerta sonoro
- experiência de tela cheia sem distrações

Em resumo, o objetivo é oferecer uma ferramenta funcional, direta e visualmente forte para controlar o tempo em situações que exigem atenção imediata.
