# LUXE E-Commerce Backend

A futuristic luxury AI-powered e-commerce platform backend built with FastAPI.

## Features

- 🔐 **Authentication**: JWT-based auth with access and refresh tokens
- 👤 **User Management**: Multiple roles (buyer, seller, admin)
- 🛍️ **Products**: Full CRUD with categories, variants, and filtering
- 🛒 **Shopping Cart**: Persistent cart with wishlist support
- 📦 **Orders**: Complete order lifecycle management
- ⭐ **Reviews**: Product reviews with seller responses
- 🤖 **AI Features**: Prepared stubs for AI integration

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLAlchemy with SQLite (dev) / PostgreSQL (prod)
- **Auth**: JWT with python-jose
- **Password Hashing**: passlib with bcrypt
- **Validation**: Pydantic

## Quick Start

### Prerequisites

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) package manager

### Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies** (already done with uv):
   ```bash
   uv sync
   ```

3. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Seed the database** (optional):
   ```bash
   uv run python -m app.seeds.seed_db
   ```

5. **Start the server**:
   ```bash
   uv run uvicorn app.main:app --reload --port 8000
   ```

### API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── api/              # API route handlers
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── users.py      # User management
│   │   ├── products.py   # Product CRUD
│   │   ├── orders.py     # Order management
│   │   ├── reviews.py    # Review system
│   │   ├── cart.py       # Cart & wishlist
│   │   └── ai.py         # AI feature endpoints
│   ├── core/             # Core configuration
│   │   ├── config.py     # Settings management
│   │   ├── security.py   # JWT & password utilities
│   │   └── dependencies.py # Dependency injection
│   ├── db/               # Database configuration
│   │   ├── base.py       # SQLAlchemy base
│   │   └── session.py    # Database session
│   ├── models/           # SQLAlchemy models
│   │   ├── user.py       # User & Address
│   │   ├── product.py    # Product & Category
│   │   ├── order.py      # Order & OrderItem
│   │   ├── review.py     # Review
│   │   └── cart.py       # CartItem & WishlistItem
│   ├── schemas/          # Pydantic schemas
│   │   ├── user.py       # User schemas
│   │   ├── auth.py       # Auth schemas
│   │   ├── product.py    # Product schemas
│   │   ├── order.py      # Order schemas
│   │   ├── review.py     # Review schemas
│   │   ├── cart.py       # Cart schemas
│   │   └── ai.py         # AI schemas
│   ├── services/         # Business logic & AI services
│   │   ├── recommender.py    # AI recommendation engine
│   │   ├── chatbot.py        # AI chatbot service
│   │   ├── summarizer.py     # AI summarization service
│   │   └── seller_assistant.py # Seller AI assistant
│   ├── seeds/            # Database seeders
│   │   └── seed_db.py    # Seed script
│   └── main.py           # FastAPI application
├── .env                  # Environment variables
├── .env.example          # Example environment file
├── pyproject.toml        # Project dependencies
└── README.md             # This file
```

## Test Accounts

After seeding the database:

| Role   | Email              | Password  |
|--------|--------------------|-----------|
| Admin  | admin@luxe.com     | admin123  |
| Seller | seller@luxe.com    | seller123 |
| Buyer  | buyer@luxe.com     | buyer123  |

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh tokens

### Users
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update profile
- `GET /api/v1/users/me/addresses` - Get addresses
- `POST /api/v1/users/me/addresses` - Add address

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/{id}` - Get product
- `POST /api/v1/products` - Create product (seller)
- `PUT /api/v1/products/{id}` - Update product (seller)
- `DELETE /api/v1/products/{id}` - Delete product (seller)

### Orders
- `GET /api/v1/orders` - Get my orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/{id}` - Get order details
- `PUT /api/v1/orders/{id}/cancel` - Cancel order

### Cart
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart/items` - Add to cart
- `PUT /api/v1/cart/items/{id}` - Update quantity
- `DELETE /api/v1/cart/items/{id}` - Remove from cart

### AI (Stubs)
- `POST /api/v1/ai/chat` - Chat with AI assistant
- `POST /api/v1/ai/recommendations` - Get recommendations
- `POST /api/v1/ai/product-summary` - Get product summary
- `POST /api/v1/ai/review-analysis` - Analyze reviews

## AI Integration

The AI features are set up as stubs ready for your implementation. To enable AI:

1. Set `AI_ENABLED=true` in `.env`
2. Add your AI API key (OpenAI, Anthropic, etc.)
3. Implement the service methods in `app/services/`

### Recommended AI Integrations:
- **Chatbot**: OpenAI GPT-4, Anthropic Claude
- **Recommendations**: scikit-learn, TensorFlow
- **Embeddings**: sentence-transformers, OpenAI embeddings
- **Sentiment**: Hugging Face transformers

## Production Deployment

1. Update `.env` with production settings
2. Use PostgreSQL instead of SQLite
3. Set a strong `SECRET_KEY`
4. Configure proper CORS origins
5. Use a production ASGI server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

## License

MIT License
