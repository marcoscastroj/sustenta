# 🌱 Sustenta - Roda de Conversa & Reflexão

**Sustenta** é um jogo digital e individual focado na escuta ativa, acolhimento e desconstrução da sobrecarga mental feminina e das expectativas invisíveis de cuidado familiar. O projeto adapta a clássica mecânica de descarte de cartas (estilo Uno) para criar um espaço seguro de diálogo terapêutico entre uma jogadora real e três personas virtuais (Bots).

Idealizadores do jogo:  
Kauê Iago, 
Mailda Braz,
Juliana Rodrigues,
Melina,
Camila Moura

---

## 🎨 Stack Tecnológica

O projeto foi projetado para ser moderno, leve e simples de manter/fazer deploy:
*   **Framework:** [Next.js 15 (React)](https://nextjs.org/) com App Router.
*   **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com paletas personalizadas, suaves e orgânicas.
*   **Biblioteca de Animações:** [Framer Motion](https://www.framer.com/motion/) para emojis flutuantes, diálogos animados e transições de cartas.
*   **Efeitos Visuais:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) para celebrar a finalização das cartas.
*   **Iconografia:** [Lucide React](https://lucide.dev/) para elementos gráficos minimalistas.
*   **Ambiente de Deploy:** [Vercel](https://vercel.com/) (otimização e hospedagem estática instantânea).

---

## 🃏 Estrutura do Jogo & Funcionalidades

### 1. Motor do Jogo (Máquina de Estados)
*   **Mecânica Uno:** Jogadoras alternam turnos para descartar cartas. Uma carta é válida se bater com a cor (categoria) ou número da carta no topo da mesa.
*   **Cartas de Reflexão:**
    *   🔴 **Cartas Vermelhas (Rede de Apoio):** Inspiradas no perfil de Juliana. Focam em delegar tarefas, pedir ajuda e mapear apoios.
    *   🔵 **Cartas Azuis (Culpa/Controle):** Inspiradas no perfil de Dona Sônia. Focam em regras invisíveis domésticas, fardo mental e centralização de decisões.
    *   🟡 **Cartas Amarelas (Nomear sentimentos):** Inspiradas no perfil de Mariana. Focam em cansaço, culpa por descansar e tempo de prazer próprio.
*   **Cartas Roxas (Ação):**
    *   `Bloqueio (Skip)`: Pula o turno da próxima jogadora.
    *   `Inverter (Reverse)`: Inverte a direção das rodadas (horário / anti-horário).
    *   `Compre +2`: Faz a próxima jogadora comprar 2 cartas e perder a vez.

### 2. Oponentes Virtuais (Bots)
As três oponentes virtuais possuem idades e trajetórias detalhadas:
1.  **Mariana (34 anos):** Mãe solo, trabalha fora e lida com a tripla jornada.
2.  **Juliana (42 anos):** Cuida dos filhos e dos pais idosos (geração sanduíche).
3.  **Dona Sônia (61 anos):** Dona de casa que centraliza o cuidado e decisões de toda a família.

*   *Lógica:* Quando é o turno de um Bot, o sistema verifica a mão de forma automática e joga uma carta válida após um curto delay. Se o Bot jogar uma carta de reflexão, surge um balão de fala exibindo a vivência dela de acordo com a sua história real.

### 3. Modos de Expressão da Jogadora
Ao jogar uma carta de reflexão, a usuária é interceptada por um modal para registrar seus sentimentos:
*   ✏️ **Modo Expressão (Escrita):** Permite redigir uma resposta livre. Há um validador de caracteres mínimos (15) para encorajar a escrita do desabafo antes de liberar a carta.
*   🔘 **Modo Rápido (Múltipla Escolha):** Exibe 3 opções pré-programadas de desabafos e sentimentos comuns associados àquela pergunta.
*   🚫 **Passar a Vez:** Caso a jogadora sinta gatilho ou não queira responder à pergunta, ela pode acionar a rota de fuga. A jogadora compra 1 carta e o turno passa ao próximo Bot automaticamente.

### 4. Sistema de Acolhimento (Espelhamento)
*   Sempre que a usuária envia seu desabafo, as jogadoras virtuais acionam reações visuais (emojis de corações, abraços, flores) flutuando sobre seus avatares.
*   Notificações rápidas são emitidas indicando o apoio mútuo do grupo (ex: *"Juliana se identificou com sua fala"*).

### 5. Tela de Fechamento & Histórico
*   O jogo termina assim que a jogadora ou um dos Bots zera as cartas da mão.
*   Uma tela de encerramento é exibida contendo:
    *   Uma frase aleatória selecionada de reflexão e autocuidado.
    *   O **Diário de Desabafos**, compilando todas as escritas ou respostas selecionadas pela usuária durante a partida para salvamento pessoal.

---

## 💻 Como Rodar Localmente

Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado em sua máquina.

1.  Entre na pasta do projeto:
    ```bash
    cd sustenta
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  Abra o navegador em [http://localhost:3000](http://localhost:3000) para testar o jogo.

---

## 🚀 Como Fazer Deploy na Vercel

O projeto foi estruturado para que o deploy na Vercel seja feito de forma simples e direta em poucos passos:

### Método 1: Integração Contínua com GitHub (Recomendado)
1.  Crie um repositório vazio no seu GitHub (ex: `sustenta`).
2.  Envie os arquivos da pasta `sustenta` para lá:
    ```bash
    git init
    git add .
    git commit -m "feat: initial release of Sustenta"
    git branch -M main
    git remote add origin <LINK_DO_SEU_REPOSITORIO>
    git push -u origin main
    ```
3.  Acesse o site da [Vercel](https://vercel.com/) e faça login com sua conta do GitHub.
4.  Clique em **"Add New" ➔ "Project"** e selecione o repositório `sustenta` criado.
5.  Mantenha as configurações padrões (a Vercel detectará o Next.js e criará os comandos automaticamente) e clique em **"Deploy"**.
6.  Pronto! Cada atualização (push) feita no repositório GitHub atualizará o site publicado na Vercel automaticamente.

### Método 2: Usando a CLI da Vercel (Rápido)
Caso prefira implantar sem criar repositório Git:
1.  Instale a Vercel CLI globalmente: `npm install -g vercel`.
2.  Na pasta `sustenta`, rode o comando `vercel`.
3.  Faça login no terminal e siga as instruções curtas na tela.
