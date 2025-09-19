# AI Literacy Student Platform

A clean, focused version of the AI Literacy Learning Platform with only the essential 8 modules.

## Features

- 8 Core AI Literacy Modules
- Direct link access for easy sharing
- Firebase video hosting integration
- Certificate generation
- Clean, minimal interface
- No authentication required
- No analytics or tracking

## Modules Included

1. **What is AI?** - Beginner introduction to AI concepts
2. **Introduction to Generative AI** - Understanding generative AI basics
3. **Introduction to Large Language Models** - LLM fundamentals
4. **Understanding Large Language Models** - Deeper dive into LLMs
5. **Critical Thinking: LLM Limitations** - Understanding AI limitations
6. **Privacy and Data Rights** - AI privacy considerations
7. **AI Environmental Impact** - Environmental implications of AI
8. **Introduction to Prompting** - Basic prompt engineering

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-literacy-student.git
cd ai-literacy-student
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env` and add your Firebase API key:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase API key:
```
VITE_GOOGLE_API_KEY=your_firebase_api_key_here
```

**Important:** Use the same Firebase project as your main platform to share videos.

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the platform.

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variable `VITE_GOOGLE_API_KEY` in Vercel settings
4. Deploy

### Deploy to Netlify

1. Push to GitHub
2. Connect your GitHub repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable in Netlify settings

### Deploy to GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
3. Run: `npm run deploy`

## Direct Link Format

Share direct links to modules:

```
https://your-domain.com/module/what-is-ai
https://your-domain.com/module/intro-to-gen-ai
https://your-domain.com/module/intro-to-llms
https://your-domain.com/module/understanding-llms
https://your-domain.com/module/llm-limitations
https://your-domain.com/module/privacy-data-rights
https://your-domain.com/module/ai-environmental-impact
https://your-domain.com/module/introduction-to-prompting
```

## Firebase Setup (If Creating New Project)

If you want to use a separate Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Firebase Storage
4. Get your Web API Key from Project Settings
5. Update `.env` with your new API key

## Optional Features

### Enable AI Feedback (Optional)

If you want AI-powered feedback, add these to `.env`:

```
GEMINI_API_KEY=your_gemini_api_key
AI_LITERACY_BOT_API_KEY=your_ai_bot_key
```

### Developer Mode

Add `?dev=true` to any module URL to enable developer mode:

```
https://your-domain.com/module/what-is-ai?dev=true
```

Then enter the secret key: `752465Ledezma`

## Project Structure

```
student-platform/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── modules/      # 8 core modules
│   │   │   ├── ui/           # UI components
│   │   │   └── ...
│   │   ├── pages/            # HomePage and ModulePage
│   │   ├── lib/              # Firebase config
│   │   ├── services/         # Video services
│   │   └── App.tsx           # Main app with routing
│   └── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## Troubleshooting

### Videos Not Loading
- Check that `VITE_GOOGLE_API_KEY` is set correctly
- Ensure you're using the same Firebase project as the main platform
- Check browser console for errors

### Module Not Found
- Verify the module ID in the URL matches one of the 8 modules
- Check that all files were copied correctly

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check for any missing imports in the console

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT