# 🎉 Cuencos - Plataforma de Eventos Universitários

<div align="center">

![Cuencos Banner](https://img.shields.io/badge/Cuencos-Eventos%20Universitários-purple?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-cuencos.web.app-success?style=for-the-badge)](https://cuencos.web.app)
[![IBMEC](https://img.shields.io/badge/IBMEC-Barra-blue?style=for-the-badge)](https://www.ibmec.br/)

**Projeto desenvolvido para a disciplina de Engenharia de Software**  
**Instituto IBMEC - Campus Barra da Tijuca, Rio de Janeiro**

[Ver Demo](https://cuencos.web.app) · [Reportar Bug](https://github.com/andersonodev/cuencos/issues) · [Solicitar Feature](https://github.com/andersonodev/cuencos/issues)

</div>

---

## 📋 Sobre o Projeto

**Cuencos** é uma plataforma web completa para divulgação, venda e gerenciamento de ingressos para eventos universitários. Desenvolvida como projeto acadêmico do **IBMEC - Campus Barra da Tijuca**, a aplicação oferece uma experiência moderna e intuitiva para estudantes, organizadores e atléticas.

### 🎯 Objetivo

Centralizar e facilitar a descoberta de eventos universitários, proporcionando uma experiência completa desde a busca até a compra de ingressos, com funcionalidades específicas para organizadores gerenciarem seus eventos.

### ✨ Características Principais

- 🎟️ **Marketplace de Eventos** - Catálogo completo de eventos universitários
- 🔍 **Sistema de Busca e Filtros** - Encontre eventos por categoria, localização e data
- 💳 **Checkout Integrado** - Processo de compra simplificado
- 📱 **Carteira Digital** - Gerenciamento de ingressos com QR Code
- ⭐ **Favoritos** - Salve seus eventos preferidos
- 🎨 **Modo Claro/Escuro** - Interface adaptável às preferências do usuário
- 👨‍💼 **Dashboard do Organizador** - Painel completo para gerenciamento de eventos
- 📊 **Analytics** - Estatísticas de vendas e visualizações
- 🎫 **Criação de Eventos** - Sistema intuitivo para cadastro de novos eventos
- 📱 **Design Responsivo** - Experiência otimizada para mobile, tablet e desktop

---

## 🚀 Tecnologias Utilizadas

### Frontend

- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **Vite 5** - Build tool moderna e rápida
- **React Router DOM** - Navegação entre páginas
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes de UI acessíveis e customizáveis
- **Lucide React** - Ícones modernos e leves
- **React Toastify** - Sistema de notificações
- **TanStack React Query** - Gerenciamento de estado e cache

### Ferramentas e Bibliotecas

- **jsPDF** - Geração de PDFs para ingressos
- **html2canvas** - Captura de elementos HTML como imagem
- **QRCode.react** - Geração de QR Codes
- **Recharts** - Gráficos e visualizações de dados
- **DOMPurify** - Sanitização de HTML para segurança
- **date-fns** - Manipulação de datas

### Backend e Infraestrutura

- **Firebase** - Backend as a Service (BaaS)
  - Firebase Hosting - Hospedagem estática
  - Firebase Firestore - Banco de dados NoSQL
  - Firebase Storage - Armazenamento de arquivos
  - Firebase Auth - Autenticação de usuários
- **Express.js** - Framework para API REST (desenvolvimento local)

### Desenvolvimento

- **ESLint** - Linting de código JavaScript
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Adição automática de prefixos CSS

---

## 📁 Estrutura do Projeto

```
cuencos/
├── public/                      # Arquivos estáticos
│   └── assets/                  # Imagens e recursos
│       ├── events/              # Imagens de eventos
│       ├── icons/               # Ícones da aplicação
│       └── logo/                # Logotipos
│
├── src/
│   ├── components/              # Componentes React reutilizáveis
│   │   ├── ui/                  # Componentes de interface (shadcn/ui)
│   │   ├── eventCreation/       # Componentes de criação de eventos
│   │   ├── AuthLogo.jsx         # Logo de autenticação
│   │   ├── DashboardHeader.jsx  # Cabeçalho do dashboard
│   │   ├── EventCard.jsx        # Card de evento
│   │   ├── EventFilter.jsx      # Filtros de eventos
│   │   ├── EventList.jsx        # Lista de eventos
│   │   ├── FeaturedEvent.jsx    # Evento em destaque
│   │   ├── Header.jsx           # Cabeçalho principal
│   │   ├── Footer.jsx           # Rodapé
│   │   ├── GoogleLoginButton.jsx # Botão de login Google
│   │   ├── Modal.jsx            # Modal genérico
│   │   ├── QRCodeScanner.jsx    # Scanner de QR Code
│   │   ├── SearchBar.jsx        # Barra de pesquisa
│   │   ├── TicketWalletModal.jsx # Modal da carteira de ingressos
│   │   └── ...                  # Outros componentes
│   │
│   ├── context/                 # Contextos React (estado global)
│   │   ├── AuthContext.jsx      # Contexto de autenticação
│   │   ├── FavoritesContext.jsx # Contexto de favoritos
│   │   └── ThemeContext.jsx     # Contexto de tema (claro/escuro)
│   │
│   ├── data/                    # Dados mockados
│   │   ├── dashboard.json       # Dados do dashboard
│   │   └── eventsData.js        # Dados de eventos
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   ├── use-breakpoint.js    # Hook para breakpoints responsivos
│   │   ├── use-mobile.jsx       # Hook para detecção mobile
│   │   └── use-toast.js         # Hook para notificações
│   │
│   ├── lib/                     # Bibliotecas e utilidades
│   │   ├── analytics.js         # Funções de analytics
│   │   ├── auth.js              # Funções de autenticação
│   │   ├── events.js            # Gerenciamento de eventos
│   │   ├── favorites.js         # Gerenciamento de favoritos
│   │   ├── firebase.js          # Configuração do Firebase
│   │   ├── firebaseAuth.js      # Autenticação Firebase
│   │   ├── firebaseStorage.js   # Storage Firebase
│   │   ├── firestore.js         # Firestore database
│   │   ├── pdfGenerator.js      # Geração de PDFs
│   │   ├── storage.js           # LocalStorage utilities
│   │   ├── tickets.js           # Gerenciamento de ingressos
│   │   └── utils.js             # Funções utilitárias
│   │
│   ├── pages/                   # Páginas da aplicação
│   │   ├── HomePage.jsx         # Página inicial
│   │   ├── EventDetailsPage.jsx # Detalhes do evento
│   │   ├── CheckoutPage.jsx     # Página de checkout
│   │   ├── LoginPage.jsx        # Login
│   │   ├── RegisterPage.jsx     # Cadastro
│   │   ├── MyTicketsPage.jsx    # Meus ingressos
│   │   ├── FavoritesPage.jsx    # Eventos favoritos
│   │   ├── AccountPage.jsx      # Conta do usuário
│   │   ├── DashboardPage.jsx    # Dashboard do organizador
│   │   ├── DashboardManagementPage.jsx # Gerenciamento de eventos
│   │   ├── EventCreationPage.jsx # Criação de eventos
│   │   └── ...                  # Outras páginas
│   │
│   ├── services/                # Serviços e APIs
│   │   ├── api.js               # Cliente API principal
│   │   ├── eventService.js      # Serviço de eventos
│   │   └── ticketService.js     # Serviço de ingressos
│   │
│   ├── styles/                  # Estilos globais
│   │   ├── global.css           # Estilos globais
│   │   └── auth.css             # Estilos de autenticação
│   │
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Entry point
│   └── index.css                # Estilos base
│
├── server/                      # Backend (desenvolvimento)
│   ├── mockEventData.js         # Dados mockados de eventos
│   └── server.js                # Servidor Express local
│
├── functions/                   # Firebase Cloud Functions
│   └── index.js                 # Functions do Firebase
│
├── firebase.json                # Configuração do Firebase
├── firestore.rules              # Regras de segurança Firestore
├── vite.config.js               # Configuração do Vite
├── tailwind.config.js           # Configuração do Tailwind
└── package.json                 # Dependências do projeto
```

---

## 🎨 Funcionalidades Detalhadas

### Para Usuários (Estudantes)

#### 🏠 Página Inicial
- Eventos em destaque com carrossel
- Lista completa de eventos disponíveis
- Sistema de busca inteligente
- Filtros por categoria, localização e data
- Cards de eventos com informações essenciais

#### 🔍 Busca e Descoberta
- Busca por texto livre (título, descrição, localização)
- Filtros por:
  - Categoria (festas, esportes, acadêmico, shows, cultural, etc.)
  - Localização (cidade/estado)
  - Data específica
  - Faixa de preço
- Resultados em tempo real

#### 🎟️ Detalhes do Evento
- Informações completas do evento
- Galeria de imagens
- Descrição detalhada
- Data, horário e localização
- Restrições de idade
- Organizadores responsáveis
- Sistema de favoritos
- Opções de compartilhamento
- Botão de compra direto

#### 💳 Processo de Compra
1. Seleção de quantidade de ingressos
2. Escolha do tipo de ingresso
3. Preenchimento de dados pessoais
4. Revisão do pedido
5. Processamento de pagamento
6. Confirmação e geração do ingresso

#### 📱 Carteira Digital
- Visualização de todos os ingressos
- Ingressos organizados por data
- QR Code para validação
- Download de ingresso em PDF
- Compartilhamento de ingresso
- Histórico de eventos anteriores
- Status do ingresso (ativo, usado, cancelado)

#### ⭐ Favoritos
- Salvar eventos de interesse
- Lista organizada de favoritos
- Notificações de eventos favoritos
- Remoção rápida de favoritos

### Para Organizadores

#### 📊 Dashboard Principal
- Visão geral de métricas
- Total de eventos publicados
- Total de ingressos vendidos
- Receita total
- Gráficos de vendas por período
- Eventos mais populares
- Próximos eventos

#### ➕ Criação de Eventos
- Formulário intuitivo e completo
- Upload de imagens do evento
- Definição de múltiplos tipos de ingresso
- Configuração de preços e lotes
- Definição de capacidade
- Rascunhos salvos automaticamente
- Preview antes de publicar

#### 🛠️ Gerenciamento de Eventos
- Lista de todos os eventos criados
- Edição de eventos publicados
- Pausar/despausar vendas
- Visualizar estatísticas por evento
- Gerenciar ingressos vendidos
- Exportar lista de participantes
- Deletar eventos (com confirmação)

#### 📈 Analytics e Relatórios
- Vendas por período
- Taxa de conversão
- Eventos mais visualizados
- Origem do tráfego
- Dispositivos utilizados
- Horários de pico de vendas

---

## 🌐 Deploy e Acesso

### 🔗 Aplicação em Produção

A aplicação está disponível online e pode ser acessada através do link:

**🌍 [https://cuencos.web.app](https://cuencos.web.app)**

### 🏗️ Hospedagem

- **Firebase Hosting** - Hospedagem estática global com CDN
- **Deploy Contínuo** - Atualizações automáticas via Git
- **HTTPS** - Certificado SSL incluído
- **Performance** - Cache otimizado e compressão Gzip

---

## 💻 Instalação e Desenvolvimento Local

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Git
- Conta no Firebase (para features completas)

### 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/andersonodev/cuencos.git
cd cuencos
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
cp .env.example .env

# Adicione suas credenciais do Firebase
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
http://localhost:5173
```

### 🏗️ Build para Produção

```bash
# Gerar build otimizado
npm run build

# Preview do build local
npm run preview
```

### 🚀 Deploy no Firebase

```bash
# Instalar Firebase CLI (se ainda não tiver)
npm install -g firebase-tools

# Login no Firebase
firebase login

# Deploy
firebase deploy
```

---

## 👥 Funcionalidades de Autenticação

### Usuário Padrão (Demo)

A aplicação está configurada para manter o usuário sempre logado automaticamente com um usuário demo:

- **Email:** usuario@cuencos.com
- **Nome:** Usuário Demo
- **Tipo:** Cliente

### Login de Organizador (Para Testes)

Para acessar o dashboard de organizador:

- **Email:** organizador@cuencos.com
- **Senha:** admin123

### Registro de Novos Usuários

- Cadastro via formulário completo
- Validação de email
- Opção de login com Google (em breve)
- Diferenciação entre usuário comum e organizador

---

## 🎯 Casos de Uso

### 1. Estudante Procurando Evento
```
Usuário acessa a home → 
Utiliza filtros (categoria: festa) → 
Encontra "PUC IN RIO" → 
Visualiza detalhes → 
Adiciona aos favoritos → 
Compra 2 ingressos → 
Recebe QR Code na carteira digital
```

### 2. Organizador Criando Evento
```
Login como organizador → 
Acessa Dashboard → 
Clica em "Criar Evento" → 
Preenche informações → 
Upload de banner → 
Define tipos de ingresso → 
Salva como rascunho → 
Revisa e publica → 
Acompanha vendas em tempo real
```

### 3. Validação de Ingresso no Evento
```
Participante abre app → 
Acessa "Meus Ingressos" → 
Seleciona evento do dia → 
Exibe QR Code → 
Staff escaneia código → 
Sistema valida ingresso → 
Entrada liberada
```

---

## 🔒 Segurança

- ✅ Autenticação segura via Firebase Auth
- ✅ Regras de segurança no Firestore
- ✅ Sanitização de HTML (DOMPurify)
- ✅ Validação de formulários
- ✅ HTTPS obrigatório em produção
- ✅ Proteção contra XSS
- ✅ Rate limiting nas APIs
- ✅ Tokens JWT para autenticação

---

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:

- 📱 **Mobile** (320px - 767px)
- 📱 **Tablet** (768px - 1023px)
- 💻 **Desktop** (1024px - 1439px)
- 🖥️ **Large Desktop** (1440px+)

### Recursos Mobile-Specific
- Menu inferior fixo
- Gestos de swipe
- Touch-optimized buttons
- Drawer lateral para filtros
- Modo paisagem otimizado

---

## 🎓 Contexto Acadêmico

### Instituição
**Instituto IBMEC - Campus Barra da Tijuca**  
Avenida Ayrton Senna, 2800 - Barra da Tijuca  
Rio de Janeiro - RJ

### Disciplina
**Engenharia de Software**

### Semestre
**2025.1**

### Objetivos de Aprendizado

Este projeto foi desenvolvido com os seguintes objetivos acadêmicos:

1. **Arquitetura de Software**
   - Aplicação de padrões de projeto
   - Separação de responsabilidades
   - Componentização
   - Gerenciamento de estado

2. **Desenvolvimento Full Stack**
   - Frontend moderno com React
   - Integração com Backend (Firebase)
   - APIs REST
   - Banco de dados NoSQL

3. **UX/UI Design**
   - Design responsivo
   - Acessibilidade
   - Experiência do usuário
   - Interface intuitiva

4. **DevOps e Deploy**
   - Versionamento com Git
   - CI/CD
   - Hospedagem em nuvem
   - Monitoramento

5. **Metodologias Ágeis**
   - Desenvolvimento iterativo
   - Sprints
   - Code review
   - Documentação

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use ESLint para manter consistência
- Siga as convenções de nomenclatura do projeto
- Adicione comentários quando necessário
- Escreva commits descritivos
- Teste suas alterações antes de commitar

---

## 📝 Licença

Este projeto é um trabalho acadêmico desenvolvido para fins educacionais no IBMEC.

---

## 📞 Contato

**Desenvolvedor:** Anderson O.  
**Instituição:** IBMEC - Barra da Tijuca  
**GitHub:** [@andersonodev](https://github.com/andersonodev)

---

## 🙏 Agradecimentos

- **IBMEC** - Por proporcionar o ambiente acadêmico e recursos
- **Professores** - Pela orientação e conhecimento compartilhado
- **Colegas** - Pelo feedback e colaboração
- **Comunidade Open Source** - Pelas ferramentas e bibliotecas utilizadas

---

## 📊 Status do Projeto

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-Academic-green)

### Roadmap Futuro

- [ ] Sistema de pagamento real (Stripe/PagSeguro)
- [ ] Notificações push
- [ ] App mobile nativo (React Native)
- [ ] Sistema de chat entre organizador e participantes
- [ ] Integração com redes sociais
- [ ] Sistema de avaliação de eventos
- [ ] Recomendações personalizadas com IA
- [ ] Modo offline com sincronização
- [ ] Multi-idioma (PT/EN/ES)
- [ ] Programa de fidelidade e pontos

---

<div align="center">

**Desenvolvido com 💜 por estudantes do IBMEC para a comunidade universitária**

[![IBMEC](https://img.shields.io/badge/IBMEC-Barra-blue?style=flat-square)](https://www.ibmec.br/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>
