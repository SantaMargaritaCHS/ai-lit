import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, FileText, Palette, AlertCircle } from 'lucide-react';

interface FormatActivityProps {
  onComplete: () => void;
}

const FormatActivity: React.FC<FormatActivityProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [exploredStandard, setExploredStandard] = useState<string[]>([]);
  const [exploredCreative, setExploredCreative] = useState<string[]>([]);

  const MIN_STANDARD = 3;
  const MIN_CREATIVE = 3;

  const articleContent = {
    title: "Artificial Intelligence in Education: How AI Is Changing the Way You Learn",
    author: "Dr. Sarah Martinez",
    date: "March 15, 2024",
    content: `Artificial Intelligence is fundamentally transforming education in ways that were unimaginable just a decade ago. This revolutionary technology is creating personalized learning experiences that adapt to each student's unique needs, learning pace, and style. By analyzing vast amounts of educational data, AI systems can identify patterns in how individual students learn best and adjust their teaching methods accordingly.

In traditional classrooms, teachers often struggle to meet the diverse needs of 25-30 students simultaneously. AI-powered educational tools solve this challenge by providing customized content and pacing for each learner. When a student struggles with a particular concept, the AI can automatically provide additional explanations, examples, or practice problems. Conversely, when a student masters material quickly, the system can present more challenging content to keep them engaged and learning at their optimal level.

Teachers are finding that AI assistants dramatically reduce their administrative workload. Tasks that once consumed hours — such as grading assignments, tracking student progress, and creating differentiated lesson plans — can now be completed in minutes. This automation frees teachers to focus on what they do best: inspiring students, facilitating discussions, providing emotional support, and fostering creativity.`
  };

  const STANDARD_FORMATS = [
    { id: 'original', title: 'Original Article', icon: '📄', description: 'Full text format' },
    { id: 'bullets', title: 'Bullet Points', icon: '📋', description: 'Key takeaways' },
    { id: 'email', title: 'Email Format', icon: '✉️', description: 'Professional email' },
    { id: 'outline', title: 'Outline', icon: '📑', description: 'Structured overview' },
    { id: 'summary', title: 'Summary', icon: '📝', description: 'Condensed version' },
    { id: 'qa', title: 'Q&A Format', icon: '❓', description: 'Questions & answers' },
  ];

  const CREATIVE_FORMATS = [
    { id: 'rhyme', title: 'Rhyme Time', icon: '🎵', description: 'Content that rhymes' },
    { id: 'emoji', title: 'Emoji Enhanced', icon: '😊', description: 'Key points with emojis' },
    { id: 'story', title: 'Story Format', icon: '📖', description: 'An engaging narrative' },
    { id: 'alliteration', title: 'Alliteration Adventure', icon: '🅰️', description: 'Same letter starts every sentence' },
  ];

  const transformations: Record<string, string> = {
    original: articleContent.content,

    bullets: `KEY POINTS ABOUT AI IN EDUCATION:

• AI creates personalized learning adapted to each student's needs
• Systems analyze data to identify optimal learning patterns
• Customized content and pacing help students learn at their ideal speed
• Struggling students receive additional explanations automatically
• Advanced students get challenging content to maintain engagement

BENEFITS FOR TEACHERS:
• Dramatic reduction in administrative workload
• Automated grading saves hours weekly
• Teachers can focus on inspiration, discussion, and support`,

    email: `Subject: How AI Is Changing Education — What You Should Know

Hey,

I wanted to share some interesting stuff about how AI is changing education.

Here's the deal: AI can now personalize how we learn. Instead of everyone getting the same lesson at the same pace, AI tools figure out where you're struggling and give you extra help — or challenge you more if you're ahead.

For teachers, it's a game-changer too:
- Grading that used to take hours? Done in minutes
- They can see exactly where students need help
- More time for actual teaching instead of paperwork

— Dr. Sarah Martinez`,

    outline: `I. AI TRANSFORMATION IN EDUCATION
   A. Personalized Learning
      1. Adapts to individual student needs
      2. Custom content and pacing
   B. Data-driven approach

II. SOLVING CLASSROOM CHALLENGES
   A. Traditional limits (25-30 diverse students)
   B. Auto-support for struggling students
   C. Advanced content for quick learners

III. TEACHER EMPOWERMENT
   A. Administrative relief (automated grading, tracking)
   B. More time for inspiring and supporting students`,

    summary: `AI is revolutionizing education through personalization and automation. It analyzes individual learning patterns to provide customized content for each student — supporting those who struggle while challenging those who are ahead. Teachers benefit from automated grading and progress tracking, freeing them to focus on inspiring students and facilitating discussions.`,

    qa: `Q: How does AI personalize education?
A: AI analyzes how each student learns — their pace, preferred content types, and mistakes — then automatically adjusts difficulty and provides targeted help.

Q: What benefits do teachers get from AI?
A: Teachers save hours on grading and progress tracking. AI identifies class-wide struggles and generates insights — freeing teachers to focus on inspiring students.

Q: How does AI help struggling students?
A: When AI detects a struggle, it automatically provides additional explanations, breaks down concepts, and adjusts the pace.`,

    rhyme: `In classrooms everywhere, both far and near,
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
To brighten up their learning day.`,

    emoji: `🤖 AI IN EDUCATION = REVOLUTION! 🎓

📚 PERSONALIZED LEARNING:
🎯 Customized content for each student
⚡ Learning at your perfect pace
🧠 AI analyzes how YOU learn best
✨ Struggling? Get instant extra help!
🚀 Advanced? Access challenging content!

👩‍🏫 TEACHERS LOVE IT:
⏰ Save HOURS on grading & admin
📊 See exactly where students struggle
💡 More time for creativity & inspiration`,

    story: `Once upon a time, in classrooms around the world, teachers faced an impossible challenge. Ms. Johnson had 28 students, each learning differently. Tommy struggled with reading, while Sofia was already three chapters ahead.

Then AI arrived — like having a personal tutor for every single student. The AI watched how Tommy read, noticed he understood better with audio, and started reading aloud to him. It saw Sofia racing ahead and began offering her advanced challenges that made her eyes light up.

For Ms. Johnson, it was like having a teaching superpower. That mountain of papers that usually took her entire weekend to grade? Done in minutes.`,

    alliteration: `Artificial advances astound academics across all areas. Adaptive algorithms analyze abundant academic achievements, adjusting approaches accordingly. Automated assistants alleviate administrative activities, allowing accomplished advisors ample attention for actual apprenticeship.

Advanced analytics accurately assess individual aptitudes, adapting assignments appropriately. Ambitious achievers access accelerated activities, while anxious apprentices acquire additional assistance automatically.`,
  };

  const handleFormatSelect = useCallback((format: string) => {
    setSelectedFormat(format);
    if (currentScreen === 0 && !exploredStandard.includes(format)) {
      setExploredStandard(prev => [...prev, format]);
    }
    if (currentScreen === 1 && !exploredCreative.includes(format)) {
      setExploredCreative(prev => [...prev, format]);
    }
  }, [currentScreen, exploredStandard, exploredCreative]);

  const canProceedToCreative = exploredStandard.length >= MIN_STANDARD;
  const canComplete = exploredCreative.length >= MIN_CREATIVE;

  const handleScreenChange = useCallback((newScreen: number) => {
    if (newScreen > currentScreen && !canProceedToCreative) return;
    setCurrentScreen(newScreen);
    setSelectedFormat(null);
  }, [currentScreen, canProceedToCreative]);

  const displayContent = selectedFormat ? (transformations[selectedFormat] ?? articleContent.content) : articleContent.content;

  return (
    <div className="space-y-5">
      {/* Tab navigation */}
      <div className="flex justify-center gap-2">
        {[
          { id: 'standard', title: 'Standard Formats', icon: FileText },
          { id: 'creative', title: 'Creative Formats', icon: Palette },
        ].map((screen, index) => {
          const Icon = screen.icon;
          const isActive = currentScreen === index;
          const isDone = index === 0 ? canProceedToCreative : canComplete;
          return (
            <button
              key={index}
              onClick={() => handleScreenChange(index)}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 text-sm font-medium ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDone
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : index > currentScreen
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{screen.title}</span>
              <span className="md:hidden">{index + 1}</span>
              {isDone && !isActive && <CheckCircle className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </div>

      {/* Article preview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-sm font-semibold text-gray-700">{articleContent.title}</p>
          <p className="text-xs text-gray-400">By {articleContent.author} · {articleContent.date}</p>
          {selectedFormat && (
            <p className="text-xs font-semibold text-blue-600 mt-1">
              Format: {[...STANDARD_FORMATS, ...CREATIVE_FORMATS].find(f => f.id === selectedFormat)?.title ?? selectedFormat}
            </p>
          )}
        </div>
        <div className="px-5 py-4 text-sm leading-relaxed text-gray-800 overflow-y-auto max-h-56 whitespace-pre-wrap">
          {displayContent}
        </div>
      </div>

      {/* Screen 1: Standard Formats */}
      {currentScreen === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Standard Formats</p>
            <p className="text-xs text-gray-500">Tap a format to see the article instantly transformed.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {STANDARD_FORMATS.map(format => {
              const isExplored = exploredStandard.includes(format.id);
              return (
                <button
                  key={format.id}
                  onClick={() => handleFormatSelect(format.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    selectedFormat === format.id
                      ? 'bg-blue-50 border-blue-400 shadow-sm'
                      : isExplored
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-xl mb-1">{format.icon}</div>
                  <div className="font-semibold text-gray-900 text-xs">{format.title}</div>
                  <div className="text-xs text-gray-400">{format.description}</div>
                  {isExplored && selectedFormat !== format.id && <CheckCircle className="w-3 h-3 text-blue-500 mt-1" />}
                </button>
              );
            })}
          </div>

          <div className={`rounded-xl p-3 text-center border-2 ${canProceedToCreative ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-200'}`}>
            <p className={`text-sm font-bold ${canProceedToCreative ? 'text-green-700' : 'text-amber-700'}`}>
              {canProceedToCreative ? `${exploredStandard.length} formats explored ✓` : `Explore at least ${MIN_STANDARD} formats to continue (${exploredStandard.length}/${MIN_STANDARD})`}
            </p>
            <div className="flex justify-center gap-1.5 mt-2">
              {[...Array(MIN_STANDARD)].map((_, i) => (
                <div key={i} className={`h-2 w-10 rounded-full transition-all ${i < exploredStandard.length ? 'bg-green-500' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>

          <Button
            onClick={() => handleScreenChange(1)}
            disabled={!canProceedToCreative}
            className={canProceedToCreative ? 'w-full bg-blue-600 hover:bg-blue-700 text-white' : 'w-full bg-gray-100 text-gray-400 cursor-not-allowed'}
          >
            Next: Creative Formats <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      )}

      {/* Screen 2: Creative Formats */}
      {currentScreen === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Creative Formats</p>
            <p className="text-xs text-gray-500">AI can transform the same content in wild and unexpected ways.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CREATIVE_FORMATS.map(format => {
              const isExplored = exploredCreative.includes(format.id);
              return (
                <button
                  key={format.id}
                  onClick={() => handleFormatSelect(format.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    selectedFormat === format.id
                      ? 'bg-purple-50 border-purple-400 shadow-sm'
                      : isExplored
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-xl mb-1">{format.icon}</div>
                  <div className="font-semibold text-gray-900 text-xs">{format.title}</div>
                  <div className="text-xs text-gray-400">{format.description}</div>
                  {isExplored && selectedFormat !== format.id && <CheckCircle className="w-3 h-3 text-purple-500 mt-1" />}
                </button>
              );
            })}
          </div>

          <div className={`rounded-xl p-3 text-center border-2 ${canComplete ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-200'}`}>
            <p className={`text-sm font-bold ${canComplete ? 'text-green-700' : 'text-amber-700'}`}>
              {canComplete ? `${exploredCreative.length} formats explored ✓` : `Explore at least ${MIN_CREATIVE} formats to continue (${exploredCreative.length}/${MIN_CREATIVE})`}
            </p>
            <div className="flex justify-center gap-1.5 mt-2">
              {[...Array(MIN_CREATIVE)].map((_, i) => (
                <div key={i} className={`h-2 w-10 rounded-full transition-all ${i < exploredCreative.length ? 'bg-green-500' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => handleScreenChange(0)} variant="outline" className="text-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button
              onClick={onComplete}
              disabled={!canComplete}
              className={`flex-1 ${canComplete ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Next: Context <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FormatActivity;
