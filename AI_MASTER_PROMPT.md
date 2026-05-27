# 🤖 AI MASTER EXECUTION PROMPT - Adaptive Learning Platform

## ⚡ CRITICAL INSTRUCTIONS FOR AI

**You are tasked with building the Adaptive Learning Platform from Phase 1 foundation. Execute tasks sequentially. Complete EACH task 100% before moving to the next. Use this document as your source of truth.**

---

## 📋 TASK EXECUTION SYSTEM

### Rules:
1. ✅ **Complete each task fully** before marking complete
2. 🔄 **Verify work** by checking GitHub for file creation
3. 📝 **Document progress** by updating the checklist below
4. 🚫 **Do NOT skip steps** - follow linear progression
5. 💾 **Commit to GitHub** after each major task completion
6. 🛑 **Ask for clarification** if ambiguous

---

## 🎯 PHASE 1: FOUNDATION (Weeks 1-4) - YOUR FOCUS

### Epic 1.0: Project Infrastructure Setup
**Status:** ⏳ PENDING  
**Priority:** 🔴 CRITICAL

#### Task 1.0.1: Backend Project Structure Setup
**Status:** ⏳ PENDING  
**Description:** Create FastAPI project with proper folder structure

**Instructions:**
```
DO THIS:
1. Navigate to backend folder
2. Create the following directory structure:
   backend/
   ├── app/
   │   ├── __init__.py
   │   ├── main.py (FastAPI app initialization)
   │   ├── config.py (environment & settings)
   │   ├── database.py (SQLAlchemy setup)
   │   ├── dependencies.py (shared dependencies)
   │   ├── middleware.py (logging, CORS, error handling)
   │   ├── routers/
   │   │   ├── __init__.py
   │   │   ├── auth.py
   │   │   ├── dashboard.py
   │   │   ├── tests.py
   │   │   └── journal.py
   │   ├── models/
   │   │   ├── __init__.py
   │   │   ├── user.py
   │   │   ├── student.py
   │   │   ├── admin.py
   │   │   ├── test.py
   │   │   └── learning_state.py
   │   ├── schemas/
   │   │   ├── __init__.py
   │   │   ├── user.py
   │   │   ├── auth.py
   │   │   └── test.py
   │   ├── services/
   │   │   ├── __init__.py
   │   │   ├── auth_service.py
   │   │   ├── user_service.py
   │   │   └── test_service.py
   │   └── utils/
   │       ├── __init__.py
   │       ├── logger.py
   │       ├── jwt_handler.py
   │       └── validators.py
   ├── tests/
   │   ├── __init__.py
   │   ├── test_auth.py
   │   └── conftest.py
   ├── requirements.txt
   ├── .env.example
   └── Dockerfile

3. Create requirements.txt with:
   fastapi==0.104.1
   uvicorn[standard]==0.24.0
   sqlalchemy==2.0.23
   psycopg2-binary==2.9.9
   python-jose[cryptography]==3.3.0
   passlib[bcrypt]==1.7.4
   python-dotenv==1.0.0
   pydantic==2.5.0
   pydantic-settings==2.1.0
   python-multipart==0.0.6
   pytest==7.4.3
   pytest-asyncio==0.21.1
   httpx==0.25.2

4. Create .env.example:
   DATABASE_URL=postgresql://postgres:password@localhost:5432/adaptive_learning
   SECRET_KEY=your-secret-key-here-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   DEBUG=True

VERIFY:
- All folders created ✓
- All __init__.py files exist ✓
- requirements.txt has all dependencies ✓
- .env.example created ✓

COMMIT:
git add backend/
git commit -m "chore: setup backend project structure"
```

**Deliverable:** ✅ Complete folder structure in GitHub  
**Completion Time:** 5 minutes

---

#### Task 1.0.2: FastAPI App Initialization & Configuration
**Status:** ⏳ PENDING  
**Description:** Set up FastAPI app with middleware, error handling, and configuration management

**Instructions:**
```
DO THIS:

1. Create backend/app/config.py:
```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postgres:password@localhost:5432/adaptive_learning"
    
    # JWT
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # App
    debug: bool = True
    app_name: str = "Adaptive Learning Platform"
    version: str = "2.0"
    
    # CORS
    allowed_origins: list = ["http://localhost:3000", "http://localhost:8000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
```

2. Create backend/app/database.py:
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings
import logging

logger = logging.getLogger(__name__)

engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise
```

3. Create backend/app/utils/logger.py:
```python
import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logger(name: str, log_file: str = "app.log", level=logging.INFO):
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    handler = RotatingFileHandler(
        log_file, maxBytes=10485760, backupCount=5
    )
    handler.setFormatter(formatter)
    
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(handler)
    
    return logger
```

4. Create backend/app/middleware.py:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from .config import settings
import logging
import time

logger = logging.getLogger(__name__)

def add_middleware(app: FastAPI):
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Trusted host middleware
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1"]
    )
    
    @app.middleware("http")
    async def log_requests(request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        logger.info(
            f"{request.method} {request.url.path} - "
            f"Status: {response.status_code} - Time: {process_time:.2f}s"
        )
        return response
    
    return app

def add_exception_handlers(app: FastAPI):
    @app.exception_handler(Exception)
    async def general_exception_handler(request, exc):
        logger.error(f"Unhandled exception: {exc}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "detail": str(exc) if settings.debug else "An error occurred"
            }
        )
    
    return app
```

5. Create backend/app/main.py:
```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from .config import settings
from .middleware import add_middleware, add_exception_handlers
from .database import init_db
import logging

logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.version,
        debug=settings.debug,
    )
    
    # Add middleware
    app = add_middleware(app)
    app = add_exception_handlers(app)
    
    # Initialize database
    @app.on_event("startup")
    async def startup():
        logger.info("Starting up application")
        try:
            init_db()
            logger.info("Database connected successfully")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    @app.on_event("shutdown")
    async def shutdown():
        logger.info("Shutting down application")
    
    # Health check endpoint
    @app.get("/health", tags=["Health"])
    async def health():
        return {
            "status": "healthy",
            "app": settings.app_name,
            "version": settings.version
        }
    
    # Root endpoint
    @app.get("/", tags=["Root"])
    async def root():
        return {
            "message": "Welcome to Adaptive Learning Platform",
            "docs": "/docs",
            "version": settings.version
        }
    
    # API v1 Routes (placeholder - will add routers later)
    @app.get("/api/v1", tags=["API"])
    async def api_v1():
        return {"message": "API v1 available"}
    
    logger.info("FastAPI app created successfully")
    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
```

6. Create backend/app/__init__.py (empty file)

7. Create backend/app/dependencies.py:
```python
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import get_db
import logging

logger = logging.getLogger(__name__)

def get_current_db(db: Session = Depends(get_db)) -> Session:
    return db
```

VERIFY:
- All files created ✓
- No syntax errors ✓
- Can import all modules ✓

COMMIT:
git add backend/app/
git commit -m "feat: initialize FastAPI app with configuration and middleware"
```

**Deliverable:** ✅ Working FastAPI app in GitHub  
**Completion Time:** 10 minutes

---

#### Task 1.0.3: Database Models (SQLAlchemy ORM)
**Status:** ⏳ PENDING  
**Description:** Create SQLAlchemy models mapping to database schema

**Instructions:**
```
DO THIS:

1. Create backend/app/models/user.py:
```python
from sqlalchemy import Column, String, Boolean, DateTime, Enum, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from ..database import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # 'student' or 'admin'
    mode = Column(String(20), nullable=True)  # 'vtu' or 'general'
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.user_id}, email={self.email}, role={self.role})>"
```

2. Create backend/app/models/student.py:
```python
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
from ..database import Base

class Student(Base):
    __tablename__ = "students"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    usn = Column(String(20), unique=True, nullable=False, index=True)
    semester = Column(Integer, nullable=False)
    branch = Column(String(10), nullable=False)
    section = Column(String(5), nullable=False)
    scheme = Column(String(10), default='22')
    selected_subjects = Column(JSONB, nullable=True)
    exam_timeline = Column(JSONB, nullable=True)
    daily_study_hours = Column(Integer, default=4)
    created_at = Column(DateTime, server_default=func.now())
    
    def __repr__(self):
        return f"<Student(usn={self.usn}, branch={self.branch})>"
```

3. Create backend/app/models/admin.py:
```python
from sqlalchemy import Column, String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
from ..database import Base

class Admin(Base):
    __tablename__ = "admins"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    employee_id = Column(String(20), unique=True, nullable=False, index=True)
    department = Column(String(50), nullable=True)
    assigned_subjects = Column(JSONB, nullable=True)
    assigned_sections = Column(JSONB, nullable=True)
    permissions = Column(JSONB, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    def __repr__(self):
        return f"<Admin(employee_id={self.employee_id})>"
```

4. Create backend/app/models/test.py:
```python
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
from ..database import Base

class Test(Base):
    __tablename__ = "tests"
    
    test_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    subject_code = Column(String(20), nullable=False)
    module_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    question_pool = Column(JSONB, nullable=False)
    questions_per_student = Column(Integer, default=10)
    time_limit_minutes = Column(Integer, nullable=False)
    marks_per_question = Column(Float, default=1.0)
    total_marks = Column(Float, nullable=True)
    due_date = Column(DateTime, nullable=False)
    assigned_branches = Column(JSONB, nullable=True)
    assigned_sections = Column(JSONB, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    allow_review = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Test(id={self.test_id}, title={self.title})>"

class TestSubmission(Base):
    __tablename__ = "test_submissions"
    
    submission_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    test_id = Column(UUID(as_uuid=True), ForeignKey("tests.test_id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_questions = Column(JSONB, nullable=False)
    student_answers = Column(JSONB, nullable=True)
    score = Column(Float, nullable=True)
    percentage = Column(Float, nullable=True)
    time_taken = Column(Integer, nullable=True)
    tab_switch_count = Column(Integer, default=0)
    copy_paste_attempts = Column(Integer, default=0)
    auto_submitted = Column(Boolean, default=False)
    flagged = Column(Boolean, default=False, index=True)
    flag_reason = Column(String(500), nullable=True)
    started_at = Column(DateTime, nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    graded_at = Column(DateTime, nullable=True)
    status = Column(String(20), default='pending', index=True)
    
    def __repr__(self):
        return f"<TestSubmission(id={self.submission_id}, status={self.status})>"
```

5. Create backend/app/models/learning_state.py:
```python
from sqlalchemy import Column, Float, Integer, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
from ..database import Base

class LearningState(Base):
    __tablename__ = "learning_states"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    topic_id = Column(UUID(as_uuid=True), primary_key=True)
    mastery_level = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.0)
    last_studied = Column(DateTime, nullable=True)
    study_count = Column(Integer, default=0)
    quiz_scores = Column(JSONB, nullable=True)
    forgetting_rate = Column(Float, default=0.3)
    next_revision_due = Column(DateTime, nullable=True)
    total_time_spent = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<LearningState(user={self.user_id}, topic={self.topic_id}, mastery={self.mastery_level})>"

class StudySession(Base):
    __tablename__ = "study_sessions"
    
    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(UUID(as_uuid=True), nullable=True)
    session_type = Column(String(50), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    completed = Column(Boolean, default=False)
    satisfaction_rating = Column(Integer, nullable=True)
    notes = Column(String(1000), nullable=True)
    started_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<StudySession(id={self.session_id}, type={self.session_type})>"
```

6. Create backend/app/models/__init__.py:
```python
from .user import User
from .student import Student
from .admin import Admin
from .test import Test, TestSubmission
from .learning_state import LearningState, StudySession

__all__ = [
    "User",
    "Student",
    "Admin",
    "Test",
    "TestSubmission",
    "LearningState",
    "StudySession",
]
```

VERIFY:
- All model files created ✓
- No import errors ✓
- SQLAlchemy relationships correct ✓

COMMIT:
git add backend/app/models/
git commit -m "feat: create SQLAlchemy ORM models for database tables"
```

**Deliverable:** ✅ All database models in GitHub  
**Completion Time:** 15 minutes

---

#### Task 1.0.4: Pydantic Schemas for Request/Response Validation
**Status:** ⏳ PENDING  
**Description:** Create Pydantic schemas for API validation

**Instructions:**
```
DO THIS:

1. Create backend/app/schemas/user.py:
```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=255)
    role: str = Field(..., pattern="^(student|admin)$")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)
    mode: Optional[str] = Field(None, pattern="^(vtu|general)$")

class UserUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    user_id: UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserProfileResponse(UserResponse):
    last_login: Optional[datetime] = None
```

2. Create backend/app/schemas/auth.py:
```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: str = Field(..., pattern="^(student|admin)$")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: UUID
    email: str
    role: str

class LoginResponse(BaseModel):
    message: str
    token: TokenResponse

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=1, max_length=255)
    role: str = Field(..., pattern="^(student|admin)$")
    mode: Optional[str] = Field(None, pattern="^(vtu|general)$")
    usn: Optional[str] = None  # For students
    employee_id: Optional[str] = None  # For admins

class RegisterResponse(BaseModel):
    message: str
    user_id: UUID
    email: str

class PasswordChangeRequest(BaseModel):
    old_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)
```

3. Create backend/app/schemas/test.py:
```python
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class QuestionBase(BaseModel):
    question_text: str
    options: List[str]
    correct_answer: int
    difficulty: str = Field(..., pattern="^(easy|medium|hard)$")

class TestCreate(BaseModel):
    subject_code: str
    module_number: int
    title: str
    description: Optional[str] = None
    question_pool: List[QuestionBase]
    questions_per_student: int = 10
    time_limit_minutes: int = Field(..., gt=0)
    marks_per_question: float = 1.0
    due_date: datetime
    assigned_branches: Optional[List[str]] = None
    assigned_sections: Optional[List[str]] = None

class TestResponse(BaseModel):
    test_id: UUID
    title: str
    subject_code: str
    module_number: int
    questions_per_student: int
    time_limit_minutes: int
    total_marks: float
    due_date: datetime
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TestStartResponse(BaseModel):
    test_id: UUID
    title: str
    questions: List[Dict[str, Any]]
    time_limit_minutes: int
    total_marks: float

class AnswerSubmission(BaseModel):
    question_id: str
    selected_option: int

class TestSubmitRequest(BaseModel):
    test_id: UUID
    answers: List[AnswerSubmission]
    time_taken: int

class TestResultResponse(BaseModel):
    submission_id: UUID
    test_id: UUID
    score: float
    percentage: float
    status: str
    submitted_at: datetime
```

4. Create backend/app/schemas/__init__.py:
```python
from .user import UserBase, UserCreate, UserUpdate, UserResponse, UserProfileResponse
from .auth import (
    LoginRequest, TokenResponse, LoginResponse,
    RegisterRequest, RegisterResponse,
    PasswordChangeRequest, ForgotPasswordRequest, ResetPasswordRequest
)
from .test import (
    QuestionBase, TestCreate, TestResponse,
    TestStartResponse, AnswerSubmission, TestSubmitRequest, TestResultResponse
)

__all__ = [
    # User schemas
    "UserBase", "UserCreate", "UserUpdate", "UserResponse", "UserProfileResponse",
    # Auth schemas
    "LoginRequest", "TokenResponse", "LoginResponse",
    "RegisterRequest", "RegisterResponse",
    "PasswordChangeRequest", "ForgotPasswordRequest", "ResetPasswordRequest",
    # Test schemas
    "QuestionBase", "TestCreate", "TestResponse",
    "TestStartResponse", "AnswerSubmission", "TestSubmitRequest", "TestResultResponse",
]
```

VERIFY:
- All schema files created ✓
- No validation errors ✓
- Pydantic imports working ✓

COMMIT:
git add backend/app/schemas/
git commit -m "feat: create Pydantic schemas for request/response validation"
```

**Deliverable:** ✅ All Pydantic schemas in GitHub  
**Completion Time:** 10 minutes

---

### Epic 1.1: Authentication System
**Status:** ⏳ PENDING  
**Priority:** 🔴 CRITICAL

#### Task 1.1.1: JWT Handler Utility
**Status:** ⏳ PENDING  
**Description:** Create JWT token generation and validation utility

**Instructions:**
```
DO THIS:

Create backend/app/utils/jwt_handler.py:
```python
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..config import settings
import logging

logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class JWTHandler:
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def create_access_token(
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.access_token_expire_minutes
            )
        
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.secret_key,
            algorithm=settings.algorithm
        )
        
        logger.info(f"Access token created for user: {data.get('sub')}")
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(
                token,
                settings.secret_key,
                algorithms=[settings.algorithm]
            )
            user_id: str = payload.get("sub")
            if user_id is None:
                logger.warning("Token missing 'sub' claim")
                return None
            return payload
        except JWTError as e:
            logger.error(f"JWT verification failed: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in token verification: {e}")
            return None

# Create singleton instance
jwt_handler = JWTHandler()
```

VERIFY:
- File created ✓
- JWT logic correct ✓
- Password hashing works ✓

COMMIT:
git add backend/app/utils/jwt_handler.py
git commit -m "feat: create JWT handler for token management"
```

**Deliverable:** ✅ JWT handler utility in GitHub  
**Completion Time:** 5 minutes

---

#### Task 1.1.2: Authentication Service Layer
**Status:** ⏳ PENDING  
**Description:** Create service layer for user registration, login, and token management

**Instructions:**
```
DO THIS:

Create backend/app/services/auth_service.py:
```python
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from uuid import UUID
from datetime import timedelta
from ..models.user import User
from ..models.student import Student
from ..models.admin import Admin
from ..schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from ..utils.jwt_handler import jwt_handler
from ..config import settings
import logging

logger = logging.getLogger(__name__)

class AuthService:
    @staticmethod
    def register_user(db: Session, data: RegisterRequest) -> dict:
        """Register new user (student or admin)"""
        try:
            # Check if email already exists
            existing_user = db.query(User).filter(User.email == data.email).first()
            if existing_user:
                logger.warning(f"Registration failed: Email {data.email} already exists")
                raise ValueError("Email already registered")
            
            # Create user
            hashed_password = jwt_handler.hash_password(data.password)
            user = User(
                email=data.email,
                password_hash=hashed_password,
                name=data.name,
                role=data.role,
                mode=data.mode,
            )
            
            db.add(user)
            db.flush()
            
            # Create role-specific record
            if data.role == "student":
                if not data.usn:
                    raise ValueError("USN required for student registration")
                student = Student(
                    user_id=user.user_id,
                    usn=data.usn,
                    semester=1,
                    branch="CSE",
                    section="A",
                )
                db.add(student)
            elif data.role == "admin":
                if not data.employee_id:
                    raise ValueError("Employee ID required for admin registration")
                admin = Admin(
                    user_id=user.user_id,
                    employee_id=data.employee_id,
                )
                db.add(admin)
            
            db.commit()
            logger.info(f"User registered successfully: {user.email} ({user.role})")
            
            return {
                "user_id": str(user.user_id),
                "email": user.email,
                "name": user.name,
                "role": user.role,
            }
        
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Database integrity error during registration: {e}")
            raise ValueError("Registration failed: Data conflict")
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error during registration: {e}")
            raise
    
    @staticmethod
    def login(db: Session, data: LoginRequest) -> dict:
        """Authenticate user and generate token"""
        try:
            # Find user by email and role
            user = db.query(User).filter(
                User.email == data.email,
                User.role == data.role
            ).first()
            
            if not user:
                logger.warning(f"Login failed: User not found - {data.email}")
                raise ValueError("Invalid email or password")
            
            if not user.is_active:
                logger.warning(f"Login failed: User inactive - {data.email}")
                raise ValueError("User account is inactive")
            
            # Verify password
            if not jwt_handler.verify_password(data.password, user.password_hash):
                logger.warning(f"Login failed: Invalid password - {data.email}")
                raise ValueError("Invalid email or password")
            
            # Create token
            access_token = jwt_handler.create_access_token(
                data={"sub": str(user.user_id), "role": user.role}
            )
            
            # Update last login
            user.last_login = datetime.utcnow()
            db.commit()
            
            logger.info(f"User logged in successfully: {user.email}")
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user_id": str(user.user_id),
                "email": user.email,
                "role": user.role,
            }
        
        except ValueError as e:
            logger.warning(f"Login error: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error during login: {e}")
            raise ValueError("Login failed")
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: UUID) -> User:
        """Get user by ID"""
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            logger.warning(f"User not found: {user_id}")
            raise ValueError("User not found")
        return user
    
    @staticmethod
    def verify_access_token(token: str) -> dict:
        """Verify access token and extract claims"""
        payload = jwt_handler.verify_token(token)
        if not payload:
            raise ValueError("Invalid token")
        return payload

from datetime import datetime
```

VERIFY:
- File created ✓
- All methods implemented ✓
- Error handling complete ✓

COMMIT:
git add backend/app/services/auth_service.py
git commit -m "feat: create authentication service layer"
```

**Deliverable:** ✅ Auth service in GitHub  
**Completion Time:** 10 minutes

---

#### Task 1.1.3: Authentication Routes/Endpoints
**Status:** ⏳ PENDING  
**Description:** Create authentication API endpoints

**Instructions:**
```
DO THIS:

Create backend/app/routers/auth.py:
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.auth import (
    RegisterRequest, RegisterResponse,
    LoginRequest, LoginResponse,
    TokenResponse
)
from ..services.auth_service import AuthService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user"
)
async def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Register a new user (student or admin)
    
    - **email**: User email (unique)
    - **password**: At least 8 characters
    - **name**: Full name
    - **role**: 'student' or 'admin'
    - **usn**: USN required for students
    - **employee_id**: Employee ID required for admins
    """
    try:
        user_data = AuthService.register_user(db, data)
        return RegisterResponse(
            message="User registered successfully",
            user_id=user_data["user_id"],
            email=user_data["email"]
        )
    except ValueError as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected registration error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Login user and get access token"
)
async def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate user and generate JWT access token
    
    - **email**: User email
    - **password**: User password
    - **role**: 'student' or 'admin'
    """
    try:
        token_data = AuthService.login(db, data)
        return LoginResponse(
            message="Login successful",
            token=TokenResponse(**token_data)
        )
    except ValueError as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception as e:
        logger.error(f"Unexpected login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.post(
    "/logout",
    summary="Logout user"
)
async def logout():
    """
    Logout user (client should discard token)
    """
    return {"message": "Logged out successfully"}

@router.get(
    "/profile",
    summary="Get current user profile"
)
async def get_profile(
    db: Session = Depends(get_db),
    authorization: str = None
):
    """
    Get authenticated user's profile
    Requires Bearer token in Authorization header
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    try:
        token = authorization.replace("Bearer ", "")
        payload = AuthService.verify_access_token(token)
        user = AuthService.get_user_by_id(db, payload["sub"])
        
        return {
            "user_id": str(user.user_id),
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Profile retrieval error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profile"
        )
```

Update backend/app/main.py to include router:
```python
# Add these imports at the top of main.py
from .routers import auth

# In the create_app() function, after app creation, add:
    app.include_router(auth.router)

# Updated main.py snippet:
def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.version,
        debug=settings.debug,
    )
    
    # Include routers
    from .routers import auth
    app.include_router(auth.router)
    
    # ... rest of code
```

Create backend/app/routers/__init__.py:
```python
# Empty file
```

VERIFY:
- Router file created ✓
- Endpoints defined ✓
- Router included in main.py ✓

COMMIT:
git add backend/app/routers/
git commit -m "feat: create authentication API endpoints"
```

**Deliverable:** ✅ Auth endpoints in GitHub  
**Completion Time:** 10 minutes

---

#### Task 1.1.4: Test Authentication Endpoints
**Status:** ⏳ PENDING  
**Description:** Create pytest tests for authentication

**Instructions:**
```
DO THIS:

Create backend/tests/conftest.py:
```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from ..app.database import Base
from ..app.main import create_app
from ..app.config import settings

# Use in-memory SQLite for testing
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app = create_app()
from ..app.database import get_db
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    yield TestingSessionLocal()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client():
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    Base.metadata.drop_all(bind=engine)
```

Create backend/tests/test_auth.py:
```python
import pytest
from fastapi import status

def test_register_student(client):
    """Test student registration"""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "student@example.com",
            "password": "password123",
            "name": "Test Student",
            "role": "student",
            "mode": "vtu",
            "usn": "1234567890"
        }
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == "student@example.com"
    assert "user_id" in data

def test_register_duplicate_email(client):
    """Test duplicate email registration fails"""
    # Register first user
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "student@example.com",
            "password": "password123",
            "name": "Test Student",
            "role": "student",
            "usn": "1234567890"
        }
    )
    
    # Try to register same email
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "student@example.com",
            "password": "password456",
            "name": "Another Student",
            "role": "student",
            "usn": "9876543210"
        }
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_login_student(client):
    """Test student login"""
    # Register student
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "student@example.com",
            "password": "password123",
            "name": "Test Student",
            "role": "student",
            "usn": "1234567890"
        }
    )
    
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "student@example.com",
            "password": "password123",
            "role": "student"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["token"]["access_token"]
    assert data["token"]["token_type"] == "bearer"

def test_login_invalid_password(client):
    """Test login with invalid password"""
    # Register student
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "student@example.com",
            "password": "password123",
            "name": "Test Student",
            "role": "student",
            "usn": "1234567890"
        }
    )
    
    # Login with wrong password
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "student@example.com",
            "password": "wrongpassword",
            "role": "student"
        }
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_logout(client):
    """Test logout"""
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "Logged out successfully"
```

VERIFY:
- Test files created ✓
- Tests cover main scenarios ✓

COMMIT:
git add backend/tests/
git commit -m "test: add authentication endpoint tests"
```

**Deliverable:** ✅ Authentication tests in GitHub  
**Completion Time:** 10 minutes

---

### Epic 1.2: Frontend Infrastructure Setup
**Status:** ⏳ PENDING  
**Priority:** 🔴 CRITICAL

#### Task 1.2.1: Next.js Frontend Project Setup
**Status:** ⏳ PENDING  
**Description:** Initialize Next.js 15 project with TypeScript and shadcn/ui

**Instructions:**
```
DO THIS:

1. Navigate to frontend folder

2. Create package.json:
```json
{
  "name": "adaptive-learning-platform-frontend",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "^15.0.0",
    "typescript": "^5.3.3",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-slot": "^2.0.2",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.1",
    "tailwindcss": "^3.4.1",
    "zustand": "^4.4.1",
    "axios": "^1.6.2",
    "next-auth": "^5.0.0-beta.18",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.292.0",
    "recharts": "^2.10.0",
    "@hookform/resolvers": "^3.3.4",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "^15.0.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.1"
  }
}
```

3. Create tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

4. Create next.config.js:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Forwarded-Host, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

5. Create tailwind.config.js:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

6. Create postcss.config.js:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

7. Create .env.local.example:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
```

8. Create app/globals.css:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  @apply box-border;
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-background text-foreground;
}
```

9. Create app/layout.tsx:
```typescript
import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Adaptive Learning Platform',
  description: 'AI-powered learning platform for VTU students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

10. Create app/page.tsx:
```typescript
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Adaptive Learning Platform</h1>
        <p className="text-xl text-gray-600 mb-8">AI-powered learning for VTU students</p>
        <div className="space-x-4">
          <a
            href="/auth/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Login
          </a>
          <a
            href="/auth/register"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Register
          </a>
        </div>
      </div>
    </main>
  )
}
```

11. Create components/providers.tsx:
```typescript
'use client'

import React from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
```

VERIFY:
- All files created ✓
- package.json has all deps ✓
- TypeScript config correct ✓

COMMIT:
git add frontend/
git commit -m "chore: setup Next.js 15 frontend with TypeScript and Tailwind"
```

**Deliverable:** ✅ Next.js project initialized in GitHub  
**Completion Time:** 15 minutes

---

#### Task 1.2.2: Frontend Authentication Pages (Login & Register)
**Status:** ⏳ PENDING  
**Description:** Create login and registration pages with forms

**Instructions:**
```
DO THIS:

1. Create app/auth/layout.tsx:
```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
```

2. Create app/auth/register/page.tsx:
```typescript
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student',
    usn: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
        formData
      )
      
      // Show success message
      alert('Registration successful! Please login.')
      router.push('/auth/login')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Register</h1>
      <p className="text-gray-600 mb-6">Create your learning account</p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Student</option>
            <option value="admin">Teacher/Admin</option>
          </select>
        </div>

        {formData.role === 'student' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              USN
            </label>
            <input
              type="text"
              name="usn"
              value={formData.usn}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234567890"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="At least 8 characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  )
}
```

3. Create app/auth/login/page.tsx:
```typescript
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        formData
      )
      
      // Store token in localStorage
      const token = response.data.token.access_token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(response.data.token))
      
      // Redirect to dashboard
      router.push(formData.role === 'student' ? '/dashboard' : '/admin/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Login</h1>
      <p className="text-gray-600 mb-6">Welcome back to Adaptive Learning Platform</p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Student</option>
            <option value="admin">Teacher/Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  )
}
```

VERIFY:
- Login page created ✓
- Register page created ✓
- Form validation works ✓

COMMIT:
git add frontend/app/auth/
git commit -m "feat: create authentication pages (login & register)"
```

**Deliverable:** ✅ Authentication pages in GitHub  
**Completion Time:** 15 minutes

---

## ✅ COMPLETION CHECKLIST

After completing each task, mark it as ✅ and move to next:

### Epic 1.0: Project Infrastructure
- [ ] 1.0.1: Backend Project Structure Setup ✅/⏳
- [ ] 1.0.2: FastAPI App Initialization ✅/⏳
- [ ] 1.0.3: Database Models (SQLAlchemy) ✅/⏳
- [ ] 1.0.4: Pydantic Schemas ✅/⏳

### Epic 1.1: Authentication System
- [ ] 1.1.1: JWT Handler Utility ✅/⏳
- [ ] 1.1.2: Authentication Service Layer ✅/⏳
- [ ] 1.1.3: Authentication Routes/Endpoints ✅/⏳
- [ ] 1.1.4: Test Authentication Endpoints ✅/⏳

### Epic 1.2: Frontend Infrastructure
- [ ] 1.2.1: Next.js Frontend Project Setup ✅/⏳
- [ ] 1.2.2: Frontend Authentication Pages ✅/⏳

---

## 📊 SUMMARY

**Total Tasks Phase 1 (Week 1-2):** 10 tasks
**Estimated Time:** 90-120 minutes
**Output:** 
- ✅ Working FastAPI backend with JWT auth
- ✅ Working Next.js frontend with login/register
- ✅ 14 files created
- ✅ All committed to GitHub

**Next Phase:** Dashboard, Learning State Tracker, Quiz System

---

## 🚨 IMPORTANT REMINDERS FOR AI

1. **Complete each task 100%** before moving to next
2. **Test code** - run it locally before committing
3. **Commit after each major task** with clear messages
4. **Ask user** if anything is unclear
5. **Do NOT skip** any steps
6. **Verify all files** exist in GitHub after each task
7. **Follow the exact code** provided - do not deviate
8. **Update this checklist** as you progress

---

**GENERATED:** 2026-05-27  
**PHASE:** 1 Foundation (Weeks 1-4)  
**VERSION:** 2.0  
**STATUS:** Ready for AI Execution
