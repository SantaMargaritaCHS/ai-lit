# File Manifest - Privacy Data Rights Activity Package

Complete list of all files included in this package and their purposes.

## 📄 Documentation Files

| File | Size | Purpose |
|------|------|---------|
| README.md | ~10KB | Main documentation with overview, installation, and troubleshooting |
| INTEGRATION_GUIDE.md | ~16KB | Detailed step-by-step integration instructions |
| QUICKSTART.md | ~2KB | 5-minute quick start guide |
| dependencies.json | ~2KB | List of all required npm packages |
| FILE_MANIFEST.md | This file | Complete file listing and descriptions |

## 🎯 Client-Side Files

### Main Activity Files

| File | Lines | Size | Purpose |
|------|-------|------|---------|
| client/src/pages/activities/PrivacyDataRightsActivity.tsx | 66 | ~2KB | Activity page wrapper with name entry and certificate flow |
| client/src/components/modules/PrivacyDataRightsModuleWithSimulation.tsx | 1644 | ~79KB | Core module with simulation, quiz, and exit ticket |

### Shared Components

| File | Purpose |
|------|---------|
| client/src/components/CertificateGenerator.tsx | Generates downloadable completion certificate using html2canvas |
| client/src/components/NameEntry.tsx | Student name entry form at activity start |
| client/src/components/ActivityWrapper.tsx | Common layout wrapper for activities |
| client/src/components/DeveloperPanel.tsx | Developer testing panel (Shift+D x3 to activate) |
| client/src/components/SecretKeyPrompt.tsx | Secret key entry dialog for developer mode |

### UI Components (Radix UI + Tailwind)

| File | Purpose |
|------|---------|
| client/src/components/ui/card.tsx | Card container component |
| client/src/components/ui/button.tsx | Button component with variants |
| client/src/components/ui/badge.tsx | Badge/pill component for labels |
| client/src/components/ui/toast.tsx | Toast notification component |
| client/src/components/ui/toaster.tsx | Toast container/provider |
| client/src/components/ui/tooltip.tsx | Tooltip overlay component |

### Hooks

| File | Purpose |
|------|---------|
| client/src/hooks/useDeveloperMode.tsx | React hook for developer mode state management |

### Context Providers

| File | Purpose |
|------|---------|
| client/src/context/ThemeContext.tsx | Theme management (light/dark mode) |
| client/src/context/GameContext.tsx | User progress and gamification state |
| client/src/context/ModuleSessionContext.tsx | Module session tracking and analytics |

### Utilities

| File | Purpose |
|------|---------|
| client/src/lib/utils.ts | Helper function for class name merging (cn) |

## 🖥️ Server-Side Files

| File | Lines | Size | Purpose |
|------|-------|------|---------|
| server/routes/gemini.ts | 282 | ~10KB | Gemini API routes for AI feedback and content generation |

### API Endpoints in gemini.ts:

- **POST /api/gemini/feedback** - Get AI feedback on student reflections
- **POST /api/gemini/generate** - Generate AI responses for simulations
- **POST /api/gemini/analyze-prompt** - Analyze prompt quality
- **POST /api/gemini/analyze-rtf-prompt** - Analyze RTF framework usage
- **POST /api/gemini/transform-content** - Transform content to different formats

## 📊 File Statistics

**Total Files**: 31
- Documentation: 5
- Client Components: 18
- Server Files: 1
- Configuration: 1

**Total Code Size**: ~115KB
- Client Code: ~95KB
- Server Code: ~10KB
- Documentation: ~30KB

**Languages**:
- TypeScript/TSX: 25 files
- Markdown: 5 files
- JSON: 1 file

## 🔗 Dependencies

### Direct Dependencies (19 packages)
See `dependencies.json` for complete list with versions.

Key dependencies:
- React ecosystem (react, react-dom)
- Animation (framer-motion)
- Icons (lucide-react)
- AI API (@google/generative-ai)
- UI components (@radix-ui/react-*)
- Utilities (clsx, tailwind-merge)

### Peer Dependencies
- Express.js (server)
- Vite (build tool)
- Tailwind CSS (styling)
- TypeScript (compilation)

## 📝 Usage Notes

### Which Files Can Be Modified?

**Safe to modify:**
- ✅ PrivacyDataRightsModuleWithSimulation.tsx (customize content)
- ✅ gemini.ts (customize AI prompts)
- ✅ CertificateGenerator.tsx (customize certificate design)

**Modify with caution:**
- ⚠️ Context files (if you have existing contexts)
- ⚠️ UI components (if you have custom UI design system)

**Don't modify:**
- ❌ Core logic in PrivacyDataRightsActivity.tsx (flow control)
- ❌ useDeveloperMode.tsx (unless you understand the logic)

### Which Files Are Optional?

**Required files** (activity won't work without these):
- PrivacyDataRightsActivity.tsx
- PrivacyDataRightsModuleWithSimulation.tsx
- All UI components
- gemini.ts server route
- utils.ts

**Optional files** (can be replaced with your own):
- DeveloperPanel.tsx / SecretKeyPrompt.tsx / useDeveloperMode.tsx (developer features)
- ThemeContext.tsx / GameContext.tsx / ModuleSessionContext.tsx (if you have existing contexts)
- CertificateGenerator.tsx (if you have your own certificate system)

## 🔍 File Relationships

```
PrivacyDataRightsActivity.tsx
  ├── Uses: NameEntry → ActivityWrapper → PrivacyDataRightsModule → CertificateGenerator
  ├── Depends on: useDeveloperMode hook
  └── Renders: SecretKeyPrompt (developer mode)

PrivacyDataRightsModuleWithSimulation.tsx
  ├── Uses: Card, Button, Badge (UI components)
  ├── Uses: DeveloperPanel (developer mode)
  ├── Calls: /api/gemini/feedback (AI feedback)
  └── Depends on: framer-motion, lucide-react

gemini.ts (server)
  ├── Uses: @google/generative-ai
  └── Requires: GEMINI_API_KEY environment variable
```

## 📦 Integration Impact

### Files Added
- 26 new files

### Files Potentially Replaced
- 5 files (if you already have them):
  - CertificateGenerator.tsx
  - NameEntry.tsx
  - ActivityWrapper.tsx
  - Context files (3)

### Configuration Changes Needed
- .env (add GEMINI_API_KEY)
- App.tsx (add route)
- server/index.ts or routes.ts (register API routes)

---

**Package Version**: 1.0.0
**Last Updated**: October 2024
**Total Package Size**: ~145KB (code + docs)
