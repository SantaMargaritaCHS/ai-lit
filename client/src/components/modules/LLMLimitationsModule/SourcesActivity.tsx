import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Info, CheckCircle, ArrowRight, BookOpen, Link2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  onComplete: () => void;
  isDevMode?: boolean;
}

export default function SourcesActivity({ onComplete, isDevMode }: Props) {
  const [clickedSources, setClickedSources] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSourceClick = (sourceIndex: number) => {
    setClickedSources(prev => new Set(prev).add(sourceIndex));
    
    // Show explanation after clicking first source
    if (clickedSources.size === 0) {
      setTimeout(() => setShowExplanation(true), 500);
    }
  };

  // Auto-complete in dev mode
  React.useEffect(() => {
    if (isDevMode) {
      setClickedSources(new Set([1, 2, 3]));
      setShowExplanation(true);
    }
  }, [isDevMode]);

  const allSourcesClicked = clickedSources.size >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Modern LLMs Can Cite Sources
            </h2>
            <p className="text-lg text-gray-300">
              While LLMs still have limitations, many now include source citations to help verify information
            </p>
          </div>

          {/* AI Response Example */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">AI</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-3">Question: What are the latest developments in renewable energy?</h3>
                <div className="text-gray-300 space-y-3">
                  <p>
                    Recent developments in renewable energy show significant progress across multiple technologies:
                  </p>
                  <p>
                    Solar power efficiency has reached new heights, with perovskite-silicon tandem cells achieving 
                    over 33% efficiency in laboratory settings
                    <button
                      onClick={() => handleSourceClick(1)}
                      className={`ml-1 text-xs align-super ${
                        clickedSources.has(1) 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-blue-400 hover:text-blue-300'
                      } hover:underline transition-colors`}
                    >
                      [1]
                    </button>
                    . This represents a major breakthrough compared to traditional silicon cells.
                  </p>
                  <p>
                    Wind energy capacity grew by 17% globally in 2024, with offshore wind installations 
                    leading the expansion
                    <button
                      onClick={() => handleSourceClick(2)}
                      className={`ml-1 text-xs align-super ${
                        clickedSources.has(2) 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-blue-400 hover:text-blue-300'
                      } hover:underline transition-colors`}
                    >
                      [2]
                    </button>
                    . Countries like Denmark now generate over 80% of their electricity from wind power.
                  </p>
                  <p>
                    Battery storage costs have decreased by 89% since 2010, making grid-scale storage 
                    increasingly viable for renewable energy integration
                    <button
                      onClick={() => handleSourceClick(3)}
                      className={`ml-1 text-xs align-super ${
                        clickedSources.has(3) 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-blue-400 hover:text-blue-300'
                      } hover:underline transition-colors`}
                    >
                      [3]
                    </button>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Sources Section */}
            <div className="border-t border-gray-700 pt-4 mt-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Sources:</h4>
              <div className="space-y-2 text-sm">
                <motion.div
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: clickedSources.has(1) ? 1 : 0.6 }}
                  className={`flex items-start gap-2 ${
                    clickedSources.has(1) ? 'text-gray-200' : 'text-gray-500'
                  }`}
                >
                  <span>[1]</span>
                  <div>
                    <span>Nature Energy Journal - "Perovskite-silicon tandem solar cells" (2024)</span>
                    {clickedSources.has(1) && (
                      <div className="flex items-center gap-1 mt-1 text-blue-400">
                        <ExternalLink className="w-3 h-3" />
                        <span className="text-xs">Click to view source</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: clickedSources.has(2) ? 1 : 0.6 }}
                  className={`flex items-start gap-2 ${
                    clickedSources.has(2) ? 'text-gray-200' : 'text-gray-500'
                  }`}
                >
                  <span>[2]</span>
                  <div>
                    <span>Global Wind Energy Council - "Annual Wind Report 2024"</span>
                    {clickedSources.has(2) && (
                      <div className="flex items-center gap-1 mt-1 text-blue-400">
                        <ExternalLink className="w-3 h-3" />
                        <span className="text-xs">Click to view source</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: clickedSources.has(3) ? 1 : 0.6 }}
                  className={`flex items-start gap-2 ${
                    clickedSources.has(3) ? 'text-gray-200' : 'text-gray-500'
                  }`}
                >
                  <span>[3]</span>
                  <div>
                    <span>Bloomberg New Energy Finance - "Battery Price Survey 2024"</span>
                    {clickedSources.has(3) && (
                      <div className="flex items-center gap-1 mt-1 text-blue-400">
                        <ExternalLink className="w-3 h-3" />
                        <span className="text-xs">Click to view source</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Explanation Box */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-100">
                      <p className="mb-2">
                        <strong>Why Sources Matter:</strong> Citations help users verify information and check 
                        if it's current and accurate. However, remember:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>AI might still misinterpret sources</li>
                        <li>Sources could be outdated by the time you read them</li>
                        <li>Always click through to verify critical information</li>
                        <li>Check the credibility of the sources themselves</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          {!allSourcesClicked && (
            <div className="text-center mb-6">
              <p className="text-gray-300">
                <span className="text-blue-400 font-medium">Try it:</span> Click on the citation numbers 
                [1], [2], and [3] above to see how sources work
              </p>
            </div>
          )}

          {/* Key Takeaways */}
          {allSourcesClicked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700/50 rounded-lg p-6 mb-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-400" />
                Key Takeaways
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>Modern AI tools increasingly provide source citations to support their claims</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>Sources appear as small, clickable numbers or links within the text</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>While helpful, sources don't eliminate the need for critical evaluation</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>Always verify important information by checking the original sources</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Continue Button */}
          {allSourcesClicked && (
            <div className="flex justify-center">
              <button
                onClick={onComplete}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-lg font-medium hover:from-green-500 hover:to-green-400 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                Continue to Conclusion
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}