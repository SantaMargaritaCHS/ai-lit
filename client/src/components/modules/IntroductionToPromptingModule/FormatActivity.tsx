import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, FileText, Palette, Wand2, AlertCircle, Loader2 } from 'lucide-react';

interface FormatActivityProps {
  onComplete: () => void;
}

const FormatActivity: React.FC<FormatActivityProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0); // 0, 1, or 2
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [customFormat, setCustomFormat] = useState('');
  const [customTransformedContent, setCustomTransformedContent] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const [hasTriedFormat, setHasTriedFormat] = useState<boolean[]>([false, false, false]);
  
  const screens = [
    { id: 'standard', title: 'Standard Formats', icon: FileText },
    { id: 'creative', title: 'Creative & Fun Formats', icon: Palette },
    { id: 'custom', title: 'Create Your Own Format', icon: Wand2 }
  ];

  // Much longer, more detailed article content
  const articleContent = {
    title: "Artificial Intelligence in Education: A Comprehensive Overview",
    author: "Dr. Sarah Martinez",
    date: "March 15, 2024",
    content: `Artificial Intelligence is fundamentally transforming education in ways that were unimaginable just a decade ago. This revolutionary technology is creating personalized learning experiences that adapt to each student's unique needs, learning pace, and style. By analyzing vast amounts of educational data, AI systems can identify patterns in how individual students learn best and adjust their teaching methods accordingly.

In traditional classrooms, teachers often struggle to meet the diverse needs of 25-30 students simultaneously. AI-powered educational tools solve this challenge by providing customized content and pacing for each learner. When a student struggles with a particular concept, the AI can automatically provide additional explanations, examples, or practice problems. Conversely, when a student masters material quickly, the system can present more challenging content to keep them engaged and learning at their optimal level.

Teachers are finding that AI assistants dramatically reduce their administrative workload. Tasks that once consumed hours - such as grading assignments, tracking student progress, and creating differentiated lesson plans - can now be completed in minutes. This automation frees teachers to focus on what they do best: inspiring students, facilitating discussions, providing emotional support, and fostering creativity. AI can analyze student submissions to identify common misconceptions, helping teachers understand where the class as a whole needs additional support.

The technology extends beyond simple automation. Natural language processing enables AI tutors to understand and respond to student questions in real-time, providing instant feedback that would be impossible for a single teacher to deliver to every student. Machine learning algorithms analyze performance data to predict which students might struggle with upcoming topics, allowing for proactive intervention. Computer vision technology can even assess student engagement levels during virtual lessons, alerting teachers when students appear confused or distracted.

As these technologies continue to evolve and improve, they promise to make quality education more accessible to students worldwide. Rural communities with teacher shortages can access AI-powered instruction. Students with learning disabilities receive customized support tailored to their specific needs. Language barriers dissolve as AI provides real-time translation and culturally relevant examples. The future of education is one where every student, regardless of their background or circumstances, has access to personalized, effective, and engaging learning experiences powered by artificial intelligence.`
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
    'bullets': `KEY POINTS ABOUT AI IN EDUCATION:

• AI creates personalized learning experiences adapted to each student's unique needs
• Systems analyze educational data to identify optimal learning patterns for individuals
• Customized content and pacing helps students learn at their ideal speed
• Struggling students receive additional explanations and practice automatically
• Advanced students get challenging content to maintain engagement

BENEFITS FOR TEACHERS:
• Dramatic reduction in administrative workload
• Automated grading saves hours of time weekly
• AI tracks student progress and creates differentiated lesson plans
• Teachers can focus on inspiration, discussion, and emotional support
• Systems identify common misconceptions across the class

ADVANCED CAPABILITIES:
• Natural language processing enables real-time Q&A with AI tutors
• Machine learning predicts which students might struggle with upcoming topics
• Computer vision assesses student engagement during virtual lessons
• Instant feedback available for every student simultaneously
• Proactive intervention possible before students fall behind

GLOBAL IMPACT:
• Rural communities gain access to quality AI-powered instruction
• Students with learning disabilities receive customized support
• Real-time translation breaks down language barriers
• Culturally relevant examples for diverse student populations
• Quality education becomes accessible regardless of background or circumstances`,

    'email': `Subject: Exciting AI Developments Transforming Education - March Update

Dear Fellow Educators,

I hope this email finds you well. I wanted to share some remarkable insights about how Artificial Intelligence is revolutionizing our field and creating unprecedented opportunities for both teachers and students.

The transformation we're witnessing is truly comprehensive. AI technology now enables us to provide genuinely personalized learning experiences for every student in our classrooms. By analyzing vast amounts of educational data, these systems identify the unique learning patterns of each individual student and adapt accordingly.

For us as teachers, the benefits are substantial:
- Administrative tasks that once consumed hours (grading, progress tracking, lesson planning) now take minutes
- We can focus more on inspiring students and facilitating meaningful discussions
- AI helps identify common misconceptions, showing us exactly where our class needs support
- Real-time insights into student engagement and understanding

The technology goes far beyond simple automation. Natural language processing allows AI tutors to answer student questions instantly, while machine learning algorithms predict which students might struggle with upcoming material. This enables proactive intervention before students fall behind.

Perhaps most excitingly, AI is making quality education accessible globally. Rural communities with teacher shortages, students with learning disabilities, and non-native speakers all benefit from customized, AI-powered support.

I'd love to discuss how we might integrate some of these tools into our curriculum. Would you be interested in attending a workshop on AI in education next month?

Best regards,
Dr. Sarah Martinez
Educational Technology Specialist`,

    'outline': `I. AI TRANSFORMATION IN EDUCATION
   A. Fundamental Changes
      1. Shift from one-size-fits-all to personalized learning
      2. Technology adapting to individual student needs
      3. Data-driven educational decisions
   
   B. Personalization Mechanisms
      1. Analysis of learning patterns
      2. Customized content delivery
      3. Adaptive pacing for each student

II. SOLVING CLASSROOM CHALLENGES
   A. Traditional Classroom Limitations
      1. 25-30 students with diverse needs
      2. Single teacher cannot provide individual attention
      3. Fixed pace frustrates both struggling and advanced students
   
   B. AI Solutions
      1. Automatic additional support for struggling students
      2. Advanced content for quick learners
      3. Optimal challenge level for engagement

III. TEACHER EMPOWERMENT
   A. Administrative Relief
      1. Automated grading systems
      2. Progress tracking dashboards
      3. AI-generated lesson plans
   
   B. Focus on Human Elements
      1. More time for inspiration and creativity
      2. Enhanced emotional support
      3. Facilitation of discussions

IV. ADVANCED TECHNOLOGICAL CAPABILITIES
   A. Natural Language Processing
      1. Real-time Q&A with AI tutors
      2. Instant feedback for all students
   
   B. Predictive Analytics
      1. Early identification of at-risk students
      2. Proactive intervention strategies
   
   C. Computer Vision
      1. Engagement assessment
      2. Confusion detection

V. GLOBAL EDUCATIONAL IMPACT
   A. Accessibility Improvements
      1. Rural community support
      2. Special needs accommodation
   
   B. Breaking Barriers
      1. Language translation
      2. Cultural adaptation
      3. Universal access to quality education`,

    'summary': `AI is revolutionizing education through unprecedented personalization and automation. The technology analyzes individual learning patterns to provide customized content and pacing for each student, ensuring optimal engagement whether they're struggling or advanced. Teachers benefit from dramatic reductions in administrative work - automated grading, progress tracking, and lesson planning free them to focus on inspiration, discussion, and emotional support. Advanced capabilities include natural language processing for instant Q&A, machine learning for predictive intervention, and computer vision for engagement assessment. Most importantly, AI is democratizing education globally, providing quality instruction to rural communities, supporting students with disabilities, breaking language barriers, and ensuring every learner has access to effective, personalized education regardless of their circumstances.`,

    'qa': `Q: How exactly does AI personalize education for individual students?
A: AI analyzes vast amounts of data about how each student learns - their pace, preferred content types, common mistakes, and mastery patterns. It then automatically adjusts lesson difficulty, provides customized explanations, and offers targeted practice problems based on each student's unique needs.

Q: What specific benefits do teachers experience from AI in education?
A: Teachers save hours weekly on administrative tasks like grading and progress tracking. AI identifies common class-wide misconceptions, generates differentiated lesson plans, and provides real-time insights into student engagement. This frees teachers to focus on inspiring students, facilitating discussions, and providing emotional support.

Q: Can AI really understand and respond to student questions?
A: Yes, through natural language processing, AI tutors can understand student questions in their own words and provide relevant, immediate responses. They can explain concepts multiple ways, provide examples, and even detect when a student is confused based on their question patterns.

Q: How does AI help struggling students specifically?
A: When AI detects a student struggling with a concept, it automatically provides additional explanations, breaks down complex ideas into smaller steps, offers more practice problems, and adjusts the pace. Machine learning can even predict struggles before they happen, allowing for preventive support.

Q: What about advanced students who learn quickly?
A: AI keeps advanced students engaged by automatically presenting more challenging content when they master material quickly. It can introduce advanced topics, provide enrichment activities, and maintain an optimal level of challenge to prevent boredom while ensuring continued growth.

Q: How is AI making education more accessible globally?
A: AI provides quality instruction to rural areas with teacher shortages, offers customized support for students with learning disabilities, provides real-time translation for non-native speakers, and adapts content to be culturally relevant for diverse populations. This ensures quality education reaches every student regardless of their location or circumstances.`,

    'alliteration': `Artificial advances astound academics across all areas. Adaptive algorithms analyze abundant academic achievements, adjusting approaches accordingly. Automated assistants alleviate administrative activities, allowing accomplished advisors ample attention for actual apprenticeship. 

Advanced analytics accurately assess individual aptitudes, adapting assignments appropriately. Ambitious achievers access accelerated activities, while anxious apprentices acquire additional assistance automatically. Artificial advisors answer all academic appeals almost instantly, advancing understanding appreciably.

Administrators appreciate AI's administrative assistance - automated assessment, attendance accounting, and achievement analysis. Alert algorithms anticipate academic adversity, allowing advisors to act appropriately. Adaptive applications accommodate all abilities, assuring accessible academics for all attendees.

AI abolishes academic barriers, assisting isolated areas and accommodating all abilities. Automatic translation allows all accents and ancestries equal academic access. Affordable, adaptive, and accessible - artificial intelligence assures all aspiring academics can achieve amazing accomplishments.`,

    'rhyme': `In classrooms everywhere, both far and near,
AI makes personalized learning clear.
Each student learns at their own special pace,
With customized help in their learning space.

No more one-size-fits-all education,
AI brings learning transformation.
It knows just what each student needs,
And plants personalized learning seeds.

Teachers find their workload light,
AI grades papers through the night.
More time to inspire and to guide,
With AI assistants by their side.

When students struggle with what's new,
AI knows just what to do.
Extra help appears right away,
To brighten up their learning day.

Advanced learners aren't held back,
They zoom ahead on their own track.
Challenging content keeps them engaged,
At just the right level, perfectly staged.

Around the world, both far and wide,
AI stands by every student's side.
Breaking barriers, opening doors,
Quality learning for rich and poor.

The future's bright with AI's glow,
Helping every student grow!`,

    'emoji': `🤖 AI IN EDUCATION = REVOLUTION! 🎓

📚 PERSONALIZED LEARNING FOR EVERYONE:
🎯 Each student gets customized content
⚡ Learning at perfect individual pace
🧠 AI analyzes how YOU learn best
📈 Adapts in real-time to your needs
✨ Struggling? Get instant extra help!
🚀 Advanced? Access challenging content!

👩‍🏫 TEACHERS LOVE IT TOO:
⏰ Save HOURS on grading & admin
📊 See exactly where students struggle
💡 More time for creativity & inspiration
🤝 Focus on human connection
📝 AI creates differentiated lessons automatically

🔮 SUPER SMART FEATURES:
💬 AI tutors answer questions instantly
🔍 Predicts who might struggle next
👀 Watches engagement levels
⚠️ Alerts when students need help
🎮 Makes learning interactive & fun

🌍 CHANGING THE WORLD:
🏘️ Rural schools get top instruction
♿ Special needs? Customized support!
🗣️ Any language? No problem!
🌈 Culturally relevant for everyone
💪 Quality education for ALL

🎉 THE FUTURE IS HERE AND IT'S AMAZING! 🎉`,

    'story': `Once upon a time, in classrooms around the world, teachers faced an impossible challenge. Ms. Johnson had 28 students, each learning differently, each needing something unique. Tommy struggled with reading, while Sofia was already three chapters ahead. Maria spoke English as her second language, and James needed everything explained visually.

Then, like magic, a digital helper arrived - Artificial Intelligence! This wasn't just any helper; it was like having a personal tutor for every single student. The AI watched how Tommy read, noticed he understood better with audio, and started reading aloud to him. It saw Sofia racing ahead and began offering her advanced puzzles that made her eyes light up with excitement.

For Ms. Johnson, it was like having a teaching superpower. The mountain of papers that usually took her entire weekend to grade? Done in minutes! The AI showed her exactly where her class was struggling - most students were confused about fractions. Armed with this knowledge, she crafted a brilliant hands-on lesson with pizza slices that finally made everything click.

Meanwhile, in a small village thousands of miles away, young Amara finally had access to the same quality education as students in big cities. The AI tutor spoke her language, understood her culture, and taught her in ways that made sense to her world. It didn't matter that her village had only one teacher for 100 students - the AI ensured no one was left behind.

As the story continues to unfold, AI is writing a new chapter in education. It's a chapter where every student is the hero of their own learning journey, where teachers have time to inspire and connect, and where quality education isn't a privilege but a right for all. The transformation isn't coming - it's here, making every classroom a place where magic happens through the power of personalized learning.

And they all learned happily ever after... because with AI, every student's educational story can have a happy ending!`
  };

  // Fallback function for custom transformations
  const applyCustomTransformation = (content: string, instruction: string): string => {
    const instructionLower = instruction.toLowerCase();
    
    // Handle "start each sentence with letter X" pattern
    if ((instructionLower.includes('start') || instructionLower.includes('begin')) && 
        instructionLower.includes('sentence') && 
        (instructionLower.includes('letter') || instructionLower.includes('with'))) {
      // Try to extract the letter from various patterns
      const patterns = [
        /letter\s+(\w)/i,
        /with\s+(?:the\s+)?(?:letter\s+)?(\w)\b/i,
        /with\s+"(\w)"/i,
        /\b([A-Z])\b/
      ];
      
      let letter = null;
      for (const pattern of patterns) {
        const match = instruction.match(pattern);
        if (match) {
          letter = match[1].toUpperCase();
          break;
        }
      }
      
      if (letter) {
        const sentences = content.split(/(?<=[.!?])\s+/);
        return sentences.map(sentence => {
          if (!sentence.trim()) return sentence;
          // Start each sentence with the specified letter
          const trimmed = sentence.trim();
          return `${letter}${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
        }).join(' ');
      }
    }
    
    // Handle dialogue format
    if (instructionLower.includes('dialogue') || instructionLower.includes('conversation') || instructionLower.includes('discussion')) {
      const sentences = content.split(/(?<=[.!?])\s+/).filter(s => s.trim());
      let result = '';
      
      // Check if it's specifically an upset discussion
      if (instructionLower.includes('upset') || instructionLower.includes('angry') || instructionLower.includes('argument')) {
        result = 'Person A: "I can\'t believe what\'s happening with AI in education! This is outrageous!"\n\n';
        result += 'Person B: "What? You\'re overreacting! Let me tell you what\'s really going on..."\n\n';
        
        sentences.forEach((sentence, index) => {
          if (index % 2 === 0) {
            result += `Person A: "Are you serious? ${sentence.trim()} This is exactly the problem!"\n\n`;
          } else {
            result += `Person B: "No, you don\'t understand! ${sentence.trim()} How can you not see this?"\n\n`;
          }
        });
        result += 'Person A: "This whole AI thing is getting out of hand!"\n\n';
        result += 'Person B: "You\'re being completely unreasonable about this!"';
      } else {
        // Regular dialogue
        result = 'Teacher: "Let me explain this fascinating topic about AI in education."\n\n';
        sentences.forEach((sentence, index) => {
          if (index % 2 === 0) {
            result += `Student: "${sentence.trim()}"\n\n`;
          } else {
            result += `Teacher: "${sentence.trim()}"\n\n`;
          }
        });
      }
      return result;
    }
    
    // Handle recipe/instruction format
    if (instructionLower.includes('recipe') || instructionLower.includes('step-by-step')) {
      const sentences = content.split(/(?<=[.!?])\s+/);
      return 'Recipe for Understanding AI in Education:\n\nIngredients:\n- Curiosity\n- Open mind\n- Learning tools\n\nInstructions:\n' + 
        sentences.map((sentence, index) => `${index + 1}. ${sentence.trim()}`).join('\n');
    }
    
    // Handle comic book format
    if (instructionLower.includes('comic') || instructionLower.includes('superhero')) {
      return `PANEL 1:\n[Scene: A classroom]\nNARRATOR: "${content.substring(0, 100)}..."\n\nPANEL 2:\n[AI arrives as a helpful assistant]\nAI HERO: "I'm here to help personalize learning!"\n\nPANEL 3:\n[Students working at their own pace]\nSTUDENT 1: "This is amazing!"\nSTUDENT 2: "I finally understand!"\n\nPANEL 4:\n[Teacher smiling]\nTEACHER: "AI has transformed our classroom!"`;
    }
    
    // Default transformation with the instruction noted
    return `[Format: ${instruction}]\n\n${content}\n\n[Note: This custom format would be fully applied with AI generation]`;
  };

  const getTransformedContent = useCallback((format: string): string => {
    if (format === 'custom') {
      if (customTransformedContent) {
        return customTransformedContent;
      }
      if (customFormat) {
        return applyCustomTransformation(articleContent.content, customFormat);
      }
      return articleContent.content;
    }
    return transformations[format] || articleContent.content;
  }, [customFormat, customTransformedContent]);

  const handleFormatSelect = useCallback((format: string) => {
    setSelectedFormat(format);
    // Clear custom transformation when selecting a different format
    if (format !== 'custom') {
      setCustomTransformedContent('');
    }
    const newHasTriedFormat = [...hasTriedFormat];
    newHasTriedFormat[currentScreen] = true;
    setHasTriedFormat(newHasTriedFormat);
  }, [currentScreen, hasTriedFormat]);

  const handleScreenChange = useCallback((newScreen: number) => {
    if (newScreen > currentScreen && !hasTriedFormat[currentScreen]) {
      // Don't allow moving forward without trying a format
      return;
    }
    setCurrentScreen(newScreen);
  }, [currentScreen, hasTriedFormat]);

  const handleCustomFormatChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomFormat(e.target.value);
  }, []);

  const handleCustomFormatApply = useCallback(async () => {
    if (!customFormat.trim()) return;
    
    setIsTransforming(true);
    
    try {
      // Use the correct transform-content endpoint
      const response = await fetch('/api/gemini/transform-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContent: articleContent.content,
          targetFormat: customFormat
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.transformedContent) {
          setCustomTransformedContent(data.transformedContent);
          handleFormatSelect('custom');
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transformation failed');
      }
    } catch (error) {
      console.error('AI transformation error:', error);
      // Apply fallback transformation
      const fallbackTransformed = applyCustomTransformation(articleContent.content, customFormat);
      setCustomTransformedContent(fallbackTransformed);
      handleFormatSelect('custom');
      
      // Optionally show error to user
      console.log('Using fallback transformation due to error:', error);
    } finally {
      setIsTransforming(false);
    }
  }, [customFormat, handleFormatSelect, articleContent.content]);

  const renderArticleDisplay = useMemo(() => (
    <div className="mb-8">
      {/* Paper-like container */}
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl mx-auto transform transition-all duration-300 hover:shadow-3xl"
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
        <div className="text-base leading-relaxed overflow-y-auto max-h-96" style={{ color: '#333333', whiteSpace: 'pre-wrap' }}>
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
  ), [selectedFormat, getTransformedContent]);

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
      <div className="text-xs text-gray-300 mt-1">{format.description}</div>
    </motion.button>
  );

  const CreativeFormatOption = ({ format, isSelected, onClick }: any) => (
    <button
      onClick={onClick}
      className={`p-6 rounded-lg text-left transition-all ${
        isSelected 
          ? 'bg-purple-600/40 border border-purple-400/50' 
          : 'bg-purple-600/30 hover:bg-purple-600/40 border border-purple-400/50'
      }`}
      // CRITICAL: Add inline styles to force white text
      style={{
        color: '#ffffff !important'
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{format.icon}</span>
        <div className="flex-1">
          {/* Force white text with both className and inline style */}
          <h3 className="font-semibold text-lg mb-1" 
              style={{ color: '#ffffff' }}>
            {format.title}
          </h3>
          <p className="text-sm mb-2" 
             style={{ color: '#e5e7eb' }}>
            {format.description}
          </p>
          {format.example && (
            <p className="text-xs italic" 
               style={{ color: '#d1d5db' }}>
              "{format.example}"
            </p>
          )}
        </div>
      </div>
    </button>
  );

  const CustomFormatCreator = useMemo(() => (
    <Card className="p-6 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">
        Create Your Custom Format
      </h3>
      <p className="text-gray-300 mb-4">
        Describe how you want the content to be formatted:
      </p>
      <div className="space-y-2 mb-4">
        <p className="text-sm font-semibold text-white">Try these examples:</p>
        <ul className="text-sm text-white font-medium space-y-1">
          <li>• <span className="text-yellow-300">"Start each sentence with the letter S"</span></li>
          <li>• <span className="text-yellow-300">"Convert to a dialogue between teacher and student"</span></li>
          <li>• <span className="text-yellow-300">"Make it a step-by-step recipe"</span></li>
          <li>• <span className="text-yellow-300">"Transform into a comic book script"</span></li>
        </ul>
      </div>
      <Textarea
        value={customFormat}
        onChange={handleCustomFormatChange}
        placeholder="Example: Convert to a dialogue between a teacher and student, or transform into a comic book script, or make it a recipe-style instruction..."
        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white min-h-[100px] placeholder-gray-400"
        disabled={isTransforming}
      />
      <Button 
        onClick={handleCustomFormatApply}
        disabled={!customFormat || isTransforming}
        className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700"
      >
        {isTransforming ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Transforming...
          </span>
        ) : (
          'Apply Custom Format'
        )}
      </Button>
    </Card>
  ), [customFormat, handleCustomFormatChange, handleCustomFormatApply, isTransforming]);

  return (
    <div className="min-h-screen p-6">
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {screens.map((screen, index) => (
          <button
            key={index}
            onClick={() => handleScreenChange(index)}
            disabled={index > currentScreen && !hasTriedFormat[currentScreen]}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              currentScreen === index
                ? 'bg-blue-600 text-white shadow-lg'
                : index > currentScreen && !hasTriedFormat[currentScreen]
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-white/20 text-gray-400 hover:bg-white/30 cursor-pointer'
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
            {!hasTriedFormat[0] && (
              <p className="text-yellow-400 text-sm mt-2 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Try at least one format before continuing
              </p>
            )}
          </div>
          
          {renderArticleDisplay}
          
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {STANDARD_FORMATS.map(format => (
              <FormatOption
                key={format.id}
                format={format}
                isSelected={selectedFormat === format.id}
                onClick={() => handleFormatSelect(format.id)}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => handleScreenChange(1)}
              disabled={!hasTriedFormat[0]}
              className={`px-8 py-3 rounded-lg flex items-center gap-2 ${
                hasTriedFormat[0] 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
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
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Creative & Fun Formats 🎨
              </h2>
              <p className="text-gray-300">
                Discover how AI can transform content in unexpected ways!
              </p>
              {!hasTriedFormat[1] && (
                <p className="text-yellow-400 text-sm mt-2 flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Try at least one format before continuing
                </p>
              )}
            </div>
            
            {renderArticleDisplay}
            
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 max-w-4xl mx-auto border border-purple-400/30">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Make learning memorable with creative formats:
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {CREATIVE_FORMATS.map(format => (
                  <CreativeFormatOption
                    key={format.id}
                    format={format}
                    isSelected={selectedFormat === format.id}
                    onClick={() => handleFormatSelect(format.id)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => handleScreenChange(0)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>
            <Button
              onClick={() => handleScreenChange(2)}
              disabled={!hasTriedFormat[1]}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                hasTriedFormat[1] 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
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
          
          {renderArticleDisplay}
          
          {CustomFormatCreator}
          
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
              onClick={() => handleScreenChange(1)}
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

export default FormatActivity;