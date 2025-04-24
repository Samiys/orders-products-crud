# Vue Orders-Products CRUD

A Vue 3 Single Page Application to manage orders and products with PrimeVue, Vuex, and TailwindCSS.

## Features

- CRUD for Orders & Products
- Dialog-based forms
- Form validation with Vuelidate
- State management via Vuex
- Responsive UI using TailwindCSS
- Styled with PrimeVue components
- Unit testing via Vitest

## Setup

### 🐳 Docker

#### 1. Build and run the app

```bash
docker-compose up --build
```

#### 2. Access the app

- **Frontend**: http://localhost:8080
- **API (json-server)**: http://localhost:3000

#### 3. Available Endpoints

```http
GET /orders
GET /products
GET /companies
```

> ℹ️ Note: The frontend Vue app is served on port 8080, and the mock backend (json-server) runs on port 3000.

---

### 💻 Manual (Local) Setup

```bash
npm install
npm run start
```

## 🧪 Tests

#### Run all tests in watch mode
```bash
npm run test:unit
```

#### Run once without watching
```bash
npx vitest run
```
