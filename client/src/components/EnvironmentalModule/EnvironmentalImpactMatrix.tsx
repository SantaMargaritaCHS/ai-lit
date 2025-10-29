import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Crown, Droplets, Zap, Cloud, Gauge, Target, ArrowRight } from 'lucide-react';

interface EnvironmentalImpactMatrixProps {
  onComplete: () => void;
}

interface ToolData {
  name: string;
  icon: React.ElementType;
  water: 'high' | 'medium' | 'low' | 'zero';
  energy: 'high' | 'medium' | 'low' | 'zero';
  carbon: 'high' | 'medium' | 'low' | 'zero';
  speed: 'high' | 'medium' | 'low' | 'variable';
  accuracy: 'high' | 'medium' | 'variable';
  isYourBrain?: boolean;
}

const AI_TOOLS: ToolData[] = [
  {
    name: 'ChatGPT (Text)',
    icon: Gauge,
    water: 'low',
    energy: 'low',
    carbon: 'low',
    speed: 'high',
    accuracy: 'high',
  },
  {
    name: 'DALL-E (Images)',
    icon: Gauge,
    water: 'medium',
    energy: 'medium',
    carbon: 'medium',
    speed: 'medium',
    accuracy: 'high',
  },
  {
    name: 'Sora (Video)',
    icon: Gauge,
    water: 'high',
    energy: 'high',
    carbon: 'high',
    speed: 'low',
    accuracy: 'variable',
  },
  {
    name: 'Google Search',
    icon: Gauge,
    water: 'low',
    energy: 'low',
    carbon: 'low',
    speed: 'high',
    accuracy: 'variable',
  },
  {
    name: 'Your Brain 🧠',
    icon: Crown,
    water: 'zero',
    energy: 'zero',
    carbon: 'zero',
    speed: 'variable',
    accuracy: 'high',
    isYourBrain: true,
  },
];

const getColorClass = (level: string, isYourBrain: boolean = false) => {
  if (isYourBrain) return 'bg-green-100 text-green-900';
  switch (level) {
    case 'high':
      return 'bg-red-100 text-red-900';
    case 'medium':
      return 'bg-yellow-100 text-yellow-900';
    case 'low':
      return 'bg-blue-100 text-blue-900';
    case 'zero':
      return 'bg-green-100 text-green-900';
    case 'variable':
      return 'bg-gray-100 text-gray-900';
    default:
      return 'bg-gray-100 text-gray-900';
  }
};

const getLabel = (level: string) => {
  switch (level) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    case 'zero':
      return '0️⃣ Zero!';
    case 'variable':
      return 'Varies';
    default:
      return level;
  }
};

export default function EnvironmentalImpactMatrix({ onComplete }: EnvironmentalImpactMatrixProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          AI Tools Environmental Impact Comparison
        </CardTitle>
        <p className="text-gray-700 mt-2">
          Compare the environmental cost and performance of different AI tools
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left font-semibold text-gray-900 border border-gray-300">
                  Tool
                </th>
                <th className="p-3 text-center font-semibold text-gray-900 border border-gray-300">
                  <div className="flex flex-col items-center gap-1">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <span>Water</span>
                  </div>
                </th>
                <th className="p-3 text-center font-semibold text-gray-900 border border-gray-300">
                  <div className="flex flex-col items-center gap-1">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span>Energy</span>
                  </div>
                </th>
                <th className="p-3 text-center font-semibold text-gray-900 border border-gray-300">
                  <div className="flex flex-col items-center gap-1">
                    <Cloud className="w-5 h-5 text-green-600" />
                    <span>Carbon</span>
                  </div>
                </th>
                <th className="p-3 text-center font-semibold text-gray-900 border border-gray-300">
                  <div className="flex flex-col items-center gap-1">
                    <Gauge className="w-5 h-5 text-purple-600" />
                    <span>Speed</span>
                  </div>
                </th>
                <th className="p-3 text-center font-semibold text-gray-900 border border-gray-300">
                  <div className="flex flex-col items-center gap-1">
                    <Target className="w-5 h-5 text-indigo-600" />
                    <span>Accuracy</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {AI_TOOLS.map((tool, index) => (
                <motion.tr
                  key={tool.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${
                    tool.isYourBrain
                      ? 'bg-green-50 border-2 border-green-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="p-3 border border-gray-300">
                    <div className="flex items-center gap-2">
                      {tool.isYourBrain && <Crown className="w-5 h-5 text-yellow-500" />}
                      <span className="font-semibold text-gray-900">{tool.name}</span>
                    </div>
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getColorClass(
                        tool.water,
                        tool.isYourBrain
                      )}`}
                    >
                      {getLabel(tool.water)}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getColorClass(
                        tool.energy,
                        tool.isYourBrain
                      )}`}
                    >
                      {getLabel(tool.energy)}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getColorClass(
                        tool.carbon,
                        tool.isYourBrain
                      )}`}
                    >
                      {getLabel(tool.carbon)}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getColorClass(
                        tool.speed
                      )}`}
                    >
                      {getLabel(tool.speed)}
                    </span>
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getColorClass(
                        tool.accuracy
                      )}`}
                    >
                      {getLabel(tool.accuracy)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {AI_TOOLS.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border-2 rounded-lg p-4 ${
                tool.isYourBrain
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {tool.isYourBrain && <Crown className="w-5 h-5 text-yellow-500" />}
                <h3 className="font-semibold text-gray-900">{tool.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Water:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${getColorClass(
                      tool.water,
                      tool.isYourBrain
                    )}`}
                  >
                    {getLabel(tool.water)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Energy:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${getColorClass(
                      tool.energy,
                      tool.isYourBrain
                    )}`}
                  >
                    {getLabel(tool.energy)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Carbon:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${getColorClass(
                      tool.carbon,
                      tool.isYourBrain
                    )}`}
                  >
                    {getLabel(tool.carbon)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Speed:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${getColorClass(
                      tool.speed
                    )}`}
                  >
                    {getLabel(tool.speed)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Accuracy:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${getColorClass(
                      tool.accuracy
                    )}`}
                  >
                    {getLabel(tool.accuracy)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Insights */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3 text-lg">Key Takeaways:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Video generation</strong> uses significantly more resources than text or images
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Your brain</strong> has zero environmental cost and high accuracy - use it first!
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Text-based AI</strong> (like ChatGPT) is the most resource-efficient when you need AI help
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                <strong>Traditional search</strong> (Google) uses less resources than generative AI
              </span>
            </li>
          </ul>
        </div>

        {/* Your Brain Highlight */}
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Crown className="w-8 h-8 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Your Brain: The Ultimate Sustainable Computer
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Notice that your brain has <strong>zero environmental cost</strong> - no water, no electricity,
                no carbon emissions. It's also incredibly accurate and creative. Before reaching for an AI tool,
                ask yourself: "Could I solve this with my own thinking?" Sometimes the most sustainable choice
                is also the most empowering one.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onComplete}
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Continue Learning
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
