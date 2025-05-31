# 💬 RealTalk AI

A **real-time microservices-based chat application** supercharged with **GroqAI** for smart replies, chat summarization, translation, and voice-to-text. Scalable, secure, and developer-ready.

---

## 🚀 Features

### 💡 Core Chat Features

- 🔌 Real-time messaging with **Socket.IO**
- 🟢 Online/Offline presence
- ✍️ Typing indicators
- 👀 Seen / read receipts
- 😄 Emojis, reactions, file sharing
- 👥 One-to-one & Group chats
- 🗃️ Persistent chat history
- ✏️ Edit/Delete messages
- 📱 Push Notifications (Web)
- 🔊 Voice messages
- 🛠️ Admin tools (kick, mute)
- 👥 Connection system (friend requests with accept/deny)

---

### 🤖 AI-Powered Features (GroqAI + AssemblyAI)

> Smart, contextual, AI enhancements.

- 🧠 **Smart Suggestions**  
  Gmail-style smart replies (suggests 3 options).

- 📝 **Conversation Summarizer**  
  Summarize long chats (e.g., "Summarize the last 100 messages").

- 🌐 **Auto Translator**  
  Detects and translates messages automatically.

- 🧏 **Voice-to-Text**  
  Converts voice messages to text for accessibility.

- 🔍 **AI Search Assistant**  
  Ask: _“What did Ali say about the meeting?”_ → GroqAI answers.

---

## 🧱 Microservices Architecture

| Service                | Description                                                                    |
| ---------------------- | ------------------------------------------------------------------------------ |
| `user-service`         | Authentication (JWT + OAuth2), user profile, online status, email verification |
| `chat-service`         | Manages rooms, messages, WebSocket handling                                    |
| `ai-service`           | Handles AI operations with GroqAI, AssemblyAI                                  |
| `notification-service` | Browser push notifications                                                     |
| `nginx`                | NGINX reverse proxy + API gateway with rate limiting                           |

---

## 🛠️ Tech Stack

- **Backend:** Node.js, TypeScript, Express, Socket.IO
- **AI/ML:** GroqAI, AssemblyAI
- **Database:** PostgreSQL (users + authentication), MongoDB Atlas (chat + notifications), Redis (caching, rate limiting)
- **Queue & Messaging:** RabbitMQ for inter-service communication
- **CDN:** Cloudinary + ImageKit
- **Authentication:** Authentication: JWT + OAuth2 (Google & GitHub) using Passport.js, Nodemailer + Email Verification for sign-up
- **ORMs:** Prisma (SQL), Mongoose (NoSQL)
- **Validation:** Zod
- **Containerization:** Docker
- **Security:** Rate limiting (Redis), SQL/NoSQL injection protection, sanitized inputs
- **API Gateway:** NGINX (reverse proxy, rate limiting)

---

## 📨 Email & Verification

- Users must verify their email via a **secure OTP** sent using **Nodemailer**.
- OTP codes and user passwords are **encrypted using bcrypt** before storage.
- Unverified users cannot initiate chats or connections.

---

## 🔗 User Connection System

- Users can **send/receive friend (connection) requests**.
- Recipients can **accept** or **decline** requests.
- On acceptance, a **RabbitMQ event** triggers chat-service to create a direct message thread between the two users.
- Connection status is persisted and saved in the database.

---

## 🐇 RabbitMQ Messaging Flow

- ⚙️ Enables decoupled, asynchronous communication between microservices
- 🤝 When a user connection request is accepted, RabbitMQ sends an event to notify relevant services
- 💬 When a new message is sent in any chat, RabbitMQ publishes this event to the notification service
- The notification service then sends real-time push/browser notifications to users

---

## ⚙️ DevOps & Infrastructure

- All services containerized with **Docker**
- Centralized **NGINX** API Gateway for routing & reverse proxy
- **Redis** used across services for caching and rate limiting
- Configurable **request size limits** per service
- Image and file uploads via **Cloudinary** and **ImageKit**

---

## 🔒 Security & Validation

- 🔐 JWT Auth + OAuth2 with Passport.js
- 🧂 Passwords & OTPs encrypted with bcrypt
- 📧 Email verification flow
- ✅ Zod validation for inputs
- 🧼 Mongo-sanitize + Prisma/Mongoose to prevent injections
- 🚦 Redis-based rate limiting on all services
- 📏 Request body size limits enforced per service
- 🛡️ Helmet + CORS protection enabled

---

## 📦 Project Structure (Monorepo)

📦 realtalk-ai

- ┣ 📂 user-service
- ┣ 📂 chat-service
- ┣ 📂 ai-service
- ┣ 📂 notification-service
- ┣ 📂 nginx # NGINX config and reverse proxy
- ┣ 📜 docker-compose.yml
- ┣ 📜 README.md

---

## 🗂️ Service Folder Structure

Here's the layout used across each microservice (e.g., `user-service`, `chat-service`, etc.):

| Path / File         | Description                                    |
| ------------------- | ---------------------------------------------- |
| `Dockerfile`        | Docker instructions to build the service image |
| `.dockerignore`     | Files/folders excluded from Docker context     |
| `tsconfig.json`     | TypeScript config for compiler                 |
| `package-lock.json` | NPM dependency lock file                       |
| `src/`              | Main source code directory                     |
| ┣ `controllers/`    | Request handler logic                          |
| ┣ `services/`       | Business logic layer                           |
| ┣ `schemas/`        | Zod schemas for validation                     |
| ┣ `middlewares/`    | Express middleware functions                   |
| ┣ `models/`         | Database models (Mongoose/Prisma)              |
| ┣ `config/`         | Configuration (env, database, etc.)            |
| ┣ `routes/`         | Express route handlers                         |
| ┣ `utils/`          | Utility functions/helpers                      |
| ┗ `index.ts`        | Entry point for the app (Express init, etc.)   |

---

# How to Use RealTalk AI Project with Docker Compose

This guide will help you get the RealTalk AI microservices project up and running using Docker Compose.

---

## Prerequisites

- Docker installed: [Get Docker](https://docs.docker.com/get-docker/)
- Docker Compose installed (usually comes with Docker Desktop)
- Git installed: [Get Git](https://git-scm.com/downloads)

---

## Steps to Run

### 1. Clone the repository

```bash
git clone https://github.com/mohamed-abobakr73/Real-Talk-AI
cd realtalk-ai
```

### 2. Build and start the services

Use Docker Compose to build all services and start containers:

```bash
docker-compose up --build
```

This command will:

- Build images for all microservices (users-service, chat-service, notification-service, ai-service)
- Start a Postgres database container for the users-service
- Start an NGINX container as a reverse proxy on port 80
- Map service ports:
  - Users Service: localhost:3001
  - Chat Service: localhost:3002
  - Notification Service: localhost:3003
  - AI Service: localhost:3004

### 3. Access the APIs

- The API Gateway (NGINX) is exposed on http://localhost and proxies requests to the respective services.
- Use tools like Postman, curl, or your frontend client to interact with the microservices via the API gateway or directly on their individual ports.

- Example API base URLs:
  - Users Service: http://localhost/api/v1/users/
  - Chat Service: http://localhost/api/v1/chats/
  - Notification Service: http://localhost/api/v1/notifications/
  - AI Service: http://localhost/api/v1/ai/

---

# 📁 Environment Variables

Each microservice has its own `.env` file. Below is a template you can fill out for each one.

---

## 🔐 `users-service/.env`

| Variable Name               | Description                           | Example                                                                    |
| --------------------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| `PORT`                      | Port the service runs on              | `3000 (must be 3000)`                                                      |
| `DATABASE_URL`              | The Database connection url to prisma | `postgresql://postgres:your-password@db:5432/docker-db-name?schema=public` |
| `REDIS_CONNECTION_URL`      | Redis connection URL                  | `redis://localhost:6379`                                                   |
| `JWT_SECRET_KEY`            | Secret key for JWT authentication     | `supersecretkey`                                                           |
| `REFRESH_TOKEN_SECRET_KEY`  | Secret key for JWT Refresh token      | `supersecretkey`                                                           |
| `NODE_MAILER_USER`          | Node mailer email                     | `test@test.com`                                                            |
| `NODE_MAILER_PASS`          | Node mailer password                  | `password`                                                                 |
| `GOOGLE_CLIENT_ID`          | Google OAuth Client ID                | `xxxx.apps.googleusercontent.com`                                          |
| `GOOGLE_CLIENT_SECRET`      | Google OAuth Client Secret            | `google-secret`                                                            |
| `GOOGLE_CALL_BACK_URL`      | Google OAuth Call Back Url            | `http://someurl.com`                                                       |
| `GITHUB_CLIENT_ID`          | GitHub OAuth Client ID                | `github-client-id`                                                         |
| `GITHUB_CLIENT_SECRET`      | GitHub OAuth Client Secret            | `github-secret`                                                            |
| `GITHUB_CALL_BACK_URL`      | Github OAuth Call Back Url            | `http://someurl.com`                                                       |
| `IMAGE_KIT_PUBLIC_API_KEY`  | Image kit public api key              | `image-kit-public`                                                         |
| `IMAGE_KIT_PRIVATE_API_KEY` | Image kit private api key             | `supersecretkey`                                                           |
| `IMAGE_KIT_URL_ENDPOINT`    | Image kit public api key              | `https://ik.imagekit.io/RealTalk`                                          |

---

## 💬 `chat-service/.env`

| Variable Name               | Description                       | Example                                          |
| --------------------------- | --------------------------------- | ------------------------------------------------ |
| `PORT`                      | Port the service runs on          | `3001 (must be 3001)`                            |
| `MONGODB_CONNECTION_URL`    | MongoDB connection URI            | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET_KEY`            | Secret key for JWT authentication | `supersecretkey`                                 |
| `RABBITMQ_URL`              | RabbitMQ connection URL           | `amqp://guest:guest@rabbitmq:5672`               |
| `REDIS_CONNECTION_URL`      | Redis connection URL              | `redis://localhost:6379`                         |
| `IMAGE_KIT_PUBLIC_API_KEY`  | Image kit public api key          | `image-kit-public`                               |
| `IMAGE_KIT_PRIVATE_API_KEY` | Image kit private api key         | `supersecretkey`                                 |
| `IMAGE_KIT_URL_ENDPOINT`    | Image kit public api key          | `https://ik.imagekit.io/RealTalk`                |
| `CLOUDINARY_CLOUD_NAME`     | Cloudianry cloud name             | `165a1sd5f`                                      |
| `CLOUDINARY_API_KEY`        | Cloudianry api key                | `6515146841321`                                  |
| `CLOUDINARY_SECRET_KEY`     | Cloudianry secret key             | `supersecretkey`                                 |

---

## 🤖 `ai-service/.env`

| Variable Name          | Description                       | Example                   |
| ---------------------- | --------------------------------- | ------------------------- |
| `PORT`                 | Port the service runs on          | `3002 (must be 3002)`     |
| `JWT_SECRET_KEY`       | Secret key for JWT authentication | `supersecretkey`          |
| `REDIS_CONNECTION_URL` | Redis connection URL              | `redis://localhost:6379`  |
| `GROQ_API_KEY`         | Groq ai api key                   | `sdbhfpu23h-8u4b4343f43t` |
| `ASSEMBLY_AI_API_KEY`  | Assembly ai api key               | `sdbhfpu23h-8u4b4343f43t` |

---

## 📣 `notification-service/.env`

| Variable Name            | Description                       | Example                                          |
| ------------------------ | --------------------------------- | ------------------------------------------------ |
| `PORT`                   | Port the service runs on          | `3003 (must be 3003)`                            |
| `JWT_SECRET_KEY`         | Secret key for JWT authentication | `supersecretkey`                                 |
| `MONGODB_CONNECTION_URL` | MongoDB connection URI            | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `RABBITMQ_URL`           | RabbitMQ connection URL           | `amqp://guest:guest@rabbitmq:5672`               |
| `REDIS_CONNECTION_URL`   | Redis connection URL              | `redis://localhost:6379`                         |
| `PUBLIC_VAPID_KEY`       | Web Push public vapid key         | `sdfg34t54g65yh56u`                              |
| `PRIVATE_VAPID_KEY`      | Web Push private vapid key        | `supersecretkey`                                 |

---

You can copy and modify these tables per service and fill in the actual values for your `.env` files.

---

### 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

### 📜 License

MIT License © Mohamed Abobakr
