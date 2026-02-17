# Privacy Data Rights Activity - Standalone Package

This package contains the complete **Privacy Data Rights** educational activity module that can be integrated into any similar React + Express educational platform.

## 📋 Overview

This interactive educational module teaches students and educators about:
- How AI systems store and reuse personal data
- Real risks of data leaks between different users
- Legal implications (FERPA/COPPA) for educational settings
- Practical steps to protect privacy when using AI tools

### Features
- **Interactive simulation** showing how AI can leak personal data
- **Animated step-by-step learning** experience
- **Teacher education quiz** with FERPA/COPPA information
- **AI-powered feedback** using Google Gemini API
- **Certificate generation** upon completion
- **Developer mode** for testing and navigation

## 🏗️ Package Structure

```
privacy-data-rights-package/
├── README.md                          # This file
├── INTEGRATION_GUIDE.md               # Step-by-step integration instructions
├── dependencies.json                  # Required npm packages
├── client/src/
│   ├── pages/activities/
│   │   └── PrivacyDataRightsActivity.tsx          # Main activity page wrapper
│   ├── components/
│   │   ├── modules/
│   │   │   └── PrivacyDataRightsModuleWithSimulation.tsx  # Core module (1644 lines)
│   │   ├── CertificateGenerator.tsx               # Certificate generation component
│   │   ├── NameEntry.tsx                          # Student name entry form
│   │   ├── ActivityWrapper.tsx                    # Layout wrapper
│   │   ├── DeveloperPanel.tsx                     # Developer testing panel
│   │   ├── SecretKeyPrompt.tsx                    # Developer mode unlock
│   │   └── ui/                                    # Shared UI components
│   │       ├── card.tsx
│   │       ├── button.tsx
│   │       ├── badge.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       └── tooltip.tsx
│   ├── hooks/
│   │   └── useDeveloperMode.tsx                   # Developer mode hook
│   ├── context/
│   │   ├── ThemeContext.tsx                       # Theme provider
│   │   ├── GameContext.tsx                        # Game state provider
│   │   └── ModuleSessionContext.tsx               # Module session tracking
│   └── lib/
│       └── utils.ts                               # Utility functions (cn helper)
└── server/
    └── routes/
        └── gemini.ts                              # Gemini API routes for AI feedback
```

## 📦 Prerequisites

Your target Replit site should have:
- React 18+ with TypeScript
- Express.js server
- Vite as build tool
- Tailwind CSS
- Path aliases configured (`@/` pointing to `client/src/`)

## 🔧 Installation Steps

### 1. Copy Files

Copy all files from this package to your target project, maintaining the directory structure:

```bash
# From the privacy-data-rights-package directory
cp -r client/src/* /path/to/your/project/client/src/
cp -r server/* /path/to/your/project/server/
```

### 2. Install Dependencies

Install the required npm packages listed in `dependencies.json`:

```bash
npm install framer-motion lucide-react @google/generative-ai html2canvas
```

**Core Dependencies:**
- `framer-motion`: ^11.18.2 - Animations
- `lucide-react`: ^0.453.0 - Icons
- `@google/generative-ai`: ^0.24.1 - Gemini API client
- `html2canvas`: ^1.4.1 - Certificate generation
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `wouter`: ^3.3.5 - Routing (or react-router-dom)

**UI Component Dependencies** (if not already installed):
- `@radix-ui/react-*` packages (dialog, toast, tooltip, etc.)
- `class-variance-authority`: ^0.7.1
- `clsx`: ^2.1.1
- `tailwind-merge`: ^2.6.0
- `tailwindcss-animate`: ^1.0.7

### 3. Configure API Routes

Add the Gemini API routes to your server's route configuration:

**In your `server/routes.ts` or `server/index.ts`:**

```typescript
import geminiRouter from './routes/gemini';

// Add this route
app.use('/api/gemini', geminiRouter);
```

### 4. Set Up Environment Variables

Add your Google Gemini API key to your `.env` file:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
# or
GOOGLE_API_KEY=your_gemini_api_key_here
```

**Get a Gemini API Key:**
1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add it to your `.env` file

### 5. Add Route to Your App

**In your `client/src/App.tsx`:**

```typescript
import PrivacyDataRightsActivity from '@/pages/activities/PrivacyDataRightsActivity';

// Add this route inside your Router/Switch component:
<Route path="/activity/privacy-data-rights" component={PrivacyDataRightsActivity} />
```

### 6. Verify Path Aliases

Ensure your `tsconfig.json` has path aliases configured:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./client/src/*"]
    }
  }
}
```

And your `vite.config.ts`:

```typescript
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
    },
  },
});
```

## 🎯 Usage

Once integrated, access the activity at:
```
http://your-site.repl.co/activity/privacy-data-rights
```

### Student Flow:
1. Enter their name
2. Complete the interactive AI privacy simulation
3. Learn about FERPA/COPPA laws
4. Complete a teacher education quiz
5. Write reflections with AI feedback
6. Download a completion certificate

### Developer Mode:
Press **Shift + D** three times to access developer mode for:
- Quick navigation between activity sections
- Auto-complete functionality for testing
- Activity progress tracking

## 🔌 API Endpoints Used

The activity uses these API endpoints:

- **POST /api/gemini/feedback** - Get AI feedback on student reflections
- **POST /api/gemini/generate** - Generate AI responses for simulations

## 🎨 Styling

The activity uses Tailwind CSS with custom styling. Ensure your `tailwind.config.ts` includes:

```typescript
export default {
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Your theme extensions
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 🐛 Troubleshooting

### Common Issues:

1. **"Cannot find module '@/components/...'"**
   - Check that path aliases are configured correctly in `tsconfig.json` and `vite.config.ts`

2. **"Gemini API error"**
   - Verify `GEMINI_API_KEY` is set in `.env`
   - Check that the API key is valid
   - Ensure the gemini route is registered in your server

3. **Certificate download not working**
   - Ensure `html2canvas` is installed
   - Check browser console for errors

4. **Missing UI components**
   - Install all `@radix-ui/react-*` dependencies
   - Copy all files from the `ui/` folder

5. **Context provider errors**
   - Ensure `ThemeContext`, `GameContext`, and `ModuleSessionContext` are copied
   - Wrap your app with these providers in `App.tsx`

## 📚 Additional Notes

### Context Providers
The activity expects these context providers to be available:
- **ThemeProvider**: Manages light/dark theme
- **GameProvider**: Tracks user progress
- **ModuleSessionProvider**: Manages module sessions

If your app doesn't have these, you can:
1. Use the provided context files
2. Modify the activity to remove context dependencies
3. Create stub contexts that match the expected interface

### Customization

You can customize:
- **Activity content**: Edit `PrivacyDataRightsModuleWithSimulation.tsx`
- **Styling**: Modify Tailwind classes throughout the components
- **AI prompts**: Update prompts in the Gemini API calls
- **Certificate design**: Edit `CertificateGenerator.tsx`

## 📄 License

This activity module is provided as-is for educational purposes.

## 🤝 Support

For issues or questions:
1. Check the `INTEGRATION_GUIDE.md` for detailed integration steps
2. Review the troubleshooting section above
3. Check that all dependencies are installed
4. Verify your environment configuration

---

**Version**: 1.0.0
**Last Updated**: October 2024
