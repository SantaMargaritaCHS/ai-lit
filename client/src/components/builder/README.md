# Module Builder Components

This directory contains all components for the **Module Builder** feature - a visual interface for creating new educational modules without writing code.

## 🚨 Critical Design Principle: ISOLATION

**This builder is completely isolated from the existing module system.**

- **No imports** from builder components into existing modules
- **No modifications** to existing module files
- **Separate routing** (`/builder`) from module routes (`/module/:moduleId`)
- **Separate component tree** - if builder breaks, modules continue working

## 📁 Directory Structure

```
client/src/components/builder/
├── README.md                       # This file
├── index.ts                        # Exports
├── ModuleBuilderPage.tsx           # Main container (Phase 1.1) ✅
├── VideoSegmentEditor.tsx          # Video editor (Phase 1.2) ⏳
├── ActivityCatalog.tsx             # Activity browser (Phase 1.3) ⏳
├── ModuleAssembly.tsx              # Drag-and-drop assembly (Phase 1.4) ⏳
├── ModulePreview.tsx               # Preview renderer (Phase 1.5) ⏳
├── JSONExporter.tsx                # Export/import (Phase 1.6) ⏳
├── ai/                             # Phase 2: AI generation components
│   ├── QuizGenerator.tsx
│   ├── ReflectionGenerator.tsx
│   ├── ScenarioGenerator.tsx
│   └── ContentReviewer.tsx
├── codegen/                        # Phase 3: Code generation components
│   ├── CodeGenerator.tsx
│   ├── CodePreview.tsx
│   └── templates/
└── validation/                     # Phase 4: Validation tools
    ├── AccessibilityValidator.tsx
    ├── StructureValidator.tsx
    └── ContentValidator.tsx
```

## 🎯 Phase 1: MVP Builder (Current Phase)

**Goal**: Visual module assembly with JSON export

### Completed Components:
- [x] `ModuleBuilderPage.tsx` - Main container with welcome screen

### In Progress:
- [ ] `VideoSegmentEditor.tsx` - Firebase Storage video URL input, time-code segments
- [ ] `ActivityCatalog.tsx` - Browse activities from MODULE_ACTIVITY_INVENTORY.md
- [ ] `ModuleAssembly.tsx` - Drag-and-drop interface for assembling modules
- [ ] `ModulePreview.tsx` - Runtime rendering of assembled module
- [ ] `JSONExporter.tsx` - Export/import module definitions

## 🔌 Integration Points

### Shared Utilities (OK to Import):
- `@/lib/progressPersistence` - Progress saving
- `@/utils/aiEducationFeedback` - AI validation
- `@/services/geminiClient` - Gemini API
- `@/context/DevModeContext` - Dev Mode integration
- `@/components/ui/*` - shadcn/ui components

### Forbidden Imports:
- ❌ Any existing module files (`client/src/components/modules/*`)
- ❌ Module-specific components
- ❌ Anything that would create circular dependencies

## 📖 Reference Documentation

- **BUILDER_PROGRESS.md** - Full 16-week implementation plan with phases, tasks, and verification gates
- **MODULE_ACTIVITY_INVENTORY.md** - Comprehensive catalog of reusable activities
- **MODULE_BUILDER_FEASIBILITY.md** - Feasibility analysis and architecture decisions

## 🧪 Testing Strategy

After each phase:
1. Test builder functionality
2. **Verify all 9 existing modules still work** (critical!)
3. Check TypeScript compilation: `npx tsc --noEmit`
4. Test Dev Mode in existing modules
5. Test Progress Persistence in existing modules

## 🚀 Development Workflow

1. **Read BUILDER_PROGRESS.md** to understand current phase
2. **Implement components** following existing module patterns
3. **Update BUILDER_PROGRESS.md** with completion status
4. **Verify isolation** - test existing modules
5. **Commit incrementally** with clear messages

## 🎨 Design Principles

### Consistency:
- Use shadcn/ui components
- Follow Tailwind CSS patterns from existing modules
- Maintain accessibility standards (WCAG 2.1 AA)

### Accessibility:
- ALWAYS specify text color with background color
- Minimum contrast ratio: 4.5:1
- Semantic HTML
- ARIA labels on interactive elements

### TypeScript:
- Define interfaces for all props
- No `any` types
- Strict mode compliant

## 📝 Notes

- **Phase 1** (Weeks 1-6): Visual assembly, JSON export
- **Phase 2** (Weeks 7-10): AI content generation
- **Phase 3** (Weeks 11-14): TypeScript code generation
- **Phase 4** (Weeks 15-16): Validation, documentation, polish

---

**Last Updated**: 2025-11-10
**Current Phase**: 1.1 - Foundation Setup
