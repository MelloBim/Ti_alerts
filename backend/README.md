# 🚨 Ti Alerts API

API para **agendamento de mensagens** (com texto e imagem) enviadas para o **Google Chat**, com **armazenamento de imagens no Google Drive**.  
Desenvolvida em **Node.js**, **Express** e **MySQL**, com **autenticação JWT** e **upload de arquivos usando Google Drive API**.

---

## ✨ Funcionalidades
- CRUD de **agendamentos** (mensagens com ou sem imagens).  
- **Upload de imagens** para uma pasta no Google Drive.  
- **Envio de mensagens para Google Chat** usando Webhook.  
- **Agendamento automático** de mensagens com `node-cron`.  
- **Autenticação JWT** para rotas protegidas.  
- **Configuração via `.env`**.  

---

## ⚙️ Requisitos
Antes de iniciar, você precisa ter instalado em sua máquina:
- [Node.js 18+](https://nodejs.org/)  
- [MySQL](https://dev.mysql.com/downloads/)  
- Conta no **Google Cloud** com **Google Drive API** ativada.  
- Um **Webhook do Google Chat**.  

---

## 📦 Instalação
Clone o repositório e instale as dependências:

```bash
git clone https://github.com/MelloBim/Ti_alerts.git
cd ti_alerts/backend
npm install

## Conteudo adicional
🌐 Endpoints Principais
Agendamentos
GET /api/schedules → Lista todos os agendamentos.

POST /api/schedules → Cria um novo agendamento (suporta upload de imagem).

PUT /api/schedules/:id → Atualiza um agendamento.

DELETE /api/schedules/:id → Remove um agendamento.

Autenticação
POST /api/login → Gera um token JWT para autenticação.

📤 Upload de Imagens no Google Drive
O upload de imagens é feito pela função uploadToDrive, que:

Envia o arquivo para a pasta do Google Drive (GOOGLE_DRIVE_FOLDER_ID).

Configura permissão de leitura pública.

Retorna a URL pública da imagem (https://drive.google.com/uc?export=view&id=ID_DO_ARQUIVO).
