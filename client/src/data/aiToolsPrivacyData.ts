/**
 * AI Tools Privacy Data
 *
 * Comprehensive comparison of school-safe and consumer AI tools
 * with privacy ratings, risks, and recommendations
 *
 * February 2026
 */

export interface AITool {
  name: string;
  icon: string;
  logo?: string;
  category: 'school-safe' | 'consumer';
  privacyRating: 'high' | 'medium' | 'low';
  description: string;
  whatItMeans: string;
  privacyFeatures?: string[];
  privacyRisks?: string[];
  recommendations: string;
  citationIds: number[];
  ageRestriction?: string;
  dataTraining: boolean;
  personalizedAds: boolean;
  dataRetention: string;
}

export const aiTools: AITool[] = [
  // SCHOOL-SAFE TOOLS
  {
    name: "Microsoft Copilot (13-17 Education Version)",
    icon: "🎓",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Microsoft_365_Copilot_Icon.svg",
    category: "school-safe",
    privacyRating: "high",
    description: "Enterprise-grade AI tool provided through your school with built-in student privacy protections.",
    whatItMeans: "Your school has a legal contract with Microsoft that prevents your conversations from being used to train public AI models or for advertising.",
    privacyFeatures: [
      "Conversations NOT used for AI model training",
      "NO personalized ads based on your chats",
      "Data protected under school agreement (FERPA compliant)",
      "Enterprise-grade security and encryption",
      "Admin controls and audit trails for schools"
    ],
    recommendations: "BEST CHOICE for schoolwork, college essays, or anything personal. This is designed specifically for students aged 13-17 with privacy as the default.",
    citationIds: [9, 10, 14],
    ageRestriction: "13-17 (school account required)",
    dataTraining: false,
    personalizedAds: false,
    dataRetention: "Controlled by school agreement"
  },
  {
    name: "SchoolAI",
    icon: "🏫",
    category: "school-safe",
    privacyRating: "high",
    description: "Purpose-built AI platform for K-12 education with FERPA and COPPA compliance.",
    whatItMeans: "Built from the ground up for schools. They legally cannot sell your data or use it to train AI models.",
    privacyFeatures: [
      "FERPA and COPPA compliant by design",
      "Never sells or shares student data",
      "Does NOT use conversations for AI training",
      "Content filtering and safety controls",
      "Teacher oversight and monitoring tools"
    ],
    recommendations: "Excellent choice if your school provides access. Designed specifically for educational use with strong privacy protections.",
    citationIds: [15, 16],
    dataTraining: false,
    personalizedAds: false,
    dataRetention: "School-controlled, can be deleted"
  },
  {
    name: "Snorkl",
    icon: "📚",
    category: "school-safe",
    privacyRating: "high",
    description: "Educational AI platform with instant feedback and built-in privacy safeguards.",
    whatItMeans: "Another school-focused platform that promises never to sell student data or display ads.",
    privacyFeatures: [
      "Will never sell or share student data",
      "No advertisements on platform",
      "Data anonymized before processing",
      "Safe content generation only",
      "Teacher controls and monitoring"
    ],
    recommendations: "Safe for school use if provided by your district. Good for getting feedback on assignments while protecting privacy.",
    citationIds: [17],
    dataTraining: false,
    personalizedAds: false,
    dataRetention: "Can be deleted by school"
  },

  // CONSUMER TOOLS - HIGH RISK
  {
    name: "ChatGPT Free/Plus",
    icon: "🤖",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    category: "consumer",
    privacyRating: "low",
    description: "Popular AI chatbot that uses your conversations to improve its models by default.",
    whatItMeans: "Free and Plus versions treat your chats as training data. Everything you type helps make the AI smarter, which means it could accidentally repeat your information to others.",
    privacyRisks: [
      "Conversations used to train AI models by default",
      "Must actively opt-out (not automatic)",
      "Human reviewers can read your conversations",
      "Deleted conversations retained for 30 days before permanent removal",
      "No FERPA or COPPA compliance"
    ],
    recommendations: "AVOID for personal information, school work with real names, or anything sensitive. Use 'Temporary Chats' feature or ChatGPT Pro if you must use it. Better yet: use your school-provided AI tool instead.",
    citationIds: [13, 19],
    ageRestriction: "13+",
    dataTraining: true,
    personalizedAds: false,
    dataRetention: "Indefinite (used for training)"
  },
  {
    name: "ChatGPT Pro",
    icon: "🤖",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    category: "consumer",
    privacyRating: "medium",
    description: "Paid version of ChatGPT with option to disable training on your data.",
    whatItMeans: "You CAN protect your privacy, but you have to actively turn it on in settings. It's not automatic.",
    privacyFeatures: [
      "Can opt-out of AI training in Settings → Data Controls",
      "Better privacy controls than free version"
    ],
    privacyRisks: [
      "Training opt-out is NOT the default - you must enable it",
      "Still requires payment ($20/month)",
      "Human reviewers may still access flagged content"
    ],
    recommendations: "Better than Free/Plus if you disable 'Improve the model for everyone' in settings, but school-provided tools are still safer and free.",
    citationIds: [13, 19],
    ageRestriction: "13+",
    dataTraining: false, // if you change settings
    personalizedAds: false,
    dataRetention: "Can opt-out of training"
  },
  {
    name: "Snapchat My AI",
    icon: "👻",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/c4/Snapchat_logo.svg",
    category: "consumer",
    privacyRating: "low",
    description: "AI chatbot built into Snapchat that stores conversations indefinitely to personalize ads.",
    whatItMeans: "Unlike regular Snaps that disappear, your My AI chats are saved forever (until you manually delete them) and used to show you more relevant ads.",
    privacyRisks: [
      "Conversations stored INDEFINITELY (not auto-deleted like Snaps)",
      "Snap employees can review your conversations",
      "Used to personalize ads shown to you",
      "Tracks your location to personalize responses",
      "No COPPA compliance for under-13 users"
    ],
    recommendations: "AVOID for anything personal. Treat it like a public conversation that advertisers can read. Never share secrets, mental health struggles, or identifying information.",
    citationIds: [11, 12, 20],
    ageRestriction: "13+",
    dataTraining: true,
    personalizedAds: true,
    dataRetention: "Indefinite (until manual deletion)"
  },
  {
    name: "Character.AI",
    icon: "🎭",
    category: "consumer",
    privacyRating: "low",
    description: "Popular roleplaying AI platform that uses ALL conversations to train its models and can even sell your data.",
    whatItMeans: "This is one of the riskiest options. Employees literally read your chats, all conversations train the AI, and they reserve the right to sell your data.",
    privacyRisks: [
      "ALL conversations used to train AI models",
      "Character.AI employees read your chats to improve models",
      "Can SELL your conversation data to third parties",
      "Mandatory arbitration (can't sue or join class actions)",
      "NO opt-out option - must delete entire account",
      "NO end-to-end encryption"
    ],
    recommendations: "EXTREMELY HIGH RISK. Never share real names, schools, personal problems, or anything you wouldn't want published online. Employees WILL read it.",
    citationIds: [21, 22],
    ageRestriction: "13+",
    dataTraining: true,
    personalizedAds: true,
    dataRetention: "Permanent (only deletion: close account)"
  },
  {
    name: "Google Gemini",
    icon: "🔗",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
    category: "consumer",
    privacyRating: "low",
    description: "Google's AI chatbot with deep integration into your Google account and services.",
    whatItMeans: "If you use Gmail, YouTube, Google Search, etc., Gemini connects all that data together to build a profile of you. In the free tier, human reviewers may read your conversations and your data is used to improve AI models.",
    privacyRisks: [
      "Links to your entire Google account",
      "Cross-service data sharing (Gmail, YouTube, Search, Maps)",
      "Human reviewers may read and process your conversations (free tier)",
      "Data used to train AI models in free tier",
      "18-month retention by default (adjustable)",
      "Data used to personalize ads across all Google services"
    ],
    recommendations: "Use a separate Google account (not your school or personal one) if you must use it. Never discuss anything you wouldn't want in your Google ad profile. API prohibits use by services directed at under-18 users.",
    citationIds: [24, 25],
    ageRestriction: "18+ (API/Workspace); younger users have stricter protections",
    dataTraining: true,
    personalizedAds: true,
    dataRetention: "18 months by default (adjustable)"
  },
  {
    name: "Claude.ai",
    icon: "🧠",
    logo: "https://www.anthropic.com/images/icons/apple-touch-icon.png",
    category: "consumer",
    privacyRating: "medium",
    description: "AI chatbot that does NOT train on conversations by default - best consumer option for privacy. Now offers opt-in training with longer retention.",
    whatItMeans: "Unlike ChatGPT or Character.AI, Claude's company (Anthropic) doesn't use your chats to train their AI by default. You can now OPT-IN to share data for training, but it's your choice.",
    privacyFeatures: [
      "Does NOT use conversations for training by default",
      "Privacy-by-default design",
      "You control whether to share data for training",
      "Deleted conversations are never used for training",
      "Anthropic does NOT sell user data",
      "Better privacy than ChatGPT/Character.AI/Snapchat"
    ],
    privacyRisks: [
      "30-day retention by default (or 5 years if you opt into training)",
      "Trust & Safety team can review flagged content (up to 2 years)",
      "No COPPA compliance (not designed for under-13)",
      "No school controls or FERPA protections"
    ],
    recommendations: "Best consumer chatbot for privacy if you DON'T opt into training. Keep the default settings for maximum privacy. Still use school tools for schoolwork.",
    citationIds: [26, 27, 28],
    ageRestriction: "13+",
    dataTraining: false,
    personalizedAds: false,
    dataRetention: "30 days (default) or 5 years (if opt-in to training)"
  },
  {
    name: "Perplexity AI",
    icon: "🔍",
    category: "consumer",
    privacyRating: "medium",
    description: "AI-powered search engine that answers questions by searching the web and summarizing results. Training enabled by default but opt-out available.",
    whatItMeans: "Unlike Google Search, Perplexity uses AI to read web pages and give you direct answers. It tracks your searches and uses them for AI training by default, but you CAN opt out in settings.",
    privacyRisks: [
      "AI training enabled by default (must opt-out in settings)",
      "Collects prompts, inputs, AI responses, device info, location",
      "Third-party data sharing with partners",
      "Profile building over time based on searches",
      "No COPPA or FERPA compliance"
    ],
    recommendations: "Go to Settings and opt out of AI training immediately. Avoid personal identifiers in search queries. Don't search for information about yourself, friends, or your school by name.",
    citationIds: [29, 30],
    ageRestriction: "13+",
    dataTraining: true,
    personalizedAds: false,
    dataRetention: "30 days after account deletion"
  },
  // NEW HIGH-RISK TOOLS (January 2026)
  {
    name: "Grok (X/xAI)",
    icon: "⚡",
    category: "consumer",
    privacyRating: "low",
    description: "AI chatbot from xAI (Elon Musk's company) integrated into X (formerly Twitter). January 2026 update grants perpetual license to all your content with NO opt-out.",
    whatItMeans: "This is one of the RISKIEST options available. The January 15, 2026 terms update grants X/xAI a perpetual, royalty-free license to use ALL your AI conversations and prompts forever. There is NO way to opt out except deleting your account BEFORE the effective date.",
    privacyRisks: [
      "PERPETUAL LICENSE to all AI content - yours forever becomes theirs",
      "NO opt-out option after January 15, 2026",
      "All conversations used for AI training",
      "Class action waiver - cannot sue or join lawsuits",
      "Liability capped at $100 per dispute",
      "Mandatory arbitration in Texas",
      "Jailbreaking and prompt injection now prohibited"
    ],
    recommendations: "EXTREMELY HIGH RISK. If you value your privacy, do NOT use Grok. Your only option to avoid the new terms was to delete your X account before January 15, 2026. Everything you say to Grok belongs to xAI forever.",
    citationIds: [31, 32, 33],
    ageRestriction: "13+ (X account required)",
    dataTraining: true,
    personalizedAds: true,
    dataRetention: "Permanent (perpetual license)"
  },
  {
    name: "Meta AI",
    icon: "📱",
    category: "consumer",
    privacyRating: "low",
    description: "AI assistant built into WhatsApp, Instagram, Messenger, and Facebook. December 2025 update uses your AI chats for personalization and targeted ads.",
    whatItMeans: "Meta AI is embedded in apps you probably already use. Starting December 2025, everything you say to Meta AI is used to personalize your experience AND show you targeted ads. You cannot fully opt out in the US.",
    privacyRisks: [
      "AI chat interactions used for personalization and targeted ads",
      "Cannot fully opt out in US (only EU/UK/Brazil have formal opt-out)",
      "Data processed even if you don't want it",
      "Cross-platform tracking (Facebook, Instagram, WhatsApp, Messenger)",
      "Conversations about health, politics, religion still stored (just not used for ads)"
    ],
    privacyFeatures: [
      "Does NOT read your private DMs with friends (only AI chat interactions)",
      "Private messages remain encrypted"
    ],
    recommendations: "AVOID sharing personal information with Meta AI. Remember: your conversations with Meta AI are NOT like your encrypted messages with friends. They are used for ads. EU/UK users have formal opt-out rights.",
    citationIds: [34, 35],
    ageRestriction: "13+",
    dataTraining: true,
    personalizedAds: true,
    dataRetention: "Used for personalization indefinitely"
  }
];

/**
 * Get tools by category
 */
export const getToolsByCategory = (category: 'school-safe' | 'consumer'): AITool[] => {
  return aiTools.filter(tool => tool.category === category);
};

/**
 * Get tools by privacy rating
 */
export const getToolsByRating = (rating: 'high' | 'medium' | 'low'): AITool[] => {
  return aiTools.filter(tool => tool.privacyRating === rating);
};

/**
 * Get specific tool by name
 */
export const getTool = (name: string): AITool | undefined => {
  return aiTools.find(tool =>
    tool.name.toLowerCase().includes(name.toLowerCase())
  );
};

/**
 * Get privacy summary statistics
 */
export const getPrivacySummary = () => {
  const schoolSafe = aiTools.filter(t => t.category === 'school-safe');
  const consumer = aiTools.filter(t => t.category === 'consumer');

  return {
    total: aiTools.length,
    schoolSafe: schoolSafe.length,
    consumer: consumer.length,
    highPrivacy: aiTools.filter(t => t.privacyRating === 'high').length,
    mediumPrivacy: aiTools.filter(t => t.privacyRating === 'medium').length,
    lowPrivacy: aiTools.filter(t => t.privacyRating === 'low').length,
    trainsOnData: aiTools.filter(t => t.dataTraining).length,
    personalizedAds: aiTools.filter(t => t.personalizedAds).length
  };
};

/**
 * Quick recommendation based on use case
 */
export const getRecommendation = (useCase: 'schoolwork' | 'personal' | 'casual'): AITool[] => {
  switch (useCase) {
    case 'schoolwork':
      return getToolsByCategory('school-safe');
    case 'personal':
      return aiTools.filter(t =>
        t.privacyRating === 'high' || t.privacyRating === 'medium'
      );
    case 'casual':
      return aiTools.filter(t =>
        t.privacyRating === 'medium' || (t.privacyRating === 'low' && !t.personalizedAds)
      );
    default:
      return getToolsByCategory('school-safe');
  }
};
