import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, RotateCcw, Clock, CheckCircle } from 'lucide-react';

interface ResumeProgressDialogProps {
  activityIndex: number;
  activityTitle: string;
  totalActivities: number;
  lastUpdated: string;
  onResume: () => void;
  onStartOver: () => void;
}

export default function ResumeProgressDialog({
  activityIndex,
  activityTitle,
  totalActivities,
  lastUpdated,
  onResume,
  onStartOver
}: ResumeProgressDialogProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleResume = () => {
    setIsVisible(false);
    setTimeout(onResume, 300); // Wait for exit animation
  };

  const handleStartOver = () => {
    setIsVisible(false);
    setTimeout(onStartOver, 300);
  };

  const progressPercentage = Math.round(((activityIndex + 1) / totalActivities) * 100);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <Card className="max-w-md w-full shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Welcome Back!
                </CardTitle>
                <CardDescription className="text-gray-700 dark:text-gray-300">
                  You were making progress on this module
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Progress Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Last Activity
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {activityTitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between text-sm text-blue-700 dark:text-blue-300 mb-2">
                      <span>Progress</span>
                      <span className="font-semibold">{progressPercentage}% Complete</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                      Activity {activityIndex + 1} of {totalActivities}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Last active: {lastUpdated}
                    </p>
                  </div>
                </div>

                {/* Important Note */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Note:</strong> Starting over will clear your progress. You'll need to complete all activities again.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleResume}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                  <Button
                    onClick={handleStartOver}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
