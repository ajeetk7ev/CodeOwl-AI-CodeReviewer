# 🦉 CodeOwl - AI Code Reviewer

CodeOwl is an intelligent AI-powered code review assistant that integrates seamlessly with GitHub. It automates pull request reviews, detects security vulnerabilities, ensures best practices, and provides actionable performance improvements.

![CodeOwl Hero](frontend/src/assets/screenshots/Screenshot%202026-01-21%20180014.png)

## 🚀 Features

- **🤖 AI-Powered Code Analysis**: Detailed feedback on logic, security, and performance.
- **🛡️ Automated Security Audits**: Detects SQL injection, XSS, and race conditions.
- **📊 Real-time Dashboard**: Track review stats, active repositories, and recent activity.
- **⚡ Instant Feedback**: Reviews delivered in seconds via BullMQ job queues.
- **🔗 GitHub Integration**: Connects via OAuth and Webhooks for automatic PR scanning.
- **💰 Pro Plans**: Stripe/Razorpay integration for premium subscription tiers.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Primary), Redis (Queues & Caching)
- **Vector DB**: Pinecone (for context-aware analysis)
- **AI Provider**: OpenRouter (Llama 3, GPT-4 support)
- **Queue System**: BullMQ
- **Authentication**: Passport.js (GitHub Strategy), JWT

---

## 📂 Project Structure

```bash
CodeOwl/
├── backend/                # Express server & microservices
│   ├── src/
│   │   ├── config/         # DB, Redis, Passport configs
│   │   ├── controllers/    # Route logic
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # AI & GitHub services
│   │   └── workers/        # BullMQ job processors
│   ├── .env.example        # Backend environment variables
│   └── package.json
│
├── frontend/               # React client application
│   ├── src/
│   │   ├── assets/         # Images & Screenshots
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application views
│   │   ├── services/       # API call definitions
│   │   └── store/          # Zustand state stores
│   ├── .env.example        # Frontend environment variables
│   └── package.json
└── README.md
```

---

## 📸 Screenshots

### 🖥️ Dashboard

![Dashboard](frontend/src/assets/screenshots/Screenshot%202026-01-21%20175555.png)

### 📊 Security Analysis

![Analysis](frontend/src/assets/screenshots/Screenshot%202026-01-21%20175620.png)

### 💳 Subscription Plans

![Pricing](frontend/src/assets/screenshots/Screenshot%202026-01-21%20175824.png)

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or Atlas URI)
- Redis (Running locally or Cloud URI)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CodeOwl.git
cd CodeOwl
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env
# Edit .env with your credentials (MongoDB, Redis, GitHub Keys)

npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file from example
cp .env.example .env

npm run dev
```

### 4. Running the Tunnel (Optional)

If developing locally with GitHub Webhooks, use ngrok:

```bash
ngrok http 5001
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

- `MONGO_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection string
- `GITHUB_CLIENT_ID` / `SECRET`: OAuth credentials
- `GITHUB_WEBHOOK_SECRET`: Verify webhook signatures
- `OPENROUTER_KEY`: API key for AI models
- `PINECONE_API_KEY`: For vector storage

### Frontend (`frontend/.env`)

- `VITE_API_URL`: Backend API URL (default: `http://localhost:5001/api`)

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## 📄 License

MIT License © 2026 CodeOwl
