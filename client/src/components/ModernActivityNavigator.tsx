import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Play, Book, Brain, Video, MessageCircle, Lightbulb } from 'lucide-react';

interface NavigationSection {
  id: string;
  title: string;
  icon: React.ElementType;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
}

interface ModernActivityNavigatorProps {
  sections: NavigationSection[];
  currentSection: string;
  onNavigate: (sectionId: string) => void;
}

export function ModernActivityNavigator({ 
  sections, 
  currentSection, 
  onNavigate 
}: ModernActivityNavigatorProps) {
  const currentIndex = sections.findIndex(s => s.id === currentSection);
  const currentSectionData = sections[currentIndex];
  
  if (!currentSectionData) return null;
  
  const Icon = currentSectionData.icon;

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {currentSectionData.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Section {currentIndex + 1} of {sections.length}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper function to get section icons
export const getSectionIcon = (sectionId: string) => {
  const iconMap: Record<string, React.ElementType> = {
    'welcome': Play,
    'opening': Play,
    'quiz': Brain,
    'daily-life': Lightbulb,
    'myths': Lightbulb,
    'videos': Video,
    'reflection': MessageCircle,
    'takeaways': Book,
    'aiInDaily': Lightbulb
  };
  return iconMap[sectionId] || Play;
};