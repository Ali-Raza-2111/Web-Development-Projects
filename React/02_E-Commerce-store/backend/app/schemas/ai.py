from pydantic import BaseModel
from typing import Optional, List, Any


# AI Chat schemas
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []
    context: Optional[dict] = None  # Product context, user preferences, etc.


class ChatResponse(BaseModel):
    message: str
    suggestions: List[str] = []
    products: List[int] = []  # Recommended product IDs


# AI Recommendation schemas
class RecommendationRequest(BaseModel):
    user_id: Optional[int] = None
    product_id: Optional[int] = None
    category: Optional[str] = None
    limit: int = 10


class RecommendationResponse(BaseModel):
    product_ids: List[int]
    reasoning: Optional[str] = None


# AI Summary schemas
class ProductSummaryRequest(BaseModel):
    product_id: int


class ProductSummaryResponse(BaseModel):
    summary: str
    key_features: List[str]
    pros: List[str]
    cons: List[str]


# AI Review Analysis schemas
class ReviewAnalysisRequest(BaseModel):
    product_id: int


class ReviewAnalysisResponse(BaseModel):
    overall_sentiment: str
    summary: str
    common_praises: List[str]
    common_complaints: List[str]
    rating_trend: str  # "improving", "declining", "stable"


# Seller Assistant schemas
class SellerQueryRequest(BaseModel):
    query: str
    seller_id: int


class SellerQueryResponse(BaseModel):
    answer: str
    data: Optional[dict] = None  # Relevant data for the query
    suggestions: List[str] = []
