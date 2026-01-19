from uuid import UUID
from datetime import datetime
from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.conversation import Conversation, Message, MessageRole
from app.schemas.conversation import ConversationListItem


class ConversationService:
    """Service for managing conversations and messages in database"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_conversation(self, title: str = "New Chat") -> Conversation:
        """Create a new conversation"""
        conversation = Conversation(title=title)
        self.db.add(conversation)
        await self.db.flush()
        await self.db.refresh(conversation)
        return conversation

    async def get_conversation(self, conversation_id: UUID) -> Conversation | None:
        """Get a conversation by ID with all messages"""
        result = await self.db.execute(
            select(Conversation)
            .options(selectinload(Conversation.messages))
            .where(Conversation.id == conversation_id)
        )
        return result.scalar_one_or_none()

    async def get_all_conversations(self) -> list[ConversationListItem]:
        """Get all conversations with message count"""
        # Subquery for message count
        message_count_subquery = (
            select(Message.conversation_id, func.count(Message.id).label("message_count"))
            .group_by(Message.conversation_id)
            .subquery()
        )

        # Main query
        result = await self.db.execute(
            select(
                Conversation.id,
                Conversation.title,
                Conversation.created_at,
                Conversation.updated_at,
                func.coalesce(message_count_subquery.c.message_count, 0).label("message_count")
            )
            .outerjoin(
                message_count_subquery,
                Conversation.id == message_count_subquery.c.conversation_id
            )
            .order_by(Conversation.updated_at.desc())
        )
        
        rows = result.all()
        return [
            ConversationListItem(
                id=row.id,
                title=row.title,
                created_at=row.created_at,
                updated_at=row.updated_at,
                message_count=row.message_count
            )
            for row in rows
        ]

    async def delete_conversation(self, conversation_id: UUID) -> bool:
        """Delete a conversation by ID"""
        conversation = await self.get_conversation(conversation_id)
        if not conversation:
            return False
        
        await self.db.delete(conversation)
        await self.db.flush()
        return True

    async def update_conversation_title(
        self, conversation_id: UUID, title: str
    ) -> Conversation | None:
        """Update conversation title"""
        await self.db.execute(
            update(Conversation)
            .where(Conversation.id == conversation_id)
            .values(title=title, updated_at=datetime.utcnow())
        )
        await self.db.flush()
        return await self.get_conversation(conversation_id)

    async def add_message(
        self, conversation_id: UUID, role: MessageRole, content: str
    ) -> Message:
        """Add a message to a conversation"""
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content
        )
        self.db.add(message)
        
        # Update conversation's updated_at timestamp
        await self.db.execute(
            update(Conversation)
            .where(Conversation.id == conversation_id)
            .values(updated_at=datetime.utcnow())
        )
        
        await self.db.flush()
        await self.db.refresh(message)
        return message

    async def get_conversation_messages(self, conversation_id: UUID) -> list[Message]:
        """Get all messages for a conversation"""
        result = await self.db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at)
        )
        return list(result.scalars().all())

    async def generate_title_from_message(self, message: str) -> str:
        """Generate a conversation title from the first message"""
        # Take first 50 characters of the message as title
        title = message[:50].strip()
        if len(message) > 50:
            title += "..."
        return title if title else "New Chat"
