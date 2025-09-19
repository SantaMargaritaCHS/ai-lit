# Quick Reference - AI Literacy Platform

## 🚀 Development Server
```bash
npm run dev          # Start on port 5001 (or 5000 if available)
```

## 📁 Key Directories
```
client/src/components/modules/    # Learning modules
client/src/components/ui/         # Reusable components  
client/src/context/              # React contexts
client/src/services/             # API integrations
```

## 🔗 Module URLs
- `/module/what-is-ai`
- `/module/intro-to-gen-ai`
- `/module/intro-to-llms`
- `/module/understanding-llms`
- `/module/llm-limitations`
- `/module/privacy-data-rights`
- `/module/ai-environmental-impact`
- `/module/introduction-to-prompting`

## 🔧 Common Fixes

### Clear User Name (Testing)
```javascript
localStorage.removeItem('ai-literacy-user-name')
```

### TypeScript Errors
```bash
npx tsc --noEmit 2>&1 | grep "error TS"
```

### Find Large Files
```bash
find client/src -name "*.tsx" -exec wc -l {} \; | sort -rn | head -10
```

### Console Logs
```bash
grep -r "console.log" client/src --include="*.tsx" --include="*.ts"
```

## 🎯 Module Props Pattern
```typescript
interface ModuleProps {
  userName?: string;
  onComplete?: () => void;
}
```

## 🔑 Environment Variables
```
VITE_GOOGLE_API_KEY      # Required
GEMINI_API_KEY           # Optional
AI_LITERACY_BOT_API_KEY  # Optional
```

## 📊 Large Modules (Need Refactoring)
1. IntroductionToPromptingModule - 2672 lines
2. LLMLimitationsModule - 2078 lines  
3. IntroToGenAIModule - 1730 lines

## 🐛 Known Issues
- GameModule.tsx has import errors
- Replit-cartographer warnings (harmless)
- Some components > 1000 lines

## ✅ Testing Checklist
- [ ] Homepage loads
- [ ] Module cards display
- [ ] URL copying works
- [ ] Name entry appears
- [ ] Certificates generate
- [ ] Direct URLs work
- [ ] Videos play
- [ ] Activities function

## 🤖 AI Commands
```bash
# Large analysis (uses Gemini)
"Analyze all modules for patterns"

# Quick review (uses Claude)
"Check HomePage component"

# Security audit (uses Gemini)
"Review all API integrations"
```

## 📝 Git Commands
```bash
git status
git add .
git commit -m "feat: description"
git push
```

## 🔍 Quick Searches
```bash
# Find component
find . -name "*ComponentName*"

# Search for text
grep -r "searchterm" client/src

# Find imports
grep -r "import.*ModuleName" client/src
```

---
*Keep this reference handy for quick development tasks*