# 🎓 AI-Based Adaptive Learning Platform

> An intelligent personal tutor with comprehensive academic management for VTU students

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0-EE4C2C)](https://pytorch.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](https://www.postgresql.org/)

## 🚀 Features

### For Students
- **🤖 AI Personal Tutor** - Ask questions, get explanations from your study materials
- **📊 Adaptive Learning** - Reinforcement learning-based personalized study plans
- **💻 Code Journal** - Document your coding journey with syntax highlighting
- **📝 Smart Assessments** - Randomized tests with anti-cheat mechanisms
- **📈 Progress Tracking** - Visual analytics of your learning journey
- **🔄 Spaced Repetition** - Intelligent revision based on forgetting curves

### For Teachers
- **👥 Student Management** - Track all students by branch/section
- **📋 Assessment Creation** - Upload question banks, auto-generate unique tests
- **📊 Analytics Dashboard** - Class-wide performance insights
- **🔔 Notifications** - Email alerts for assignments and results
- **🎯 Targeted Interventions** - Identify struggling students early

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 15)                    │
│  Student Portal  │  Teacher Portal  │  AI Chat Interface    │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Backend (FastAPI + Python)                  │
│  Auth  │  Tests  │  AI/ML  │  PDF Parser  │  Notifications │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│              Data Layer (PostgreSQL + Redis)                 │
│  Users  │  Tests  │  Learning States  │  Code Journal       │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router, Server Components)
- **Language:** TypeScript 5
- **UI Library:** shadcn/ui + Tailwind CSS v4
- **Charts:** Recharts + Tremor
- **Code Editor:** Monaco Editor
- **State Management:** Zustand
- **Real-time:** Socket.io

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **AI/ML:** PyTorch (RL), LangChain (LLM)
- **NLP:** spaCy, sentence-transformers
- **Task Queue:** Celery + Redis
- **Email:** Resend API

### Database
- **Primary:** PostgreSQL 15
- **Vector DB:** Pinecone
- **Cache:** Redis
- **Storage:** AWS S3 / Cloudflare R2

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.11+
- PostgreSQL 15
- Redis

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn app.main:app --reload
```

### Database Setup
```bash
cd database
psql -U postgres -f schema.sql
psql -U postgres -f seeds/vtu_6th_sem_subjects.sql
```

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd adaptive-learning-platform
```

2. **Start services with Docker Compose**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📚 Documentation

- [Project Analysis](docs/learnings/PROJECT_ANALYSIS.md)
- [Project Structure](PROJECT_STRUCTURE.md)
- [API Documentation](docs/api/)
- [Architecture Diagrams](docs/architecture/)

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:e2e
```

### Backend Tests
```bash
cd backend
pytest
pytest --cov=app tests/
```

## 📈 Project Timeline

- **Phase 1 (Weeks 1-4):** Foundation - Database, Auth, Basic UI ✅ IN PROGRESS
- **Phase 2 (Weeks 5-8):** Core Features - Learning tracker, Code Journal
- **Phase 3 (Weeks 9-12):** Assessment System - Tests, Anti-cheat
- **Phase 4 (Weeks 13-16):** AI Integration - LLM, Quiz generation
- **Phase 5 (Weeks 17-20):** Reinforcement Learning - DQN, Adaptive scheduling
- **Phase 6 (Weeks 21-24):** Testing & Refinement
- **Phase 7 (Weeks 25-26):** Deployment

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built with ❤️ by the AI Learning Platform Team

## 📞 Support

For support, email support@adaptivelearning.com or join our Discord server.

---

**Version:** 2.0  
**Last Updated:** May 2025
