import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Hash, Info, ArrowRight, Check, Eye, FileText, MessageSquare, BookOpen } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface Token {
  text: string;
  id: number;
  color: string;
}

interface Example {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  description: string;
  tokenizeThis: string; // The actual text to tokenize
}

export default function TokenizationDemo({ onComplete }: Props) {
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [viewedExamples, setViewedExamples] = useState<Set<string>>(new Set());
  const [userInput, setUserInput] = useState('');
  const [userTokens, setUserTokens] = useState<Token[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  const examples: Example[] = [
    {
      id: 'essay',
      label: 'Essay',
      icon: <BookOpen className="w-5 h-5" />,
      description: "Academic writing - notice how complex vocabulary splits into meaningful parts",
      tokenizeThis: "The Industrial Revolution fundamentally transformed human society during the late 18th and 19th centuries. Manufacturing processes shifted dramatically from hand production methods to mechanized factory systems powered by steam engines and later electricity. This technological advancement sparked unprecedented economic growth and rapid urbanization as workers migrated from rural agricultural communities to industrial cities. The revolution profoundly impacted social structures, creating a new industrial working class while generating immense wealth for factory owners and entrepreneurs. Educational systems evolved to meet the demands of industrial labor, emphasizing punctuality, discipline, and basic literacy. Despite improving living standards over time, early industrialization brought harsh working conditions, including long hours, child labor, and dangerous factory environments. The period ultimately laid the groundwork for modern capitalism and continues to influence economic and social policies today.",
      content: (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">The Industrial Revolution's Lasting Impact</h2>
            <p className="text-white/60 text-sm">By Student Writer • 10th Grade History</p>
          </div>

          <div className="space-y-3 text-white leading-relaxed">
            <p>
              The Industrial Revolution fundamentally transformed human society during the late 18th and 19th centuries. Manufacturing processes shifted dramatically from hand production methods to mechanized factory systems powered by steam engines and later electricity. This technological advancement sparked unprecedented economic growth and rapid urbanization as workers migrated from rural agricultural communities to industrial cities.
            </p>

            <p>
              The revolution profoundly impacted social structures, creating a new industrial working class while generating immense wealth for factory owners and entrepreneurs. Educational systems evolved to meet the demands of industrial labor, emphasizing punctuality, discipline, and basic literacy.
            </p>

            <p>
              Despite improving living standards over time, early industrialization brought harsh working conditions, including long hours, child labor, and dangerous factory environments. The period ultimately laid the groundwork for modern capitalism and continues to influence economic and social policies today.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'homework',
      label: 'Homework',
      icon: <FileText className="w-5 h-5" />,
      description: "A typical English homework assignment with reading and questions",
      tokenizeThis: "English 10 - Reading Comprehension Worksheet. Read the following passage carefully: 'To Kill a Mockingbird' by Harper Lee explores themes of racial injustice and moral growth in the American South during the 1930s. Through the eyes of young Scout Finch, readers witness her father Atticus defending a Black man falsely accused of assault. The novel challenges readers to confront prejudice and understand empathy. Question 1: What is the main theme of the novel? Question 2: Who is the narrator of the story? Question 3: What does Atticus Finch's character represent? Question 4: How does Scout's perspective change throughout the novel? Writing Prompt: In 3-4 sentences, explain why understanding different perspectives matters in fighting injustice.",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-900/30 border-l-4 border-blue-400 p-3 rounded">
            <h3 className="text-white font-bold">English 10 - Reading Comprehension Worksheet</h3>
            <p className="text-white/70 text-sm">Due: Tomorrow</p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-white/90 font-semibold mb-2">Read the following passage carefully:</p>
            <p className="text-white leading-relaxed">
              'To Kill a Mockingbird' by Harper Lee explores themes of racial injustice and moral growth in the American South during the 1930s. Through the eyes of young Scout Finch, readers witness her father Atticus defending a Black man falsely accused of assault. The novel challenges readers to confront prejudice and understand empathy.
            </p>
          </div>

          <div className="space-y-3">
            <div className="border-l-2 border-purple-400 pl-3">
              <p className="text-white font-semibold">Question 1:</p>
              <p className="text-white/80">What is the main theme of the novel?</p>
              <p className="text-white/40 text-sm mt-1">Answer: _________________________________</p>
            </div>

            <div className="border-l-2 border-purple-400 pl-3">
              <p className="text-white font-semibold">Question 2:</p>
              <p className="text-white/80">Who is the narrator of the story?</p>
              <p className="text-white/40 text-sm mt-1">Answer: _________________________________</p>
            </div>

            <div className="border-l-2 border-purple-400 pl-3">
              <p className="text-white font-semibold">Question 3:</p>
              <p className="text-white/80">What does Atticus Finch's character represent?</p>
              <p className="text-white/40 text-sm mt-1">Answer: _________________________________</p>
            </div>

            <div className="border-l-2 border-purple-400 pl-3">
              <p className="text-white font-semibold">Question 4:</p>
              <p className="text-white/80">How does Scout's perspective change throughout the novel?</p>
              <p className="text-white/40 text-sm mt-1">Answer: _________________________________</p>
            </div>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-400 rounded-lg p-3">
            <p className="text-yellow-200 font-semibold mb-1">✏️ Writing Prompt:</p>
            <p className="text-white/90 text-sm">In 3-4 sentences, explain why understanding different perspectives matters in fighting injustice.</p>
          </div>
        </div>
      )
    },
    {
      id: 'chat',
      label: 'Conversation',
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Student chatting with AI about homework - see how conversations tokenize",
      tokenizeThis: "Can you explain photosynthesis in simple terms? Of course! Photosynthesis is the process plants use to convert sunlight into food energy. They take in carbon dioxide from the air, water from the soil, and use light energy to create glucose sugar and release oxygen as a byproduct. So plants are basically making their own food from sunlight? Exactly! Think of it like this: the green chlorophyll in their leaves acts like tiny solar panels. They capture light energy and use it to power a chemical reaction that combines CO2 and H2O into glucose. That's actually pretty cool. So that's why we need plants for oxygen? Yes! When plants make glucose through photosynthesis, they release oxygen molecules that we breathe. It's a perfect cycle - we breathe out CO2 that plants need, and they produce oxygen that we need. This is really helpful for my biology test. Can you explain cellular respiration next? Sure! Cellular respiration is basically photosynthesis in reverse. Animals like us take in glucose from food and oxygen from breathing, then our cells break down the glucose to release energy, producing CO2 and water as waste products.",
      content: (
        <div className="space-y-3">
          {/* Student Message */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
              <p className="text-sm">Can you explain photosynthesis in simple terms?</p>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm font-semibold text-purple-300 mb-1">AI Assistant</p>
              <p className="text-sm">Of course! Photosynthesis is the process plants use to convert sunlight into food energy. They take in carbon dioxide from the air, water from the soil, and use light energy to create glucose (sugar) and release oxygen as a byproduct.</p>
            </div>
          </div>

          {/* Student Message */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
              <p className="text-sm">So plants are basically making their own food from sunlight?</p>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm font-semibold text-purple-300 mb-1">AI Assistant</p>
              <p className="text-sm">Exactly! Think of it like this: the green chlorophyll in their leaves acts like tiny solar panels. They capture light energy and use it to power a chemical reaction that combines CO₂ and H₂O into glucose.</p>
            </div>
          </div>

          {/* Student Message */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
              <p className="text-sm">That's actually pretty cool. So that's why we need plants for oxygen?</p>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm font-semibold text-purple-300 mb-1">AI Assistant</p>
              <p className="text-sm">Yes! When plants make glucose through photosynthesis, they release oxygen molecules that we breathe. It's a perfect cycle - we breathe out CO₂ that plants need, and they produce oxygen that we need.</p>
            </div>
          </div>

          {/* Student Message */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
              <p className="text-sm">This is really helpful for my biology test. Can you explain cellular respiration next?</p>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm font-semibold text-purple-300 mb-1">AI Assistant</p>
              <p className="text-sm">Sure! Cellular respiration is basically photosynthesis in reverse. Animals like us take in glucose from food and oxygen from breathing, then our cells break down the glucose to release energy, producing CO₂ and water as waste products.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Realistic tokenization patterns based on GPT-style tokenization
  const tokenizeText = (text: string): Token[] => {
    if (!text) return [];

    const words = text.split(/\s+/);
    const tokenList: Token[] = [];
    let tokenId = 0;

    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500',
      'bg-pink-500', 'bg-cyan-500', 'bg-orange-500', 'bg-indigo-500',
      'bg-teal-500', 'bg-red-500'
    ];

    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    const complexWordSplits: { [key: string]: string[] } = {
      'fundamentally': ['fund', 'ament', 'ally'],
      'transformed': ['trans', 'formed'],
      'manufacturing': ['manufact', 'uring'],
      'dramatically': ['dramat', 'ically'],
      'mechanized': ['mechan', 'ized'],
      'technological': ['techn', 'ological'],
      'advancement': ['adv', 'ancement'],
      'unprecedented': ['un', 'preced', 'ented'],
      'urbanization': ['urban', 'ization'],
      'agricultural': ['agricult', 'ural'],
      'communities': ['commun', 'ities'],
      'profoundly': ['prof', 'ound', 'ly'],
      'industrial': ['industr', 'ial'],
      'entrepreneurs': ['entrepr', 'ene', 'urs'],
      'educational': ['educ', 'ational'],
      'emphasizing': ['emphas', 'izing'],
      'punctuality': ['punct', 'ual', 'ity'],
      'discipline': ['disc', 'ipl', 'ine'],
      'industrialization': ['industr', 'ial', 'ization'],
      'environments': ['environ', 'ments'],
      'ultimately': ['ultim', 'ately'],
      'capitalism': ['capit', 'alism'],
      'influence': ['influ', 'ence'],
      'Comprehension': ['Comp', 'rehens', 'ion'],
      'photosynthesis': ['photo', 'synth', 'esis'],
      'perspectives': ['per', 'spect', 'ives'],
      'understanding': ['under', 'standing'],
      'chlorophyll': ['chlor', 'ophyll'],
      'conversation': ['convers', 'ation'],
      'cellular': ['cell', 'ular'],
      'respiration': ['resp', 'iration']
    };

    words.forEach((word, wordIndex) => {
      // Add space token if not first word
      if (wordIndex > 0) {
        tokenList.push({
          text: ' ',
          id: tokenId++,
          color: 'bg-gray-600'
        });
      }

      // Clean word of punctuation
      const cleanWord = word.replace(/[.,!?;:'"]/g, '');
      const punct = word.replace(/[^.,!?;:'"]/g, '');

      // Check for complex word splits
      const lowerWord = cleanWord.toLowerCase();
      if (complexWordSplits[lowerWord]) {
        complexWordSplits[lowerWord].forEach(part => {
          tokenList.push({ text: part, id: tokenId++, color: getRandomColor() });
        });
      } else if (cleanWord.length > 8) {
        // Split long words into 2 parts
        const mid = Math.ceil(cleanWord.length / 2);
        tokenList.push({ text: cleanWord.substring(0, mid), id: tokenId++, color: getRandomColor() });
        tokenList.push({ text: cleanWord.substring(mid), id: tokenId++, color: getRandomColor() });
      } else {
        // Simple word as single token
        tokenList.push({ text: cleanWord, id: tokenId++, color: getRandomColor() });
      }

      // Add punctuation as separate tokens
      if (punct) {
        punct.split('').forEach(p => {
          tokenList.push({ text: p, id: tokenId++, color: 'bg-gray-500' });
        });
      }
    });

    return tokenList;
  };

  // Handle tab selection
  const handleTabSelect = (exampleId: string) => {
    setSelectedTab(exampleId);
    setViewedExamples(prev => new Set(prev).add(exampleId));
  };

  // Tokenize user input with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setUserTokens(tokenizeText(userInput));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [userInput]);

  // Check if user can continue
  useEffect(() => {
    const hasViewedAll = viewedExamples.size >= 3;
    const hasTypedEnough = userInput.trim().length >= 20;
    setCanContinue(hasViewedAll && hasTypedEnough);
  }, [viewedExamples, userInput]);

  const hasViewedAllExamples = viewedExamples.size >= 3;
  const selectedExample = examples.find(ex => ex.id === selectedTab);
  const selectedTokens = selectedExample ? tokenizeText(selectedExample.tokenizeThis) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Eye className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">
            See How AI Sees Your Content
          </h1>
          <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-6 max-w-4xl mx-auto">
            <p className="text-white text-lg leading-relaxed">
              Ever wondered how ChatGPT actually "reads" your homework or essays? It doesn't see words like you do - it breaks everything into <strong className="text-yellow-300">tokens</strong> (smart chunks). Click an example below to see the difference between what YOU see and what AI sees!
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-3 mb-6 justify-center flex-wrap">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => handleTabSelect(example.id)}
              className={`relative px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                selectedTab === example.id
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {example.icon}
              {example.label}
              {viewedExamples.has(example.id) && (
                <Check className="w-4 h-4 text-green-400 absolute -top-1 -right-1 bg-gray-900 rounded-full p-0.5" />
              )}
            </button>
          ))}
        </div>

        {/* Prompt to click an example */}
        {!selectedTab && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-900/30 border-2 border-yellow-400 rounded-lg p-8 mb-8 text-center"
          >
            <p className="text-white text-xl font-medium mb-2">
              👆 Click on an example above to get started!
            </p>
            <p className="text-white/80">
              You'll see a split-screen comparison: What YOU see vs. What AI sees
            </p>
          </motion.div>
        )}

        {/* Split Screen: Your View (Left) + AI's View (Right) */}
        {selectedTab && selectedExample && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            {/* Left: What YOU See */}
            <div className="bg-gray-800/50 border-2 border-purple-400 rounded-lg overflow-hidden">
              <div className="bg-purple-900/40 px-4 py-3 border-b border-purple-400">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-300" />
                  What YOU See
                </h3>
                <p className="text-purple-200 text-sm">{selectedExample.description}</p>
              </div>
              <div className="p-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-700">
                {selectedExample.content}
              </div>
            </div>

            {/* Right: What AI Sees (Tokenized) */}
            <div className="bg-gray-800/50 border-2 border-green-400 rounded-lg overflow-hidden">
              <div className="bg-green-900/40 px-4 py-3 border-b border-green-400">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Hash className="w-5 h-5 text-green-300" />
                  What AI Sees ({selectedTokens.length} tokens)
                </h3>
                <p className="text-green-200 text-sm">Each colored box is a separate "token"</p>
              </div>
              <div className="p-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-700">
                <div className="flex flex-wrap gap-2">
                  {selectedTokens.map((token, index) => (
                    <motion.div
                      key={token.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.01 }}
                      className="relative group"
                    >
                      <div className={`${token.color} px-2 py-1 rounded text-white font-mono text-xs`}>
                        {token.text === ' ' ? '␣' : token.text}
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        Token {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Prompt to view all examples before "Now You Try!" */}
        {!hasViewedAllExamples && selectedTab && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-purple-900/30 border-2 border-purple-400 rounded-lg p-6 mb-8 text-center"
          >
            <p className="text-white text-lg font-medium mb-2">
              🔍 Keep exploring!
            </p>
            <p className="text-white/80">
              View all three examples (Essay, Homework, Conversation) to unlock "Try Your Own"
            </p>
            <p className="text-white/60 text-sm mt-2">
              Progress: {viewedExamples.size}/3 examples viewed
            </p>
          </motion.div>
        )}

        {/* Try Your Own Section */}
        {hasViewedAllExamples && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-yellow-900/20 border-2 border-yellow-400 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Scissors className="w-6 h-6 text-yellow-400" />
                ✏️ Now You Try!
              </h3>
              <p className="text-white mb-4">
                Type anything you want to see how it tokenizes (at least 20 characters):
              </p>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type anything here... Try a sentence from your homework, a question for AI, or anything else!"
                className="w-full h-24 px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none mb-3"
              />
              <div className="flex justify-between items-center text-sm mb-4">
                <span className={userInput.length >= 20 ? 'text-green-400 font-medium' : 'text-white/70'}>
                  {userInput.length >= 20 ? '✓' : '•'} {userInput.length}/20 characters
                </span>
                {userTokens.length > 0 && (
                  <span className="text-white/70">
                    <Hash className="w-4 h-4 inline mr-1" />
                    {userTokens.length} tokens
                  </span>
                )}
              </div>

              {/* User's Tokenized Output */}
              {userTokens.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 rounded-lg p-4"
                >
                  <div className="flex flex-wrap gap-2">
                    {userTokens.map((token, index) => (
                      <motion.div
                        key={token.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className={`${token.color} px-2 py-1 rounded text-white font-mono text-xs`}
                      >
                        {token.text === ' ' ? '␣' : token.text}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Explanation Toggle */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
          >
            <Info className="w-4 h-4" />
            {showExplanation ? 'Hide' : 'Show'} why this matters for you
          </button>
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">💡 Why This Matters for YOU:</h3>
                <ul className="text-white space-y-3">
                  <li>• <strong className="text-yellow-300">Token limits:</strong> Why AI tools cut off long essays (too many tokens!)</li>
                  <li>• <strong className="text-yellow-300">Better predictions:</strong> Tokens help AI understand context way better than individual letters</li>
                  <li>• <strong className="text-yellow-300">Complex words:</strong> Notice how academic vocabulary splits into multiple pieces</li>
                  <li>• <strong className="text-yellow-300">Processing power:</strong> More tokens = more computation = slower (or more expensive) responses</li>
                </ul>
                <p className="text-white mt-4">
                  Remember: AI is still that <strong className="text-yellow-300">"super advanced pattern matcher"</strong> from the video—tokens are HOW it matches patterns!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className={viewedExamples.size >= 3 ? 'text-green-400' : 'text-white/70'}>
                {viewedExamples.size >= 3 ? '✓' : '○'} Viewed all 3 examples ({viewedExamples.size}/3)
              </span>
              <span className={userInput.length >= 20 ? 'text-green-400' : 'text-white/70'}>
                {userInput.length >= 20 ? '✓' : '○'} Tried your own text
              </span>
            </div>
            {canContinue && (
              <span className="text-green-400 font-medium flex items-center gap-1">
                <Check className="w-5 h-5" />
                Ready to continue!
              </span>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onComplete}
          disabled={!canContinue}
          className={`w-full py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-2 transition-all ${
            canContinue
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {canContinue ? (
            <>
              Continue <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            'Complete the requirements above to continue'
          )}
        </button>
      </div>
    </motion.div>
  );
}
