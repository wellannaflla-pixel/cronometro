⏱️ Placar de Futsal Interativo (Real-Time)
Este projeto consiste em um sistema de cronômetro para partidas de futsal, desenvolvido com foco em baixa latência e usabilidade. O sistema utiliza comunicação em tempo real para permitir que um dispositivo (celular) controle o placar exibido em outro dispositivo (tablet, celular, Computadores ou TV).

🚀 Tecnologias Utilizadas
Node.js: Ambiente de execução do servidor.

Express: Framework para servir a aplicação web.

Socket.io: Biblioteca para comunicação bidirecional em tempo real entre o controle e o placar.

HTML5/CSS3/JavaScript: Interface do usuário com design responsivo e efeitos 3D.

Render: Plataforma de deploy para hospedagem em nuvem.

⚙️ Funcionalidades
Sincronização em Tempo Real: Comandos enviados pelo controle são refletidos instantaneamente no placar.

Modo Full Screen: Ativação automática de tela cheia para melhor visualização.

Alerta Visual e Sonoro: O sistema emite um sinal sonoro (sirene) e o fundo da tela pisca em vermelho ao zerar o tempo.

Controle Intuitivo: Botões com design 3D que oferecem feedback visual de pressionamento.

Gestão de Tempo: Iniciar, resetar e acréscimo manual de 3 minutos.

📂 Estrutura do Projeto
Plaintext
├── server.js           # Servidor Node.js com Socket.io
├── index.html          # Interface do Placar (Display)
├── controle.html       # Interface do Controle Remoto
├── package.json        # Dependências do projeto
└── sirene.mp3          # Arquivo de áudio para fim de tempo
🛠️ Como Instalar e Rodar Localmente
Clone o repositório:

Bash
git clone (https://github.com/wellannaflla-pixel/cronometro)
cd nome-do-projeto
Instale as dependências:

Bash
npm install
Inicie o servidor:

Bash
node server.js
Acesse no navegador:

Placar: http://localhost:3000/index.html

Controle: http://localhost:3000/controle.html

🌐 Deploy no Render
O projeto está configurado para deploy automático via GitHub no Render:

Conecte o repositório ao Render.

Configure o Build Command como npm install.

Configure o Start Command como npm start.

🤝 Contribuições
Este projeto foi desenvolvido como parte de um programa de estudos em Full Stack Backend Development. Sinta-se à vontade para abrir Issues ou enviar Pull Requests para melhorias no código.
