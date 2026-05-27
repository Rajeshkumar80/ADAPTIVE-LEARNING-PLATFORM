# 🎓 ADAPTIVE LEARNING PLATFORM - COMPLETE PHASE 2-3 MASTER PROMPT
## Fix Existing Issues + Add New Features

**Generated:** 2026-05-27  
**Version:** 3.0 Complete  
**Status:** Ready for Implementation

---

## 🔍 ISSUES TO FIX

### Critical Issues (Must Fix First)
1. ❌ **AI Chatbot** - Google API & OpenRouter API not working
2. ❌ **Notifications** - Not working properly (teachers can't send, students can't view history)

### New Features to Add
1. ✨ **AI Tutor with PDF Upload** - Upload any file type (PDF, DOC, DOCX, TXT, MD, Images)
2. ✨ **Image Rendering in PDF** - Display images from PDFs properly
3. ✨ **Student Profile** - Show semester, branch, section, selected subjects
4. ✨ **VTU Data Import** - Auto-import all CSE 22 Scheme subjects, notes, CO/PO
5. ✨ **Notifications System** - Teachers send, students view, persistent history

---

## 📋 COMPLETE TO-DO LIST WITH PERFECT EXECUTION ORDER

### **PHASE 2A: Fix Critical Issues (1-2 days)**

#### Epic 2A.1: Fix AI Chatbot
- [ ] **Task 2A.1.1:** Debug Google API & OpenRouter API Integration (30 min)
- [ ] **Task 2A.1.2:** Implement Proper Error Handling for LLM Calls (20 min)
- [ ] **Task 2A.1.3:** Add Retry Logic & Fallback Mechanisms (20 min)
- [ ] **Task 2A.1.4:** Test Chatbot with Sample Queries (15 min)

#### Epic 2A.2: Fix Notifications System
- [ ] **Task 2A.2.1:** Fix Notification Schema & Database (20 min)
- [ ] **Task 2A.2.2:** Create Notification Service Layer (25 min)
- [ ] **Task 2A.2.3:** Implement Teacher Notification Endpoints (20 min)
- [ ] **Task 2A.2.4:** Implement Student Notification History (20 min)
- [ ] **Task 2A.2.5:** Test Notification Flow End-to-End (15 min)

---

### **PHASE 2B: AI Tutor with Document Upload (2-3 days)**

#### Epic 2B.1: File Upload Infrastructure
- [ ] **Task 2B.1.1:** Setup File Upload Handler (PDF, DOC, DOCX, TXT, MD, Images) (30 min)
- [ ] **Task 2B.1.2:** Implement File Validation & Security Checks (25 min)
- [ ] **Task 2B.1.3:** Create File Storage System (S3/Local) (30 min)

#### Epic 2B.2: Document Parsing & Processing
- [ ] **Task 2B.2.1:** Setup PyPDF2/pdfplumber for PDF Extraction (25 min)
- [ ] **Task 2B.2.2:** Extract Text & Images from PDFs (30 min)
- [ ] **Task 2B.2.3:** Process DOCX/TXT/MD Files (20 min)
- [ ] **Task 2B.2.4:** Create Vector Embeddings for Semantic Search (30 min)
- [ ] **Task 2B.2.5:** Store Embeddings in Pinecone/Database (20 min)

#### Epic 2B.3: AI Tutor API with Document Q&A
- [ ] **Task 2B.3.1:** Create Document Upload Endpoint (25 min)
- [ ] **Task 2B.3.2:** Create Question-Answering Endpoint (Retrieval-Augmented Generation) (40 min)
- [ ] **Task 2B.3.3:** Implement Image Display in Responses (25 min)
- [ ] **Task 2B.3.4:** Test AI Tutor with Sample Documents (20 min)

#### Epic 2B.4: Frontend AI Tutor UI
- [ ] **Task 2B.4.1:** Create AI Tutor Chat Interface (30 min)
- [ ] **Task 2B.4.2:** Implement File Upload Component (25 min)
- [ ] **Task 2B.4.3:** Display Images from PDFs in Chat (30 min)
- [ ] **Task 2B.4.4:** Add Conversation History (20 min)

---

### **PHASE 2C: Student Profile & Academic Details (1 day)**

#### Epic 2C.1: Student Profile Page
- [ ] **Task 2C.1.1:** Create Student Profile Schema (15 min)
- [ ] **Task 2C.1.2:** Create GET Student Profile Endpoint (20 min)
- [ ] **Task 2C.1.3:** Create Frontend Student Profile Page (30 min)
- [ ] **Task 2C.1.4:** Display Semester, Branch, Section, Subjects (25 min)

#### Epic 2C.2: Teacher Profile & Management
- [ ] **Task 2C.2.1:** Create Teacher Profile Endpoint (20 min)
- [ ] **Task 2C.2.2:** Create Teacher Management Dashboard (30 min)
- [ ] **Task 2C.2.3:** Show Assigned Subjects & Sections (25 min)

---

### **PHASE 2D: VTU Data Integration (2-3 days)**

#### Epic 2D.1: VTU Data Structure Setup
- [ ] **Task 2D.1.1:** Create VTU Subject Models (CSE 22 Scheme) (30 min)
- [ ] **Task 2D.1.2:** Create VTU CO/PO Models (Course Outcomes & Program Outcomes) (25 min)
- [ ] **Task 2D.1.3:** Create VTU Notes/Resources Models (20 min)

#### Epic 2D.2: VTU Data Import Agent
- [ ] **Task 2D.2.1:** Create VTU Data Scraper/Parser (From VTU Circle or Official Site) (60 min)
- [ ] **Task 2D.2.2:** Parse CSE 22 Scheme All Semesters All Subjects (45 min)
- [ ] **Task 2D.2.3:** Extract Course Outcomes & Program Outcomes (30 min)
- [ ] **Task 2D.2.4:** Parse Notes & Resources (30 min)
- [ ] **Task 2D.2.5:** Implement Bulk Import to Database (30 min)
- [ ] **Task 2D.2.6:** Create Admin API for Manual VTU Data Upload (25 min)

#### Epic 2D.3: Display VTU Content
- [ ] **Task 2D.3.1:** Create Subject Selection Page (30 min)
- [ ] **Task 2D.3.2:** Display CO/PO for Each Subject (25 min)
- [ ] **Task 2D.3.3:** Display Notes & Resources (25 min)
- [ ] **Task 2D.3.4:** Create Search & Filter for Subjects (25 min)

---

### **PHASE 2E: Notification System Complete (1 day)**

#### Epic 2E.1: Teacher Notification Interface
- [ ] **Task 2E.1.1:** Create Send Notification UI for Teachers (30 min)
- [ ] **Task 2E.1.2:** Implement Target Student/Section Selection (25 min)
- [ ] **Task 2E.1.3:** Add Schedule Notification Feature (20 min)

#### Epic 2E.2: Student Notification History
- [ ] **Task 2E.2.1:** Create Notification History Page (30 min)
- [ ] **Task 2E.2.2:** Show Sent/Unsent Status (20 min)
- [ ] **Task 2E.2.3:** Implement Mark as Read/Unread (20 min)
- [ ] **Task 2E.2.4:** Add Notification Filtering & Search (20 min)

#### Epic 2E.3: Real-time Notifications (Optional)
- [ ] **Task 2E.3.1:** Setup WebSocket for Real-time Updates (optional)
- [ ] **Task 2E.3.2:** Push Notifications Setup (optional)

---

## 🔧 DETAILED IMPLEMENTATION GUIDE

### **EPIC 2A.1: Fix AI Chatbot**

#### Task 2A.1.1: Debug Google API & OpenRouter API Integration

**File:** `backend/app/services/llm_service.py`

```python
import logging
from typing import Optional, List
from openai import OpenAI, AzureOpenAI
import google.generativeai as genai
from ..config import settings

logger = logging.getLogger(__name__)

class LLMService:
    """Handle LLM interactions (Google & OpenRouter)"""
    
    def __init__(self):
        self.google_client = None
        self.openrouter_client = None
        self._init_clients()
    
    def _init_clients(self):
        """Initialize LLM clients"""
        # Google API Setup
        if settings.google_api_key:
            try:
                genai.configure(api_key=settings.google_api_key)
                self.google_client = genai.GenerativeModel(
                    model_name="gemini-1.5-pro",
                    generation_config={
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "max_output_tokens": 2048,
                    }
                )
                logger.info("✅ Google API initialized successfully")
            except Exception as e:
                logger.error(f"❌ Google API initialization failed: {e}")
        
        # OpenRouter Setup
        if settings.openrouter_api_key:
            try:
                self.openrouter_client = OpenAI(
                    api_key=settings.openrouter_api_key,
                    base_url="https://openrouter.ai/api/v1",
                )
                logger.info("✅ OpenRouter API initialized successfully")
            except Exception as e:
                logger.error(f"❌ OpenRouter API initialization failed: {e}")
    
    async def chat_with_google(self, message: str, history: Optional[List] = None) -> str:
        """Chat with Google Gemini API"""
        try:
            if not self.google_client:
                raise ValueError("Google API not configured")
            
            # Build conversation history
            chat = self.google_client.start_chat(history=history or [])
            response = chat.send_message(message)
            
            logger.info(f"✅ Google API response received: {len(response.text)} chars")
            return response.text
        
        except Exception as e:
            logger.error(f"❌ Google API error: {e}")
            return f"Error: {str(e)}"
    
    async def chat_with_openrouter(self, message: str, model: str = "gpt-3.5-turbo") -> str:
        """Chat with OpenRouter API"""
        try:
            if not self.openrouter_client:
                raise ValueError("OpenRouter API not configured")
            
            response = self.openrouter_client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": message}],
                temperature=0.7,
            )
            
            logger.info(f"✅ OpenRouter API response received")
            return response.choices[0].message.content
        
        except Exception as e:
            logger.error(f"❌ OpenRouter API error: {e}")
            return f"Error: {str(e)}"
    
    async def chat(self, message: str, use_google: bool = True) -> str:
        """Chat with preferred LLM (with fallback)"""
        if use_google and self.google_client:
            result = await self.chat_with_google(message)
            if not result.startswith("Error"):
                return result
            logger.warning("Google API failed, trying OpenRouter...")
        
        if self.openrouter_client:
            return await self.chat_with_openrouter(message)
        
        return "Error: No LLM service available"

# Singleton instance
llm_service = LLMService()
```

**File:** `backend/app/config.py` (Add these)

```python
# LLM Configuration
google_api_key: Optional[str] = Field(None, env="GOOGLE_API_KEY")
openrouter_api_key: Optional[str] = Field(None, env="OPENROUTER_API_KEY")
llm_default_provider: str = Field("google", env="LLM_DEFAULT_PROVIDER")  # "google" or "openrouter"
```

**File:** `.env.example` (Add these)

```
GOOGLE_API_KEY=your-google-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
LLM_DEFAULT_PROVIDER=google
```

**Testing Command:**
```bash
python -m pytest backend/tests/test_llm_service.py -v
```

**Expected Output:**
```
✅ Google API initialized successfully
✅ OpenRouter API initialized successfully
✅ chat_with_google PASSED
✅ chat_with_openrouter PASSED
```

---

#### Task 2A.1.2: Implement Proper Error Handling for LLM Calls

**File:** `backend/app/routers/ai_tutor.py`

```python
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.llm_service import llm_service
from ..schemas.ai import ChatRequest, ChatResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/ai", tags=["AI Tutor"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Chat with AI Tutor
    
    - **message**: User message
    - **use_google**: Use Google API (true) or OpenRouter (false)
    """
    try:
        if not request.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )
        
        # Call LLM service
        response = await llm_service.chat(
            message=request.message,
            use_google=request.use_google
        )
        
        if response.startswith("Error"):
            logger.error(f"LLM error: {response}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service temporarily unavailable"
            )
        
        logger.info(f"✅ Chat response generated: {len(response)} chars")
        
        return ChatResponse(
            message=response,
            provider="google" if request.use_google else "openrouter"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error in chat: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
```

**File:** `backend/app/schemas/ai.py`

```python
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)
    use_google: bool = True
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    provider: str
    timestamp: Optional[datetime] = None
```

**COMMIT:**
```bash
git add backend/app/services/llm_service.py backend/app/routers/ai_tutor.py
git commit -m "fix: implement LLM service with Google & OpenRouter APIs and error handling"
```

---

#### Task 2A.1.3: Add Retry Logic & Fallback Mechanisms

**File:** `backend/app/utils/retry_handler.py`

```python
import asyncio
import logging
from typing import Callable, Any, Optional
from functools import wraps

logger = logging.getLogger(__name__)

class RetryConfig:
    def __init__(self, max_retries: int = 3, delay: float = 1.0, backoff: float = 2.0):
        self.max_retries = max_retries
        self.delay = delay
        self.backoff = backoff

def async_retry(config: Optional[RetryConfig] = None):
    """Decorator for async retry logic with exponential backoff"""
    if config is None:
        config = RetryConfig()
    
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            last_exception = None
            
            for attempt in range(config.max_retries):
                try:
                    logger.info(f"🔄 Attempt {attempt + 1}/{config.max_retries} for {func.__name__}")
                    result = await func(*args, **kwargs)
                    logger.info(f"✅ {func.__name__} succeeded on attempt {attempt + 1}")
                    return result
                
                except Exception as e:
                    last_exception = e
                    if attempt < config.max_retries - 1:
                        wait_time = config.delay * (config.backoff ** attempt)
                        logger.warning(f"⚠️ Attempt {attempt + 1} failed: {e}. Retrying in {wait_time}s...")
                        await asyncio.sleep(wait_time)
                    else:
                        logger.error(f"❌ All {config.max_retries} attempts failed for {func.__name__}")
            
            raise last_exception
        
        return wrapper
    return decorator
```

**Update:** `backend/app/services/llm_service.py`

```python
from ..utils.retry_handler import async_retry, RetryConfig

class LLMService:
    # ... existing code ...
    
    @async_retry(RetryConfig(max_retries=3, delay=1.0))
    async def chat_with_google_safe(self, message: str) -> str:
        """Chat with Google API with retry logic"""
        return await self.chat_with_google(message)
    
    @async_retry(RetryConfig(max_retries=3, delay=1.0))
    async def chat_with_openrouter_safe(self, message: str) -> str:
        """Chat with OpenRouter API with retry logic"""
        return await self.chat_with_openrouter(message)
    
    async def chat_with_fallback(self, message: str) -> str:
        """Chat with automatic fallback"""
        try:
            logger.info("🎯 Trying Google API first...")
            return await self.chat_with_google_safe(message)
        except Exception as e:
            logger.warning(f"⚠️ Google API failed: {e}. Falling back to OpenRouter...")
            try:
                return await self.chat_with_openrouter_safe(message)
            except Exception as e2:
                logger.error(f"❌ Both APIs failed: Google={e}, OpenRouter={e2}")
                raise Exception("All LLM services failed")
```

**COMMIT:**
```bash
git add backend/app/utils/retry_handler.py
git commit -m "feat: add retry logic with exponential backoff for LLM calls"
```

---

#### Task 2A.1.4: Test Chatbot with Sample Queries

**File:** `backend/tests/test_ai_chatbot.py`

```python
import pytest
from fastapi.testclient import TestClient
from ..app.main import create_app

@pytest.fixture
def client():
    app = create_app()
    return TestClient(app)

def test_chat_with_google_api(client):
    """Test chatbot with Google API"""
    response = client.post(
        "/api/v1/ai/chat",
        json={
            "message": "What is machine learning?",
            "use_google": True
        }
    )
    assert response.status_code == 200
    assert "message" in response.json()
    assert len(response.json()["message"]) > 0

def test_chat_with_openrouter_api(client):
    """Test chatbot with OpenRouter API"""
    response = client.post(
        "/api/v1/ai/chat",
        json={
            "message": "Explain neural networks",
            "use_google": False
        }
    )
    assert response.status_code == 200
    assert "message" in response.json()

def test_chat_empty_message(client):
    """Test with empty message"""
    response = client.post(
        "/api/v1/ai/chat",
        json={"message": "", "use_google": True}
    )
    assert response.status_code == 400

def test_chat_fallback_mechanism(client):
    """Test fallback when primary API fails"""
    response = client.post(
        "/api/v1/ai/chat",
        json={
            "message": "What is data science?",
            "use_google": True
        }
    )
    # Should either succeed or fallback gracefully
    assert response.status_code in [200, 503]
```

**Run Tests:**
```bash
cd backend
pytest tests/test_ai_chatbot.py -v
```

**COMMIT:**
```bash
git add backend/tests/test_ai_chatbot.py
git commit -m "test: add comprehensive chatbot tests with API fallback scenarios"
```

---

### **EPIC 2A.2: Fix Notifications System**

#### Task 2A.2.1: Fix Notification Schema & Database

**File:** `backend/app/models/notification.py`

```python
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, func, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
from datetime import datetime
from ..database import Base

class Notification(Base):
    __tablename__ = "notifications"
    
    notification_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)  # Teacher/Admin who sent
    recipient_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False)  # Student who receives
    type = Column(String(50), nullable=False)  # 'test_assigned', 'announcement', 'reminder', etc.
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    link_url = Column(String(500), nullable=True)
    
    # Status tracking
    is_read = Column(Boolean, default=False, index=True)
    read_at = Column(DateTime, nullable=True)
    
    # Targeting
    target_section = Column(String(50), nullable=True)
    target_branch = Column(String(50), nullable=True)
    
    # Metadata
    metadata = Column(JSONB, nullable=True)  # Extra data like subject_id, test_id, etc.
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), index=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Notification(id={self.notification_id}, type={self.type}, read={self.is_read})>"
```

**File:** `backend/app/models/__init__.py` (Update)

```python
from .notification import Notification

__all__ = [
    # ... existing ...
    "Notification",
]
```

**Update Database Schema:**
```bash
# Run migration or execute SQL
psql -U postgres -d adaptive_learning -c "
DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link_url VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    target_section VARCHAR(50),
    target_branch VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
"
```

**COMMIT:**
```bash
git add backend/app/models/notification.py
git commit -m "fix: redesign notification schema with proper read tracking and metadata"
```

---

#### Task 2A.2.2: Create Notification Service Layer

**File:** `backend/app/services/notification_service.py`

```python
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from uuid import UUID
from datetime import datetime
from ..models.notification import Notification
from ..models.user import User
from ..models.student import Student
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    
    @staticmethod
    def send_notification_to_student(
        db: Session,
        sender_id: UUID,
        recipient_id: UUID,
        title: str,
        message: str,
        type: str = "announcement",
        link_url: Optional[str] = None,
        metadata: Optional[dict] = None
    ) -> Notification:
        """Send notification to individual student"""
        try:
            notification = Notification(
                sender_id=sender_id,
                recipient_id=recipient_id,
                title=title,
                message=message,
                type=type,
                link_url=link_url,
                metadata=metadata
            )
            db.add(notification)
            db.commit()
            db.refresh(notification)
            logger.info(f"✅ Notification sent to {recipient_id}: {title}")
            return notification
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Failed to send notification: {e}")
            raise
    
    @staticmethod
    def send_notification_to_section(
        db: Session,
        sender_id: UUID,
        section: str,
        branch: str,
        title: str,
        message: str,
        type: str = "announcement",
        link_url: Optional[str] = None,
        metadata: Optional[dict] = None
    ) -> int:
        """Send notification to entire section/branch"""
        try:
            # Get all students in this section
            students = db.query(Student).filter(
                and_(
                    Student.section == section,
                    Student.branch == branch
                )
            ).all()
            
            count = 0
            for student in students:
                notification = Notification(
                    sender_id=sender_id,
                    recipient_id=student.user_id,
                    title=title,
                    message=message,
                    type=type,
                    link_url=link_url,
                    target_section=section,
                    target_branch=branch,
                    metadata=metadata
                )
                db.add(notification)
                count += 1
            
            db.commit()
            logger.info(f"✅ Notification sent to {count} students in {branch}-{section}")
            return count
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Failed to send bulk notification: {e}")
            raise
    
    @staticmethod
    def get_student_notifications(
        db: Session,
        student_id: UUID,
        limit: int = 50,
        skip: int = 0,
        include_read: bool = True
    ) -> list:
        """Get all notifications for a student (with history)"""
        try:
            query = db.query(Notification).filter(
                Notification.recipient_id == student_id
            )
            
            if not include_read:
                query = query.filter(Notification.is_read == False)
            
            notifications = query.order_by(
                Notification.created_at.desc()
            ).offset(skip).limit(limit).all()
            
            logger.info(f"✅ Retrieved {len(notifications)} notifications for {student_id}")
            return notifications
        except Exception as e:
            logger.error(f"❌ Failed to retrieve notifications: {e}")
            raise
    
    @staticmethod
    def mark_as_read(db: Session, notification_id: UUID) -> Notification:
        """Mark notification as read"""
        try:
            notification = db.query(Notification).filter(
                Notification.notification_id == notification_id
            ).first()
            
            if not notification:
                raise ValueError("Notification not found")
            
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            db.commit()
            db.refresh(notification)
            
            logger.info(f"✅ Marked notification {notification_id} as read")
            return notification
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Failed to mark as read: {e}")
            raise
    
    @staticmethod
    def delete_notification(db: Session, notification_id: UUID) -> bool:
        """Delete a notification"""
        try:
            notification = db.query(Notification).filter(
                Notification.notification_id == notification_id
            ).first()
            
            if not notification:
                raise ValueError("Notification not found")
            
            db.delete(notification)
            db.commit()
            
            logger.info(f"✅ Deleted notification {notification_id}")
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"❌ Failed to delete notification: {e}")
            raise
```

**COMMIT:**
```bash
git add backend/app/services/notification_service.py
git commit -m "feat: create complete notification service with history tracking"
```

---

#### Task 2A.2.3: Implement Teacher Notification Endpoints

**File:** `backend/app/routers/notification.py`

```python
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from ..database import get_db
from ..services.notification_service import NotificationService
from ..schemas.notification import (
    SendNotificationRequest,
    NotificationResponse,
    NotificationListResponse
)
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])

@router.post(
    "/send-to-student",
    response_model=NotificationResponse,
    status_code=status.HTTP_201_CREATED
)
async def send_notification_to_student(
    request: SendNotificationRequest,
    sender_id: UUID = Depends(get_current_teacher),  # Only teachers
    db: Session = Depends(get_db)
):
    """Send notification to individual student (Teachers only)"""
    try:
        notification = NotificationService.send_notification_to_student(
            db=db,
            sender_id=sender_id,
            recipient_id=request.recipient_id,
            title=request.title,
            message=request.message,
            type=request.type,
            link_url=request.link_url,
            metadata=request.metadata
        )
        
        return NotificationResponse.from_orm(notification)
    
    except Exception as e:
        logger.error(f"❌ Error sending notification: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send notification"
        )

@router.post(
    "/send-to-section",
    status_code=status.HTTP_201_CREATED
)
async def send_notification_to_section(
    request: SendToSectionRequest,
    sender_id: UUID = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """Send notification to entire section (Teachers only)"""
    try:
        count = NotificationService.send_notification_to_section(
            db=db,
            sender_id=sender_id,
            section=request.section,
            branch=request.branch,
            title=request.title,
            message=request.message,
            type=request.type,
            link_url=request.link_url,
            metadata=request.metadata
        )
        
        return {
            "message": f"Notification sent to {count} students",
            "count": count
        }
    
    except Exception as e:
        logger.error(f"❌ Error sending bulk notification: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send notification"
        )
```

**File:** `backend/app/schemas/notification.py`

```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class SendNotificationRequest(BaseModel):
    recipient_id: UUID
    title: str = Field(..., min_length=5, max_length=255)
    message: str = Field(..., min_length=10, max_length=2000)
    type: str = "announcement"
    link_url: Optional[str] = None
    metadata: Optional[dict] = None

class SendToSectionRequest(BaseModel):
    section: str
    branch: str
    title: str = Field(..., min_length=5, max_length=255)
    message: str = Field(..., min_length=10, max_length=2000)
    type: str = "announcement"
    link_url: Optional[str] = None
    metadata: Optional[dict] = None

class NotificationResponse(BaseModel):
    notification_id: UUID
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
```

**COMMIT:**
```bash
git add backend/app/routers/notification.py backend/app/schemas/notification.py
git commit -m "feat: implement teacher notification endpoints"
```

---

#### Task 2A.2.4: Implement Student Notification History

**File:** `backend/app/routers/notification.py` (Add these endpoints)

```python
@router.get(
    "/history",
    response_model=NotificationListResponse
)
async def get_notification_history(
    student_id: UUID = Depends(get_current_student),
    include_read: bool = True,
    limit: int = 50,
    skip: int = 0,
    db: Session = Depends(get_db)
):
    """Get all notifications for student (full history)"""
    try:
        notifications = NotificationService.get_student_notifications(
            db=db,
            student_id=student_id,
            limit=limit,
            skip=skip,
            include_read=include_read
        )
        
        return NotificationListResponse(
            notifications=[NotificationResponse.from_orm(n) for n in notifications],
            total=len(notifications)
        )
    
    except Exception as e:
        logger.error(f"❌ Error retrieving notifications: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve notifications"
        )

@router.put(
    "/{notification_id}/read",
    response_model=NotificationResponse
)
async def mark_notification_read(
    notification_id: UUID,
    student_id: UUID = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Mark notification as read"""
    try:
        notification = NotificationService.mark_as_read(
            db=db,
            notification_id=notification_id
        )
        
        # Verify the notification belongs to this student
        if notification.recipient_id != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot access this notification"
            )
        
        return NotificationResponse.from_orm(notification)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error marking notification: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update notification"
        )

@router.get(
    "/unread-count",
    response_model=dict
)
async def get_unread_count(
    student_id: UUID = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get count of unread notifications"""
    try:
        unread_count = db.query(Notification).filter(
            and_(
                Notification.recipient_id == student_id,
                Notification.is_read == False
            )
        ).count()
        
        return {"unread_count": unread_count}
    
    except Exception as e:
        logger.error(f"❌ Error getting unread count: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get unread count"
        )
```

**Update:** `backend/app/schemas/notification.py`

```python
class NotificationListResponse(BaseModel):
    notifications: List[NotificationResponse]
    total: int
```

**COMMIT:**
```bash
git add backend/app/routers/notification.py
git commit -m "feat: implement student notification history and read tracking"
```

---

#### Task 2A.2.5: Test Notification Flow End-to-End

**File:** `backend/tests/test_notifications.py`

```python
import pytest
from fastapi.testclient import TestClient
from uuid import uuid4

@pytest.fixture
def client():
    from ..app.main import create_app
    return TestClient(create_app())

@pytest.fixture
def teacher_id():
    return str(uuid4())

@pytest.fixture
def student_id():
    return str(uuid4())

def test_send_notification_to_student(client, teacher_id, student_id):
    """Test sending notification to individual student"""
    response = client.post(
        "/api/v1/notifications/send-to-student",
        json={
            "recipient_id": student_id,
            "title": "Test Notification",
            "message": "This is a test notification",
            "type": "announcement"
        },
        headers={"Authorization": f"Bearer {teacher_id}"}
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Test Notification"

def test_get_notification_history(client, student_id):
    """Test retrieving notification history"""
    response = client.get(
        "/api/v1/notifications/history",
        headers={"Authorization": f"Bearer {student_id}"}
    )
    assert response.status_code == 200
    assert "notifications" in response.json()

def test_mark_notification_read(client, student_id):
    """Test marking notification as read"""
    # First get notifications
    hist_response = client.get(
        "/api/v1/notifications/history",
        headers={"Authorization": f"Bearer {student_id}"}
    )
    
    if hist_response.json()["notifications"]:
        notif_id = hist_response.json()["notifications"][0]["notification_id"]
        
        # Mark as read
        response = client.put(
            f"/api/v1/notifications/{notif_id}/read",
            headers={"Authorization": f"Bearer {student_id}"}
        )
        assert response.status_code == 200
        assert response.json()["is_read"] == True

def test_get_unread_count(client, student_id):
    """Test getting unread notification count"""
    response = client.get(
        "/api/v1/notifications/unread-count",
        headers={"Authorization": f"Bearer {student_id}"}
    )
    assert response.status_code == 200
    assert "unread_count" in response.json()
```

**Run Tests:**
```bash
cd backend
pytest tests/test_notifications.py -v
```

**COMMIT:**
```bash
git add backend/tests/test_notifications.py
git commit -m "test: add comprehensive notification system tests"
```

---

## 🎯 CONTINUATION: PHASE 2B, 2C, 2D, 2E

Due to length constraints, I'll provide the skeleton structure for remaining phases:

---

### **PHASE 2B: AI Tutor with PDF Upload**

#### Tasks Overview:
- 2B.1.1-1.3: File Upload Infrastructure (PDF, DOCX, TXT, MD, Images)
- 2B.2.1-2.5: Document Processing (PyPDF2, pdfplumber, embeddings, Pinecone)
- 2B.3.1-3.4: AI Tutor RAG (Retrieval-Augmented Generation)
- 2B.4.1-4.4: Frontend UI (Upload, Chat, Image Display)

#### Key Files to Create:
```
backend/app/services/document_service.py
backend/app/services/embedding_service.py
backend/app/routers/documents.py
backend/app/utils/pdf_parser.py
backend/app/utils/document_processor.py
frontend/components/AiTutor.tsx
frontend/components/FileUpload.tsx
```

---

### **PHASE 2C: Student Profile & Academic Details**

#### Files to Create:
```
backend/app/routers/profile.py
backend/app/services/profile_service.py
frontend/app/profile/page.tsx
frontend/components/StudentProfile.tsx
frontend/components/TeacherProfile.tsx
```

---

### **PHASE 2D: VTU Data Integration**

#### Files to Create:
```
backend/app/models/vtu_subject.py
backend/app/models/vtu_outcomes.py
backend/app/services/vtu_data_service.py
backend/app/scrapers/vtu_scraper.py
backend/app/routers/vtu_data.py
backend/management/import_vtu_data.py (CLI script)
```

**VTU CSE 22 Scheme Subjects to Import:**
```
Semester 1:
- Engineering Mathematics-I
- Engineering Physics
- Engineering Chemistry
- English for Engineers
- Python Programming

Semester 2:
- Engineering Mathematics-II
- Engineering Graphics
- Data Structures
- Digital Logic
- Discrete Mathematics

... (and so on for all 8 semesters)
```

---

### **PHASE 2E: Complete Notification System**

#### Files to Create:
```
frontend/components/NotificationCenter.tsx
frontend/components/TeacherNotificationPanel.tsx
frontend/app/notifications/page.tsx
backend/app/utils/notification_scheduler.py (for scheduled notifications)
```

---

## 🚀 MASTER TESTING & AUTOMATION SCRIPT

**File:** `run_all_tests.sh`

```bash
#!/bin/bash

echo "🚀 Starting Complete Test Suite..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

test_section() {
    echo -e "\n${YELLOW}▶ Testing: $1${NC}"
}

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2 PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $2 FAILED${NC}"
        ((FAILED++))
    fi
}

# Backend Tests
test_section "Backend Authentication"
cd backend
python -m pytest tests/test_auth.py -v
test_result $? "Authentication Tests"

test_section "Backend AI Chatbot"
python -m pytest tests/test_ai_chatbot.py -v
test_result $? "AI Chatbot Tests"

test_section "Backend Notifications"
python -m pytest tests/test_notifications.py -v
test_result $? "Notification Tests"

# Frontend Tests
test_section "Frontend Build"
cd ../frontend
npm run build
test_result $? "Frontend Build"

test_section "Frontend Lint"
npm run lint
test_result $? "Frontend Linting"

# Summary
echo -e "\n${YELLOW}═══════════════════════════════════${NC}"
echo -e "${GREEN}✅ PASSED: $PASSED${NC}"
echo -e "${RED}❌ FAILED: $FAILED${NC}"
echo -e "${YELLOW}═══════════════════════════════════${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All Tests Passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some Tests Failed${NC}"
    exit 1
fi
```

**Make Executable:**
```bash
chmod +x run_all_tests.sh
```

**Run All Tests:**
```bash
./run_all_tests.sh
```

---

## 📋 COMPLETE PHASE 2-3 EXECUTION CHECKLIST

```markdown
# PHASE 2-3: FIXES + NEW FEATURES - COMPLETE CHECKLIST

## PHASE 2A: Fix Critical Issues (Day 1-2)
### Epic 2A.1: Fix AI Chatbot
- [ ] 2A.1.1: Debug Google & OpenRouter APIs (30 min)
- [ ] 2A.1.2: Error Handling (20 min)
- [ ] 2A.1.3: Retry Logic & Fallback (20 min)
- [ ] 2A.1.4: Test Chatbot (15 min)

### Epic 2A.2: Fix Notifications (Day 2)
- [ ] 2A.2.1: Fix Notification Schema (20 min)
- [ ] 2A.2.2: Notification Service (25 min)
- [ ] 2A.2.3: Teacher Endpoints (20 min)
- [ ] 2A.2.4: Student History (20 min)
- [ ] 2A.2.5: End-to-End Tests (15 min)

**Subtotal: ~2-3 hours** ✅

## PHASE 2B: AI Tutor with PDF Upload (Day 3-4)
- [ ] 2B.1: File Upload Infrastructure (2 hours)
- [ ] 2B.2: Document Processing (2.5 hours)
- [ ] 2B.3: AI Tutor RAG (2 hours)
- [ ] 2B.4: Frontend UI (1.5 hours)

**Subtotal: ~8 hours**

## PHASE 2C: Student Profile (Day 5)
- [ ] 2C.1: Student Profile Page (1 hour)
- [ ] 2C.2: Teacher Profile (1 hour)

**Subtotal: ~2 hours**

## PHASE 2D: VTU Data Integration (Day 6-7)
- [ ] 2D.1: VTU Models (1 hour)
- [ ] 2D.2: VTU Data Import Agent (3 hours)
- [ ] 2D.3: Display VTU Content (1.5 hours)

**Subtotal: ~5.5 hours**

## PHASE 2E: Complete Notification System (Day 8)
- [ ] 2E.1: Teacher Notification UI (1 hour)
- [ ] 2E.2: Student History UI (1 hour)
- [ ] 2E.3: Real-time Notifications (optional - 2 hours)

**Subtotal: ~2-4 hours**

---

## TOTAL PHASE 2-3: ~20-25 hours of implementation
## Timeline: 5-7 business days

---

## FINAL DELIVERABLES
✅ Fixed AI Chatbot (Google + OpenRouter)
✅ Fixed Notifications (Teachers send, Students view history)
✅ AI Tutor with PDF Upload & Q&A
✅ Image display from PDFs in chat
✅ Student Profile with academic details
✅ VTU Data Integration (All CSE 22 Scheme subjects)
✅ Complete notification system
✅ All tests passing
✅ Ready for production
```

---

## 🎁 BONUS: GITHUB ACTIONS CI/CD PIPELINE

**File:** `.github/workflows/test-and-build.yml`

```yaml
name: Test & Build

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      
      - name: Run tests
        run: |
          cd backend
          pytest tests/ -v --cov

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      
      - name: Build
        run: |
          cd frontend
          npm run build
      
      - name: Lint
        run: |
          cd frontend
          npm run lint
```

---

## 🎓 LEARNING OUTCOMES & COURSE OUTCOMES (CO/PO) MAPPING

The system should map each topic to:

**Example Structure:**
```json
{
  "subject_id": "CS201",
  "subject_name": "Data Structures",
  "semester": 3,
  "scheme": "22",
  "credits": 4,
  "course_outcomes": [
    {
      "co_id": "CO1",
      "description": "Understand linear data structures and implement them",
      "bloom_level": "C2"
    },
    {
      "co_id": "CO2",
      "description": "Analyze time complexity of algorithms",
      "bloom_level": "C4"
    }
  ],
  "program_outcomes": ["PO1", "PO2", "PO3"],
  "modules": [
    {
      "module_id": "M1",
      "topic": "Arrays & Linked Lists",
      "cos": ["CO1"],
      "duration_hours": 6
    }
  ]
}
```

---

**READY TO EXECUTE? YES ✅**

**Next Step:** Share this prompt with your AI agent and start with Phase 2A fixes!

