# Privacy Data Rights Activity - Integration Guide

This guide provides step-by-step instructions for integrating the Privacy Data Rights activity into your existing Replit educational platform.

## 📋 Prerequisites Checklist

Before starting, ensure your target project has:

- [ ] React 18+ with TypeScript
- [ ] Express.js server
- [ ] Vite as the build tool
- [ ] Tailwind CSS configured
- [ ] Path aliases (`@/`) configured
- [ ] Git for version control (recommended)

## 🚀 Step-by-Step Integration

### Step 1: Backup Your Project

Create a backup or commit your current work:

```bash
git add .
git commit -m "Backup before integrating privacy-data-rights activity"
```

### Step 2: Copy Files to Your Project

Copy all files maintaining the directory structure:

```bash
# Navigate to the privacy-data-rights-package directory
cd privacy-data-rights-package

# Copy client files
cp -r client/src/* /path/to/your/project/client/src/

# Copy server files
cp -r server/routes/* /path/to/your/project/server/routes/
```

**What gets copied:**
```
Your Project:
  client/src/
    ├── pages/activities/
    │   └── PrivacyDataRightsActivity.tsx           [NEW]
    ├── components/
    │   ├── modules/
    │   │   └── PrivacyDataRightsModuleWithSimulation.tsx  [NEW]
    │   ├── CertificateGenerator.tsx                [NEW or REPLACE]
    │   ├── NameEntry.tsx                           [NEW or REPLACE]
    │   ├── ActivityWrapper.tsx                     [NEW or REPLACE]
    │   ├── DeveloperPanel.tsx                      [NEW or REPLACE]
    │   ├── SecretKeyPrompt.tsx                     [NEW or REPLACE]
    │   └── ui/                                     [NEW or MERGE]
    ├── hooks/
    │   └── useDeveloperMode.tsx                    [NEW or REPLACE]
    ├── context/
    │   ├── ThemeContext.tsx                        [NEW or REPLACE]
    │   ├── GameContext.tsx                         [NEW or REPLACE]
    │   └── ModuleSessionContext.tsx                [NEW or REPLACE]
    └── lib/
        └── utils.ts                                [NEW or REPLACE]

  server/routes/
    └── gemini.ts                                   [NEW or MERGE]
```

**Important Notes:**
- If you already have similar components (e.g., `CertificateGenerator`), you may need to merge or rename them
- Context files may conflict if you have existing contexts - see Step 7 for handling conflicts

### Step 3: Install Dependencies

Install all required npm packages:

```bash
# Core dependencies
npm install react@^18.3.1 react-dom@^18.3.1 framer-motion@^11.18.2 lucide-react@^0.453.0

# API dependencies
npm install @google/generative-ai@^0.24.1

# Utilities
npm install html2canvas@^1.4.1 class-variance-authority@^0.7.1 clsx@^2.1.1 tailwind-merge@^2.6.0

# Routing (if not already installed)
npm install wouter@^3.3.5

# UI Components (Radix UI)
npm install @radix-ui/react-dialog@^1.1.7 @radix-ui/react-toast@^1.2.7 @radix-ui/react-tooltip@^1.2.0 @radix-ui/react-slot@^1.2.0 @radix-ui/react-label@^2.1.3

# Styling (if not already installed)
npm install -D tailwindcss@^3.4.17 tailwindcss-animate@^1.0.7 autoprefixer@^10.4.20 postcss@^8.4.47
```

**Alternative - Install all at once:**
```bash
npm install react react-dom framer-motion lucide-react @google/generative-ai html2canvas class-variance-authority clsx tailwind-merge wouter @radix-ui/react-dialog @radix-ui/react-toast @radix-ui/react-tooltip @radix-ui/react-slot @radix-ui/react-label
```

### Step 4: Configure Environment Variables

Add the Gemini API key to your `.env` file:

```bash
# In your project root, edit .env
GEMINI_API_KEY=your_api_key_here
```

**Get a Gemini API Key:**
1. Visit https://makersuite.google.com/app/apikey or https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

**Test API Key:**
```bash
# Optional: Test that the API key works
curl -H 'Content-Type: application/json' \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

### Step 5: Register Server Routes

Add the Gemini API routes to your server configuration.

**Option A: If you have a separate routes file (server/routes.ts):**

```typescript
// In server/routes.ts
import geminiRouter from './routes/gemini';

export function registerRoutes(app: Express) {
  // ... your existing routes ...

  // Add this line
  app.use('/api/gemini', geminiRouter);
}
```

**Option B: If you configure routes in server/index.ts:**

```typescript
// In server/index.ts
import geminiRouter from './routes/gemini';

// Add this line after your other app.use() calls
app.use('/api/gemini', geminiRouter);
```

**Verify routes are registered:**
After starting your server, check that these endpoints respond:
- POST http://localhost:5000/api/gemini/feedback
- POST http://localhost:5000/api/gemini/generate

### Step 6: Add Route to Your App

Update your main app router to include the new activity.

**In client/src/App.tsx:**

```typescript
// Add import at the top
import PrivacyDataRightsActivity from '@/pages/activities/PrivacyDataRightsActivity';

// Inside your Router/Switch component, add:
<Route path="/activity/privacy-data-rights" component={PrivacyDataRightsActivity} />
```

**Full Example:**
```typescript
import { Switch, Route } from "wouter";
import PrivacyDataRightsActivity from '@/pages/activities/PrivacyDataRightsActivity';
// ... other imports

function Router() {
  return (
    <Switch>
      {/* Your existing routes */}
      <Route path="/" component={HomePage} />

      {/* Add this new route */}
      <Route path="/activity/privacy-data-rights" component={PrivacyDataRightsActivity} />

      {/* Your 404 route */}
      <Route component={NotFound} />
    </Switch>
  );
}
```

### Step 7: Handle Context Provider Conflicts

The activity requires three context providers. Check if you already have these in your app.

**Check your existing App.tsx:**

```typescript
// Look for existing providers
<ThemeProvider>
  <GameProvider>
    <ModuleSessionProvider>
      {/* Your app */}
    </ModuleSessionProvider>
  </GameProvider>
</ThemeProvider>
```

**Scenario A: You DON'T have these contexts**
Simply import and use the provided contexts:

```typescript
import { ThemeProvider } from '@/context/ThemeContext';
import { GameProvider } from '@/context/GameContext';
import { ModuleSessionProvider } from '@/context/ModuleSessionContext';

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <ModuleSessionProvider>
          <Router />
        </ModuleSessionProvider>
      </GameProvider>
    </ThemeProvider>
  );
}
```

**Scenario B: You have SOME of these contexts**
- If you have `ThemeProvider` but not the others, just add the missing ones
- If your existing contexts have similar functionality, you may need to merge them

**Scenario C: You have ALL these contexts but they're different**
You have two options:

1. **Rename the imported contexts** (easier):
```typescript
// In PrivacyDataRightsActivity.tsx, change imports:
import { ThemeContext as PrivacyThemeContext } from '@/context/ThemeContext';
// Then update all usages in the activity files
```

2. **Merge functionality** (recommended for long-term):
- Review both versions of each context
- Merge the functionality into your existing contexts
- This requires code understanding and may take more time

### Step 8: Verify Tailwind Configuration

Ensure your `tailwind.config.ts` includes the correct content paths:

```typescript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
    "./client/index.html",
  ],
  theme: {
    extend: {
      // Your custom theme
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
```

**If you don't have `tailwindcss-animate`:**
```bash
npm install -D tailwindcss-animate
```

### Step 9: Verify TypeScript Configuration

Check that your `tsconfig.json` has the correct path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"]
    },
    // ... other options
  }
}
```

**And in vite.config.ts:**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
    },
  },
  // ... other config
});
```

### Step 10: Test the Integration

1. **Start your development server:**
```bash
npm run dev
```

2. **Navigate to the activity:**
```
http://localhost:5000/activity/privacy-data-rights
```

3. **Test the flow:**
   - [ ] Name entry screen appears
   - [ ] Activity loads without errors
   - [ ] Simulation plays correctly
   - [ ] Quiz section works
   - [ ] AI feedback generates (check network tab for /api/gemini/feedback)
   - [ ] Certificate downloads successfully

4. **Test Developer Mode:**
   - Press **Shift + D** three times rapidly
   - Developer panel should appear
   - Test navigation buttons
   - Test auto-complete features

### Step 11: Troubleshooting Common Issues

#### Issue: "Cannot find module '@/components/...'"

**Solution:**
- Check that `@/*` path alias is configured in both `tsconfig.json` and `vite.config.ts`
- Restart your dev server after config changes
- Clear Vite cache: `rm -rf node_modules/.vite`

#### Issue: "Gemini API returns 404 or 500"

**Solution:**
- Verify `GEMINI_API_KEY` is in your `.env` file
- Check that the key is valid (test with curl)
- Ensure the gemini router is registered in your server
- Check server logs for error messages
- Restart your server after adding env variables

#### Issue: "Certificate download doesn't work"

**Solution:**
- Ensure `html2canvas` is installed: `npm install html2canvas`
- Check browser console for errors
- Verify the CertificateGenerator component was copied correctly
- Test in a different browser

#### Issue: Context errors (e.g., "Cannot read property 'theme' of undefined")

**Solution:**
- Ensure all three context providers wrap your app
- Check that imports are correct
- Verify context files were copied to the right location
- Look for naming conflicts with existing contexts

#### Issue: Styling looks wrong

**Solution:**
- Ensure Tailwind CSS is configured correctly
- Check that `tailwindcss-animate` plugin is installed
- Verify content paths in `tailwind.config.ts` include the new files
- Run build to regenerate CSS: `npm run build`

#### Issue: TypeScript errors

**Solution:**
- Install missing type definitions: `npm install -D @types/react @types/react-dom @types/node`
- Check that all imports resolve correctly
- Run type check: `npx tsc --noEmit`

### Step 12: Optional Customizations

#### Customize Activity Content

Edit the main module file to change content:
```
client/src/components/modules/PrivacyDataRightsModuleWithSimulation.tsx
```

Key sections to customize:
- **Lines 94-107**: Chat simulation scripts
- **Lines 519-572**: FERPA/COPPA law explanations
- **Lines 645-691**: AI tools comparison data
- **Lines 1149-1170**: Teacher quiz questions

#### Customize Styling

The activity uses Tailwind classes throughout. To change colors/styling:
```typescript
// Example: Change primary color from blue to purple
// Find: className="bg-blue-600"
// Replace: className="bg-purple-600"
```

#### Customize AI Feedback Prompts

Edit the API routes to change AI behavior:
```
server/routes/gemini.ts
```

Key areas:
- **Line 17**: System prompt for feedback
- **Line 45**: Prompt analysis system message
- **Line 99**: RTF framework analysis prompt

#### Add Analytics Tracking

Add tracking to monitor activity usage:
```typescript
// In PrivacyDataRightsActivity.tsx
useEffect(() => {
  // Track activity start
  analytics.track('privacy_activity_started', { timestamp: Date.now() });
}, []);
```

## ✅ Final Checklist

Before considering the integration complete:

- [ ] All files copied successfully
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Server routes registered
- [ ] App route added
- [ ] Context providers configured
- [ ] Tailwind config updated
- [ ] TypeScript config verified
- [ ] Activity loads without errors
- [ ] Simulation works correctly
- [ ] Quiz functionality works
- [ ] AI feedback generates
- [ ] Certificate downloads
- [ ] Developer mode accessible
- [ ] No console errors
- [ ] Mobile responsive (test on different screen sizes)

## 🎉 You're Done!

The Privacy Data Rights activity should now be fully integrated into your platform. Students and educators can access it at:

```
https://your-site.repl.co/activity/privacy-data-rights
```

## 📚 Additional Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **Radix UI Docs**: https://www.radix-ui.com/
- **Framer Motion Docs**: https://www.framer.com/motion/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs

## 🐛 Still Having Issues?

If you encounter problems not covered in this guide:

1. Check the browser console for error messages
2. Check the server logs for API errors
3. Verify all files were copied correctly
4. Compare your configuration with the original project
5. Try a fresh install of dependencies: `rm -rf node_modules && npm install`

---

**Need Help?** Review the README.md for more troubleshooting tips.

**Version**: 1.0.0
**Last Updated**: October 2024
