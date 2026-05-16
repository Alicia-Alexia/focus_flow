# 🌌 FocusFlow - Gerenciador de Tarefas Full-Stack

## 📸 Demonstração do App

| Hoje | Próximos | Configurações |
| :---: | :---: | :---: |
| <img src="frontend/img/hoje.png" width="100%" /> | <img src="frontend/img/proximos.png" width="100%" /> | <img src="frontend/img/configuracoes.png" width="100%" /> |

O **FocusFlow** é uma plataforma full-stack para gerenciamento de tarefas pessoais. O projeto foi construído do zero, arquitetura desacoplada, persistência de dados em banco de dados relacional.

---

## 🎨 ## 🎨 Identidade Visual e Cores Customizadas (Frontend)

O aplicativo foi desenhado em Dark Mode e conta com um seletor que permite ao usuário escolher a sua cor favorita de destaque para os botões e títulos:

* **Salva a escolha do usuário:** A cor que você escolher fica guardada no navegador (`localStorage`). Se você fechar a página e abrir no dia seguinte, o app ainda vai estar com a cor que você escolheu.
* **Mudança instantânea sem travar a tela:** Usando variáveis nativas do CSS (`--color-target`), o projeto consegue mudar a cor de vários elementos ao mesmo tempo no exato milissegundo em que você clica no botão, sem precisar recarregar a página e sem pesar no React.
* **O que muda com a cor escolhida:**
  * O título principal da tela ("Hoje", "Próximos" ou "Configurações").
  * O botão de "Criar Tarefa" (que também ganha um efeito visual dinâmico quando passa o mouse).
  * A cor do menu lateral para mostrar qual aba está aberta.
* **As 4 opções disponíveis:**
  * 🟣 **Roxo Produtivo:** O visual padrão e mais focado.
  * 🟢 **Verde Hacker:** Visual estilo terminal de programação.
  * 🔵 **Ciano Espacial:** Um tom moderno e bem aceso para o modo escuro.
  * 🔴 **Rosa Cyberpunk:** Uma cor vibrante e cheia de estilo.

---

## ⚡ Engenharia de Software & Banco de Dados (Backend)

O ecossistema do backend foi desenhado para ser leve, seguindo princípios de Clean Code:

* **Fastify:** Framework web utilizado para criar as rotas da API .
* **Prisma ORM:** Modelagem de dados  e segura (Type-Safe), garantindo migrações de banco de dados (`migrations`) limpas e consultas otimizadas.
* **PostgreSQL (Neon):** Banco de dados relacional hospedado em nuvem (Serverless Postgres), garantindo alta disponibilidade e isolamento de dados.
* **Variáveis de Ambiente Protegidas:** Uso de arquivos `.env` tanto no cliente quanto no servidor para isolar credenciais críticas (banco de dados, chaves de API e usuários de teste).

---

## 🧪 Automação de Qualidade (QA)

Para garantir que novas alterações não quebrem as funcionalidades críticas do FocusFlow, o projeto conta com uma esteira de testes automatizados:

* **Playwright Framework:** Implementação de testes End-to-End (E2E) simulando o comportamento real do usuário final no navegador Chrome (Chromium).
* **Testes de Autenticação Estabilizados:** Fluxo de login e gerenciamento de estados assíncronos das páginas React (SPAs).

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React** (com Vite)
* **TypeScript**
* **Tailwind CSS**
* **Lucide React** (Ícones)
* **React Hot Toast** (Notificações em tempo real)

### Backend & Banco de Dados

- **Node.js**
* **Prisma ORM**
* **PostgreSQL** (Hospedado no Neon)
* **Dotenv** (Segurança de credenciais)

### Testes & Qualidade

- **Playwright** (Testes E2E e UI Mode)

---

## 🚀 Como Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone [https://github.com/Alicia-Alexia/focus_flow](https://github.com/Alicia-Alexia/focus_flow)
cd focus-flow
```

### 2. Configurar e Rodar o Backend

```bash
cd backend
npm install 
```

### Crie um arquivo .env na pasta backend com a string de conexão do seu banco

```bash
DATABASE_URL="postgresql://usuario:senha@ep-bold-sunset-...neon.tech/focusflow?sslmode=require"
PORT=3333
```

### Execute as migrations e inicie o servidor

```bash
npx prisma migrate dev
npm run dev 
```

### 3. Configurar e Rodar o Frontend

```bash
cd frontend
npm install
```

### Crie um arquivo .env na pasta frontend para mapear a API e os dados do robô de testes

```bash
VITE_API_URL=http://localhost:3333
TEST_USER_EMAIL=contato@teste.com
TEST_USER_PASSWORD=senha_segura_123
```

### Inicie a aplicação

```bash
npm run dev
```

### 4. Rodar os Testes E2E (Playwright)

```bash
npx playwright test --ui
```

## 📂 Estrutura de Arquivos

```
focus-flow/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Modelagem e tabelas do banco de dados
│   │   └── migrations/        # Histórico de evolução do banco
│   ├── src/                   # Rotas, controladores e regras de negócio
│   └── .env                   # Credenciais do banco (Neon)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SettingsView.tsx # Painel de customização de aparência
│   │   │   ├── Sidebar.tsx      # Menu lateral integrado com abas
│   │   │   └── TaskCard.tsx     # Cards de tarefas com bordas dinâmicas e limpas
│   │   ├── pages/
│   │   │   └── Dashboard.tsx    # Tela central e controle de estados
│   │   ├── index.css            # Regras e variáveis do tema global CSS
│   │   └── main.tsx             # Inicialização e leitura do localStorage
│   ├── tests/
│   │   └── auth.spec.ts         # Testes automatizados do fluxo de login e aquecimento de API
│   └── .env                     # Credenciais do robô de testes
```
