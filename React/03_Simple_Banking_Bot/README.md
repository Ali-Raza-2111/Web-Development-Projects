# 🏦 Payrite - Nigerian Tax Classification & Compliance System

<div align="center">

![Payrite Banner](https://img.shields.io/badge/Payrite-Nigerian%20Tax%20System-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-orange?style=flat-square)
![Status](https://img.shields.io/badge/status-In%20Development-yellow?style=flat-square)

**An intelligent system that classifies bank transactions and applies Nigerian tax rules automatically.**

[Features](#-features) • [Tax System](#-nigerian-tax-system-overview) • [Classification Logic](#-transaction-classification-logic) • [Installation](#-installation) • [Usage](#-usage)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Features](#-features)
- [The Fundamental Rule](#-the-fundamental-rule)
- [Transaction Classification Groups](#-transaction-classification-groups)
- [Nigerian Tax System Overview](#-nigerian-tax-system-overview)
- [Transaction Classification Logic](#-transaction-classification-logic)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement

Many Nigerian businesses and individuals face significant challenges with tax compliance:

1. **Misclassification of Income**: Bank credits are often wrongly treated as taxable income, leading to overpayment of taxes.
2. **Complex Tax Rules**: Nigeria has multiple tax types (PIT, CIT, VAT, WHT, CGT) with different rules and rates.
3. **Manual Processing**: Manually reviewing bank statements is time-consuming and error-prone.
4. **Missed Deductions**: Legitimate business expenses and tax credits are often overlooked.
5. **Compliance Risk**: Improper classification can lead to penalties or audit exposure.

---

## 💡 Solution

**Payrite** is an intelligent banking bot that:

- ✅ Automatically classifies bank transactions into proper tax categories
- ✅ Applies the correct Nigerian tax rules to each transaction
- ✅ Identifies tax-deductible expenses and reclaimable VAT
- ✅ Detects overpayments and potential tax savings
- ✅ Provides clear, human-readable explanations for each classification
- ✅ Generates compliance-ready tax reports

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Smart Classification** | AI-powered transaction categorization using narration keywords, patterns, and counterparty analysis |
| 📊 **Multi-Tax Support** | Handles PIT, CIT, VAT, WHT, and CGT calculations |
| 💰 **Expense Tracking** | Identifies deductible vs non-deductible expenses |
| 🧾 **WHT Credit Management** | Tracks withholding tax for future credit claims |
| 📈 **Company Size Detection** | Auto-detects business tier for correct CIT rate |
| ⚠️ **Audit Risk Alerts** | Flags transactions that may trigger audit attention |
| 📝 **Clear Explanations** | Human-readable reasoning for every classification |

---

## ⚖️ The Fundamental Rule

> **In Nigeria, tax is determined by the nature of a transaction, NOT by the presence of money in a bank account.**

This is the core principle that drives Payrite:

```
❌ WRONG: All bank credits = Taxable Income
✅ CORRECT: Only earned income = Taxable Income
```

**Not all inflows are income.** Payrite intelligently distinguishes between:
- 💼 Actual business income (taxable)
- 🏦 Loans and capital injections (not taxable)
- 🔄 Refunds and reimbursements (not taxable)
- 👨‍👩‍👧 Family support and gifts (not taxable)

---

## 📦 Transaction Classification Groups

Payrite classifies every transaction into one of six master groups:

### Group 1: 💰 Taxable Income
| Type | Examples | Tax Treatment |
|------|----------|---------------|
| Earned Income | Sales proceeds, service fees, consulting income, freelance payments | Subject to PIT or CIT, may attract VAT and WHT |

```javascript
// Example Classification
{
  transaction: "Credit - Payment for web design services",
  group: 1,
  taxable: true,
  taxes: ["PIT/CIT", "VAT", "WHT"]
}
```

---

### Group 2: 🏦 Non-Taxable Capital Inflow
| Type | Examples | Tax Treatment |
|------|----------|---------------|
| Capital Movement | Capital injections, loans received, investor funding, grants, family support | NOT subject to PIT, CIT, VAT, or WHT |

```javascript
// Example Classification
{
  transaction: "Credit - Loan disbursement from GTBank",
  group: 2,
  taxable: false,
  explanation: "This is a loan received, not income. Not taxable."
}
```

---

### Group 3: 🔄 Reimbursements / Refunds
| Type | Examples | Tax Treatment |
|------|----------|---------------|
| Money Returns | Expense reimbursements, supplier refunds, reversed transactions | NOT income, NOT taxable |

```javascript
// Example Classification
{
  transaction: "Credit - Refund from vendor ABC Ltd",
  group: 3,
  taxable: false,
  explanation: "This is a refund of previous payment. Not new income."
}
```

---

### Group 4: 📉 Business Expenses (Deductible)
| Type | Examples | Tax Treatment |
|------|----------|---------------|
| Operating Costs | Rent, salaries, internet, power, advertising, logistics, software subscriptions | Deductible from taxable income, some require WHT deduction |

```javascript
// Example Classification
{
  transaction: "Debit - Office rent payment to Landlord",
  group: 4,
  deductible: true,
  whtRequired: true,
  whtRate: 0.10  // 10% WHT on rent
}
```

---

### Group 5: 🚫 Personal Expenses (Non-Deductible)
| Type | Examples | Tax Treatment |
|------|----------|---------------|
| Personal Spending | Personal feeding, school fees, personal transfers | NOT deductible, may indicate audit risk if claimed |

```javascript
// Example Classification
{
  transaction: "Debit - Transfer to personal savings",
  group: 5,
  deductible: false,
  auditRisk: true,
  warning: "Personal expense mixed with business account"
}
```

---

### Group 6: 🏢 Asset Transactions
| Type | Examples | Tax Treatment |
|------|----------|---------------|
| Capital Assets | Purchase/sale of vehicles, equipment, land, machinery | Purchases → Capital Allowance; Sales → CGT on profit |

```javascript
// Example Classification
{
  transaction: "Credit - Sale of company vehicle",
  group: 6,
  cgtApplicable: true,
  explanation: "Asset sale may trigger Capital Gains Tax on profit"
}
```

---

## 🇳🇬 Nigerian Tax System Overview

### 1. Personal Income Tax (PIT)

**Applies to:** Individuals earning income

**Calculation:**
```
Taxable Income = Total Income - Allowable Expenses - Reliefs
Tax = Taxable Income × Applicable Rate
```

**Progressive Tax Rates:**
| Income Band (₦) | Rate |
|-----------------|------|
| First 300,000 | 7% |
| Next 300,000 | 11% |
| Next 500,000 | 15% |
| Next 500,000 | 19% |
| Next 1,600,000 | 21% |
| Above 3,200,000 | 24% |

---

### 2. Company Income Tax (CIT)

**Applies to:** Registered companies based on annual turnover

**Tiered Rates:**
| Annual Turnover | CIT Rate | Classification |
|-----------------|----------|----------------|
| Below ₦25 million | **0%** | Small Company |
| ₦25m - ₦100m | **20%** | Medium Company |
| Above ₦100 million | **30%** | Large Company |

```javascript
// System Auto-Detection Logic
function determineCITRate(annualTurnover) {
  if (annualTurnover < 25_000_000) return 0.00;      // Small
  if (annualTurnover <= 100_000_000) return 0.20;   // Medium
  return 0.30;                                        // Large
}
```

---

### 3. Value Added Tax (VAT) - 7.5%

**Applies to:** Sale of goods and services

**VAT Exempt Items:**
- ❌ Salaries and wages
- ❌ Loans and capital injections
- ❌ Residential rent
- ❌ Interest income
- ❌ Medical services
- ❌ Educational services

**Calculation:**
```
VAT Payable = Output VAT (on sales) - Input VAT (on purchases)
```

```javascript
// VAT Calculation Example
const sales = 1_000_000;
const purchases = 400_000;

const outputVAT = sales * 0.075;      // ₦75,000
const inputVAT = purchases * 0.075;   // ₦30,000
const vatPayable = outputVAT - inputVAT; // ₦45,000
```

---

### 4. Withholding Tax (WHT)

**Definition:** Advance tax deducted at source by the payer

**Common WHT Rates:**
| Transaction Type | Individual Rate | Company Rate |
|------------------|-----------------|--------------|
| Professional Services | 5% | 10% |
| Rent | 10% | 10% |
| Interest | 10% | 10% |
| Dividends | 10% | 10% |
| Construction | 5% | 5% |
| Contracts/Supplies | 5% | 5% |

> ⚠️ **Important:** WHT deducted must be stored as **tax credit** and can be offset against final tax liability.

---

### 5. Capital Gains Tax (CGT) - 10%

**Applies to:** Profit from sale of capital assets

**Calculation:**
```
Capital Gain = Sale Price - Purchase Price - Improvement Costs
CGT = Capital Gain × 10%
```

```javascript
// CGT Calculation Example
const salePrice = 5_000_000;
const purchasePrice = 3_000_000;
const improvements = 500_000;

const capitalGain = salePrice - purchasePrice - improvements; // ₦1,500,000
const cgt = capitalGain * 0.10; // ₦150,000
```

---

## 🔍 Transaction Classification Logic

Payrite uses a multi-signal approach to classify transactions:

### Classification Signals

```
┌─────────────────────────────────────────────────────────────┐
│                    TRANSACTION ANALYSIS                      │
├─────────────────────────────────────────────────────────────┤
│  Signal 1: DIRECTION                                        │
│  └─ Credit (inflow) vs Debit (outflow)                     │
│                                                              │
│  Signal 2: FREQUENCY                                        │
│  └─ One-time vs Recurring pattern                          │
│                                                              │
│  Signal 3: AMOUNT PATTERN                                   │
│  └─ Round numbers, consistent amounts, large sums          │
│                                                              │
│  Signal 4: COUNTERPARTY                                     │
│  └─ Bank, vendor, customer, family, government             │
│                                                              │
│  Signal 5: NARRATION KEYWORDS                               │
│  └─ "loan", "refund", "salary", "rent", "invoice"          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  ASSIGN GROUP   │
                   │    (1 - 6)      │
                   └─────────────────┘
```

### Keyword Detection Matrix

| Keywords | Likely Group | Tax Treatment |
|----------|--------------|---------------|
| `payment`, `invoice`, `service fee`, `commission` | Group 1 | Taxable Income |
| `loan`, `disbursement`, `funding`, `investment`, `capital` | Group 2 | Non-Taxable |
| `refund`, `reversal`, `reimbursement`, `returned` | Group 3 | Non-Taxable |
| `rent`, `salary`, `wages`, `subscription`, `utility` | Group 4 | Deductible |
| `personal`, `school fees`, `groceries`, `allowance` | Group 5 | Non-Deductible |
| `vehicle`, `equipment`, `land`, `property`, `machinery` | Group 6 | CGT/Capital Allowance |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         PAYRITE SYSTEM                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐  │
│  │   BANK      │───▶│  TRANSACTION     │───▶│  CLASSIFICATION │  │
│  │  STATEMENT  │    │  PARSER          │    │  ENGINE         │  │
│  └─────────────┘    └──────────────────┘    └────────┬────────┘  │
│                                                       │           │
│                                                       ▼           │
│                     ┌──────────────────────────────────────┐     │
│                     │         TAX CALCULATION ENGINE        │     │
│                     ├──────────────────────────────────────┤     │
│                     │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │     │
│                     │  │ PIT │ │ CIT │ │ VAT │ │ WHT │    │     │
│                     │  └─────┘ └─────┘ └─────┘ └─────┘    │     │
│                     │           ┌─────┐                    │     │
│                     │           │ CGT │                    │     │
│                     │           └─────┘                    │     │
│                     └──────────────────┬───────────────────┘     │
│                                        │                          │
│                                        ▼                          │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐  │
│  │  EXPLANATION    │◀───│   REPORT         │───▶│   USER      │  │
│  │  GENERATOR      │    │   GENERATOR      │    │   INTERFACE │  │
│  └─────────────────┘    └──────────────────┘    └─────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📥 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/payrite.git

# Navigate to project directory
cd payrite

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

---

## 🚀 Usage

### Basic Transaction Classification

```javascript
import { classifyTransaction } from './services/classifier';

const transaction = {
  date: '2026-01-15',
  type: 'credit',
  amount: 500000,
  narration: 'Payment for consulting services - Invoice #1234',
  counterparty: 'ABC Company Ltd'
};

const result = classifyTransaction(transaction);
console.log(result);

// Output:
// {
//   group: 1,
//   groupName: "Taxable Income",
//   taxable: true,
//   taxes: {
//     vat: { applicable: true, amount: 37500 },
//     wht: { applicable: true, rate: 0.10, amount: 50000 }
//   },
//   explanation: "This is a payment for consulting services. It is taxable income subject to VAT (7.5%) and WHT (10%)."
// }
```

### Batch Processing

```javascript
import { processStatement } from './services/processor';

const bankStatement = await loadBankStatement('./statement.csv');
const report = await processStatement(bankStatement);

console.log(report.summary);

// Output:
// {
//   totalCredits: 5000000,
//   taxableIncome: 3500000,
//   nonTaxableInflows: 1500000,
//   deductibleExpenses: 1200000,
//   vatPayable: 172500,
//   estimatedTax: 450000,
//   taxCredits: 125000
// }
```

---

## 📚 API Reference

### Classification Endpoint

```http
POST /api/classify
Content-Type: application/json

{
  "transaction": {
    "date": "2026-01-15",
    "type": "credit",
    "amount": 500000,
    "narration": "Loan disbursement",
    "counterparty": "First Bank"
  }
}
```

**Response:**
```json
{
  "success": true,
  "classification": {
    "group": 2,
    "groupName": "Non-Taxable Capital Inflow",
    "taxable": false,
    "explanation": "This is a loan disbursement. Loans are capital inflows, not income. This amount is NOT taxable under PIT, CIT, VAT, or WHT."
  }
}
```

---

## 💬 Example System Outputs

Payrite provides clear, actionable explanations:

| Scenario | System Output |
|----------|---------------|
| Loan Received | ✅ *"This ₦2,000,000 is a capital injection and NOT taxable income. No tax liability applies."* |
| Overpaid Tax | ⚠️ *"You may have overpaid tax on this transaction. The WHT of ₦50,000 can be claimed as tax credit."* |
| Reclaimable VAT | 💰 *"The VAT of ₦75,000 on this purchase is reclaimable against your output VAT."* |
| Personal Expense | 🚨 *"This appears to be a personal expense. It is NOT deductible and mixing with business expenses may trigger audit attention."* |
| Asset Sale | 📊 *"This asset sale generated a capital gain of ₦500,000. CGT of ₦50,000 (10%) is applicable."* |

---

## 🗂️ Project Structure

```
payrite/
├── src/
│   ├── components/          # React UI components
│   ├── services/
│   │   ├── classifier.js    # Transaction classification engine
│   │   ├── taxCalculator.js # Tax calculation logic
│   │   ├── vatEngine.js     # VAT computation
│   │   ├── whtEngine.js     # WHT processing
│   │   └── cgtEngine.js     # Capital gains calculator
│   ├── utils/
│   │   ├── keywords.js      # Classification keywords
│   │   ├── patterns.js      # Amount/frequency patterns
│   │   └── explanations.js  # Human-readable messages
│   ├── constants/
│   │   └── taxRates.js      # Nigerian tax rates
│   └── App.jsx
├── public/
├── tests/
├── README.md
└── package.json
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Test specific module
npm test -- --grep "VAT"
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- 📧 Email: support@payrite.ng
- 💬 Discord: [Join our community](https://discord.gg/payrite)
- 📖 Documentation: [docs.payrite.ng](https://docs.payrite.ng)

---

<div align="center">

**Built with ❤️ for Nigerian businesses and taxpayers**

*Making tax compliance simple, accurate, and transparent.*

</div>
