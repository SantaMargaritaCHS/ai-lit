import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Zap, ArrowRight, CheckCircle } from 'lucide-react';

interface SteerTheConversationActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

const INITIAL_PROMPT =
  'You are an AP History teacher. Create 10 review questions with answers on the causes of WWI, focusing on the alliance system.';

const INITIAL_AI_RESPONSE = `**WWI Review Questions:**

**1.** What were the four main causes of WWI? (M.A.I.N.)
*Answer:* Militarism, Alliances, Imperialism, Nationalism

**2.** Name the countries in the Triple Alliance.
*Answer:* Germany, Austria-Hungary, Italy

**3.** Name the countries in the Triple Entente.
*Answer:* France, Russia, Britain

**4.** What event triggered WWI?
*Answer:* The assassination of Archduke Franz Ferdinand

**5.** What is militarism?
*Answer:* The buildup of a country's military forces

**6.** What is imperialism?
*Answer:* When countries try to expand their territory and influence

**7.** Who assassinated Archduke Franz Ferdinand?
*Answer:* Gavrilo Princip

**8.** What year did WWI begin?
*Answer:* 1914

**9.** What was the Schlieffen Plan?
*Answer:* Germany's plan to attack France through Belgium

**10.** Why did the US enter WWI?
*Answer:* Because of unrestricted submarine warfare and the Zimmerman Telegram`;

const REFINEMENT_1_CHIPS = [
  'Make questions 3 and 5 more analytical \u2014 ask WHY, not just WHAT',
  'Add a question about the Treaty of Versailles and its long-term effects',
  'Use simpler vocabulary in the answers for a 10th grader',
];

const REFINEMENT_1_RESPONSES: Record<number, string> = {
  0: `**WWI Review Questions (Updated):**

**1.** What were the four main causes of WWI? (M.A.I.N.)
*Answer:* Militarism, Alliances, Imperialism, Nationalism

**2.** Name the countries in the Triple Alliance.
*Answer:* Germany, Austria-Hungary, Italy

**3.** Explain WHY the Triple Entente formed. What threat were France, Russia, and Britain responding to?
*Answer:* The Triple Entente formed as a counterbalance to the growing power of the Triple Alliance. France feared German aggression after losing Alsace-Lorraine in 1871, Russia sought allies against Austria-Hungary in the Balkans, and Britain was alarmed by Germany's naval buildup threatening its maritime dominance.

**4.** What event triggered WWI?
*Answer:* The assassination of Archduke Franz Ferdinand

**5.** Explain WHY militarism made war more likely, rather than preventing it through deterrence.
*Answer:* While nations believed large militaries would deter attacks, the arms race instead created a climate of suspicion and fear. Each country's buildup made neighbors feel threatened, leading to more buildup. Military leaders gained political influence and pushed for war plans to be used before they became outdated, making diplomacy harder.

**6-10.** *(remaining questions unchanged)*`,

  1: `**WWI Review Questions (Updated):**

**1-9.** *(previous questions unchanged)*

**10.** How did the Treaty of Versailles attempt to prevent future wars, and why did it arguably make another war MORE likely?
*Answer:* The Treaty imposed harsh penalties on Germany including massive reparations, territorial losses, military restrictions, and the "war guilt" clause. While intended to weaken Germany permanently, these conditions created deep resentment among Germans, economic devastation, and political instability that Hitler later exploited to rise to power, leading to WWII.

**11. (Bonus)** Compare the alliance system before WWI with the United Nations formed after WWII. How did world leaders try to fix what went wrong?
*Answer:* Pre-WWI alliances were secret, military-focused, and designed to protect national interests through force. The UN was created as an open diplomatic forum where conflicts could be resolved through discussion rather than automatic military responses, directly addressing how the alliance system had escalated a regional crisis into a world war.`,

  2: `**WWI Review Questions (Simplified for 10th Grade):**

**1.** What were the four main causes of WWI? (M.A.I.N.)
*Answer:* Think of it like drama at school \u2014 countries were building up weapons (Militarism), picking sides (Alliances), trying to take over other places (Imperialism), and having extreme pride in their country (Nationalism).

**2.** Name the countries in the Triple Alliance.
*Answer:* Germany, Austria-Hungary, and Italy \u2014 think of them as a friend group that agreed to back each other up in a fight.

**3.** Name the countries in the Triple Entente.
*Answer:* France, Russia, and Britain \u2014 the rival friend group that formed because they were nervous about the first group getting too powerful.

**4.** What event triggered WWI?
*Answer:* A Serbian man named Gavrilo Princip shot Archduke Franz Ferdinand of Austria-Hungary. It was like the match that lit a fire that was already waiting to explode.

**5.** What is militarism?
*Answer:* Countries competing to have the biggest, most powerful military \u2014 like an arms race. Everyone kept building more weapons, which made everyone else more scared and want more weapons too.

**6-10.** *(remaining answers similarly simplified with relatable examples)*`,
};

const REFINEMENT_2_CHIPS = [
  'Convert the key terms into a matching exercise instead',
  'Add a "why this matters today" connection for each answer',
  'Make it shorter \u2014 just the 5 most important questions',
];

const REFINEMENT_2_RESPONSES: Record<number, string> = {
  0: `**WWI Key Terms \u2014 Matching Exercise:**

**Match each term (1-8) with its correct definition (A-H):**

| # | Term | | Letter | Definition |
|---|------|---|--------|------------|
| 1 | Militarism | | A | Secret agreement between nations to defend each other |
| 2 | Triple Alliance | | B | Extreme pride in one's country |
| 3 | Imperialism | | C | Germany, Austria-Hungary, Italy |
| 4 | Nationalism | | D | Germany's plan to quickly defeat France via Belgium |
| 5 | Triple Entente | | E | Building up military forces competitively |
| 6 | Schlieffen Plan | | F | Expanding territory and influence over weaker nations |
| 7 | Alliance System | | G | France, Russia, Britain |
| 8 | Assassination | | H | The killing of Archduke Franz Ferdinand that sparked WWI |

**Answer Key:** 1-E, 2-C, 3-F, 4-B, 5-G, 6-D, 7-A, 8-H`,

  1: `**WWI Review \u2014 With Modern Connections:**

**1.** What were the four main causes of WWI?
*Answer:* Militarism, Alliances, Imperialism, Nationalism
*Why it matters today:* These same forces are visible in current events \u2014 the global arms trade, NATO and military alliances, territorial disputes, and rising nationalist movements worldwide.

**2.** How did the alliance system turn a local conflict into a world war?
*Answer:* When Austria-Hungary declared war on Serbia, treaty obligations pulled in Russia, then Germany, then France, then Britain.
*Why it matters today:* Modern alliances like NATO have an Article 5 \u2014 an attack on one is an attack on all. Understanding how alliances escalate conflict helps us evaluate current defense agreements.

**3.** Why did militarism make war more likely?
*Answer:* Arms races created fear and pressure to use weapons before they became obsolete.
*Why it matters today:* Nuclear arms races, AI weapons development, and cyber warfare capabilities raise the same questions about whether building weapons keeps peace or invites conflict.

*(remaining questions follow same pattern)*`,

  2: `**WWI Review \u2014 Top 5 Essential Questions:**

**1.** What were the four main causes of WWI, and which do you think was MOST important?
*Answer:* Militarism, Alliances, Imperialism, Nationalism (M.A.I.N.). The alliance system was arguably most critical because it transformed a regional assassination into a global war through chain-reaction treaty obligations.

**2.** How did the alliance system turn one assassination into a world war?
*Answer:* Austria-Hungary declared war on Serbia. Russia mobilized to defend Serbia. Germany backed Austria-Hungary and declared war on Russia and France. Britain entered when Germany invaded Belgium. Two alliance blocs pulled the entire continent into war within weeks.

**3.** Why is the assassination of Archduke Franz Ferdinand considered a trigger, not a cause?
*Answer:* The underlying tensions (militarism, imperialism, nationalism, alliances) had been building for decades. The assassination was the spark, but the "gunpowder" was already in place. Without these deeper causes, the assassination alone would not have caused a world war.

**4.** What role did nationalism play in both starting and prolonging the war?
*Answer:* Nationalism fueled the initial rivalries and made citizens eager to fight for national pride. Once war began, it kept people fighting because surrendering was seen as a national humiliation.

**5.** What lessons from WWI's causes are still relevant today?
*Answer:* Secret alliances can escalate small conflicts, arms races create instability rather than security, and extreme nationalism can blind leaders to diplomatic solutions. These patterns repeat throughout modern history.`,
};

const TYPING_DELAY = 1500;

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1 px-4 py-3" aria-label="AI is typing">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 rounded-full bg-gray-400"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const formatContent = (text: string): React.ReactNode => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    let formatted: React.ReactNode = line;
    // Bold
    if (line.includes('**')) {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      formatted = parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      );
    }
    // Italic
    if (typeof formatted === 'string' && formatted.includes('*')) {
      const parts = formatted.split(/\*(.*?)\*/g);
      formatted = parts.map((part, j) =>
        j % 2 === 1 ? <em key={j}>{part}</em> : part
      );
    }
    return (
      <React.Fragment key={i}>
        {formatted}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

const ChatBubble: React.FC<{ message: ChatMessage; index: number }> = ({ message, index }) => {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
      role="listitem"
      aria-label={`${isUser ? 'Your prompt' : 'AI response'}: message ${index + 1}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200'
        }`}
      >
        {isUser ? message.content : formatContent(message.content)}
      </div>
    </motion.div>
  );
};

const SteerTheConversationActivity: React.FC<SteerTheConversationActivityProps> = ({
  onComplete,
  isDevMode = false,
}) => {
  const [step, setStep] = useState<'initial' | 'refine1' | 'refine2' | 'summary'>(
    isDevMode ? 'summary' : 'initial'
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [refinement1Choice, setRefinement1Choice] = useState<number | null>(null);
  const [refinement2Choice, setRefinement2Choice] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, []);

  const addAIResponse = useCallback(
    (content: string, thenStep?: typeof step) => {
      setIsTyping(true);
      scrollToBottom();
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: 'ai', content }]);
        if (thenStep) setStep(thenStep);
        scrollToBottom();
      }, TYPING_DELAY);
    },
    [scrollToBottom]
  );

  // Start the conversation on mount
  useEffect(() => {
    if (isDevMode) {
      setMessages([
        { role: 'user', content: INITIAL_PROMPT },
        { role: 'ai', content: INITIAL_AI_RESPONSE },
        { role: 'user', content: REFINEMENT_1_CHIPS[0] },
        { role: 'ai', content: REFINEMENT_1_RESPONSES[0] },
        { role: 'user', content: REFINEMENT_2_CHIPS[2] },
        { role: 'ai', content: REFINEMENT_2_RESPONSES[2] },
      ]);
      return;
    }
    setMessages([{ role: 'user', content: INITIAL_PROMPT }]);
    addAIResponse(INITIAL_AI_RESPONSE, 'refine1');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefinement1 = useCallback(
    (chipIndex: number, text: string) => {
      setRefinement1Choice(chipIndex);
      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      scrollToBottom();
      const responseKey = chipIndex >= 0 && chipIndex < 3 ? chipIndex : 0;
      addAIResponse(REFINEMENT_1_RESPONSES[responseKey], 'refine2');
    },
    [addAIResponse, scrollToBottom]
  );

  const handleRefinement2 = useCallback(
    (chipIndex: number, text: string) => {
      setRefinement2Choice(chipIndex);
      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      scrollToBottom();
      const responseKey = chipIndex >= 0 && chipIndex < 3 ? chipIndex : 0;
      addAIResponse(REFINEMENT_2_RESPONSES[responseKey], 'summary');
    },
    [addAIResponse, scrollToBottom]
  );

  const handleCustomSubmit = useCallback(
    (refinementStep: 1 | 2) => {
      if (!customInput.trim()) return;
      const text = customInput.trim();
      setCustomInput('');
      if (refinementStep === 1) {
        handleRefinement1(0, text);
      } else {
        handleRefinement2(0, text);
      }
    },
    [customInput, handleRefinement1, handleRefinement2]
  );

  const renderChips = (
    chips: string[],
    handler: (index: number, text: string) => void,
    refinementStep: 1 | 2
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mt-4 space-y-3"
    >
      <p className="text-sm font-medium text-gray-700 px-1">
        Choose a refinement or type your own:
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, i) => (
          <button
            key={i}
            onClick={() => handler(i, chip)}
            disabled={isTyping}
            className="text-left text-sm px-4 py-2 rounded-full border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Refinement option: ${chip}`}
          >
            {chip}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCustomSubmit(refinementStep);
          }}
          placeholder="Or type your own refinement..."
          disabled={isTyping}
          className="flex-1 text-sm px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50"
          aria-label="Type a custom refinement prompt"
        />
        <Button
          size="sm"
          onClick={() => handleCustomSubmit(refinementStep)}
          disabled={isTyping || !customInput.trim()}
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-3"
          aria-label="Send custom refinement"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );

  const renderSummary = () => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-6"
    >
      <Card className="border-green-200 bg-green-50 p-5">
        <div className="flex items-start gap-3 mb-3">
          <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-green-900 mb-2">
              That's Iterative Prompting
            </h3>
            <p className="text-sm text-green-800 leading-relaxed mb-3">
              Look at the conversation above. In just 3 messages, you transformed a generic
              set of review questions into a study tool customized to your exact needs.
            </p>
            <p className="text-sm text-green-800 leading-relaxed mb-4 italic">
              "The real skill is treating this like a conversation. You don't have to get
              it perfect on the first try — you steer the AI toward what you actually need."
            </p>
            <div className="bg-white rounded-lg border border-green-200 p-3 mb-4">
              <p className="text-xs font-semibold text-green-900 mb-2 uppercase tracking-wide">
                What happened in this conversation:
              </p>
              <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                <li>You started with a solid RTFC prompt</li>
                <li>You identified what could be better</li>
                <li>You refined it with a specific follow-up</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={onComplete}
            className="bg-green-700 hover:bg-green-800 text-white"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Steer the Conversation</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Watch how iterative prompting refines AI output. Pick a follow-up to improve the
        response.
      </p>

      {isDevMode && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-800">
              Dev Mode: Jumped to summary
            </span>
          </div>
        </div>
      )}

      {/* Chat area */}
      <Card className="border border-gray-200 bg-white overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" aria-hidden="true" />
          <span className="text-xs font-medium text-gray-600">AI Chat Simulator</span>
        </div>
        <div
          ref={scrollRef}
          className="p-4 max-h-[420px] overflow-y-auto"
          role="list"
          aria-label="Chat conversation"
        >
          <AnimatePresence>
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} index={i} />
            ))}
          </AnimatePresence>
          {isTyping && <TypingIndicator />}
        </div>
      </Card>

      {/* Interaction area */}
      {!isTyping && step === 'refine1' && renderChips(REFINEMENT_1_CHIPS, handleRefinement1, 1)}
      {!isTyping && step === 'refine2' && renderChips(REFINEMENT_2_CHIPS, handleRefinement2, 2)}
      {step === 'summary' && !isTyping && renderSummary()}
    </div>
  );
};

export default SteerTheConversationActivity;
