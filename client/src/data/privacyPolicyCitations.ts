/**
 * Privacy Policy Citations
 *
 * All sources used in Privacy & Data Rights Module
 * Based on research conducted February 2026
 *
 * Format: Chicago-style with web sources
 */

export interface Citation {
  id: number;
  title: string;
  url: string;
  accessed: string;
  organization?: string;
  notes?: string;
}

export const citations: Citation[] = [
  {
    id: 1,
    title: "What ChatGPT Really Knows About You: OpenAI Privacy Policy Explained",
    url: "/resources/openai-privacy-explained",
    accessed: "February 9, 2026",
    organization: "AI Literacy Student Platform",
    notes: "Hosted explanation with actual OpenAI policy language; credited to Ayan Rayne and OpenAI official sources"
  },
  {
    id: 2,
    title: "Does ChatGPT Have a Character Limit? Yes, But It Depends",
    url: "https://www.wikihow.com/Chatgpt-Character-Limit",
    accessed: "February 9, 2026",
    organization: "wikiHow"
  },
  {
    id: 3,
    title: "ChatGPT usage limits explained: free vs plus vs enterprise",
    url: "https://northflank.com/blog/chatgpt-usage-limits-free-plus-enterprise",
    accessed: "February 9, 2026",
    organization: "Northflank Blog"
  },
  {
    id: 4,
    title: "GPT-5 in ChatGPT",
    url: "https://help.openai.com/en/articles/11909943-gpt-5-in-chatgpt",
    accessed: "February 9, 2026",
    organization: "OpenAI Help Center"
  },
  {
    id: 5,
    title: "ChatGPT-4o from 100k to 30k word limits now",
    url: "https://community.openai.com/t/chatgpt-4o-from-100k-to-30k-word-limits-now/1247160",
    accessed: "February 9, 2026",
    organization: "OpenAI Developer Community"
  },
  {
    id: 6,
    title: "How to extend ChatGPT 4's word count limits?",
    url: "https://forum.aiprm.com/t/how-to-extend-chatgpt-4s-word-count-limits/26854",
    accessed: "February 9, 2026",
    organization: "AIPRM Community Forum"
  },
  {
    id: 7,
    title: "ChatGPT cannot count words or produce word-count-limited text",
    url: "https://community.openai.com/t/chatgpt-cannot-count-words-or-produce-word-count-limited-text/47380",
    accessed: "February 9, 2026",
    organization: "OpenAI Community"
  },
  {
    id: 8,
    title: "Microsoft Services Agreement",
    url: "https://www.microsoft.com/en-us/servicesagreement",
    accessed: "February 9, 2026",
    organization: "Microsoft",
    notes: "Over 15,000 words, 60+ minute estimated read time"
  },
  {
    id: 9,
    title: "Microsoft Copilot age limits and parental controls",
    url: "https://support.microsoft.com/en-au/topic/microsoft-copilot-age-limits-and-parental-controls-f79b47a6-288a-4513-8c01-afe4d16db900",
    accessed: "February 9, 2026",
    organization: "Microsoft Support",
    notes: "Users 13-18 years old do not have conversations used for model training"
  },
  {
    id: 10,
    title: "Microsoft 365 Copilot Chat Privacy and Protections",
    url: "https://learn.microsoft.com/en-us/copilot/privacy-and-protections",
    accessed: "February 9, 2026",
    organization: "Microsoft Learn",
    notes: "Enterprise/educational users: prompts and responses not used to train foundation models"
  },
  {
    id: 11,
    title: "What is My AI on Snapchat and how do I use it?",
    url: "https://help.snapchat.com/hc/en-us/articles/13266788358932-What-is-My-AI-on-Snapchat-and-how-do-I-use-it",
    accessed: "February 9, 2026",
    organization: "Snapchat Support",
    notes: "All content shared with My AI is stored until you delete it; data used to personalize ads"
  },
  {
    id: 12,
    title: "Early Learnings from My AI and New Safety Enhancements",
    url: "https://values.snap.com/news/early-learnings-from-my-ai-and-new-safety-enhancements",
    accessed: "February 9, 2026",
    organization: "Snap Inc.",
    notes: "Reviewing early interactions helped identify which guardrails are working"
  },
  {
    id: 13,
    title: "OpenAI Terms of Use",
    url: "https://openai.com/policies/terms-of-use/",
    accessed: "February 9, 2026",
    organization: "OpenAI",
    notes: "General Terms of Use - ~4,000 words, 16 minute estimated read time; covers user obligations and content usage"
  },
  {
    id: 14,
    title: "Empowering teens: Microsoft 365 Copilot availability for students",
    url: "https://www.microsoft.com/en-us/education/blog/2025/05/empowering-teen-students-to-achieve-more-with-copilot-chat-and-microsoft-365-copilot/",
    accessed: "February 9, 2026",
    organization: "Microsoft Education Blog"
  },
  {
    id: 15,
    title: "SchoolAI Trust Center | Privacy, Safety, and Responsible AI for Schools",
    url: "https://schoolai.com/trust",
    accessed: "February 9, 2026",
    organization: "SchoolAI",
    notes: "FERPA and COPPA compliant; does not use student data for training"
  },
  {
    id: 16,
    title: "SchoolAI Privacy Policy | How We Protect Educator and Student Data",
    url: "https://schoolai.com/privacy",
    accessed: "February 9, 2026",
    organization: "SchoolAI"
  },
  {
    id: 17,
    title: "Snorkl Safety and Privacy",
    url: "https://snorkl.app/safety",
    accessed: "February 9, 2026",
    organization: "Snorkl",
    notes: "Will never sell or share student data; no ads on platform"
  },
  {
    id: 19,
    title: "ChatGPT data retention policies: updated rules and user controls in 2025",
    url: "https://www.datastudios.org/post/chatgpt-data-retention-policies-updated-rules-and-user-controls-in-2025",
    accessed: "February 9, 2026",
    organization: "Data Studios",
    notes: "Specific data retention and privacy controls - explains 30-day retention period, opt-out settings, and temporary chat features"
  },
  {
    id: 20,
    title: "Staying Safe with My AI",
    url: "https://help.snapchat.com/hc/en-us/articles/13889139811860-Staying-Safe-with-My-AI",
    accessed: "February 9, 2026",
    organization: "Snapchat Support"
  },
  {
    id: 21,
    title: "Character.AI Terms of Service",
    url: "https://character.ai/tos",
    accessed: "February 9, 2026",
    organization: "Character Technologies Inc.",
    notes: "Grants company broad rights to use, modify, and sell user-generated content and conversations"
  },
  {
    id: 22,
    title: "Character.AI Privacy Policy",
    url: "https://character.ai/privacy",
    accessed: "February 9, 2026",
    organization: "Character Technologies Inc.",
    notes: "Conversations may be reviewed by employees; data used for model training; mandatory arbitration clause"
  },
  {
    id: 23,
    title: "Snapchat Terms of Service",
    url: "https://www.snap.com/terms",
    accessed: "February 9, 2026",
    organization: "Snap Inc.",
    notes: "~15,000 words, estimated 60 minute read time; updated April 2025"
  },
  // Google Gemini Citations
  {
    id: 24,
    title: "Gemini Apps Privacy Hub",
    url: "https://support.google.com/gemini/answer/13594961",
    accessed: "February 9, 2026",
    organization: "Google",
    notes: "Human reviewers may read and process API input/output for free tier; 18-month auto-delete by default"
  },
  {
    id: 25,
    title: "Gemini API Additional Terms of Service",
    url: "https://ai.google.dev/gemini-api/terms",
    accessed: "February 9, 2026",
    organization: "Google AI for Developers",
    notes: "Prohibits use in services directed towards individuals under 18; content used for model improvement in free tier"
  },
  // Claude.ai / Anthropic Citations
  {
    id: 26,
    title: "How long do you store my data?",
    url: "https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data",
    accessed: "February 9, 2026",
    organization: "Anthropic Privacy Center",
    notes: "30-day retention by default; 5-year retention if user opts into training; deleted conversations not used for training"
  },
  {
    id: 27,
    title: "Updates to Consumer Terms and Privacy Policy",
    url: "https://www.anthropic.com/news/updates-to-our-consumer-terms",
    accessed: "February 9, 2026",
    organization: "Anthropic",
    notes: "January 2026 update introduced opt-in training option; does not apply to Enterprise/API users"
  },
  {
    id: 28,
    title: "How does Anthropic protect the personal data of Claude users?",
    url: "https://privacy.claude.com/en/articles/10458704-how-does-anthropic-protect-the-personal-data-of-claude-users",
    accessed: "February 9, 2026",
    organization: "Anthropic Privacy Center",
    notes: "Employees cannot access conversations unless user consents or policy violation; does not sell user data"
  },
  // Perplexity AI Citations
  {
    id: 29,
    title: "Perplexity Privacy Policy",
    url: "https://www.perplexity.ai/hub/legal/privacy-policy",
    accessed: "February 9, 2026",
    organization: "Perplexity AI",
    notes: "Effective February 5, 2026; AI training opt-out available in settings; collects search queries and browsing behavior"
  },
  {
    id: 30,
    title: "What data does Perplexity collect about me?",
    url: "https://www.perplexity.ai/help-center/en/articles/10354855-what-data-does-perplexity-collect-about-me",
    accessed: "February 9, 2026",
    organization: "Perplexity Help Center",
    notes: "Collects prompts, inputs, AI responses, device info, location, browsing behavior; 30-day deletion after account removal"
  },
  // Grok / xAI Citations
  {
    id: 31,
    title: "Privacy Policy",
    url: "https://x.ai/legal/privacy-policy",
    accessed: "February 9, 2026",
    organization: "xAI",
    notes: "xAI is separate from X Corp; use of Grok on X platform governed by X Privacy Policy"
  },
  {
    id: 32,
    title: "Updates to our Terms of Service and Privacy Policy",
    url: "https://privacy.x.com/en/blog/2025/updates-tos-privacy-policy",
    accessed: "February 9, 2026",
    organization: "X Corp",
    notes: "January 15, 2026 update grants perpetual license to AI content; no opt-out after effective date"
  },
  {
    id: 33,
    title: "Terms of Service - Consumer",
    url: "https://x.ai/legal/terms-of-service",
    accessed: "February 9, 2026",
    organization: "xAI",
    notes: "Class action waiver; $100 liability cap; mandatory arbitration in Tarrant County, Texas"
  },
  // Meta AI Citations
  {
    id: 34,
    title: "Meta's 2026 AI Policy Sparks Privacy Fury Over Chat Data Use",
    url: "https://www.webpronews.com/metas-2026-ai-policy-sparks-privacy-fury-over-chat-data-use/",
    accessed: "February 9, 2026",
    organization: "WebProNews",
    notes: "December 2025 policy update allows Meta to use AI chat interactions for personalization and targeted ads"
  },
  {
    id: 35,
    title: "Meta AI in WhatsApp: Assistant Behavior, Model Updates, and Data Privacy Controls",
    url: "https://www.datastudios.org/post/meta-ai-in-whatsapp-assistant-behavior-model-updates-and-data-privacy-controls",
    accessed: "February 9, 2026",
    organization: "Data Studios",
    notes: "AI interactions treated separately from encrypted messages; cannot fully opt out in US"
  }
];

/**
 * Helper function to format citation for display
 */
export const formatCitation = (id: number): string => {
  const citation = citations.find(c => c.id === id);
  if (!citation) return '';

  return `${citation.organization ? citation.organization + '. ' : ''}"${citation.title}." ${citation.accessed}. ${citation.url}`;
};

/**
 * Helper function to get citation by ID
 */
export const getCitation = (id: number): Citation | undefined => {
  return citations.find(c => c.id === id);
};

/**
 * Generate Works Cited section in HTML
 */
export const generateWorksCited = (): string => {
  return citations
    .map(c => {
      const org = c.organization ? `${c.organization}. ` : '';
      const title = `"${c.title}."`;
      const accessed = `Accessed ${c.accessed}.`;
      const link = `<a href="${c.url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">${c.url}</a>`;
      return `<div class="mb-3"><strong>${c.id}.</strong> ${org}${title} ${accessed} ${link}</div>`;
    })
    .join('');
};

/**
 * Terms & Conditions Reading Time Data
 */
export const tcReadingTimes = {
  snapchat: {
    words: 15000,
    minutes: 60,
    platform: "Snapchat",
    citationId: 23
  },
  chatgpt: {
    words: 4000,
    minutes: 16,
    platform: "ChatGPT (OpenAI)",
    citationId: 13
  },
  microsoft: {
    words: 15000,
    minutes: 60,
    platform: "Microsoft Services",
    citationId: 8
  },
  instagram: {
    words: 17000,
    minutes: 68,
    platform: "Instagram",
    citationId: null // Add if we include Instagram
  },
  tiktok: {
    words: 12000,
    minutes: 48,
    platform: "TikTok",
    citationId: null // Add if we include TikTok
  }
};
