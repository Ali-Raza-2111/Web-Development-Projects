const faqData = [
  {
    id: 1,
    question: "What is Tailwind CSS and why use it?",
    answer: "A utility-first CSS framework with small classes like 'p-4' or 'bg-blue-500'. It’s faster, cleaner, and more customizable than pre-styled frameworks."
  },
  {
    id: 2,
    question: "How to install Tailwind CSS with npm?",
    answer: "Run 'npm install -D tailwindcss postcss autoprefixer', then 'npx tailwindcss init'. Add '@tailwind base; @tailwind components; @tailwind utilities;' to your CSS and set the 'content' array for purging."
  },
  {
    id: 3,
    question: "What does tailwind.config.js do?",
    answer: "It’s your customization file to add colors, fonts, spacing, breakpoints, plugins, and more—turning Tailwind into your own design system."
  },
  {
    id: 4,
    question: "What is JIT mode?",
    answer: "It compiles classes instantly as you code, supports custom values like 'bg-[#ff5722]', speeds up builds, and creates smaller CSS. Enabled by default in v3."
  },
  {
    id: 5,
    question: "How to make layouts responsive?",
    answer: "Use prefixes like 'sm:', 'md:', 'lg:', etc. Example: 'text-base md:text-lg lg:text-xl'. No custom media queries needed."
  },
  {
    id: 6,
    question: "Why use Tailwind over custom CSS?",
    answer: "It’s faster, consistent, works with React/Vue/Next, and removes unused classes automatically for smaller builds."
  },
  {
    id: 7,
    question: "How to add custom brand styles?",
    answer: "Extend the 'theme' in tailwind.config.js with your colors/fonts. Then use them like 'bg-brandBlue' or 'font-brandSans' in HTML."
  },
  {
    id: 8,
    question: "What are utility classes?",
    answer: "Single-purpose classes like 'p-4', 'flex', 'bg-green-500'. Combine them in HTML instead of writing custom CSS."
  }
];

export default faqData;
