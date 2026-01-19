from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.conversation import (
    ConversationResponse,
    ConversationListResponse,
    ConversationUpdate,
    MessageResponse,
)
from app.services.conversation_service import ConversationService

router = APIRouter(prefix="/api/conversations", tags=["conversations"])


@router.get("", response_model=ConversationListResponse)
async def get_all_conversations(db: AsyncSession = Depends(get_db)):
    """Get all conversations with message count"""
    conversation_service = ConversationService(db)
    conversations = await conversation_service.get_all_conversations()
    return ConversationListResponse(conversations=conversations)


@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific conversation with all its messages"""
    conversation_service = ConversationService(db)
    conversation = await conversation_service.get_conversation(conversation_id)
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return ConversationResponse(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        messages=[
            MessageResponse(
                id=msg.id,
                conversation_id=msg.conversation_id,
                role=msg.role,
                content=msg.content,
                created_at=msg.created_at
            )
            for msg in conversation.messages
        ]
    )


@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a conversation and all its messages"""
    conversation_service = ConversationService(db)
    success = await conversation_service.delete_conversation(conversation_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return {"message": "Conversation deleted successfully"}


@router.patch("/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(
    conversation_id: UUID,
    update_data: ConversationUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a conversation's title"""
    conversation_service = ConversationService(db)
    
    if update_data.title is None:
        raise HTTPException(status_code=400, detail="Title is required")
    
    conversation = await conversation_service.update_conversation_title(
        conversation_id, update_data.title
    )
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return ConversationResponse(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        messages=[
            MessageResponse(
                id=msg.id,
                conversation_id=msg.conversation_id,
                role=msg.role,
                content=msg.content,
                created_at=msg.created_at
            )
            for msg in conversation.messages
        ]
    )


@router.post("", response_model=ConversationResponse)
async def create_new_conversation(db: AsyncSession = Depends(get_db)):
    """Create a new empty conversation"""
    conversation_service = ConversationService(db)
    conversation = await conversation_service.create_conversation()
    
    return ConversationResponse(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        messages=[]
    )
