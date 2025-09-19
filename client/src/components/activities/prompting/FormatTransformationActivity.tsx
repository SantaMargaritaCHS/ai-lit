import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, FileText, Palette, Wand2 } from 'lucide-react';

interface FormatTransformationActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

const FormatTransformationActivity: React.FC<FormatTransformationActivityProps> = ({ onComplete, isDevMode }) => {
  const [currentScreen, setCurrentScreen] = useState(0); // 0, 1, or 2
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [customFormat, setCustomFormat] = useState('');
  const [transformedContent, setTransformedContent] = useState('');
  
  const screens = [
    { id: 'standard', title: 'Standard Formats', icon: FileText },
    { id: 'creative', title: 'Creative & Fun Formats', icon: Palette },
    { id: 'custom', title: 'Create Your Own Format', icon: Wand2 }
  ];

  // Base article content with author and date
  const articleContent = {
    title: "Artificial Intelligence in Education",
    author: "Dr. Sarah Martinez",
    date: "March 15, 2024",
    content: `Artificial Intelligence is transforming education by providing personalized learning experiences and automating administrative tasks. AI-powered tools can adapt to individual student needs, offering customized content and pacing that matches each learner's abilities. Teachers benefit from AI assistants that help with grading, lesson planning, and identifying students who need extra support. As these technologies continue to evolve, they promise to make education more accessible, effective, and engaging for learners worldwide.`
  };

  const STANDARD_FORMATS = [
    { id: 'original', title: 'Original Article', icon: '📄', description: 'Full text format' },
    { id: 'bullets', title: 'Bullet Points', icon: '📋', description: 'Key takeaways' },
    { id: 'email', title: 'Email Format', icon: '✉️', description: 'Professional communication' },
    { id: 'outline', title: 'Outline', icon: '📑', description: 'Structured overview' },
    { id: 'summary', title: 'Summary', icon: '📝', description: 'Condensed version' },
    { id: 'qa', title: 'Q&A Format', icon: '❓', description: 'Questions and answers' }
  ];

  const CREATIVE_FORMATS = [
    { 
      id: 'alliteration',
      title: 'Alliteration Adventure',
      icon: '🅰️',
      description: 'Every sentence starts with the same letter',
      example: 'Artificial advances amaze academics...'
    },
    {
      id: 'rhyme',
      title: 'Rhyme Time',
      icon: '🎵',
      description: 'Content that rhymes for memorability',
      example: 'AI helps us learn each day, In a personalized way...'
    },
    {
      id: 'emoji',
      title: 'Emoji Enhanced',
      icon: '😊',
      description: 'Key points with relevant emojis',
      example: 'AI in education 🎓 personalizes learning 📚...'
    },
    {
      id: 'story',
      title: 'Story Format',
      icon: '📖',
      description: 'Content as an engaging narrative',
      example: 'Once upon a time in a classroom...'
    }
  ];

  // Pre-generated transformed content for demo
  const transformations: Record<string, string> = {
    'original': articleContent.content,
    'bullets': `• AI personalizes learning for each student's unique needs
• Provides immediate feedback to help students improve faster  
• Helps teachers spot where students are struggling
• Uses machine learning to find the best learning path for each student
• AI tutors can answer student questions instantly using natural language processing`,
    'email': `Subject: Exciting AI Developments in Education

Dear Colleagues,

I wanted to share some exciting insights about how Artificial Intelligence is revolutionizing our field.

AI technology is now enabling us to:
- Personalize learning experiences for every student
- Provide instant feedback and support
- Identify struggling students early
- Optimize learning paths through data analysis

These tools are making education more accessible and effective for all learners.

Best regards,
Dr. Sarah Martinez`,
    'outline': `I. AI in Education Overview
   A. Personalized Learning
      1. Individual student adaptation
      2. Customized content delivery
   B. Teacher Support
      1. Automated grading
      2. Lesson planning assistance
   C. Technology Benefits
      1. Real-time feedback
      2. Data-driven insights`,
    'summary': `AI is revolutionizing education through personalization and automation. It adapts to individual student needs, provides instant feedback, and helps teachers identify struggling students. The technology promises to make education more accessible and effective globally.`,
    'qa': `Q: How does AI personalize education?
A: AI adapts to individual student needs by customizing content and pacing.

Q: What benefits do teachers get from AI?
A: AI helps with grading, lesson planning, and identifying students who need support.

Q: What makes AI tutoring effective?
A: Natural language processing enables real-time understanding and response to student questions.`,
    'alliteration': `Artificial advances amaze academics and administrators alike. AI assists ambitious achievers, adapting academic activities accordingly. Automated assessments accelerate accurate analysis. Advanced algorithms anticipate areas where assistance is advantageous.`,
    'rhyme': `AI helps us learn each day,
In a personalized way.
Teachers get the tools they need,
To help each student succeed.
With feedback that's instant and clear,
Learning goals are always near!`,
    'emoji': `🤖 AI in Education = Personalized Learning! 📚

✨ Key Benefits:
🎯 Adapts to each student's needs
⚡ Instant feedback & support
👩‍🏫 Helps teachers identify struggles
📊 Data-driven learning paths
🌍 Making education accessible globally!`,
    'story': `Once upon a time, in classrooms around the world, teachers struggled to meet every student's unique needs. Then, a magical helper arrived - Artificial Intelligence! This wise digital assistant could understand each student's learning style, provide instant help when needed, and guide teachers to those who needed extra support. Together, they transformed education into an adventure where every student could thrive at their own pace.`
  };

  const getTransformedContent = (format: string): string => {
    if (format === 'custom' && customFormat) {
      return `[Your custom format: ${customFormat}]\n\n${articleContent.content}\n\n[This would be transformed according to your custom format specification]`;
    }
    return transformations[format] || articleContent.content;
  };

  const renderArticleDisplay = () => (
    <div className="mb-8">
      {/* Paper-like container */}
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-3xl mx-auto transform transition-all duration-300 hover:shadow-3xl"
           style={{ 
             backgroundColor: '#ffffff',
             color: '#000000',
             fontFamily: 'Georgia, serif'
           }}>
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
          {articleContent.title}
        </h2>
        <div className="text-sm mb-6 pb-3 border-b border-gray-300" style={{ color: '#666666' }}>
          By <span className="font-semibold">{articleContent.author}</span> | {articleContent.date}
        </div>
        <div className="text-base leading-relaxed" style={{ color: '#333333', whiteSpace: 'pre-wrap' }}>
          {selectedFormat ? getTransformedContent(selectedFormat) : articleContent.content}
        </div>
      </div>
      
      {selectedFormat && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Format: <span className="text-white font-semibold">{selectedFormat}</span>
          </p>
        </div>
      )}
    </div>
  );

  const FormatOption = ({ format, isSelected, onClick }: any) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all ${
        isSelected 
          ? 'bg-blue-600/30 border-blue-500 shadow-lg' 
          : 'bg-white/10 border-white/20 hover:border-white/40'
      }`}
    >
      <div className="text-2xl mb-2">{format.icon}</div>
      <div className="font-semibold text-white">{format.title}</div>
      <div className="text-xs text-gray-400 mt-1">{format.description}</div>
    </motion.button>
  );

  const CreativeFormatOption = ({ format, isSelected, onClick }: any) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-all ${
        isSelected 
          ? 'bg-purple-600/30 border-purple-500 shadow-lg' 
          : 'bg-white/10 border-white/20 hover:border-purple-400/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{format.icon}</div>
        <div className="flex-1">
          <div className="font-semibold text-white">{format.title}</div>
          <div className="text-xs text-gray-400 mt-1">{format.description}</div>
          {format.example && (
            <div className="text-xs text-purple-300 mt-2 italic">"{format.example}"</div>
          )}
        </div>
      </div>
    </motion.button>
  );

  const CustomFormatCreator = ({ onFormatCreate }: any) => (
    <Card className="p-6 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">
        Create Your Custom Format
      </h3>
      <p className="text-gray-300 mb-4">
        Describe how you want the content to be formatted:
      </p>
      <Textarea
        value={customFormat}
        onChange={(e) => setCustomFormat(e.target.value)}
        placeholder="Example: Convert to a dialogue between a teacher and student, or transform into a comic book script, or make it a recipe-style instruction..."
        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white min-h-[100px]"
      />
      <Button 
        onClick={() => onFormatCreate('custom')}
        disabled={!customFormat}
        className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        Apply Custom Format
      </Button>
    </Card>
  );

  return (
    <div className="min-h-screen p-6">
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {screens.map((screen, index) => (
          <button
            key={index}
            onClick={() => setCurrentScreen(index)}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              currentScreen === index
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/20 text-gray-400 hover:bg-white/30'
            }`}
          >
            <screen.icon className="w-4 h-4" />
            <span className="hidden md:inline">{screen.title}</span>
            <span className="md:hidden">{index + 1}</span>
          </button>
        ))}
      </div>

      {/* Screen 1: Standard Formats */}
      {currentScreen === 0 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Standard Formats
            </h2>
            <p className="text-gray-300">
              Transform content into common educational formats
            </p>
          </div>
          
          {renderArticleDisplay()}
          
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {STANDARD_FORMATS.map(format => (
              <FormatOption
                key={format.id}
                format={format}
                isSelected={selectedFormat === format.id}
                onClick={() => setSelectedFormat(format.id)}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setCurrentScreen(1)}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
            >
              Next: Creative Formats 
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Screen 2: Creative Formats */}
      {currentScreen === 1 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Creative & Fun Formats 🎨
            </h2>
            <p className="text-gray-300">
              Discover how AI can transform content in unexpected ways!
            </p>
          </div>
          
          {renderArticleDisplay()}
          
          <div className="bg-purple-500/20 rounded-2xl p-6 max-w-4xl mx-auto">
            <p className="text-gray-300 mb-6 text-center">
              Make learning memorable with creative formats:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {CREATIVE_FORMATS.map(format => (
                <CreativeFormatOption
                  key={format.id}
                  format={format}
                  isSelected={selectedFormat === format.id}
                  onClick={() => setSelectedFormat(format.id)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => setCurrentScreen(0)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
            <Button
              onClick={() => setCurrentScreen(2)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
            >
              Next: Custom Format 
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Screen 3: Custom Format */}
      {currentScreen === 2 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Your Own Custom Format 🚀
            </h2>
            <p className="text-gray-300">
              Tell AI exactly how you want your content formatted
            </p>
          </div>
          
          {renderArticleDisplay()}
          
          <CustomFormatCreator
            onFormatCreate={(format: string) => setSelectedFormat(format)}
          />
          
          {/* Format Power Tips */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 
                        rounded-2xl p-6 max-w-4xl mx-auto mt-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Format Power Tips
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Different formats serve different purposes - choose wisely!</li>
              <li>• Bullet points are great for quick scanning and key takeaways</li>
              <li>• Creative formats like poems or dialogues make content memorable</li>
              <li>• Custom formats let you match your exact teaching needs</li>
              <li>• Always consider your audience when selecting a format</li>
            </ul>
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => setCurrentScreen(1)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
            <Button
              onClick={onComplete}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2"
            >
              Continue to RTF Builder 
              <CheckCircle className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FormatTransformationActivity;