# Payrite - Project Development Plan

> AI-powered Tax Health Check Application for Nigeria

---

## 📋 Project Overview

**Payrite** is a mobile-first web application that helps individuals and SMEs in Nigeria understand their tax exposure through bank statement analysis. The app provides educational insights and tax reduction strategies without filing taxes or providing legal advice.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  React 19 + Vite + React Router DOM                          │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │   │
│  │  │  Auth   │ │ Upload  │ │Dashboard│ │ Payment │            │   │
│  │  │  Pages  │ │  Flow   │ │& Reports│ │  Flow   │            │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ REST API (HTTPS)
                                   │ JWT Authentication
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  FastAPI / Node.js Express                                   │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │   │
│  │  │  Auth   │ │   PDF   │ │   Tax   │ │ Payment │            │   │
│  │  │ Service │ │ Parser  │ │ Engine  │ │ Service │            │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │   │
│  │  ┌─────────┐ ┌─────────┐                                     │   │
│  │  │   AI    │ │  File   │                                     │   │
│  │  │ Service │ │ Storage │                                     │   │
│  │  └─────────┘ └─────────┘                                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
            ┌───────────┐  ┌───────────┐  ┌───────────┐
            │PostgreSQL │  │   Redis   │  │   S3/     │
            │  Database │  │   Cache   │  │ Storage   │
            └───────────┘  └───────────┘  └───────────┘
```

---

## 🎯 MVP Features Breakdown

### Phase 1: Core Authentication & Onboarding
- [x] User registration (email/password)
- [x] User login with JWT tokens
- [x] Consent & terms acceptance screen
- [x] Onboarding flow explaining the app
- [x] Password reset functionality

### Phase 2: PDF Upload & Processing
- [x] Multi-file upload (max 5 PDFs)
- [x] File validation (type, size)
- [x] Upload progress tracking
- [x] Processing status screen
- [x] Error handling for failed uploads

### Phase 3: Tax Dashboard & Reports
- [x] Tax Health Score display (0-100)
- [x] Income summary breakdown
- [x] Tax exposure calculations
- [x] Risk indicators
- [x] AI-generated explanations
- [x] Downloadable reports

### Phase 4: Payment Integration
- [x] One-time payment (₦1,500)
- [x] Lifetime access (₦10,000)
- [x] Paystack/Flutterwave integration
- [x] Payment verification
- [x] Receipt generation

### Phase 5: Profile & History
- [x] User profile management
- [x] Analysis history
- [x] Settings & preferences
- [x] Data deletion options

---

## 📁 Frontend Project Structure

```
payrite-frontend/
├── public/
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       └── global.css
│   ├── Components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Input/
│   │   │   ├── LoadingSpinner/
│   │   │   ├── Modal/
│   │   │   └── Toast/
│   │   ├── ErrorBoundary/
│   │   ├── FileUpload/
│   │   ├── Layout/
│   │   ├── Navigation/
│   │   ├── ProtectedRoute/
│   │   ├── TaxScore/
│   │   └── PaymentCard/
│   ├── context/
│   │   ├── authContext.jsx
│   │   ├── uploadContext.jsx
│   │   └── paymentContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useUpload.js
│   │   └── usePayment.js
│   ├── pages/
│   │   ├── Landing/
│   │   ├── Auth/
│   │   │   ├── Login/
│   │   │   ├── Signup/
│   │   │   └── ForgotPassword/
│   │   ├── Onboarding/
│   │   ├── Consent/
│   │   ├── Upload/
│   │   ├── Processing/
│   │   ├── Dashboard/
│   │   ├── Report/
│   │   ├── Payment/
│   │   ├── Profile/
│   │   ├── History/
│   │   └── Error/
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── uploadService.js
│   │   ├── taxService.js
│   │   └── paymentService.js
│   └── utils/
│       ├── formatters.js
│       ├── validators.js
│       ├── constants.js
│       └── helpers.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔐 Backend API Endpoints

### Authentication
```
POST   /api/auth/register     - Create new user account
POST   /api/auth/login        - Login and get JWT token
POST   /api/auth/logout       - Invalidate token
POST   /api/auth/refresh      - Refresh access token
POST   /api/auth/forgot       - Request password reset
POST   /api/auth/reset        - Reset password with token
GET    /api/auth/me           - Get current user profile
```

### File Upload
```
POST   /api/upload            - Upload PDF files (max 5)
GET    /api/upload/:id        - Get upload status
DELETE /api/upload/:id        - Delete uploaded file
```

### Tax Analysis
```
POST   /api/analysis          - Start new analysis
GET    /api/analysis/:id      - Get analysis results
GET    /api/analysis/history  - Get user's analysis history
DELETE /api/analysis/:id      - Delete analysis
```

### Payment
```
POST   /api/payment/init      - Initialize payment
POST   /api/payment/verify    - Verify payment (webhook)
GET    /api/payment/status    - Check payment status
GET    /api/payment/history   - Get payment history
```

### Profile
```
GET    /api/profile           - Get user profile
PUT    /api/profile           - Update profile
DELETE /api/profile           - Delete account
PUT    /api/profile/password  - Change password
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  has_consented BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMP,
  subscription_type VARCHAR(20) DEFAULT 'free', -- free, one_time, lifetime
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Uploads Table
```sql
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
  bank_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP -- Auto-delete after this time
);
```

### Analyses Table
```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tax_health_score INTEGER, -- 0-100
  total_income DECIMAL(15,2),
  total_expenses DECIMAL(15,2),
  estimated_tax DECIMAL(15,2),
  risk_level VARCHAR(20), -- low, medium, high
  ai_summary TEXT,
  detailed_report JSONB,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  upload_id UUID REFERENCES uploads(id) ON DELETE CASCADE,
  date DATE,
  description TEXT,
  amount DECIMAL(15,2),
  type VARCHAR(20), -- credit, debit
  category VARCHAR(50),
  is_taxable BOOLEAN,
  tax_type VARCHAR(50), -- income_tax, vat, withholding
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES analyses(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  payment_type VARCHAR(20), -- one_time, lifetime
  payment_provider VARCHAR(20), -- paystack, flutterwave
  provider_reference VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- pending, success, failed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP
);
```

---

## 🧮 Tax Calculation Engine

### Nigerian Tax Rules (Simplified for MVP)

#### Personal Income Tax (PIT)
```
Annual Income          | Tax Rate
-----------------------|----------
First ₦300,000         | 7%
Next ₦300,000          | 11%
Next ₦500,000          | 15%
Next ₦500,000          | 19%
Next ₦1,600,000        | 21%
Above ₦3,200,000       | 24%
```

#### Value Added Tax (VAT)
- Standard rate: 7.5%
- Applied to identified business transactions

#### Withholding Tax
- Contracts: 5%
- Dividends: 10%
- Professional fees: 10%

### Tax Health Score Algorithm
```
Score = 100 - (Risk Points)

Risk Factors:
- Unreported income indicators: -10 to -30 points
- Large unexplained deposits: -5 to -20 points
- Business activity without VAT: -10 to -25 points
- Irregular patterns: -5 to -15 points

Positive Factors:
- Consistent income patterns: +5 points
- Low cash transactions: +5 points
- Regular salary deposits: +10 points
```

---

## 🤖 AI Integration

### OpenAI/Claude Integration Points

1. **Transaction Categorization** (Backend)
   - Classify transactions into categories
   - Identify business vs personal expenses

2. **Summary Generation** (Backend)
   - Generate plain-language explanations
   - Highlight key findings

3. **Tax Reduction Suggestions** (Backend)
   - Educational tips based on patterns
   - Legal deduction opportunities

### AI Prompt Templates
```
SYSTEM: You are a Nigerian tax education assistant. You explain tax concepts 
in simple terms. You do NOT provide legal advice or file taxes. You only 
educate users about their potential tax obligations based on their 
transaction patterns.

USER: Based on the following transaction summary, explain the user's tax 
exposure in simple terms:
- Total Income: ₦{income}
- Estimated Tax: ₦{tax}
- Risk Level: {risk}
- Key Findings: {findings}
```

---

## 💳 Payment Flow

### One-Time Payment (₦1,500)
1. User completes analysis
2. Preview of Tax Health Score shown
3. Full report locked behind paywall
4. User clicks "Unlock Report"
5. Redirect to Paystack checkout
6. Webhook verifies payment
7. Report unlocked for viewing

### Lifetime Access (₦10,000)
1. User sees lifetime option
2. Completes payment
3. All future analyses unlocked
4. No per-report payments

---

## 🔒 Security Measures

### Frontend
- HTTPS only
- JWT in httpOnly cookies (preferred) or secure localStorage
- XSS prevention (React's default escaping)
- CSRF tokens for forms
- Input validation

### Backend
- Rate limiting (100 requests/minute)
- File type validation (PDF only)
- File size limits (10MB per file)
- Auto-delete files after 24 hours
- Password hashing (bcrypt)
- SQL injection prevention (parameterized queries)

### Data Privacy
- Explicit consent before processing
- No storage of bank credentials
- User can delete all data
- Encrypted at rest (AES-256)
- Encrypted in transit (TLS 1.3)

---

## 📅 Development Timeline

### Week 1: Foundation
- [ ] Setup Vite + React project
- [ ] Implement design system
- [ ] Build authentication pages
- [ ] Create onboarding flow

### Week 2: Core Features
- [ ] Build file upload component
- [ ] Create processing screen
- [ ] Develop dashboard layout
- [ ] Implement tax score display

### Week 3: Backend Integration
- [ ] Connect to API endpoints
- [ ] Implement PDF processing
- [ ] Build tax calculation engine
- [ ] Integrate AI explanations

### Week 4: Payment & Polish
- [ ] Integrate Paystack/Flutterwave
- [ ] Build payment screens
- [ ] Add profile management
- [ ] Testing & bug fixes

---

## 🧪 Testing Strategy

### Frontend Testing
- Unit tests with Vitest
- Component tests with Testing Library
- E2E tests with Playwright

### Backend Testing
- Unit tests for tax calculations
- Integration tests for API endpoints
- Load testing for file uploads

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 480px)  { /* Large phones */ }
@media (min-width: 768px)  { /* Tablets */ }
@media (min-width: 1024px) { /* Laptops */ }
@media (min-width: 1280px) { /* Desktops */ }
```

---

## 🚀 Deployment

### Frontend
- Vercel or Netlify
- CDN for assets
- Environment variables for API URL

### Backend
- Railway, Render, or AWS
- Docker containerization
- PostgreSQL managed instance
- Redis for caching

---

## 📈 Success Metrics

1. **User Onboarding**: 80% completion rate
2. **Upload Success**: 95% successful processing
3. **Payment Conversion**: 15% of free users convert
4. **User Satisfaction**: NPS > 40
5. **Error Rate**: < 1% failed analyses

---

## 🎨 Brand Colors

```css
Primary:    #2563eb (Ocean Blue)
Secondary:  #06b6d4 (Cyan)
Accent:     #10b981 (Success Green)
Warning:    #f59e0b (Amber)
Error:      #ef4444 (Red)
Background: #0a0e1a (Deep Ocean)
```

---

*Last Updated: January 2026*
*Version: 1.0.0-MVP*
