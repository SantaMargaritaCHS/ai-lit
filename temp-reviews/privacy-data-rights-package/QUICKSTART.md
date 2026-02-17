# Quick Start Guide - Privacy Data Rights Activity

Get up and running in 5 minutes!

## ⚡ Fast Track Installation

### 1. Copy Files (2 minutes)
```bash
# From the privacy-data-rights-package directory
cp -r client/src/* /path/to/your/project/client/src/
cp -r server/routes/* /path/to/your/project/server/routes/
```

### 2. Install Dependencies (1 minute)
```bash
npm install framer-motion lucide-react @google/generative-ai html2canvas class-variance-authority clsx tailwind-merge @radix-ui/react-dialog @radix-ui/react-toast @radix-ui/react-tooltip @radix-ui/react-slot @radix-ui/react-label tailwindcss-animate
```

### 3. Set API Key (30 seconds)
Add to your `.env` file:
```bash
GEMINI_API_KEY=your_key_here
```
Get a key: https://aistudio.google.com/apikey

### 4. Add Routes (1 minute)

**In server/routes.ts or server/index.ts:**
```typescript
import geminiRouter from './routes/gemini';
app.use('/api/gemini', geminiRouter);
```

**In client/src/App.tsx:**
```typescript
import PrivacyDataRightsActivity from '@/pages/activities/PrivacyDataRightsActivity';
// Add in your router:
<Route path="/activity/privacy-data-rights" component={PrivacyDataRightsActivity} />
```

### 5. Test (30 seconds)
```bash
npm run dev
# Navigate to: http://localhost:5000/activity/privacy-data-rights
```

## ✅ Success Checklist

- [ ] Activity page loads
- [ ] No console errors
- [ ] Simulation plays
- [ ] AI feedback works
- [ ] Certificate downloads

## 🚨 Quick Troubleshooting

**Path errors?** → Check `tsconfig.json` has `"@/*": ["./client/src/*"]`

**API errors?** → Verify `GEMINI_API_KEY` in `.env` and restart server

**Missing UI?** → Run `npm install` again

**Context errors?** → Wrap your app with ThemeProvider, GameProvider, ModuleSessionProvider

## 📖 Need More Help?

See the full **INTEGRATION_GUIDE.md** for detailed step-by-step instructions.

---

**Estimated Time**: 5-10 minutes for experienced developers
