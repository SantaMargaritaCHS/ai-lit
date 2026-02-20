import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, CheckCircle, Star, BookOpen, Code, Megaphone, PenTool } from 'lucide-react';

interface RTFOutputBuilderProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

const RTFOutputBuilder: React.FC<RTFOutputBuilderProps> = ({ onComplete, isDevMode }) => {
  const [role, setRole] = useState('');
  const [task, setTask] = useState('');
  const [format, setFormat] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<{
    prompt: string;
    output: string;
    quality: { score: number; feedback: string[] };
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const TEMPLATE_SUGGESTIONS = [
    {
      id: 'study-guide',
      title: 'Study Guide Creator',
      icon: BookOpen,
      description: 'Get help studying for your next test',
      example: {
        role: 'biology tutor who specializes in AP-level content',
        task: 'create a study guide for cell division covering mitosis and meiosis',
        format: 'outline with key vocabulary definitions and 5 practice questions with answers'
      }
    },
    {
      id: 'essay-outliner',
      title: 'Essay Outliner',
      icon: PenTool,
      description: 'Structure a persuasive or analytical essay',
      example: {
        role: 'AP English writing coach who helps students build strong arguments',
        task: 'outline a persuasive essay arguing that school should start later in the morning',
        format: '5-paragraph outline with thesis statement, topic sentences for each body paragraph, and key evidence to include'
      }
    },
    {
      id: 'social-media',
      title: 'Social Media Expert',
      icon: Megaphone,
      description: 'Create captions for a school club or event',
      example: {
        role: 'social media content creator for a high school audience',
        task: 'write 3 Instagram captions promoting our school science fair happening next Friday',
        format: 'short captions (under 150 chars each) with relevant hashtags and a call-to-action'
      }
    },
    {
      id: 'code-tutor',
      title: 'Code Tutor',
      icon: Code,
      description: 'Learn a programming concept step by step',
      example: {
        role: 'patient Python instructor who explains things with real-world analogies',
        task: 'explain how for loops work in Python, including when and why to use them',
        format: 'step-by-step explanation with 3 code examples that get progressively harder, with comments in each'
      }
    }
  ];

  const generateFallbackOutput = (r: string, t: string, f: string): string => {
    const outputs: Record<string, string> = {
      'study-guide': `# Cell Division Study Guide

## Key Vocabulary:
- **Mitosis** — Cell division that produces 2 identical daughter cells (used for growth and repair)
- **Meiosis** — Cell division that produces 4 unique cells with half the chromosomes (used for reproduction)
- **Chromosome** — Thread-like structure of DNA that carries genetic information
- **Interphase** — The phase where the cell grows and copies its DNA before dividing
- **Cytokinesis** — The final step where the cell's cytoplasm physically splits

## Outline:
### A. Mitosis (4 phases)
1. **Prophase** — Chromosomes condense and become visible; spindle fibers form
2. **Metaphase** — Chromosomes line up in the middle of the cell
3. **Anaphase** — Sister chromatids are pulled to opposite sides
4. **Telophase** — Nuclear envelopes reform; chromosomes decondense

### B. Meiosis (Key Differences)
- Two rounds of division (Meiosis I and II)
- Produces 4 genetically unique cells
- Includes crossing over (genetic recombination)

## Practice Questions:
1. What is the main difference between mitosis and meiosis?
2. During which phase of mitosis do chromosomes align at the cell's center?
3. Why does meiosis produce genetically unique cells while mitosis doesn't?
4. What happens during interphase that makes cell division possible?
5. If a human cell has 46 chromosomes, how many will each daughter cell have after (a) mitosis and (b) meiosis?`,

      'essay-outliner': `# Persuasive Essay: Schools Should Start Later

## Thesis Statement:
High schools should delay start times to 9:00 AM because later starts improve student health, boost academic performance, and reduce safety risks.

## I. Introduction
- Hook: "Imagine an entire generation of students running on empty — that's what 7 AM start times create."
- Context: Most U.S. high schools start before 8:30 AM despite scientific evidence that teens need 8-10 hours of sleep
- Thesis (above)

## II. Body Paragraph 1: Health Benefits
- Topic sentence: Later school start times significantly improve adolescent physical and mental health.
- Evidence: CDC reports teens who sleep <8 hours are more likely to experience depression and obesity
- Evidence: The American Academy of Pediatrics recommends 8:30 AM or later
- Connection to thesis

## III. Body Paragraph 2: Academic Performance
- Topic sentence: Well-rested students perform measurably better in school.
- Evidence: Studies show 20% improvement in test scores with later starts
- Evidence: Reduced tardiness and absenteeism in districts that shifted times
- Connection to thesis

## IV. Body Paragraph 3: Safety
- Topic sentence: Drowsy teen drivers are a preventable safety risk.
- Evidence: Car accidents involving teen drivers decrease with later start times
- Counter-argument: Some say it disrupts parent work schedules (address this)
- Connection to thesis

## V. Conclusion
- Restate thesis in new words
- Call to action: Students can petition their school boards
- Closing thought: Investing in sleep is investing in our future`,

      'social-media': `📱 Instagram Captions for Science Fair:

**Caption 1:**
🔬 Our annual Science Fair is THIS Friday! Come see what happens when curiosity meets creativity. You won't want to miss it. 🧪✨
#ScienceFair #STEM #HighSchoolScience #InnovationDay

**Caption 2:**
Explosions? Robots? Discoveries that'll blow your mind? 🤯 It's all going down at the Science Fair — Friday after school. Bring your friends!
#ScienceFairFriday #StudentScientists #SchoolEvents

**Caption 3:**
From biology to engineering, our students have been working ALL semester on these projects. Come support them this Friday! 🏆💡
See you there → [Location in bio]
#ProudStudents #ScienceRocks #SchoolCommunity`,

      'code-tutor': `# Understanding For Loops in Python 🐍

## What is a For Loop?
Think of a for loop like a teacher taking attendance. The teacher goes through the class list ONE student at a time, says their name, and moves to the next. A for loop does the same thing — it goes through a collection one item at a time and does something with each one.

## Example 1: The Basics
\`\`\`python
# Print each fruit in a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:        # "fruit" is like a pointer that moves through the list
    print(f"I like {fruit}")  # This runs once for each item

# Output:
# I like apple
# I like banana
# I like cherry
\`\`\`

## Example 2: Using range() for counting
\`\`\`python
# Count from 1 to 5
for number in range(1, 6):   # range(1, 6) generates: 1, 2, 3, 4, 5
    print(f"Count: {number}")  # This runs 5 times total

# Output:
# Count: 1
# Count: 2
# Count: 3
# Count: 4
# Count: 5
\`\`\`

## Example 3: Building something useful
\`\`\`python
# Calculate the total cost of items in a shopping cart
prices = [4.99, 12.50, 3.25, 8.00, 15.75]
total = 0                      # Start with $0

for price in prices:           # Go through each price
    total = total + price      # Add it to our running total
    print(f"Added \${price:.2f} → Running total: \${total:.2f}")

print(f"\\nFinal total: \${total:.2f}")  # Print the grand total

# Output:
# Added $4.99 → Running total: $4.99
# Added $12.50 → Running total: $17.49
# ...
# Final total: $44.49
\`\`\`

## When to use for loops:
- When you need to do something with each item in a list
- When you need to repeat an action a specific number of times
- When you're building up a result (like a total) from multiple values`
    };

    for (const template of TEMPLATE_SUGGESTIONS) {
      if (r.includes(template.example.role.substring(0, 15)) ||
          t.includes(template.example.task.substring(0, 15))) {
        if (outputs[template.id]) {
          return outputs[template.id];
        }
      }
    }

    return `# Generated Output

**Your Prompt:** Act as ${r} and ${t}. Format as ${f}.

---

This is a preview of what your RTF prompt would produce. The combination of a specific Role, clear Task, and defined Format ensures the AI understands exactly what you need.

*In a live AI tool, this would generate a complete, tailored response matching your specifications.*`;
  };

  const evaluatePromptQuality = (r: string, t: string, f: string): { score: number; feedback: string[] } => {
    let score = 0;
    const feedback: string[] = [];

    if (r.split(' ').length > 2) {
      score += 2;
      feedback.push('Role is specific and detailed');
    } else if (r.length > 0) {
      score += 1;
      feedback.push('Role could be more specific — try adding expertise or style');
    }

    if (t.includes('create') || t.includes('write') || t.includes('design') || t.includes('explain') || t.includes('outline') || t.includes('summarize')) {
      score += 1;
      feedback.push('Good use of a clear action verb');
    }
    if (t.split(' ').length > 5) {
      score += 1;
      feedback.push('Task is detailed with clear scope');
    } else if (t.length > 0) {
      feedback.push('Task could use more detail — what specifically do you want?');
    }

    if (f.split(' ').length > 3) {
      score += 2;
      feedback.push('Format is well specified');
    } else if (f.length > 0) {
      score += 1;
      feedback.push('Format could be more specific — mention structure, length, or style');
    }

    return {
      score: Math.min(5, Math.round((score / 6) * 5)),
      feedback
    };
  };

  const generateOutput = async () => {
    if (!role || !task || !format) return;
    setIsGenerating(true);

    try {
      const prompt = `Act as ${role} and ${task}. Format as ${format}.`;
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, maxTokens: 800, temperature: 0.7 })
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
    } catch {
      setGeneratedOutput({
        prompt: `Act as ${role} and ${task}. Format as ${format}.`,
        output: generateFallbackOutput(role, task, format),
        quality: evaluatePromptQuality(role, task, format)
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Build Your RTF Prompt
        </h2>
        <p className="text-gray-600">
          Put everything together! Create a prompt using Role, Task, and Format — then see it in action.
        </p>
      </motion.div>

      {/* Suggestion Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-blue-600 hover:text-blue-700 underline text-sm font-medium"
        >
          {showSuggestions ? 'Hide' : 'Show'} Ideas for Inspiration
        </button>
      </div>

      {/* Template Suggestions */}
      {showSuggestions && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need ideas? Here are some student scenarios:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {TEMPLATE_SUGGESTIONS.map(template => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className="p-4 rounded-lg bg-white border border-blue-100"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-base font-semibold text-gray-900 mb-1">
                        {template.title}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><span className="text-blue-600 font-semibold">Role:</span> {template.example.role}</p>
                        <p><span className="text-green-600 font-semibold">Task:</span> {template.example.task}</p>
                        <p><span className="text-purple-600 font-semibold">Format:</span> {template.example.format}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 italic">
                        (These are examples — create your own!)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* RTF Builder */}
      <Card className="p-6">
        <div className="mb-4 text-center">
          <p className="text-gray-600 text-sm">
            Fill in each component below to build your prompt
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="inline-block bg-blue-600 px-2 py-1 rounded text-white text-xs mr-2 font-bold">R</span>
              Role
              <span className="text-xs text-gray-500 ml-2">(Who should the AI act as?)</span>
            </label>
            <Input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., patient biology tutor, creative writing coach, Python instructor..."
              className="w-full text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific! Include expertise area, teaching style, or audience level.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="inline-block bg-green-600 px-2 py-1 rounded text-white text-xs mr-2 font-bold">T</span>
              Task
              <span className="text-xs text-gray-500 ml-2">(What should the AI do?)</span>
            </label>
            <Textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g., create a study guide on cell division, outline a persuasive essay about school start times..."
              className="w-full min-h-[80px] text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use action verbs: create, explain, compare, summarize, design, outline...
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="inline-block bg-purple-600 px-2 py-1 rounded text-white text-xs mr-2 font-bold">F</span>
              Format
              <span className="text-xs text-gray-500 ml-2">(How should it be structured?)</span>
            </label>
            <Input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="e.g., outline with vocabulary, 5-paragraph structure, step-by-step with code examples..."
              className="w-full text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              Specify structure, length, sections, or special requirements.
            </p>
          </div>

          {/* Prompt Preview */}
          {(role || task || format) && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 mb-1 font-semibold">Your prompt preview:</p>
              <p className="text-gray-900 font-mono text-sm">
                {role && <span>Act as <span className="text-blue-700 font-semibold">{role}</span></span>}
                {role && task && ' and '}
                {task && <span className="text-green-700 font-semibold">{task}</span>}
                {(role || task) && format && '. '}
                {format && <span>Format as <span className="text-purple-700 font-semibold">{format}</span>.</span>}
              </p>
            </div>
          )}

          <Button
            onClick={generateOutput}
            disabled={isGenerating || !role || !task || !format}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
            size="lg"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Output...
              </span>
            ) : !role || !task || !format ? (
              'Fill in all fields to generate'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate AI Output
              </span>
            )}
          </Button>
        </div>
      </Card>

      {/* Generated Output Display */}
      {generatedOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Output */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Generated Output:
            </h3>
            <div className="prose max-w-none text-gray-800 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
              {generatedOutput.output}
            </div>
          </Card>

          {/* Prompt Evaluation */}
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
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
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-700 font-medium">
                {generatedOutput.quality.score}/5
              </span>
            </div>
            <ul className="space-y-1 text-gray-700">
              {generatedOutput.quality.feedback.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              onClick={onComplete}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              Complete Activity
              <CheckCircle className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RTFOutputBuilder;
