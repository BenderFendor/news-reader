# Project Rules and Technical Stack

# Project Rules
Please use comments to explain each function and how it works and what it does. Use thoughtful variable names.
Don't remove comments

## Technology Stack

### Core Technologies
- **Next.js 14+** - React framework for production
- **React 18+** - UI library
- **TypeScript** - Programming language
- **Tailwind CSS** - Utility-first CSS framework

### UI Components
- **Shadcn/ui** - React components
- **Lucide Icons** - Icon library
- **Radix UI** - Headless UI components

### State Management & Data Fetching
- **React Hooks** - Local state management
- **Custom Hooks** - Reusable logic
- **Server Actions** - Data mutations

## Coding Standards

### TypeScript
- Strict mode enabled
- Explicit type definitions
- No `any` types unless absolutely necessary
- Use interfaces for object types
- Use type for union types

### React
- Functional components only
- Use hooks for state and effects
- Props should be typed with interfaces
- Component files should use `.tsx` extension
- One component per file

### CSS/Styling
- Use Tailwind CSS classes
- Follow mobile-first approach
- Use responsive design
- Give components descriptive names
- Use a Dark Amoled theme
- Use CSS modules for component-specific styles
- Follow BEM naming convention for custom CSS

### File Structure
- Components in `/app/components`
- Pages in `/app` directory
- Hooks in `/hooks`
- Types in component files or dedicated type files
- Utils in `/lib`

### Code Organization
- Group related components
- Keep components small and focused
- Extract reusable logic into hooks
- Use meaningful file and component names

## Development Workflow

### Version Control
- Use Git for version control
- Follow conventional commits
- Create feature branches
- Pull requests for code review

### Performance
- Optimize images
- Lazy load components when possible
- Minimize bundle size
- Use proper caching strategies

### Accessibility
- Follow WCAG guidelines
- Use semantic HTML
- Provide proper ARIA labels
- Ensure keyboard navigation

### Testing
- Write unit tests for components
- Test custom hooks
- E2E testing for critical paths
- Maintain good test coverage

### Documentation
- Document complex logic
- Add JSDoc comments for functions
- Keep README updated
- Document API endpoints

## Best Practices

### Security
- Validate user input
- Sanitize data
- Follow security best practices
- Keep dependencies updated

### Error Handling
- Use error boundaries
- Proper error logging
- User-friendly error messages
- Fallback UI components

### Code Quality
- Use ESLint
- Format with Prettier
- Regular code reviews
- Maintain consistent style

### Performance Monitoring
- Monitor load times
- Track core web vitals
- Regular performance audits
- Optimize as needed

## Deployment

### Environment
- Use environment variables
- Separate dev/prod configs
- Proper error logging
- Monitoring setup

### CI/CD
- Automated testing
- Build verification
- Automated deployment
- Environment specific checks