/**
 * Policy Comparison Data
 *
 * Detailed comparison of privacy policies for major AI tools
 * with actual quoted language from their Terms of Service
 *
 * Based on October 2025 policy versions
 */

export interface PolicyComparison {
  tool: string;
  icon: string;
  logo?: string;
  privacyRating: 'high' | 'medium' | 'low';
  summary: {
    trainedOnData: boolean;
    personalizedAds: boolean;
    dataProtection: string;
  };
  whatYouAgreedTo: string[];
  finePrint: {
    text: string;
    citationIds: number[];
  }[];
  bottomLine: string;
}

export const policyComparisons: PolicyComparison[] = [
  {
    tool: "Microsoft Copilot (13-17 School Version)",
    icon: "🎓",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Microsoft_365_Copilot_Icon.svg",
    privacyRating: "high",
    summary: {
      trainedOnData: false,
      personalizedAds: false,
      dataProtection: "Enterprise education agreement"
    },
    whatYouAgreedTo: [
      "✅ Your conversations are NOT used to train the main AI models.",
      "✅ You are NOT shown personalized ads based on your chats.",
      "✅ Your data is protected under your school's agreement."
    ],
    finePrint: [
      {
        text: '"Copilot users between 13 to 18 years old... Do not have their conversations used for model training."',
        citationIds: [9]
      },
      {
        text: '"For enterprise/educational users, prompts and responses are not used to train foundation models, and data remains within the organization\'s control."',
        citationIds: [10]
      }
    ],
    bottomLine: "The version of Copilot available through your school account is built with student privacy as the default. It's designed for educational use, so your data is treated as confidential school information, not as a product."
  },
  {
    tool: "Snapchat (My AI)",
    icon: "👻",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/c4/Snapchat_logo.svg",
    privacyRating: "low",
    summary: {
      trainedOnData: true,
      personalizedAds: true,
      dataProtection: "Consumer service (indefinite storage)"
    },
    whatYouAgreedTo: [
      "❌ Your conversations are stored indefinitely until you manually delete them.",
      "❌ Your chats ARE used to personalize ads shown to you.",
      "❌ Snap employees CAN review your conversations."
    ],
    finePrint: [
      {
        text: '"All the content shared with My AI is stored until you delete it."',
        citationIds: [11]
      },
      {
        text: '"Your data may also be used by Snap to improve Snap\'s products and personalize your experience, including ads."',
        citationIds: [11]
      },
      {
        text: '"Being able to review these early interactions with My AI has helped us identify which guardrails are working well."',
        citationIds: [12]
      }
    ],
    bottomLine: "My AI is designed like a consumer product. It remembers everything you say to sell you more relevant ads. Your \"private\" chat is a commercial asset for the company."
  },
  {
    tool: "OpenAI (ChatGPT Free/Plus)",
    icon: "🤖",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    privacyRating: "low",
    summary: {
      trainedOnData: true,
      personalizedAds: false,
      dataProtection: "Consumer service (opt-out available)"
    },
    whatYouAgreedTo: [
      "❌ Your conversations ARE used to train AI models by default.",
      "❌ You must actively opt-out or use special features to protect your privacy.",
      "❌ OpenAI employees CAN review your conversations."
    ],
    finePrint: [
      {
        text: '"OpenAI may use content to provide, maintain, develop, and improve services..."',
        citationIds: [13]
      },
      {
        text: '"Users can opt out of having their content used to train models" (Note: This requires changing settings; it is not the default).',
        citationIds: [13, 19]
      },
      {
        text: '"To help with quality and improve the Service, human reviewers may read, annotate, and process Your Content..."',
        citationIds: [13]
      }
    ],
    bottomLine: "The free version of ChatGPT treats your conversations as a resource to make its AI smarter. Privacy is a feature you have to turn on, not something that's guaranteed from the start."
  }
];

/**
 * Get comparison data for specific tool
 */
export const getToolComparison = (toolName: string): PolicyComparison | undefined => {
  return policyComparisons.find(p =>
    p.tool.toLowerCase().includes(toolName.toLowerCase())
  );
};

/**
 * Get all tools by privacy rating
 */
export const getToolsByRating = (rating: 'high' | 'medium' | 'low'): PolicyComparison[] => {
  return policyComparisons.filter(p => p.privacyRating === rating);
};

/**
 * Generate comparison summary for display
 */
export const generateComparisonSummary = (): {
  safe: number;
  caution: number;
  risky: number;
} => {
  return {
    safe: policyComparisons.filter(p => p.privacyRating === 'high').length,
    caution: policyComparisons.filter(p => p.privacyRating === 'medium').length,
    risky: policyComparisons.filter(p => p.privacyRating === 'low').length
  };
};
