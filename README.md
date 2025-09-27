# fastify-otp-redis

A minimal **OTP (One-Time Password) API** built with **Fastify** and **Redis**.  
It generates and verifies short‑lived, one‑time codes and exposes routes documented with Swagger.

---

## Features
- Fastify v5 with schema‑driven routes
- Redis‑backed OTP store with configurable TTL and one‑time verification
- Swagger UI (`/docs`) for interactive API testing
- Clear service/store layering (OTP service + Redis store)
- Ready to run locally or via Docker Compose

## Tech Stack
- Node.js (Fastify)
- Redis
- Swagger / OpenAPI

---

## Quick Start (Local)

### Prerequisites
- Node.js >= 18
- Redis >= 6 (local or Docker)

### 1) Install
```bash
git clone https://github.com/<you>/fastify-otp-redis.git
cd fastify-otp-redis
npm i
```

### 2) Environment
Create a `.env` file in the project root (example values):
```ini
PORT=3000
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
OTP_TTL_SECONDS=120
```

### 3) Run
```bash
npm run dev
# or
npm start
```
- Swagger UI: `http://localhost:3000/docs`

---

## Docker Compose (Optional)

```yaml
version: "3.9"
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  app:
    build: .
    environment:
      - PORT=3000
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - OTP_TTL_SECONDS=120
    ports:
      - "3000:3000"
    depends_on:
      - redis
```

Run:
```bash
docker compose up --build
```

---

## API

### Request OTP Code
**GET** `/otp/requestCode/:mobile`  
Query (optional): `name=...`

Response example:
```json
{
  "ok": true,
  "mobile": "0912xxxxxxx",
  "ttl": 120
}
```

cURL:
```bash
curl "http://localhost:3000/otp/requestCode/09120000000?name=john"
```

### Verify OTP Code
**GET** `/otp/verifyCode/:mobile/:code`

Response example:
```json
{ "ok": true }
```

cURL:
```bash
curl "http://localhost:3000/otp/verifyCode/09120000000/123456"
```

> Suggested RESTful alternative (if you refactor):
> - `POST /otp/request-code` with body `{ "mobile": "09..." }`
> - `POST /otp/verify-code` with body `{ "mobile": "09...", "code": "123456" }`

---

## Project Structure (example)
```
.
├─ app.js
├─ routes/
│  └─ otp/
│     ├─ requestCode/index.js
│     └─ verifyCode/index.js
├─ service/
│  ├─ otp.js
│  └─ redis-otp-store.js
├─ plugins/  (fastify plugins: redis, swagger, etc.)
├─ .env.example
└─ README.md
```

> Note: If you have a file named `redis-otp-strore.js`, rename it to `redis-otp-store.js`.

---

## Notes & Best Practices
- Typical OTP TTL: 60–180 seconds
- Delete the key after successful verification (one-time usage)
- Add a rate limit (e.g., 3 requests per 5 minutes per mobile/IP)
- Avoid logging OTP codes in production
- Keep real secrets in `.env` (never commit them)

---

## License
MIT
