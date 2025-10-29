# AI Literacy Platform - Specialized Agents

This directory contains specialized Claude Code agents customized for the AI Literacy Student Platform. These agents help maintain code quality, accessibility compliance, and platform-specific architectural patterns.

## 🎯 Available Agents

### 1. **accessibility-tester**
Expert in WCAG 2.1 AA compliance for educational platforms.

**When to use:**
- Before merging any UI changes
- When creating new modules or components
- When users report visibility issues
- Before production deployment

**Key capabilities:**
- Checks for explicit text colors with backgrounds (critical rule)
- Verifies 4.5:1 contrast ratios
- Validates semantic HTML and ARIA attributes
- Tests keyboard navigation

**Example invocation:**
```
Please audit the Privacy & Data Rights module for accessibility compliance
```

---

### 2. **refactoring-specialist**
Expert in breaking down large modules while preserving platform patterns.

**When to use:**
- Module exceeds 1,000 lines
- Code is difficult to maintain
- Need to extract activities to separate files
- Preparing for major refactor

**Key capabilities:**
- Breaks modules into maintainable components
- Preserves Developer Mode integration (empty deps!)
- Preserves Progress Persistence
- Maintains self-contained module pattern

**Example invocation:**
```
Please refactor IntroductionToPromptingModule.tsx (2672 lines) into smaller components
```

---

### 3. **code-reviewer**
Expert in reviewing code for platform-specific patterns and quality.

**When to use:**
- Before committing changes
- After major feature implementation
- When preparing pull requests
- During module development

**Key capabilities:**
- Checks platform-specific patterns (Developer Mode, Progress Persistence, etc.)
- Finds accessibility violations
- Detects console.log statements
- Verifies TypeScript quality
- Identifies large files needing refactoring

**Example invocation:**
```
Please review the changes in IntroToLLMsModule.tsx
```

---

### 4. **frontend-developer**
Expert in building educational React modules for teenagers.

**When to use:**
- Creating new modules
- Adding interactive activities
- Implementing video-based content
- Building quizzes, reflections, simulations

**Key capabilities:**
- Implements self-contained module pattern
- Integrates Developer Mode (with empty deps!)
- Integrates Progress Persistence
- Implements AI validation + escape hatch
- Ensures WCAG 2.1 AA compliance

**Example invocation:**
```
Please create a new module about "AI Ethics in Healthcare" with 3 videos and 2 reflection activities
```

---

### 5. **qa-expert**
Expert in testing educational modules and platform features.

**When to use:**
- After module completion
- Before production deployment
- When bugs are reported
- To verify fixes work

**Key capabilities:**
- Tests Developer Mode navigation
- Tests Progress Persistence (save/resume/clear)
- Tests AI validation + escape hatch
- Tests video playback on production URL
- Verifies accessibility compliance
- Checks mobile responsiveness

**Example invocation:**
```
Please test the Ancient Compass module comprehensively
```

---

### 6. **documentation-engineer**
Expert in maintaining CLAUDE.md and .claude/guides/ documentation.

**When to use:**
- After architectural changes
- When new patterns are established
- When module status changes
- Before risky operations (checkpoint)

**Key capabilities:**
- Updates CLAUDE.md concisely
- Creates/updates detailed guides
- Creates checkpoints before risky operations
- Ensures documentation stays current

**Example invocation:**
```
Please update CLAUDE.md to reflect that Introduction to Prompting now has escape hatch implemented
```

---

### 7. **mcp-debugger**
Expert in automated browser testing via Railway MCP server.

**When to use:**
- Continuous regression testing across all 9 modules
- Automated accessibility compliance checks
- Production URL validation (videos, routing, features)
- Performance monitoring and optimization detection
- After significant code changes or before deployment

**Key capabilities:**
- 10 comprehensive test suites (150+ automated tests)
- Railway MCP server integration (real Chromium browser)
- Gemini Vision analysis for visual bugs
- Auto-collaboration with other agents on failures
- Detailed reports with reproduction steps and fixes

**Example invocation:**
```
MCP debugger, run full regression tests and report any issues
```

## 🚀 How to Invoke Agents

### Method 1: Direct Request
Simply ask for the agent by name:
```
accessibility-tester, please audit the new quiz component
```

### Method 2: Task Description
Describe the task and Claude will automatically invoke the appropriate agent:
```
I need to refactor this large module into smaller components
→ Automatically invokes refactoring-specialist
```

### Method 3: Multiple Agents
Request multiple agents for comprehensive work:
```
Please use code-reviewer to check my changes, then qa-expert to test them
```

## 📋 Recommended Workflows

### **Workflow 1: Creating a New Module**

1. **frontend-developer** - Implement module with all platform patterns
2. **accessibility-tester** - Verify WCAG 2.1 AA compliance
3. **code-reviewer** - Review for quality and patterns
4. **qa-expert** - Comprehensive testing
5. **documentation-engineer** - Update module status in CLAUDE.md

**Example:**
```
Please use frontend-developer to create a new module, then accessibility-tester to audit it, then qa-expert to test it
```

---

### **Workflow 2: Refactoring Large Module**

1. **refactoring-specialist** - Break down into components
2. **code-reviewer** - Verify patterns preserved
3. **qa-expert** - Test all functionality still works
4. **documentation-engineer** - Update docs if patterns changed

**Example:**
```
Please use refactoring-specialist to break down LLMLimitationsModule.tsx, then qa-expert to verify everything works
```

---

### **Workflow 3: Bug Fix**

1. **code-reviewer** - Identify issue patterns
2. **frontend-developer** or direct fix - Implement fix
3. **qa-expert** - Verify fix works + no regressions
4. **accessibility-tester** - If UI change, verify compliance

**Example:**
```
The escape hatch isn't appearing after 2 attempts. Please use code-reviewer to diagnose, then qa-expert to verify the fix
```

---

### **Workflow 4: Pre-Production Checklist**

1. **code-reviewer** - Final code quality check
2. **accessibility-tester** - Comprehensive WCAG audit
3. **qa-expert** - Full platform testing
4. **documentation-engineer** - Ensure docs current

**Example:**
```
We're about to deploy to production. Please run a comprehensive audit using code-reviewer, accessibility-tester, and qa-expert
```

---

### **Workflow 5: Adding AI Validation to Existing Module**

1. **frontend-developer** - Implement AI validation + escape hatch
2. **code-reviewer** - Verify pattern matches other modules
3. **qa-expert** - Test validation (valid/invalid/escape hatch)
4. **documentation-engineer** - Update module status

**Example:**
```
Please use frontend-developer to add AI validation with escape hatch to the Intro to LLMs module
```

## 🎓 Agent Specializations

### **For Accessibility Issues:**
- `accessibility-tester` - First choice
- `code-reviewer` - Can catch some issues
- `qa-expert` - Can test keyboard/screen reader

### **For Code Quality:**
- `code-reviewer` - First choice
- `refactoring-specialist` - For structural issues
- `frontend-developer` - For implementing fixes

### **For Testing:**
- `qa-expert` - First choice
- `accessibility-tester` - For WCAG testing specifically

### **For New Development:**
- `frontend-developer` - First choice
- `code-reviewer` - Review after implementation
- `qa-expert` - Test after implementation

### **For Documentation:**
- `documentation-engineer` - Always use for doc updates

## 💡 Pro Tips

### Tip 1: Chain Agents for Complete Work
```
Use frontend-developer to implement, then code-reviewer to review, then qa-expert to test
```

### Tip 2: Be Specific
```
❌ "Check my code"
✅ "code-reviewer, please check IntroToPromptingModule.tsx for platform pattern compliance"
```

### Tip 3: Pre-Deployment Checklist
Always run before deploying:
- code-reviewer (zero console.log, TypeScript clean)
- accessibility-tester (WCAG compliance)
- qa-expert (full functionality)

### Tip 4: Use Checkpoints Before Risky Operations
```
documentation-engineer, please create a checkpoint before I refactor this module
```

### Tip 5: Update Docs After Major Changes
```
documentation-engineer, please update CLAUDE.md to reflect the new validation pattern
```

## 🔍 Agent Decision Tree

```
Need to...

├─ Build something new?
│  └─ frontend-developer
│
├─ Fix code structure?
│  └─ refactoring-specialist
│
├─ Review code quality?
│  └─ code-reviewer
│
├─ Check accessibility?
│  └─ accessibility-tester
│
├─ Test functionality?
│  └─ qa-expert
│
└─ Update documentation?
   └─ documentation-engineer
```

## 📊 Agent Integration Matrix

| Agent | Works Well With | Common Sequence |
|-------|----------------|-----------------|
| frontend-developer | accessibility-tester, code-reviewer | Build → Review → Audit |
| refactoring-specialist | code-reviewer, qa-expert | Refactor → Review → Test |
| code-reviewer | qa-expert, accessibility-tester | Review → Test → Audit |
| accessibility-tester | qa-expert | Audit → Comprehensive Test |
| qa-expert | documentation-engineer | Test → Update Docs |
| documentation-engineer | Any agent | Any agent → Document |

## 🎯 Success Metrics

After using agents, verify:

- [ ] **Code Quality**: TypeScript compiles, no console.log
- [ ] **Accessibility**: WCAG 2.1 AA compliant, 4.5:1 contrast
- [ ] **Platform Patterns**: Developer Mode, Progress Persistence correct
- [ ] **Functionality**: All features work, no regressions
- [ ] **Documentation**: CLAUDE.md current, guides updated
- [ ] **Testing**: Comprehensive test coverage

## 🚨 Common Issues

### Issue: Agent not invoked
**Solution**: Use agent name explicitly
```
accessibility-tester, please audit this component
```

### Issue: Agent gives generic advice
**Solution**: Provide specific context
```
code-reviewer, check line 142 of IntroToPromptingModule.tsx for Developer Mode integration
```

### Issue: Agent misses platform-specific patterns
**Solution**: The agents are customized for this platform, trust their guidance. If something seems wrong, the pattern may have changed - consult CLAUDE.md.

## 📚 Further Reading

- **CLAUDE.md** - Main project instructions
- **.claude/guides/** - Detailed implementation guides
  - `dev-mode-integration.md` - Developer Mode pattern
  - `progress-persistence.md` - Progress save/load pattern
  - `student-feedback-validation.md` - AI validation pattern

## 🤝 Contributing

When adding new agents:
1. Follow the template from existing agents
2. Customize for platform-specific needs
3. Add to this README with clear use cases
4. Test with real platform scenarios
5. Update decision tree and integration matrix

---

**Remember**: These agents are your specialized assistants. Use them frequently and chain them together for comprehensive work. They're trained on the specific patterns and requirements of the AI Literacy Student Platform.
