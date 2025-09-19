# CLAUDE.md - AI Assistant Guidelines for AI Literacy Student Platform

## 🎯 Project Overview
This is an educational web application for teaching AI literacy concepts to students. It's a React-based single-page application with 8 interactive learning modules covering AI fundamentals, ethics, and practical skills.

## 🏗️ Architecture & Tech Stack

### Frontend Framework
- **React 18** with TypeScript for type safety
- **Vite** as the build tool for fast development
- **Wouter** for client-side routing
- **Tailwind CSS** for styling
- **Radix UI** primitives with shadcn/ui components
- **Framer Motion** for animations

### Backend Services
- **Firebase** for video storage and hosting
- **Gemini API** for optional AI feedback features
- **LocalStorage** for user data persistence

### Key Features
1. 8 comprehensive AI literacy modules with video lessons
2. No authentication required - direct access via shareable URLs
3. Interactive pause activities (quizzes, reflections, applications)
4. Progress tracking and certificate generation
5. Responsive design for desktop and mobile
6. AI-powered feedback system (optional)

## 📁 Project Structure

```
/home/runner/workspace/
├── client/src/
│   ├── components/
│   │   ├── modules/           # 8 main learning modules
│   │   ├── ui/                # Reusable UI components
│   │   ├── activities/        # Interactive activities
│   │   └── WhatIsAIModule/    # Module-specific components
│   ├── context/               # React context providers
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page components
│   ├── services/              # API and service integrations
│   └── lib/                   # Utilities and helpers
├── .claude/                   # Claude-specific settings
├── dist/                      # Build output
└── attached_assets/           # Static assets
```

## 🔑 Key Components & Patterns

### Module System
Each module follows this pattern:
```typescript
interface ModuleProps {
  userName?: string;
  onComplete?: () => void;
}
```

### User Context
- Stores user name in localStorage
- Provides name for certificate generation
- Persists across sessions

### Direct Module Linking
URLs follow pattern: `/module/[module-id]`
- `/module/what-is-ai`
- `/module/intro-to-gen-ai`
- `/module/intro-to-llms`
- `/module/understanding-llms`
- `/module/llm-limitations`
- `/module/privacy-data-rights`
- `/module/ai-environmental-impact`
- `/module/introduction-to-prompting`

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking (if errors exist)
npx tsc --noEmit
```

## 🔧 Environment Variables

Required in `.env`:
```
VITE_GOOGLE_API_KEY=your_firebase_api_key
```

Optional:
```
GEMINI_API_KEY=for_ai_feedback_features
AI_LITERACY_BOT_API_KEY=for_chatbot_features
VITE_DEV_MODE_SECRET_KEY=752465Ledezma
```

## 🤖 AI Assistant Guidelines

### When Working on This Project:

1. **Module Development**
   - Each module should be self-contained
   - Always pass `userName` prop from ModulePage
   - Include certificate generation at completion
   - Maintain consistent styling with Tailwind classes

2. **Component Creation**
   - Use existing UI components from `components/ui/`
   - Follow the shadcn/ui pattern for new components
   - Prefer composition over inheritance
   - Keep components focused and single-purpose

3. **State Management**
   - Use React Context for global state (UserContext)
   - Local state with useState for component-specific data
   - Persist important data in localStorage

4. **Performance Considerations**
   - Large modules (>2000 lines) should be split
   - Use React.lazy() for code splitting if needed
   - Implement loading states for async operations
   - Optimize video loading with proper error handling

5. **Error Handling**
   - Always handle Firebase connection errors
   - Provide fallback UI for failed video loads
   - Show user-friendly error messages
   - Log errors appropriately (not in production)

### Common Tasks & Solutions

#### Adding a New Module
1. Create component in `client/src/components/modules/`
2. Export as default function
3. Add to moduleMap in App.tsx
4. Add module metadata to HomePage.tsx

#### Fixing TypeScript Errors
- Check imports are using correct export syntax
- Ensure props interfaces are defined
- Verify module exports match import statements

#### Working with Certificates
- Use CertificateWrapper component
- Pass userName from UserContext
- Implement html2canvas for download functionality

#### Video Integration
- Use FirebaseVideoPlayer component
- Handle loading and error states
- Implement pause activities with InteractivePauseActivity

### Code Quality Standards

1. **No Console Logs in Production**
   - Remove all console.log statements
   - Use proper error handling instead

2. **TypeScript Best Practices**
   - Define interfaces for all props
   - Avoid using 'any' type
   - Use proper type exports/imports

3. **React Best Practices**
   - Use functional components with hooks
   - Implement proper cleanup in useEffect
   - Memoize expensive computations
   - Handle loading and error states

4. **Accessibility**
   - Add ARIA labels to interactive elements
   - Ensure keyboard navigation works
   - Provide alt text for images
   - Use semantic HTML elements

## 🔄 Workflow Improvements with Claude-Gemini Bridge

### Automatic Task Delegation
The Claude-Gemini Bridge will automatically delegate to Gemini when:
- Analyzing multiple module files simultaneously
- Reviewing the entire codebase for patterns
- Performing security audits across all components
- Generating comprehensive documentation

### Enhanced Capabilities
With the bridge installed, you can:
```bash
# Analyze all modules for consistency
"Review all 8 modules and identify inconsistent patterns"

# Security audit
"Check all components for potential security issues"

# Performance analysis
"Identify performance bottlenecks across all module components"

# Code quality review
"Review all TypeScript files for type safety issues"
```

## 📝 Module-Specific Notes

### Large Modules Requiring Refactoring
1. **IntroductionToPromptingModule** (2672 lines) - Consider splitting into smaller components
2. **LLMLimitationsModule** (2078 lines) - Extract activities into separate files
3. **IntroToGenAIModule** (1730 lines) - Modularize video segments

### Known Issues to Address
- TypeScript compilation errors in GameModule.tsx
- Missing imports for non-existent modules
- Console warnings from replit-cartographer (can be ignored)
- Some components exceed 1000 lines (refactoring recommended)

## 🛠️ Testing Strategy

### Manual Testing Checklist
- [ ] Homepage loads without errors
- [ ] All module cards display correctly
- [ ] URL copying functionality works
- [ ] Name entry appears when accessing modules
- [ ] Certificates generate with user name
- [ ] Direct module URLs work
- [ ] Videos load and play correctly
- [ ] Interactive activities function properly

### Future Improvements
1. Add Jest and React Testing Library
2. Implement unit tests for critical components
3. Add integration tests for user flows
4. Set up E2E tests with Playwright/Cypress
5. Achieve minimum 70% code coverage

## 🚦 Quick Status Checks

```bash
# Check if app is running
curl -I http://localhost:5001/

# Check TypeScript errors
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l

# Find large files needing refactoring
find client/src -name "*.tsx" -exec wc -l {} \; | sort -rn | head -10

# Check for console.log statements
grep -r "console.log" client/src --include="*.tsx" --include="*.ts" | wc -l
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Wouter Routing](https://github.com/molefrog/wouter)

## 🤝 Collaboration Guidelines

When assisting with this project:
1. Maintain the existing code style and patterns
2. Test changes before committing
3. Keep commits focused and descriptive
4. Update this documentation when adding major features
5. Consider performance and accessibility in all changes

---

*This document is maintained to help AI assistants understand the project structure and provide better assistance. Update it when making significant architectural changes.*