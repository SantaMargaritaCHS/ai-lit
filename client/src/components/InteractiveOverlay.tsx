import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, Clock, CheckCircle, Play, 
  Lightbulb, HelpCircle, ArrowRight 
} from 'lucide-react';
import { PausePoint } from '@/services/videoSegments';

interface InteractiveOverlayProps {
  interaction: PausePoint;
  onComplete: (response?: string) => void;
  onSkip?: () => void;
  allowSkip?: boolean;
}

export function InteractiveOverlay({ 
  interaction, 
  onComplete, 
  onSkip, 
  allowSkip = false 
}: InteractiveOverlayProps) {
  const [userResponse, setUserResponse] = useState('');
  const [hasResponded, setHasResponded] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Show hint after 10 seconds if no response for reflection prompts
    const isReflectionPrompt = interaction.prompt.toLowerCase().includes('think') || 
                              interaction.prompt.toLowerCase().includes('reflect') ||
                              interaction.prompt.toLowerCase().includes('consider');
    
    if (isReflectionPrompt && !hasResponded) {
      const hintTimer = setTimeout(() => setShowHint(true), 10000);
      return () => clearTimeout(hintTimer);
    }
  }, [interaction.prompt, hasResponded]);

  const handleSubmitResponse = () => {
    if (userResponse.trim()) {
      setHasResponded(true);
      setTimeout(() => {
        onComplete(userResponse);
      }, 1500); // Show confirmation briefly
    }
  };

  const handleContinueWithoutResponse = () => {
    onComplete();
  };

  const isReflectionPrompt = interaction.prompt.toLowerCase().includes('think') || 
                            interaction.prompt.toLowerCase().includes('reflect') ||
                            interaction.prompt.toLowerCase().includes('consider');
  
  const isQuickCheck = interaction.prompt.toLowerCase().includes('quick check') || 
                       interaction.prompt.toLowerCase().includes('name one') ||
                       interaction.prompt.toLowerCase().includes('identify');

  if (hasResponded) {
    return (
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <Card className="max-w-md mx-4">
            <CardContent className="flex flex-col items-center text-center p-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 10 }}
              >
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              </motion.div>
              <motion.h3 
                className="text-lg font-semibold mb-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Great thinking!
              </motion.h3>
              <motion.p 
                className="text-muted-foreground mb-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your reflection has been noted. Let's continue the journey.
              </motion.p>
              <motion.div 
                className="flex items-center gap-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                />
                <span className="text-sm">Continuing in 2 seconds...</span>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: -20, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="max-w-lg mx-4"
        >
          <Card>
        <CardHeader>
          <motion.div 
            className="flex items-center gap-2 mb-2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {Math.floor(interaction.time / 60)}:{(Math.floor(interaction.time % 60)).toString().padStart(2, '0')}
              </span>
            </div>
            {isReflectionPrompt && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge variant="secondary" className="text-xs">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Reflection
                </Badge>
              </motion.div>
            )}
            {isQuickCheck && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge variant="outline" className="text-xs">
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Quick Check
                </Badge>
              </motion.div>
            )}
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                💭
              </motion.div>
              Pause & Reflect
            </CardTitle>
            <CardDescription>
              Take a moment to engage with the content
            </CardDescription>
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <motion.div 
            className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary/30"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.p 
              className="text-lg leading-relaxed"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {interaction.prompt}
            </motion.p>
          </motion.div>

          {isReflectionPrompt ? (
            <motion.div 
              className="space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.label 
                className="text-sm font-medium block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Share your thoughts (optional but encouraged):
              </motion.label>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Textarea
                  placeholder="What comes to mind? Write down your thoughts..."
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  rows={3}
                  className="resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                  autoFocus
                />
              </motion.div>
              
              <AnimatePresence>
                {showHint && !userResponse.trim() && (
                  <motion.p
                    className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    💡 No wrong answers! Just share what comes to mind.
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div 
                className="flex gap-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button 
                    onClick={handleSubmitResponse}
                    disabled={!userResponse.trim()}
                    className="w-full"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Submit Reflection
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button 
                    variant="outline" 
                    onClick={handleContinueWithoutResponse}
                    className="w-full"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : isQuickCheck ? (
            <motion.div 
              className="space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.label 
                className="text-sm font-medium block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Your answer:
              </motion.label>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Input
                  placeholder="Type your answer here..."
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userResponse.trim() && handleSubmitResponse()}
                  className="focus:ring-2 focus:ring-primary/20 transition-all"
                  autoFocus
                />
              </motion.div>
              <motion.div 
                className="flex gap-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button 
                    onClick={handleSubmitResponse}
                    disabled={!userResponse.trim()}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Answer
                  </Button>
                </motion.div>
                {allowSkip && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline" 
                      onClick={onSkip}
                    >
                      Skip
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="flex gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button onClick={handleContinueWithoutResponse} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Continue Watching
                </Button>
              </motion.div>
              {allowSkip && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" onClick={onSkip}>
                    Skip Ahead
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          <motion.div 
            className="text-xs text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Video will resume automatically after your response
          </motion.div>
        </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default InteractiveOverlay;