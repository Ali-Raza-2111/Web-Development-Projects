const faqData = [
  {
    id: 1,
    question: "What exactly is Tailwind CSS, and why is it such a game-changer for front-end development?",
    answer: "Tailwind CSS is a utility-first CSS framework that provides thousands of small, single-purpose classes—like 'p-4', 'text-center', and 'bg-blue-500'. Unlike traditional CSS frameworks such as Bootstrap (which give you pre-styled components), Tailwind focuses on giving you building blocks. You design directly in your HTML by combining these utilities. This approach makes your workflow faster, your CSS cleaner, and your designs more customizable from day one."
  },
  {
    id: 2,
    question: "How do you install Tailwind CSS step by step using npm and configure it correctly?",
    answer: "To set up Tailwind CSS, first install the required packages:\n\n'npm install -D tailwindcss postcss autoprefixer'\n\nNext, generate the Tailwind config file by running:\n\n'npx tailwindcss init'\n\nThis creates a 'tailwind.config.js' file, where you define custom settings. Finally, ensure your CSS file includes the Tailwind directives '@tailwind base; @tailwind components; @tailwind utilities;'. When building for production, configure the 'content' array in your config so Tailwind purges unused classes for a smaller bundle."
  },
  {
    id: 3,
    question: "What is the purpose of the tailwind.config.js file, and how does it supercharge customization?",
    answer: "The tailwind.config.js file is like the brain of your Tailwind setup. It allows you to extend or override the default design system by adding custom colors, fonts, spacing, animations, breakpoints, and more. You can also enable variants and plugins here. In short, this file transforms Tailwind from a generic toolkit into a framework tailored to your brand and project."
  },
  {
    id: 4,
    question: "What is JIT mode in Tailwind CSS, and how does it make development faster?",
    answer: "JIT (Just-In-Time) mode compiles your CSS classes on the fly as you write your markup. This means you can use arbitrary values like 'bg-[#ff5722]' or 'mt-[3.5rem]' without predefining them. It gives instant feedback, faster builds, and dramatically smaller CSS files. Starting with Tailwind v3, JIT mode is enabled by default."
  },
  {
    id: 5,
    question: "How can I create a responsive layout quickly with Tailwind CSS?",
    answer: "Tailwind makes responsive design incredibly easy. You use simple prefixes like 'sm:', 'md:', 'lg:', 'xl:', and '2xl:' before any utility class. For example: 'text-base md:text-lg lg:text-xl' changes text size based on screen width. This mobile-first system eliminates the need to write custom media queries by hand."
  },
  {
    id: 6,
    question: "What are the main benefits of using Tailwind CSS compared to writing custom CSS?",
    answer: "Tailwind CSS speeds up development, keeps your styles consistent, and removes the mental overhead of naming CSS classes. It integrates smoothly with modern frameworks like React, Vue, and Next.js. Plus, its built-in purge feature removes unused classes automatically for optimized production builds. It’s essentially a powerful design system you control."
  },
  {
    id: 7,
    question: "How do I add my brand's custom colors, fonts, or spacing to Tailwind CSS?",
    answer: "Open your tailwind.config.js file and extend the 'theme' section. For example:\n\n```\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brandBlue: '#1DA1F2',\n      },\n      fontFamily: {\n        brandSans: ['Open Sans', 'sans-serif'],\n      }\n    }\n  }\n}\n```\n\nYou can now use 'bg-brandBlue' or 'font-brandSans' anywhere in your HTML. This lets you build a design system that matches your brand perfectly."
  },
  {
    id: 8,
    question: "What exactly are utility classes in Tailwind CSS, and how do they change UI building?",
    answer: "Utility classes are single-purpose CSS classes (like 'p-4', 'flex', or 'bg-green-500') that you stack in your markup to style elements. Instead of writing a custom CSS rule in a separate file, you compose your interface directly in HTML. This approach reduces CSS bloat, improves maintainability, and lets you build complex UIs quickly with full control."
  }
];

export default faqData;
