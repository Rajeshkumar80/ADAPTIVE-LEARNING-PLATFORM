"""
Code Journal endpoints — full CRUD on student's entries.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.auth import get_current_user, require_student
from app.database import get_db
from app.models import JournalEntry, User
from app.schemas import JournalEntryCreate, JournalEntryResponse, JournalEntryUpdate

router = APIRouter()


@router.get("/", response_model=list[JournalEntryResponse])
def list_entries(
    q: str | None = None,
    starred: bool | None = None,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    query = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id)
    if q:
        query = query.filter(or_(
            JournalEntry.title.contains(q),
            JournalEntry.description.contains(q),
        ))
    if starred is not None:
        query = query.filter(JournalEntry.is_starred == starred)
    return query.order_by(JournalEntry.created_at.desc()).all()


@router.post("/", response_model=JournalEntryResponse)
def create_entry(
    payload: JournalEntryCreate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    entry = JournalEntry(
        user_id=current_user.id,
        title=payload.title,
        code=payload.code or "",
        language=payload.language,
        description=payload.description or "",
        tags=payload.tags or [],
        is_starred=payload.is_starred,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/{entry_id}", response_model=JournalEntryResponse)
def get_entry(
    entry_id: int,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id,
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry


@router.put("/{entry_id}", response_model=JournalEntryResponse)
def update_entry(
    entry_id: int,
    payload: JournalEntryUpdate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id,
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)

    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}")
def delete_entry(
    entry_id: int,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id,
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted"}


@router.get("/stats/summary")
def get_stats(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    entries = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).all()
    languages = {e.language for e in entries}
    return {
        "total_entries": len(entries),
        "starred_count": sum(1 for e in entries if e.is_starred),
        "languages": list(languages),
        "languages_count": len(languages),
    }
