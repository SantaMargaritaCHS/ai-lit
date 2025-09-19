import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, CheckCircle, Star, BookOpen, ClipboardList, GraduationCap, Mail } from 'lucide-react';

interface RTFOutputBuilderProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

const RTFOutputBuilder: React.FC<RTFOutputBuilderProps> = ({ onComplete, isDevMode }) => {
  const [role, setRole] = useState('');
  const [task, setTask] = useState('');
  const [format, setFormat] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const TEMPLATE_SUGGESTIONS = [
    {
      id: 'lesson-plan',
      title: '📚 Lesson Plan',
      icon: BookOpen,
      description: 'Create a complete lesson plan',
      example: {
        role: 'experienced 5th grade teacher',
        task: 'create a 45-minute lesson plan about the water cycle',
        format: 'structured lesson plan with objectives, activities, and assessment'
      }
    },
    {
      id: 'student-activity',
      title: '🎯 Student Activity',
      icon: GraduationCap,
      description: 'Design an engaging student activity',
      example: {
        role: 'creative elementary school teacher',
        task: 'create a hands-on science activity about plant growth',
        format: 'step-by-step activity guide with materials list and instructions'
      }
    },
    {
      id: 'assessment',
      title: '📝 Assessment',
      icon: ClipboardList,
      description: 'Create a quiz or assessment',
      example: {
        role: 'middle school math teacher',
        task: 'create a 10-question quiz about fractions',
        format: 'multiple choice quiz with answer key'
      }
    },
    {
      id: 'parent-comm',
      title: '✉️ Parent Communication',
      icon: Mail,
      description: 'Write a parent newsletter or email',
      example: {
        role: 'professional elementary school teacher',
        task: 'write a monthly classroom newsletter for parents',
        format: 'friendly newsletter with sections for updates, upcoming events, and how to help at home'
      }
    }
  ];

  const generateFallbackOutput = (r: string, t: string, f: string): string => {
    // Fallback outputs based on template selection
    const outputs: Record<string, string> = {
      'lesson-plan': `# Water Cycle Lesson Plan - Grade 5
## Duration: 45 minutes

### Learning Objectives:
• Students will identify the main stages of the water cycle
• Students will explain how water moves through Earth's systems
• Students will create a diagram showing the water cycle process

### Materials Needed:
- Interactive water cycle diagram
- Clear containers for demonstration
- Ice cubes, hot water
- Student worksheets
- Colored pencils

### Introduction (10 minutes):
1. Begin with a question: "Where does rain come from?"
2. Show students a glass of water and ask: "How old do you think this water is?"
3. Introduce the concept that water on Earth is constantly recycling

### Main Activity (25 minutes):
**Part 1: Demonstration (10 min)**
- Use hot water in a container to show evaporation
- Use ice to demonstrate condensation
- Connect to real-world examples (puddles, clouds, rain)

**Part 2: Student Exploration (15 min)**
- Students work in pairs to label water cycle diagrams
- Create movements to represent each stage
- Share with the class

### Assessment (5 minutes):
Quick exit ticket with 3 questions:
1. Name the stages of the water cycle
2. What causes water to evaporate?
3. Draw one example of the water cycle you see in nature

### Closing (5 minutes):
- Review key vocabulary: evaporation, condensation, precipitation, collection
- Preview tomorrow: How humans impact the water cycle
- Homework: Observe and record one example of the water cycle at home`,

      'student-activity': `# Plant Growth Hands-On Activity
## Grade Level: Elementary (3-5)

### Activity: "Growing Our Garden Scientists"

#### Materials List:
• Bean seeds (3 per student)
• Clear plastic cups
• Cotton balls or paper towels
• Water spray bottles
• Observation journals
• Rulers
• Markers

#### Step-by-Step Instructions:

**Setup (10 minutes):**
1. Give each student 3 clear plastic cups
2. Label cups: "Sunlight", "Darkness", "Half-sun"
3. Place damp cotton balls in each cup
4. Add 1 bean seed to each cup

**Daily Routine (5 minutes/day):**
1. Students spray water to keep cotton moist
2. Measure and record growth in journal
3. Draw observations
4. Note any changes in color or direction

**Variables to Test:**
- Cup 1: Place in direct sunlight
- Cup 2: Place in dark cabinet
- Cup 3: Place in partial shade

**Discussion Questions:**
• Which plant grew tallest? Why?
• What differences do you notice?
• What do plants need to grow?

**Extension Activities:**
- Graph the growth over 2 weeks
- Write a story from the seed's perspective
- Research different types of seeds`,

      'assessment': `# Fractions Quiz - Middle School Mathematics

## Instructions: Choose the best answer for each question.

**1. What is 1/2 + 1/4?**
   a) 2/6
   b) 3/4 ✓
   c) 1/6
   d) 2/4

**2. Simplify: 6/8**
   a) 3/4 ✓
   b) 2/3
   c) 1/2
   d) 5/7

**3. Which fraction is equivalent to 2/3?**
   a) 4/5
   b) 3/2
   c) 4/6 ✓
   d) 5/8

**4. Convert 3/5 to a decimal:**
   a) 0.35
   b) 0.6 ✓
   c) 0.53
   d) 0.3

**5. What is 2/3 × 3/4?**
   a) 6/12
   b) 1/2 ✓
   c) 5/7
   d) 6/7

**6. In a class of 20 students, 3/4 passed the test. How many students passed?**
   a) 12
   b) 14
   c) 15 ✓
   d) 16

**7. Which fraction is greater: 3/5 or 2/3?**
   a) 3/5
   b) 2/3 ✓
   c) They are equal
   d) Cannot determine

**8. What is 3 1/2 as an improper fraction?**
   a) 6/2
   b) 7/2 ✓
   c) 5/2
   d) 8/2

**9. Divide: 1/2 ÷ 1/4**
   a) 1/8
   b) 2 ✓
   c) 1/2
   d) 4

**10. A pizza is cut into 8 slices. If you eat 3 slices, what fraction remains?**
   a) 3/8
   b) 5/8 ✓
   c) 3/5
   d) 1/2

### Answer Key:
1. b  2. a  3. c  4. b  5. b  6. c  7. b  8. b  9. b  10. b`,

      'parent-comm': `# Monthly Classroom Newsletter - March 2024

Dear Families,

Welcome to our March newsletter! Spring is in the air, and our classroom is buzzing with exciting learning opportunities.

## 📚 What We're Learning:

**Reading & Writing:**
This month, we're diving into poetry! Students are exploring different forms including haiku, acrostic, and free verse. Each student will create their own poetry book by month's end.

**Mathematics:**
We're mastering multiplication facts and beginning our unit on fractions. Games and hands-on activities are making math fun and meaningful.

**Science:**
Our plant unit is growing! Students have planted their own beans and are observing the life cycle. Ask your child about their plant journal!

## 🎉 Upcoming Events:

• **March 15:** Poetry Café - 2:00 PM (families welcome!)
• **March 22:** Field trip to Science Museum (permission slips due March 18)
• **March 28:** Parent-Teacher Conferences (sign-up link coming soon)

## 🏠 How to Help at Home:

**Reading:** 20 minutes nightly - let your child read to you!
**Math:** Practice multiplication facts during car rides or while cooking
**Science:** Look for signs of spring on family walks

## ⭐ Classroom Stars:

Congratulations to this month's kindness award winners: Emma, Carlos, and Aisha! They showed exceptional empathy and helpfulness to classmates.

## 📝 Reminders:

• Library books due every Tuesday
• Please label all clothing and supplies
• Healthy snacks only, please (nut-free classroom)

Thank you for your continued support! Feel free to email me with any questions or concerns.

Warm regards,
Mrs. Johnson
3rd Grade Teacher`
    };

    // Check if the input matches any of our template examples
    for (const template of TEMPLATE_SUGGESTIONS) {
      if (r.includes(template.example.role.substring(0, 20)) ||
          t.includes(template.example.task.substring(0, 20))) {
        const templateId = template.id;
        if (outputs[templateId]) {
          return outputs[templateId];
        }
      }
    }

    // Generic output for custom prompts
    return `Generated Output for Your Prompt:

Role: ${r}
Task: ${t}
Format: ${f}

[AI Generated Content]
Based on your specifications, here's the customized output that matches your requirements. This demonstrates how the RTF framework helps create targeted, useful content for educational purposes.

The combination of a specific role, clear task, and defined format ensures the AI understands exactly what you need and delivers it in the most useful way possible.`;
  };

  const generateOutput = async () => {
    if (!role || !task || !format) {
      alert('Please fill in all RTF components!');
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `Act as ${role} and ${task}. Format as ${format}.`;
      
      // Try to call the AI API
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          maxTokens: 800,
          temperature: 0.7
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setGeneratedOutput({
          prompt,
          output: data.response,
          quality: evaluatePromptQuality(role, task, format)
        });
      } else {
        throw new Error('API call failed');
      }
    } catch (error) {
      console.log('Using fallback output');
      // Use fallback output
      setGeneratedOutput({
        prompt: `Act as ${role} and ${task}. Format as ${format}.`,
        output: generateFallbackOutput(role, task, format),
        quality: evaluatePromptQuality(role, task, format)
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const evaluatePromptQuality = (r: string, t: string, f: string) => {
    let score = 0;
    let feedback = [];
    
    // Check role specificity
    if (r.split(' ').length > 2) {
      score += 2;
      feedback.push('✓ Specific role defined');
    } else if (r.length > 0) {
      score += 1;
      feedback.push('→ Could be more specific about the role');
    } else {
      feedback.push('✗ Missing role specification');
    }
    
    // Check task clarity
    if (t.includes('create') || t.includes('write') || t.includes('design') || t.includes('explain')) {
      score += 1;
      feedback.push('✓ Clear action verb used');
    }
    if (t.split(' ').length > 5) {
      score += 1;
      feedback.push('✓ Detailed task description');
    } else if (t.length > 0) {
      feedback.push('→ Add more task details');
    } else {
      feedback.push('✗ Missing task description');
    }
    
    // Check format specification
    if (f.split(' ').length > 3) {
      score += 2;
      feedback.push('✓ Format well specified');
    } else if (f.length > 0) {
      score += 1;
      feedback.push('→ Could be more specific about format');
    } else {
      feedback.push('✗ Missing format specification');
    }
    
    return { 
      score: Math.min(5, (score / 7) * 5), 
      feedback 
    };
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          🚀 Build Your RTF Prompt & See It In Action!
        </h2>
        <p className="text-gray-300">
          Now it's your turn! Create a prompt and watch AI generate real output.
        </p>
      </motion.div>

      {/* Suggestion Toggle */}
      <div className="mb-6 text-center">
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-blue-400 hover:text-blue-300 underline text-sm"
        >
          {showSuggestions ? 'Hide' : 'Show'} Suggestions for Inspiration 💡
        </button>
      </div>

      {/* Template Suggestions - NO AUTO-FILL */}
      {showSuggestions && (
        <Card className="mb-8 p-6 bg-gray-800/30">
          <h3 className="text-lg font-semibold text-white mb-4">
            Need Ideas? Here are some examples:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {TEMPLATE_SUGGESTIONS.map(template => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className="p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-blue-400 mt-1" />
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-white mb-1">
                        {template.title}
                      </div>
                      <div className="text-sm text-gray-400 mb-3">
                        {template.description}
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><span className="text-blue-400">Role:</span> {template.example.role}</p>
                        <p><span className="text-green-400">Task:</span> {template.example.task}</p>
                        <p><span className="text-purple-400">Format:</span> {template.example.format}</p>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 italic">
                        (These are just examples - create your own!)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* RTF Builder - EMPTY FIELDS */}
      <Card className="p-6 bg-gray-800/50">
        <div className="mb-4 text-center">
          <p className="text-yellow-300 text-sm">
            ✍️ Fill in each component below to build your prompt
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <span className="inline-block bg-blue-600 px-2 py-1 rounded text-white mr-2">R</span>
              Role
              <span className="text-xs text-gray-500 ml-2">(Who should the AI act as?)</span>
            </label>
            <Input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., experienced biology teacher, creative writing coach, patient math tutor..."
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:bg-white/15 transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific! Include grade level, subject expertise, or teaching style.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <span className="inline-block bg-green-600 px-2 py-1 rounded text-white mr-2">T</span>
              Task
              <span className="text-xs text-gray-500 ml-2">(What should the AI do?)</span>
            </label>
            <Textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g., create a lesson plan about ecosystems, write a parent email about field trip, design a hands-on activity for teaching fractions..."
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:bg-white/15 transition-all min-h-[80px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use action verbs: create, write, design, develop, explain, generate...
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <span className="inline-block bg-purple-600 px-2 py-1 rounded text-white mr-2">F</span>
              Format
              <span className="text-xs text-gray-500 ml-2">(How should it be structured?)</span>
            </label>
            <Input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="e.g., bullet points with examples, step-by-step instructions, friendly email with 3 paragraphs..."
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:bg-white/15 transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Specify structure, length, tone, or special requirements.
            </p>
          </div>
          
          {/* Character count */}
          <div className="text-xs text-gray-500 text-right">
            Total characters: {(role + task + format).length}
          </div>

          {/* Full Prompt Preview - Only shows when fields have content */}
          {(role || task || format) && (
            <div className="mt-4 p-4 bg-blue-600/20 rounded-lg border border-blue-500/50">
              <p className="text-sm text-blue-300 mb-1">Your prompt preview:</p>
              <p className="text-white font-mono text-sm">
                {role && <span>Act as <span className="text-blue-300">{role}</span></span>}
                {role && task && ' and '}
                {task && <span className="text-green-300">{task}</span>}
                {(role || task) && format && '. '}
                {format && <span>Format as <span className="text-purple-300">{format}</span>.</span>}
              </p>
            </div>
          )}

          <Button
            onClick={generateOutput}
            disabled={isGenerating || !role || !task || !format}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Output...
              </span>
            ) : !role || !task || !format ? (
              '✍️ Fill in all fields to generate'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate AI Output
              </span>
            )}
          </Button>
        </div>
      </Card>

      {/* Helper tips */}
      {!role && !task && !format && (
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            💡 Tip: The more specific your RTF components, the better your output!
          </p>
        </div>
      )}

      {/* Generated Output Display */}
      {generatedOutput && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Output */}
          <div className="bg-white rounded-lg shadow-xl p-6" 
               style={{ color: '#000', backgroundColor: '#fff' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#000' }}>
              Generated Output:
            </h3>
            <div className="prose max-w-none" style={{ color: '#333', whiteSpace: 'pre-wrap' }}>
              {generatedOutput.output}
            </div>
          </div>

          {/* Prompt Evaluation */}
          <Card className="p-6 bg-green-500/10 border border-green-500/30">
            <h3 className="text-lg font-bold text-white mb-4">
              Prompt Quality Analysis
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${
                      star <= generatedOutput.quality.score 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-300">
                {generatedOutput.quality.score.toFixed(1)}/5.0
              </span>
            </div>
            <ul className="space-y-1 text-gray-300">
              {generatedOutput.quality.feedback.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              onClick={onComplete}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2"
            >
              Complete Activity
              <CheckCircle className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RTFOutputBuilder;