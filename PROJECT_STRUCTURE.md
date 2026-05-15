# Adaptive Learning Platform - Project Structure

```
adaptive-learning-platform/
├── frontend/                          # Next.js 15 Frontend
│   ├── app/                          # App Router
│   │   ├── (auth)/                   # Auth routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (student)/                # Student routes
│   │   │   ├── dashboard/
│   │   │   ├── subjects/
│   │   │   ├── ai-tutor/
│   │   │   ├── code-journal/
│   │   │   ├── tests/
│   │   │   ├── study-plan/
│   │   │   └── profile/
│   │   ├── (admin)/                  # Admin routes
│   │   │   ├── dashboard/
│   │   │   ├── students/
│   │   │   ├── assessments/
│   │   │   ├── question-bank/
│   │   │   ├── analytics/
│   │   │   └── notifications/
│   │   ├── api/                      # API routes (Next.js API)
│   │   │   └── auth/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── student/                  # Student-specific components
│   │   ├── admin/                    # Admin-specific components
│   │   ├── charts/                   # Chart components
│   │   ├── code-editor/              # Monaco editor wrapper
│   │   └── shared/                   # Shared components
│   ├── lib/                          # Utilities
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── db.ts                     # Database client
│   │   ├── api.ts                    # API client
│   │   └── utils.ts                  # Helper functions
│   ├── hooks/                        # Custom React hooks
│   ├── store/                        # Zustand stores
│   ├── types/                        # TypeScript types
│   ├── public/                       # Static assets
│   ├── styles/                       # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry
│   │   ├── config.py                 # Configuration
│   │   ├── database.py               # Database connection
│   │   ├── models/                   # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── student.py
│   │   │   ├── admin.py
│   │   │   ├── test.py
│   │   │   ├── submission.py
│   │   │   ├── code_journal.py
│   │   │   ├── learning_state.py
│   │   │   └── notification.py
│   │   ├── schemas/                  # Pydantic schemas
│   │   │   ├── user.py
│   │   │   ├── test.py
│   │   │   ├── submission.py
│   │   │   └── journal.py
│   │   ├── routers/                  # API routers
│   │   │   ├── auth.py
│   │   │   ├── student.py
│   │   │   ├── admin.py
│   │   │   ├── tests.py
│   │   │   ├── journal.py
│   │   │   ├── ai.py
│   │   │   └── planner.py
│   │   ├── services/                 # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── test_service.py
│   │   │   ├── randomizer.py        # Question randomization
│   │   │   ├── anti_cheat.py        # Anti-cheat logic
│   │   │   ├── email_service.py     # Email notifications
│   │   │   ├── pdf_parser.py        # PDF processing
│   │   │   └── ai_service.py        # LLM integration
│   │   ├── ml/                       # Machine Learning
│   │   │   ├── rl/                   # Reinforcement Learning
│   │   │   │   ├── dqn_model.py     # DQN implementation
│   │   │   │   ├── environment.py   # RL environment
│   │   │   │   ├── trainer.py       # Training pipeline
│   │   │   │   └── scheduler.py     # Adaptive scheduler
│   │   │   ├── learning_state/      # Learning state tracking
│   │   │   │   ├── bayesian.py      # Bayesian knowledge tracing
│   │   │   │   ├── forgetting.py    # Forgetting curve
│   │   │   │   └── tracker.py       # State tracker
│   │   │   └── nlp/                  # NLP processing
│   │   │       ├── topic_extractor.py
│   │   │       ├── dependency_graph.py
│   │   │       └── embeddings.py
│   │   ├── tasks/                    # Celery tasks
│   │   │   ├── pdf_processing.py
│   │   │   ├── email_tasks.py
│   │   │   └── ml_tasks.py
│   │   └── utils/                    # Utilities
│   │       ├── security.py
│   │       ├── validators.py
│   │       └── helpers.py
│   ├── tests/                        # Backend tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── database/                         # Database scripts
│   ├── migrations/                   # Alembic migrations
│   ├── seeds/                        # Seed data
│   │   └── vtu_6th_sem_subjects.sql
│   └── schema.sql                    # Complete schema
│
├── ml-models/                        # Trained ML models
│   ├── dqn_checkpoint.pth
│   ├── embeddings/
│   └── configs/
│
├── docs/                             # Documentation
│   ├── api/                          # API documentation
│   ├── architecture/                 # Architecture diagrams
│   ├── learnings/                    # Project learnings
│   │   └── PROJECT_ANALYSIS.md
│   └── user-guides/                  # User guides
│
├── scripts/                          # Utility scripts
│   ├── setup_db.sh
│   ├── seed_vtu_data.py
│   └── deploy.sh
│
├── .github/                          # GitHub Actions
│   └── workflows/
│       ├── frontend-ci.yml
│       └── backend-ci.yml
│
├── docker-compose.yml                # Docker compose for local dev
├── .gitignore
├── README.md
└── LICENSE
```

## Key Directories Explained

### Frontend (`/frontend`)
- **app/**: Next.js 15 App Router with route groups for auth, student, admin
- **components/**: Reusable React components organized by feature
- **lib/**: Core utilities (auth, API client, database)
- **hooks/**: Custom React hooks for state management
- **store/**: Zustand stores for global state

### Backend (`/backend`)
- **models/**: SQLAlchemy ORM models (database tables)
- **schemas/**: Pydantic schemas for request/response validation
- **routers/**: FastAPI routers (API endpoints)
- **services/**: Business logic layer (separated from routes)
- **ml/**: Machine learning modules (RL, learning state, NLP)
- **tasks/**: Celery background tasks

### Database (`/database`)
- **migrations/**: Alembic database migrations
- **seeds/**: Initial data (VTU subjects, sample questions)
- **schema.sql**: Complete database schema

### ML Models (`/ml-models`)
- Trained DQN models
- Pre-computed embeddings
- Model configurations

## Technology Mapping

### Frontend Stack
- **Framework:** Next.js 15 (App Router, Server Components)
- **Language:** TypeScript 5
- **UI:** shadcn/ui + Tailwind CSS v4
- **Charts:** Recharts + Tremor
- **Code Editor:** Monaco Editor
- **State:** Zustand
- **Real-time:** Socket.io-client
- **Animations:** Framer Motion

### Backend Stack
- **Framework:** FastAPI (Python 3.11+)
- **ORM:** SQLAlchemy 2.0
- **Validation:** Pydantic v2
- **Auth:** JWT (python-jose)
- **ML:** PyTorch 2.0
- **NLP:** spaCy, sentence-transformers
- **LLM:** LangChain + OpenAI API
- **Tasks:** Celery + Redis
- **Email:** Resend API

### Infrastructure
- **Database:** PostgreSQL 15
- **Vector DB:** Pinecone
- **Cache:** Redis
- **Storage:** AWS S3 / Cloudflare R2
- **Hosting:** Vercel (frontend) + Railway/AWS (backend)
- **Monitoring:** Grafana + Sentry
