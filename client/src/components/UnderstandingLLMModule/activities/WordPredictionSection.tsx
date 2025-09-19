import React, { useState, useEffect } from 'react';

interface Props {
  onComplete: () => void;
}

// Word Prediction Section Component
const WordPredictionSection: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [userWord, setUserWord] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Sentences to complete
  const sentences = [
    {
      text: "The teacher asked the students to open their",
      topPredictions: [
        { word: "books", probability: 0.42, insight: "Educational contexts often mention books" },
        { word: "laptops", probability: 0.28, insight: "Modern classrooms frequently use technology" },
        { word: "notebooks", probability: 0.18, insight: "Traditional classroom materials" },
        { word: "minds", probability: 0.08, insight: "Metaphorical usage in motivational contexts" },
        { word: "OTHER", probability: 0.04, insight: "Less common words" }
      ]
    },
    {
      text: "In the morning, I always drink my",
      topPredictions: [
        { word: "coffee", probability: 0.55, insight: "Most common morning beverage in training data" },
        { word: "tea", probability: 0.22, insight: "Second most common morning drink" },
        { word: "water", probability: 0.12, insight: "Health-conscious contexts" },
        { word: "juice", probability: 0.07, insight: "Breakfast contexts" },
        { word: "OTHER", probability: 0.04, insight: "Less common beverages" }
      ]
    },
    {
      text: "The weather today is very",
      topPredictions: [
        { word: "nice", probability: 0.31, insight: "Generic positive descriptor" },
        { word: "cold", probability: 0.24, insight: "Common weather complaint" },
        { word: "hot", probability: 0.19, insight: "Opposite extreme weather" },
        { word: "beautiful", probability: 0.15, insight: "Positive weather description" },
        { word: "OTHER", probability: 0.11, insight: "Various weather conditions" }
      ]
    }
  ];

  const handleSubmit = () => {
    if (!userWord.trim()) return;

    const current = sentences[currentSentence];
    const userWordLower = userWord.toLowerCase().trim();
    
    const matchedPrediction = current.topPredictions.find(
      p => p.word.toLowerCase() === userWordLower
    );
    
    let probability, insight;
    if (matchedPrediction && matchedPrediction.word !== 'OTHER') {
      probability = matchedPrediction.probability;
      insight = matchedPrediction.insight;
    } else {
      probability = Math.random() * 0.03 + 0.01;
      insight = "This word appears less frequently in typical training data";
    }

    setPredictions([...predictions, {
      sentence: current.text,
      userWord: userWord,
      probability: probability,
      insight: insight
    }]);

    setShowFeedback(true);
  };

  const nextSentence = () => {
    if (currentSentence < sentences.length - 1) {
      setCurrentSentence(currentSentence + 1);
      setUserWord('');
      setShowFeedback(false);
    } else {
      setIsComplete(true);
    }
  };

  // When complete, call the parent's onComplete function
  useEffect(() => {
    if (isComplete) {
      // Small delay to show summary first
      setTimeout(() => {
        onComplete();
      }, 5000); // 5 seconds to read summary
    }
  }, [isComplete, onComplete]);

  if (isComplete) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🎓 What You Learned</h3>
        
        <div className="space-y-3 mb-6">
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
            <p className="font-medium text-gray-900 dark:text-white">AI predicts based on patterns in training data</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border-l-4 border-green-500">
            <p className="font-medium text-gray-900 dark:text-white">Common words have higher probabilities</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border-l-4 border-purple-500">
            <p className="font-medium text-gray-900 dark:text-white">Context heavily influences predictions</p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Your Predictions:</h4>
          {predictions.map((pred, idx) => (
            <div key={idx} className="mb-2">
              <span className="text-gray-600 dark:text-gray-300">"{pred.sentence} </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{pred.userWord}"</span>
              <span className="text-sm text-gray-500"> - {(pred.probability * 100).toFixed(1)}% likely</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500">Moving to next section in a moment...</p>
      </div>
    );
  }

  return (
    <div className="word-prediction-container">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-white">Predict the Next Word</h3>
          <span className="text-sm text-gray-400">
            Sentence {currentSentence + 1} of {sentences.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentSentence + 1) / sentences.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-6">
        <p className="text-lg mb-4">
          <span className="text-gray-700 dark:text-gray-300">{sentences[currentSentence].text}</span>
          <span className="text-blue-600 font-bold animate-pulse"> ___?</span>
        </p>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={userWord}
            onChange={(e) => setUserWord(e.target.value.replace(/\s/g, ''))}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Type one word"
            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={showFeedback}
            maxLength={20}
          />
          <button
            onClick={handleSubmit}
            disabled={!userWord.trim() || showFeedback}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
      </div>

      {showFeedback && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">AI Probability Analysis</h4>
            
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-lg text-gray-900 dark:text-white">
                  Your word: <span className="font-bold text-blue-600">"{userWord}"</span>
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  {(predictions[predictions.length - 1].probability * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${predictions[predictions.length - 1].probability * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                <strong>Why this probability?</strong>
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {predictions[predictions.length - 1].insight}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Top AI Predictions</h4>
            <div className="space-y-2">
              {sentences[currentSentence].topPredictions.slice(0, 4).map((pred, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{pred.word}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${pred.probability * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {(pred.probability * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSentence}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
          >
            {currentSentence < sentences.length - 1 ? 'Next Sentence →' : 'See What You Learned →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default WordPredictionSection;