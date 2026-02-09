/**
 * Policy Myths Quiz Data
 *
 * True/False questions about AI platform privacy policies
 * Each question includes primary source citations
 *
 * February 2026
 */

export interface QuizQuestion {
  id: string;
  statement: string;
  answer: boolean; // true = TRUE, false = FALSE
  explanation: string;
  actualLanguage: string;
  source: {
    title: string;
    url: string;
    organization: string;
  };
  surpriseFactor: 'low' | 'medium' | 'high';
  category: 'training' | 'retention' | 'ads' | 'protection';
}

export const policyMythsQuestions: QuizQuestion[] = [
  {
    id: 'chatgpt-training',
    statement: "ChatGPT Free uses your conversations to train its AI models",
    answer: true,
    explanation: "Yes! When you use the free version of ChatGPT, your conversations help train OpenAI's models. You have to actively opt-out in settings to prevent this.",
    actualLanguage: "When you use services for individuals such as ChatGPT, Sora, or Operator, OpenAI may use your content to train their models.",
    source: {
      title: "How your data is used to improve model performance",
      url: "https://openai.com/policies/how-your-data-is-used-to-improve-model-performance/",
      organization: "OpenAI"
    },
    surpriseFactor: 'medium',
    category: 'training'
  },
  {
    id: 'snapchat-disappear',
    statement: "Snapchat My AI chats disappear automatically like regular Snaps",
    answer: false,
    explanation: "FALSE! Unlike regular Snaps that disappear, your My AI conversations are stored FOREVER until you manually delete them. Snap treats AI chats completely differently from friend chats.",
    actualLanguage: "All the content you share with My AI is retained until you delete it... Snap treats your conversations and the content you share with My AI differently from regular Snaps.",
    source: {
      title: "Does Snap save content shared with My AI?",
      url: "https://help.snapchat.com/hc/en-us/articles/15682296562836-Does-Snap-save-content-shared-with-My-AI",
      organization: "Snapchat Support"
    },
    surpriseFactor: 'high',
    category: 'retention'
  },
  {
    id: 'character-ai-sell',
    statement: "Character.AI can share your conversations with third parties for advertising",
    answer: true,
    explanation: "TRUE! Character.AI's privacy policy allows them to share your data with third parties for targeted advertising. They claim it's not technically 'selling' for money, but the effect is the same.",
    actualLanguage: "This may include personal information shared with third parties for purposes of targeted advertising. While these disclosures may be considered sales under certain state laws, we do not sell personal information for monetary consideration.",
    source: {
      title: "Character.AI Privacy Policy",
      url: "https://character.ai/privacy",
      organization: "Character Technologies Inc."
    },
    surpriseFactor: 'high',
    category: 'ads'
  },
  {
    id: 'grok-perpetual',
    statement: "X/Grok can use your AI conversations forever with no way to take it back",
    answer: true,
    explanation: "TRUE! The January 2026 terms update grants X a 'perpetual, royalty-free license' to use everything you type to Grok - forever. This includes training AI models with your conversations.",
    actualLanguage: "Users grant a worldwide, royalty-free, sublicensable license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute Content 'for any purpose,' including analyzing it and training machine learning and AI models.",
    source: {
      title: "Updates to Terms of Service and Privacy Policy",
      url: "https://privacy.x.com/en/blog/2025/updates-tos-privacy-policy",
      organization: "X Privacy Center"
    },
    surpriseFactor: 'high',
    category: 'training'
  },
  {
    id: 'meta-ai-ads',
    statement: "Meta AI conversations can be used to show you targeted ads",
    answer: true,
    explanation: "TRUE! Starting December 2025, everything you say to Meta AI on WhatsApp, Instagram, or Facebook is used to personalize your ads. You cannot fully opt out in the US.",
    actualLanguage: "We will start personalizing content and ad recommendations on our platforms based on people's interactions with our generative AI features.",
    source: {
      title: "Improving Your Recommendations on Our Apps With AI at Meta",
      url: "https://about.fb.com/news/2025/10/improving-your-recommendations-apps-ai-meta/",
      organization: "Meta Newsroom"
    },
    surpriseFactor: 'high',
    category: 'ads'
  },
  {
    id: 'claude-default-training',
    statement: "Claude.ai trains on your conversations by default",
    answer: false,
    explanation: "FALSE! Unlike most AI chatbots, Claude does NOT train on your conversations by default. You have to actively OPT-IN if you want to share your data. This makes Claude one of the more privacy-friendly options.",
    actualLanguage: "Current users see an in-app notification asking whether they want to share their chats and coding sessions for model improvement. Users can make their selection right away...",
    source: {
      title: "Updates to Consumer Terms and Privacy Policy",
      url: "https://www.anthropic.com/news/updates-to-our-consumer-terms",
      organization: "Anthropic"
    },
    surpriseFactor: 'medium',
    category: 'protection'
  },
  {
    id: 'copilot-edu-training',
    statement: "Microsoft Copilot Education uses student conversations to train its AI",
    answer: false,
    explanation: "FALSE! School versions of Microsoft Copilot do NOT use your conversations for training. Your school has a legal agreement that protects student data. This is why school-provided AI tools are safer.",
    actualLanguage: "Prompts, responses, and data accessed through Microsoft Graph aren't used to train foundation LLMs, including those used by Microsoft 365 Copilot.",
    source: {
      title: "Data, Privacy, and Security for Microsoft 365 Copilot",
      url: "https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy",
      organization: "Microsoft Learn"
    },
    surpriseFactor: 'medium',
    category: 'protection'
  },
  {
    id: 'chatgpt-deletion',
    statement: "When you delete a ChatGPT conversation, it's gone immediately",
    answer: false,
    explanation: "FALSE! When you delete a chat, it's removed from YOUR view immediately, but OpenAI keeps it on their servers for up to 30 more days before permanent deletion.",
    actualLanguage: "When you delete a chat (or your account), the chat is removed from your account immediately and scheduled for permanent deletion from OpenAI systems within 30 days.",
    source: {
      title: "Chat and File Retention Policies in ChatGPT",
      url: "https://help.openai.com/en/articles/8983778-chat-and-file-retention-policies-in-chatgpt",
      organization: "OpenAI Help Center"
    },
    surpriseFactor: 'medium',
    category: 'retention'
  }
];

/**
 * Get a shuffled copy of the questions
 */
export const getShuffledQuestions = (): QuizQuestion[] => {
  const shuffled = [...policyMythsQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Calculate quiz results
 */
export const calculateResults = (answers: Record<string, boolean>) => {
  let correct = 0;
  let mostSurprising: QuizQuestion[] = [];
  let goodNews: QuizQuestion[] = [];

  policyMythsQuestions.forEach(q => {
    const userAnswer = answers[q.id];
    if (userAnswer === q.answer) {
      correct++;
    }

    if (q.surpriseFactor === 'high') {
      mostSurprising.push(q);
    }

    if (q.category === 'protection') {
      goodNews.push(q);
    }
  });

  return {
    correct,
    total: policyMythsQuestions.length,
    percentage: Math.round((correct / policyMythsQuestions.length) * 100),
    mostSurprising,
    goodNews
  };
};
