# LUXE E-Commerce Frontend

A futuristic luxury AI-powered e-commerce platform frontend built with React, TypeScript, and Tailwind CSS.

## Features

- ⚡ **Fast**: Built with Vite for instant HMR
- 🎨 **Beautiful UI**: Glass morphism, gradients, and animations
- 📱 **Responsive**: Mobile-first design
- 🔐 **Authentication**: JWT-based with Zustand state management
- 🛒 **Shopping Cart**: Persistent cart with local storage
- 🌙 **Dark Theme**: Elegant dark mode interface
- ✨ **Animations**: Smooth transitions with Framer Motion

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**: http://localhost:5173

## Project Structure

```
src/
├── components/
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components
│   ├── home/           # Home page components
│   ├── products/       # Product components
│   └── cart/           # Cart components
├── pages/              # Page components
├── store/              # Zustand stores
├── services/           # API services
├── types/              # TypeScript types
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

## Design System

### Colors

| Name      | Value       |
|-----------|-------------|
| Primary   | #6366f1     |
| Secondary | #8b5cf6     |
| Accent    | #f59e0b     |
| Dark      | #0f172a     |

### Typography

- **Headings**: Space Grotesk
- **Body**: Inter

## License

MIT License
