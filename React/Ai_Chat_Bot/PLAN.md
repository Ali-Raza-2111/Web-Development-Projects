# AI Chat Bot - Complete Implementation Plan

## 📋 Project Overview
Build a full-stack AI chatbot application where users can have conversations with an AI assistant, with all conversation history stored in a PostgreSQL database.

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **AI Provider**: Ollama (Local LLM via langchain-ollama)
- **Agent Framework**: LangGraph
- **Async Support**: asyncpg, SQLAlchemy async
- **Migrations**: Alembic
- **Environment**: python-dotenv

### Frontend
- **Framework**: React + Vite
- **Styling**: CSS3
- **HTTP Client**: Axios / Fetch API
- **State Management**: React Hooks (useState, useEffect)

## 📁 Complete File Structure

```
Ai_Chat_Bot/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app entry point
│   │   ├── config.py               # Configuration & environment variables
│   │   ├── database.py             # Database connection & session
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── conversation.py     # SQLAlchemy models
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── conversation.py     # Pydantic schemas (request/response)
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py             # Chat endpoints
│   │   │   └── conversation.py     # Conversation history endpoints
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── ai_service.py       # Ollama + LangGraph integration
│   │   │   └── conversation_service.py # Business logic
│   │   ├── agents/
│   │   │   ├── __init__.py
│   │   │   ├── graph.py            # LangGraph workflow definition
│   │   │   ├── nodes.py            # Agent nodes (actions)
│   │   │   ├── state.py            # Agent state definition
│   │   │   └── tools.py            # Agent tools (optional)
│   │   └── middleware/
│   │       ├── __init__.py
│   │       └── cors.py             # CORS configuration
│   ├── alembic/
│   │   ├── versions/               # Database migration files
│   │   └── env.py
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── .env.example
│   ├── .env                        # NOT in git (create locally)
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx      # Main chat interface
│   │   │   ├── MessageList.jsx     # Display messages
│   │   │   ├── MessageInput.jsx    # User input field
│   │   │   ├── Sidebar.jsx         # Conversation history sidebar
│   │   │   └── ConversationItem.jsx # Individual conversation item
│   │   ├── services/
│   │   │   └── api.js              # API calls to backend
│   │   ├── hooks/
│   │   │   └── useChat.js          # Custom hook for chat logic
│   │   ├── utils/
│   │   │   └── helpers.js          # Helper functions
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── PLAN.md                         # This file
└── README.md
```

## 🗄️ Database Schema

### Tables

#### 1. conversations
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. messages
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,  -- 'user', 'assistant', 'system', 'function'
    content TEXT NOT NULL,
    metadata JSONB,             -- Store LangGraph state, tool calls, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
```sql
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
```

## 🔌 API Endpoints

### Chat Endpoints

#### POST /api/chat/message
Send a message and get AI response
```json
Request:
{
  "conversation_id": "uuid or null",
  "message": "Hello, how are you?"
}

Response:
{
  "conversation_id": "uuid",
  "user_message": {
    "id": "uuid",
    "role": "user",
    "content": "Hello, how are you?",
    "created_at": "timestamp"
  },
  "assistant_message": {
    "id": "uuid",
    "role": "assistant",
    "content": "I'm doing well, thank you!",
    "metadata": {
      "agent_state": {},
      "tool_calls": [],
      "graph_execution": {}
    },
    "created_at": "timestamp"
  }
}
```

### Conversation Endpoints

#### GET /api/conversations
Get all conversations
```json
Response:
{
  "conversations": [
    {
      "id": "uuid",
      "title": "Chat about Python",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "message_count": 10
    }
  ]
}
```

#### GET /api/conversations/{conversation_id}
Get a specific conversation with all messages
```json
Response:
{
  "id": "uuid",
  "title": "Chat about Python",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "What is Python?",
      "created_at": "timestamp"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Python is a programming language...",
      "created_at": "timestamp"
    }
  ]
}
```

#### DELETE /api/conversations/{conversation_id}
Delete a conversation
```json
Response:
{
  "message": "Conversation deleted successfully"
}
```

#### PATCH /api/conversations/{conversation_id}
Update conversation title
```json
Request:
{
  "title": "New conversation title"
}

Response:
{
  "id": "uuid",
  "title": "New conversation title",
  "updated_at": "timestamp"
}
```

## ⚙️ Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chatbot_db

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# LangGraph
LANGCHAIN_TRACING_V2=false
LANGCHAIN_PROJECT=ai-chatbot

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🎯 Implementation Steps

### Phase 1: Backend Foundation (Steps 1-4)

#### Step 1: Database Setup
- [ ] Install PostgreSQL
- [ ] Create database: `chatbot_db`
- [ ] Set up database connection in `database.py`
- [ ] Configure SQLAlchemy engine and session

#### Step 2: Models & Schemas
- [ ] Create SQLAlchemy models (`models/conversation.py`)
  - Conversation model
  - Message model
- [ ] Create Pydantic schemas (`schemas/conversation.py`)
  - MessageCreate, MessageResponse
  - ConversationCreate, ConversationResponse
  - ChatRequest, ChatResponse

#### Step 3: Database Migrations
- [ ] Initialize Alembic: `alembic init alembic`
- [ ] Create initial migration
- [ ] Run migrations: `alembic upgrade head`

#### Step 4: Configuration
- [ ] Set up `config.py` with Settings class
- [ ] Create `.env.example` file
- [ ] Configure environment variables

### Phase 2: LangGraph Agent Setup (Steps 5-7)

#### Step 5: Agent State & Tools
- [ ] Create `agents/state.py`
  - Define AgentState class with TypedDict
  - Include messages, conversation_id, metadata fields
- [ ] Create `agents/tools.py` (optional)
  - Define any custom tools the agent can use
  - Tool for retrieving conversation context

#### Step 6: Agent Graph
- [ ] Create `agents/nodes.py`
  - Define agent nodes (call_model, process_response, etc.)
  - Handle Ollama LLM calls
  - Process tool calls if any
- [ ] Create `agents/graph.py`
  - Build LangGraph StateGraph
  - Define nodes and edges
  - Set entry and finish points
  - Compile the graph

#### Step 7: AI Service
- [ ] Create `services/ai_service.py`
- [ ] Implement Ollama API integration
- [ ] Handle chat completions with local LLM
- [ ] Error handling for API failures

### Phase 3: Backend Services (Steps 8-9)

#### Step 8: Conversation Service
- [ ] Create `services/conversation_service.py`
- [ ] Implement CRUD operations
- [ ] Create/retrieve conversations
- [ ] Save messages with LangGraph metadata to database
- [ ] Generate conversation titles

#### Step 7: API Routes
- [ ] Create `routes/chat.py`
  - POST /api/chat/message
- [ ] Create `routes/conversation.py`
  - GET /api/conversations
  - GET /api/conversations/{id}
  - DELETE /api/conversations/{id}
  - PATCH /api/conversations/{id}

### Phase 4: Backend Integration (Steps 10-11)

#### Step 10: Main Application
- [ ] Set up FastAPI app in `main.py`
- [ ] Configure CORS middleware
- [ ] Register routers
- [ ] Add exception handlers

#### Step 11: Testing Backend
- [ ] Test database connection
- [ ] Test LangGraph agent execution
- [ ] Test all API endpoints with Postman/curl
- [ ] Verify Ollama integration
- [ ] Inspect LangGraph state and metadata
- [ ] Test error scenarios

### Phase 5: Frontend Development (Steps 12-16)

#### Step 12: API Service Layer
- [ ] Create `services/api.js`
- [ ] Implement API client (axios/fetch)
- [ ] Define all API functions
  - sendMessage()
  - getConversations()
  - getConversation()
  - deleteConversation()
  - updateConversation()

#### Step 13: Core Components
- [ ] Create `ChatWindow.jsx` (main container)
- [ ] Create `MessageList.jsx` (display messages)
- [ ] Create `MessageInput.jsx` (user input)
- [ ] Add loading states and error handling

#### Step 14: Sidebar Components
- [ ] Create `Sidebar.jsx` (conversation list)
- [ ] Create `ConversationItem.jsx` (individual item)
- [ ] Add new conversation button
- [ ] Add delete functionality

#### Step 15: Custom Hooks
- [ ] Create `useChat.js` hook
  - Manage messages state
  - Handle sending messages
  - Load conversation history
  - Switch between conversations

#### Step 16: Styling
- [ ] Design chat interface
- [ ] Style message bubbles (user vs assistant)
- [ ] Make responsive layout
- [ ] Add animations and transitions

### Phase 6: Integration & Polish (Steps 17-18)

#### Step 17: Frontend-Backend Integration
- [ ] Connect all components to API
- [ ] Test full conversation flow
- [ ] Handle loading states
- [ ] Implement error messages

#### Step 18: Final Testing & Optimization
- [ ] End-to-end testing
- [ ] Fix bugs
- [ ] Optimize performance
- [ ] Add README documentation

## 🚀 Running the Application

### Backend
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database
createdb chatbot_db
alembic upgrade head

# Run server
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Security Considerations
- [ ] Never commit `.env` file
- [ ] Use environment variables for sensitive data
- [ ] Validate all user inputs
- [ ] Implement rate limiting
- [ ] Add authentication (future enhancement)

## 🎨 UI/UX Features
- Clean, modern chat interface
- Real-time message streaming (optional enhancement)
- Conversation history sidebar
- Message timestamps
- User/AI message differentiation
- Loading indicators
- Error messages
- Empty states

## 🔮 Future Enhancements
- [ ] User authentication and authorization
- [ ] Multiple users support
- [ ] Message reactions
- [ ] File/image uploads
- [ ] Voice input
- [ ] Dark mode
- [ ] Export conversations
- [ ] Search functionality
- [ ] Streaming responses
- [ ] Multiple AI models selection

## 📝 Notes
- **Install Ollama first**: Download from https://ollama.ai and pull a model (e.g., `ollama pull llama2`)
- **LangGraph Architecture**: The agent uses a state graph to manage conversation flow, allowing for complex multi-step reasoning and tool usage
- **Agent State**: All agent state and metadata are stored in the database for full conversation traceability
- Start with Phase 1 and work sequentially
- Test each component before moving to the next
- Keep the code modular and maintainable
- Follow REST API best practices
- Use proper error handling throughout
- Document code as you build

---

**Status**: Ready to implement
**Next Action**: Begin with Phase 1, Step 1 - Database Setup
