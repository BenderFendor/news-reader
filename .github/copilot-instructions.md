# Project Rules
Please use comments to explain each function and how it works and what it does. Use thoughtful 
comments to explain the code and how it works. Don't add comments that are not needed.

Don't remove comments

Please ensure that all public methods and properties are documented clearly for maintainability.

for each function use meaningful names that explain what that function does

use meaningful variable names

There is a cloudflarepagedoc.md

A projectrules.md which you can also refencece if needed

if you add a new feature please add it to the doc.md and explain it and your design philosophy.

Functions and things should be modular, test able and function like blackboxes taking input in and output out.

Collecting workspace information# Tech Stack & Design Philosophy

Have meaningful tailwind class names

## Tech Stack

### Core Technologies
- **Next.js 14+** - React framework for production
- **React 18+** - UI library
- **TypeScript** - Programming language with strict typing
- **Tailwind CSS** - Utility-first CSS framework

### UI Components
- **Shadcn/ui** - React component library
- **Lucide Icons** - SVG icon library
- **Radix UI** - Headless UI components

### State Management & Data Fetching
- **React Hooks** - Local state management
- **Custom Hooks** - Reusable logic
- **Server Actions** - Data mutations

### Deployment
- **Cloudflare Pages** - Web application hosting platform

## Design Philosophy

1. **Dark AMOLED Theme** - Pure black backgrounds (#000000) for better display and battery life on OLED screens

2. **Dual Mode Interface**:
   - **Grid Mode** - Traditional news layout view
   - **Doomscroll Mode** - TikTok-like infinite scrolling experience

3. **Modular Architecture** - Components and functions designed as self-contained "black boxes" that take inputs and produce outputs

4. **Mobile-First Approach** - Responsive design prioritizing mobile experience

5. **Code Quality**:
   - Descriptive function and variable names
   - Thoughtful documentation with comments
   - Strict TypeScript typing
   - Component-focused organization

6. **Accessibility** - Following WCAG guidelines with semantic HTML and proper ARIA attributes

7. **Performance Optimization** - Lazy loading, image optimization, and efficient rendering

The project appears to be "Scoop" - a modern news reader application with an emphasis on clean design, performance, and an engaging user experience across different viewing modes.

What to Comment (and What Not to): Focus on complex logic, e.g., "Use this approach for legacy compatibility," but avoid restating obvious code.
Comment Styles and Formatting: Use /* block */ for multi-line, // line for single-line, ensuring alignment with code indentation.
Maintaining Comment Accuracy: Regularly update during refactoring, removing outdated comments to avoid confusion.