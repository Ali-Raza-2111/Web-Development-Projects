# 🌟 LUXE - AI-Powered Luxury E-Commerce Platform

A futuristic, AI-powered e-commerce platform featuring a React frontend and FastAPI backend.

![LUXE Banner](https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200)

## ✨ Features

### Frontend
- ⚡ **Vite + React 18** - Lightning-fast development
- 🎨 **Glass Morphism UI** - Modern, elegant design
- 🌙 **Dark Theme** - Eye-friendly dark mode
- ✨ **Framer Motion** - Smooth animations
- 📱 **Responsive** - Mobile-first approach
- 🛒 **Persistent Cart** - Zustand + Local Storage

### Backend
- 🚀 **FastAPI** - High-performance Python API
- 🔐 **JWT Auth** - Secure authentication
- 👥 **Multi-Role** - Buyer, Seller, Admin
- 📦 **Order Management** - Full lifecycle
- ⭐ **Reviews** - With seller responses
- 🤖 **AI Ready** - Prepared for AI integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.12+
- [uv](https://github.com/astral-sh/uv) package manager

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
uv sync

# Seed the database (optional)
uv run python -m app.seeds.seed_db

# Start the server
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📂 Project Structure

```
luxe-ecommerce/
├── frontend/               # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Page Components
│   │   ├── store/          # Zustand Stores
│   │   ├── services/       # API Services
│   │   └── types/          # TypeScript Types
│   └── ...
├── backend/                # FastAPI Backend
│   ├── app/
│   │   ├── api/           # API Routes
│   │   ├── models/        # SQLAlchemy Models
│   │   ├── schemas/       # Pydantic Schemas
│   │   ├── services/      # AI Services (Stubs)
│   │   └── core/          # Configuration
│   └── ...
└── plan.md                # Project Documentation
```

## 🧪 Test Accounts

After seeding the database:

| Role   | Email              | Password  |
|--------|--------------------|-----------|
| Admin  | admin@luxe.com     | admin123  |
| Seller | seller@luxe.com    | seller123 |
| Buyer  | buyer@luxe.com     | buyer123  |

## 🤖 AI Integration

The platform is prepared for AI features:

1. **Chatbot Assistant** - Customer support and product discovery
2. **Recommendations** - Personalized product suggestions
3. **Review Analysis** - Sentiment and summary extraction
4. **Seller Assistant** - Business insights and optimization

To implement AI features:
1. Set `AI_ENABLED=true` in backend `.env`
2. Add your AI API key (OpenAI, Anthropic, etc.)
3. Implement methods in `backend/app/services/`

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh tokens

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/{id}` - Get product
- `POST /api/v1/products` - Create (seller)
- `PUT /api/v1/products/{id}` - Update (seller)

### Orders
- `GET /api/v1/orders` - My orders
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/{id}/cancel` - Cancel order

### Cart
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart/items` - Add to cart
- `DELETE /api/v1/cart/items/{id}` - Remove

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366f1)
- **Secondary**: Violet (#8b5cf6)
- **Accent**: Amber (#f59e0b)
- **Background**: Dark Slate (#0f172a)

### Typography
- **Headings**: Space Grotesk
- **Body**: Inter

## 📜 License

MIT License - See LICENSE file for details.

---

Built with ❤️ for the future of e-commerce
