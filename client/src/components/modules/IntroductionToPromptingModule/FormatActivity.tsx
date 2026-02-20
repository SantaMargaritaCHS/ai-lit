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
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [customFormat, setCustomFormat] = useState('');
  const [customTransformedContent, setCustomTransformedContent] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  const [hasTriedFormat, setHasTriedFormat] = useState<boolean[]>([false, false, false]);

  const screens = [
    { id: 'standard', title: 'Standard Formats', icon: FileText },
    { id: 'creative', title: 'Creative Formats', icon: Palette },
    { id: 'custom', title: 'Your Own Format', icon: Wand2 }
  ];

  const articleContent = {
    title: "Artificial Intelligence in Education: How AI Is Changing the Way You Learn",
    author: "Dr. Sarah Martinez",
    date: "March 15, 2024",
    content: `Artificial Intelligence is fundamentally transforming education in ways that were unimaginable just a decade ago. This revolutionary technology is creating personalized learning experiences that adapt to each student's unique needs, learning pace, and style. By analyzing vast amounts of educational data, AI systems can identify patterns in how individual students learn best and adjust their teaching methods accordingly.

In traditional classrooms, teachers often struggle to meet the diverse needs of 25-30 students simultaneously. AI-powered educational tools solve this challenge by providing customized content and pacing for each learner. When a student struggles with a particular concept, the AI can automatically provide additional explanations, examples, or practice problems. Conversely, when a student masters material quickly, the system can present more challenging content to keep them engaged and learning at their optimal level.

Teachers are finding that AI assistants dramatically reduce their administrative workload. Tasks that once consumed hours — such as grading assignments, tracking student progress, and creating differentiated lesson plans — can now be completed in minutes. This automation frees teachers to focus on what they do best: inspiring students, facilitating discussions, providing emotional support, and fostering creativity.

The technology extends beyond simple automation. Natural language processing enables AI tutors to understand and respond to student questions in real-time, providing instant feedback that would be impossible for a single teacher to deliver to every student. Machine learning algorithms analyze performance data to predict which students might struggle with upcoming topics, allowing for proactive intervention.

As these technologies continue to evolve, they promise to make quality education more accessible to students worldwide. Rural communities with teacher shortages can access AI-powered instruction. Students with learning disabilities receive customized support tailored to their specific needs. Language barriers dissolve as AI provides real-time translation and culturally relevant examples.`
  };

  const STANDARD_FORMATS = [
    { id: 'original', title: 'Original Article', icon: '📄', description: 'Full text format' },
    { id: 'bullets', title: 'Bullet Points', icon: '📋', description: 'Key takeaways' },
    { id: 'email', title: 'Email Format', icon: '✉️', description: 'Professional email' },
    { id: 'outline', title: 'Outline', icon: '📑', description: 'Structured overview' },
    { id: 'summary', title: 'Summary', icon: '📝', description: 'Condensed version' },
    { id: 'qa', title: 'Q&A Format', icon: '❓', description: 'Questions and answers' }
  ];

  const CREATIVE_FORMATS = [
    { id: 'rhyme', title: 'Rhyme Time', icon: '🎵', description: 'Content that rhymes for memorability', example: 'AI helps us learn each day, In a personalized way...' },
    { id: 'emoji', title: 'Emoji Enhanced', icon: '😊', description: 'Key points with relevant emojis', example: 'AI in education 🎓 personalizes learning 📚...' },
    { id: 'story', title: 'Story Format', icon: '📖', description: 'Content as an engaging narrative', example: 'Once upon a time in a classroom...' },
    { id: 'alliteration', title: 'Alliteration Adventure', icon: '🅰️', description: 'Every sentence starts with the same letter', example: 'Artificial advances amaze academics...' },
  ];

  const transformations: Record<string, string> = {
    'original': articleContent.content,
    'bullets': `KEY POINTS ABOUT AI IN EDUCATION:

• AI creates personalized learning adapted to each student's needs
• Systems analyze data to identify optimal learning patterns
• Customized content and pacing help students learn at their ideal speed
• Struggling students receive additional explanations automatically
• Advanced students get challenging content to maintain engagement

BENEFITS FOR TEACHERS:
• Dramatic reduction in administrative workload
• Automated grading saves hours weekly
• AI tracks progress and creates differentiated plans
• Teachers can focus on inspiration, discussion, and support

ADVANCED CAPABILITIES:
• Natural language processing enables real-time Q&A with AI tutors
• Machine learning predicts which students might struggle with upcoming topics
• Instant feedback available for every student simultaneously

GLOBAL IMPACT:
• Rural communities gain access to quality AI-powered instruction
• Students with learning disabilities receive customized support
• Real-time translation breaks down language barriers`,

    'email': `Subject: How AI Is Changing Education — What You Should Know

Hey there,

I wanted to share some really interesting stuff about how AI is changing education. It's pretty relevant to all of us as students.

Here's the deal: AI can now personalize how we learn. Instead of everyone getting the same lesson at the same pace, AI tools can figure out where you're struggling and give you extra help, or challenge you more if you're ahead.

For teachers, it's a game-changer too:
- Grading that used to take hours? Done in minutes
- They can see exactly where the class needs more help
- More time for actual teaching instead of paperwork

The coolest part? AI tutors can answer questions instantly, predict who might need extra support, and even break down language barriers with real-time translation.

It's not perfect, but it's making education way more accessible worldwide.

— Dr. Sarah Martinez
Educational Technology Specialist`,

    'outline': `I. AI TRANSFORMATION IN EDUCATION
   A. Personalized Learning
      1. Adapts to individual student needs
      2. Custom content and pacing
      3. Data-driven approach

II. SOLVING CLASSROOM CHALLENGES
   A. Traditional Limits (25-30 diverse students, one pace)
   B. AI Solutions
      1. Auto-support for struggling students
      2. Advanced content for quick learners
      3. Optimal challenge for engagement

III. TEACHER EMPOWERMENT
   A. Administrative Relief (automated grading, tracking)
   B. More Time for Human Elements
      1. Inspiration and creativity
      2. Emotional support
      3. Discussion facilitation

IV. ADVANCED TECH CAPABILITIES
   A. Real-time Q&A with AI tutors
   B. Predictive analytics for early intervention
   C. Instant feedback for every student

V. GLOBAL IMPACT
   A. Rural community access
   B. Learning disability support
   C. Language barrier solutions`,

    'summary': `AI is revolutionizing education through personalization and automation. The technology analyzes individual learning patterns to provide customized content and pacing for each student, ensuring optimal engagement whether they're struggling or advanced. Teachers benefit from automated grading, progress tracking, and lesson planning — freeing them to focus on inspiring students and facilitating discussions. Advanced capabilities include instant AI tutors, predictive analytics for early intervention, and real-time feedback. Most importantly, AI is making quality education accessible globally — reaching rural communities, supporting students with disabilities, and breaking language barriers.`,

    'qa': `Q: How does AI personalize education?
A: AI analyzes how each student learns — their pace, preferred content types, and common mistakes — then automatically adjusts lesson difficulty and provides targeted help.

Q: What benefits do teachers get from AI?
A: Teachers save hours on grading and progress tracking. AI identifies class-wide struggles, generates lesson plans, and provides real-time insights — freeing teachers to focus on inspiring students.

Q: Can AI really answer student questions?
A: Yes! Through natural language processing, AI tutors understand questions in your own words and provide relevant, immediate responses.

Q: How does AI help struggling students?
A: When AI detects a struggle, it automatically provides additional explanations, breaks down concepts, offers more practice, and adjusts the pace.

Q: How is AI making education more accessible?
A: AI provides quality instruction to rural areas, customized support for learning disabilities, real-time translation for non-native speakers, and culturally relevant examples.`,

    'rhyme': `In classrooms everywhere, both far and near,
AI makes personalized learning clear.
Each student learns at their own pace,
With customized help in their learning space.

Teachers find their workload light,
AI grades papers through the night.
More time to inspire and to guide,
With AI assistants by their side.

When students struggle with what's new,
AI knows exactly what to do.
Extra help appears right away,
To brighten up their learning day.

Around the world, both far and wide,
AI stands by every student's side.
Breaking barriers, opening doors,
Quality learning for rich and poor.`,

    'emoji': `🤖 AI IN EDUCATION = REVOLUTION! 🎓

📚 PERSONALIZED LEARNING:
🎯 Customized content for each student
⚡ Learning at your perfect pace
🧠 AI analyzes how YOU learn best
✨ Struggling? Get instant extra help!
🚀 Advanced? Access challenging content!

👩‍🏫 TEACHERS LOVE IT:
⏰ Save HOURS on grading & admin
📊 See exactly where students struggle
💡 More time for creativity & inspiration
📝 AI creates lesson plans automatically

🌍 CHANGING THE WORLD:
🏘️ Rural schools get quality instruction
♿ Customized support for all abilities
🗣️ Any language? No problem!
💪 Quality education for ALL`,

    'story': `Once upon a time, in classrooms around the world, teachers faced an impossible challenge. Ms. Johnson had 28 students, each learning differently. Tommy struggled with reading, while Sofia was already three chapters ahead.

Then AI arrived — like having a personal tutor for every single student. The AI watched how Tommy read, noticed he understood better with audio, and started reading aloud to him. It saw Sofia racing ahead and began offering her advanced puzzles that made her eyes light up.

For Ms. Johnson, it was like having a teaching superpower. That mountain of papers that usually took her entire weekend to grade? Done in minutes! She finally had time to craft hands-on lessons that made everything click.

Meanwhile, in a small village thousands of miles away, young Amara finally had access to the same quality education as students in big cities. The AI tutor spoke her language and taught in ways that made sense to her world.

The story continues to unfold — AI is writing a new chapter where every student is the hero of their own learning journey.`,

    'alliteration': `Artificial advances astound academics across all areas. Adaptive algorithms analyze abundant academic achievements, adjusting approaches accordingly. Automated assistants alleviate administrative activities, allowing accomplished advisors ample attention for actual apprenticeship.

Advanced analytics accurately assess individual aptitudes, adapting assignments appropriately. Ambitious achievers access accelerated activities, while anxious apprentices acquire additional assistance automatically.

AI abolishes academic barriers, assisting isolated areas and accommodating all abilities. Automatic translation allows all accents and ancestries equal academic access.`
  };

  const applyCustomTransformation = (content: string, instruction: string): string => {
    const instructionLower = instruction.toLowerCase();
    if (instructionLower.includes('dialogue') || instructionLower.includes('conversation')) {
      const sentences = content.split(/(?<=[.!?])\s+/).filter(s => s.trim());
      let result = 'Student: "So how is AI changing education?"\n\n';
      sentences.forEach((sentence, index) => {
        if (index % 2 === 0) {
          result += `Teacher: "${sentence.trim()}"\n\n`;
        } else {
          result += `Student: "Interesting! ${sentence.trim()}"\n\n`;
        }
      });
      return result;
    }
    if (instructionLower.includes('recipe') || instructionLower.includes('step-by-step')) {
      const sentences = content.split(/(?<=[.!?])\s+/);
      return 'Recipe for Understanding AI in Education:\n\nIngredients:\n- Curiosity\n- Open mind\n- Learning tools\n\nInstructions:\n' +
        sentences.map((sentence, index) => `${index + 1}. ${sentence.trim()}`).join('\n');
    }
    return `[Format: ${instruction}]\n\n${content}\n\n[Note: In a live AI tool, this would be fully transformed according to your instructions.]`;
  };

  const getTransformedContent = useCallback((format: string): string => {
    if (format === 'custom') {
      if (customTransformedContent) return customTransformedContent;
      if (customFormat) return applyCustomTransformation(articleContent.content, customFormat);
      return articleContent.content;
    }
    return transformations[format] || articleContent.content;
  }, [customFormat, customTransformedContent]);

  const handleFormatSelect = useCallback((format: string) => {
    setSelectedFormat(format);
    if (format !== 'custom') setCustomTransformedContent('');
    const newHasTriedFormat = [...hasTriedFormat];
    newHasTriedFormat[currentScreen] = true;
    setHasTriedFormat(newHasTriedFormat);
  }, [currentScreen, hasTriedFormat]);

  const handleScreenChange = useCallback((newScreen: number) => {
    if (newScreen > currentScreen && !hasTriedFormat[currentScreen]) return;
    setCurrentScreen(newScreen);
  }, [currentScreen, hasTriedFormat]);

  const handleCustomFormatApply = useCallback(async () => {
    if (!customFormat.trim()) return;
    setIsTransforming(true);
    try {
      const response = await fetch('/api/gemini/transform-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalContent: articleContent.content, targetFormat: customFormat })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.transformedContent) {
          setCustomTransformedContent(data.transformedContent);
          handleFormatSelect('custom');
        } else { throw new Error('Invalid response'); }
      } else { throw new Error('Transform failed'); }
    } catch {
      const fallback = applyCustomTransformation(articleContent.content, customFormat);
      setCustomTransformedContent(fallback);
      handleFormatSelect('custom');
    } finally {
      setIsTransforming(false);
    }
  }, [customFormat, handleFormatSelect]);

  const renderArticleDisplay = useMemo(() => (
    <div className="mb-6">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{articleContent.title}</h2>
        <div className="text-sm text-gray-500 mb-4 pb-3 border-b border-gray-200">
          By <span className="font-semibold">{articleContent.author}</span> | {articleContent.date}
        </div>
        <div className="text-sm leading-relaxed text-gray-800 overflow-y-auto max-h-72 whitespace-pre-wrap">
          {selectedFormat ? getTransformedContent(selectedFormat) : articleContent.content}
        </div>
      </div>
      {selectedFormat && (
        <p className="text-center text-sm text-gray-500 mt-2">
          Format: <span className="font-semibold text-gray-700">{selectedFormat}</span>
        </p>
      )}
    </div>
  ), [selectedFormat, getTransformedContent]);

  return (
    <div className="space-y-6">
      {/* Screen navigation tabs */}
      <div className="flex justify-center gap-2">
        {screens.map((screen, index) => (
          <button
            key={index}
            onClick={() => handleScreenChange(index)}
            disabled={index > currentScreen && !hasTriedFormat[currentScreen]}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 text-sm ${
              currentScreen === index
                ? 'bg-blue-600 text-white shadow-md'
                : index > currentScreen && !hasTriedFormat[currentScreen]
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer'
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Standard Formats</h3>
            <p className="text-gray-600 text-sm">Click any format to see the article transformed</p>
            {!hasTriedFormat[0] && (
              <p className="text-yellow-600 text-xs mt-1 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" /> Try at least one format before continuing
              </p>
            )}
          </div>
          {renderArticleDisplay}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {STANDARD_FORMATS.map(format => (
              <button
                key={format.id}
                onClick={() => handleFormatSelect(format.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedFormat === format.id
                    ? 'bg-blue-50 border-blue-500 shadow-md'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-xl mb-1">{format.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{format.title}</div>
                <div className="text-xs text-gray-500">{format.description}</div>
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => handleScreenChange(1)}
              disabled={!hasTriedFormat[0]}
              className={`${hasTriedFormat[0] ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Next: Creative Formats <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Screen 2: Creative Formats */}
      {currentScreen === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Creative Formats</h3>
            <p className="text-gray-600 text-sm">See how AI can transform content in unexpected ways!</p>
            {!hasTriedFormat[1] && (
              <p className="text-yellow-600 text-xs mt-1 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" /> Try at least one format before continuing
              </p>
            )}
          </div>
          {renderArticleDisplay}
          <div className="grid md:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {CREATIVE_FORMATS.map(format => (
              <button
                key={format.id}
                onClick={() => handleFormatSelect(format.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedFormat === format.id
                    ? 'bg-purple-50 border-purple-500 shadow-md'
                    : 'bg-white border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{format.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{format.title}</h4>
                    <p className="text-xs text-gray-600 mb-1">{format.description}</p>
                    {format.example && (
                      <p className="text-xs text-gray-400 italic">"{format.example}"</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-4">
            <Button onClick={() => handleScreenChange(0)} variant="outline" className="text-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button
              onClick={() => handleScreenChange(2)}
              disabled={!hasTriedFormat[1]}
              className={`${hasTriedFormat[1] ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Next: Custom Format <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Screen 3: Custom Format */}
      {currentScreen === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Create Your Own Format</h3>
            <p className="text-gray-600 text-sm">Tell AI exactly how you want the content formatted</p>
          </div>
          {renderArticleDisplay}

          <Card className="p-6 bg-indigo-50 border-indigo-200 max-w-4xl mx-auto">
            <h4 className="text-lg font-bold text-gray-900 mb-3">Describe your format:</h4>
            <div className="space-y-2 mb-3">
              <p className="text-sm text-gray-700">Try these examples:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "Convert to a dialogue between a teacher and student"</li>
                <li>• "Make it a step-by-step recipe"</li>
                <li>• "Write as a social media thread"</li>
              </ul>
            </div>
            <Textarea
              value={customFormat}
              onChange={(e) => setCustomFormat(e.target.value)}
              placeholder="Describe how you want the content formatted..."
              className="w-full min-h-[80px] text-gray-900"
              disabled={isTransforming}
            />
            <Button
              onClick={handleCustomFormatApply}
              disabled={!customFormat || isTransforming}
              className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isTransforming ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Transforming...</span>
              ) : (
                'Apply Custom Format'
              )}
            </Button>
          </Card>

          {/* Format Power Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 max-w-4xl mx-auto">
            <h4 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" /> Format Power Tips
            </h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Different formats serve different purposes — choose wisely!</li>
              <li>• Bullet points are great for quick scanning and studying</li>
              <li>• Creative formats like poems make content more memorable</li>
              <li>• Custom formats let you match your exact needs</li>
            </ul>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <Button onClick={() => handleScreenChange(1)} variant="outline" className="text-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700 text-white">
              Continue to RTF Builder <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FormatActivity;
