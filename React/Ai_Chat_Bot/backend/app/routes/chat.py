from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.conversation import ChatRequest, ChatResponse, MessageResponse
from app.services.conversation_service import ConversationService
from app.services.agent_service import agent_service
from app.models.conversation import MessageRole

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/message", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Send a message to the AI chatbot and get a response.
    If conversation_id is None, a new conversation will be created.
    """
    conversation_service = ConversationService(db)
    
    # Get or create conversation
    if request.conversation_id:
        conversation = await conversation_service.get_conversation(request.conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        # Create new conversation with title from first message
        title = await conversation_service.generate_title_from_message(request.message)
        conversation = await conversation_service.create_conversation(title=title)
    
    # Get existing messages for context
    existing_messages = await conversation_service.get_conversation_messages(conversation.id)
    
    # Convert to format for agent
    history = [
        {"role": msg.role.value, "content": msg.content}
        for msg in existing_messages
    ]
    
    # Convert to LangChain messages
    langchain_history = agent_service.convert_to_langchain_messages(history)
    
    # Save user message to database
    user_message = await conversation_service.add_message(
        conversation_id=conversation.id,
        role=MessageRole.USER,
        content=request.message
    )
    
    # Get AI response
    try:
        ai_response_content = agent_service.chat(langchain_history, request.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")
    
    # Save AI response to database
    assistant_message = await conversation_service.add_message(
        conversation_id=conversation.id,
        role=MessageRole.ASSISTANT,
        content=ai_response_content
    )
    
    return ChatResponse(
        conversation_id=conversation.id,
        user_message=MessageResponse(
            id=user_message.id,
            conversation_id=user_message.conversation_id,
            role=user_message.role,
            content=user_message.content,
            created_at=user_message.created_at
        ),
        assistant_message=MessageResponse(
            id=assistant_message.id,
            conversation_id=assistant_message.conversation_id,
            role=assistant_message.role,
            content=assistant_message.content,
            created_at=assistant_message.created_at
        )
    )
