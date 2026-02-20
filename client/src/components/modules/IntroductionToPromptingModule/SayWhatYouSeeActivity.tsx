import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight, CheckCircle, Clock, Sparkles, Info,
  Upload, ExternalLink, Image as ImageIcon, HelpCircle
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';

interface SayWhatYouSeeActivityProps {
  onComplete: () => void;
  isDevMode?: boolean;
}

const ACTIVITY_DURATION = 180;

const SayWhatYouSeeActivity: React.FC<SayWhatYouSeeActivityProps> = ({
  onComplete,
  isDevMode = false
}) => {
  const [currentStep, setCurrentStep] = useState<'play' | 'upload' | 'reflect'>('play');
  const [timeRemaining, setTimeRemaining] = useState(ACTIVITY_DURATION);
  const [reflectionText, setReflectionText] = useState('');
  const [hasPlayedGame, setHasPlayedGame] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isDevMode) {
      setHasPlayedGame(true);
      setCurrentStep('upload');
      setUploadedImage('/api/placeholder/800/600');
      setIsVerified(true);
      setReflectionText('Playing Say What You See showed me that the words I use to describe something to AI really matter. When I was vague, the AI had no idea what I meant. But when I described specific details like colors, positions, and shapes, it matched the artwork way better. This connects to prompting because being specific and descriptive is the key to getting good results from AI.');
      return;
    }

    if (currentStep === 'play' && hasPlayedGame) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setCurrentStep('upload');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDevMode, currentStep, hasPlayedGame]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleGameLinkClick = () => {
    setHasPlayedGame(true);
    window.open('https://artsandculture.google.com/experiment/say-what-you-see/jwG3m7wQShZngw?hl=en', '_blank');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImage('/api/placeholder/800/600');
      setTimeout(() => {
        setIsVerified(true);
        setTimeout(() => setCurrentStep('reflect'), 500);
      }, 1500);
    }
  };

  const handleSkipToUpload = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeRemaining(0);
    setCurrentStep('upload');
  };

  const handleComplete = () => {
    if (reflectionText.trim().length >= 10) {
      onComplete();
    }
  };

  const renderPlayStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p className="text-sm text-blue-900 font-medium">How to play:</p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click the button below to open the game in a new tab</li>
              <li>Look at the artwork displayed</li>
              <li>Type a description of what you see</li>
              <li>The AI will try to match your description to the artwork</li>
              <li>Play for at least 3 minutes, then come back here</li>
              <li>Take a screenshot of your best result!</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <Button
          onClick={handleGameLinkClick}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          <ExternalLink className="mr-2 h-5 w-5" />
          Open "Say What You See" Game
        </Button>

        {hasPlayedGame && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-center text-purple-800 mb-2">
              <Clock className="mr-2 h-6 w-6" />
              <p className="text-2xl font-bold">{formatTime(timeRemaining)}</p>
            </div>
            <p className="text-sm text-gray-600">
              Keep playing! Upload your screenshot when the timer ends.
            </p>
            {timeRemaining > 120 && (
              <Button onClick={handleSkipToUpload} variant="outline" size="sm" className="mt-3">
                I'm ready to upload my screenshot
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="text-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              See Example Screenshot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Example Screenshot</DialogTitle>
              <DialogDescription>
                This is what a successful game result looks like. Try to get a good match!
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Example game screenshot placeholder</p>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                The AI matched the description to the artwork!
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );

  const renderUploadStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Upload Your Screenshot</h3>
        <p className="text-gray-600">Share a screenshot of your best match from the game!</p>
      </div>

      {!uploadedImage ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Click to upload your screenshot</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Choose File
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Screenshot uploaded</p>
            </div>
            {isVerified && (
              <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                <CheckCircle className="h-6 w-6" />
              </div>
            )}
          </div>
          {isVerified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-green-50 p-4 rounded-lg"
            >
              <div className="flex items-center justify-center text-green-800">
                <CheckCircle className="mr-2 h-6 w-6" />
                <p className="text-lg font-semibold">Great work! Screenshot verified.</p>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );

  const renderReflectStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center bg-green-50 p-4 rounded-lg">
        <div className="flex items-center justify-center text-green-800">
          <CheckCircle className="mr-2 h-6 w-6" />
          <p className="text-lg font-semibold">Nice work exploring! Time to reflect.</p>
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="reflection" className="block text-lg font-medium text-gray-800">
          Quick Reflection
        </label>
        <p className="text-gray-600">
          What did you learn about describing things for AI? Think about:
        </p>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 ml-2">
          <li>What made some descriptions more successful than others?</li>
          <li>What details were most important to include?</li>
          <li>How does this connect to writing good prompts?</li>
        </ul>

        <Textarea
          id="reflection"
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="Share what you learned about describing things for AI... (minimum 10 characters)"
          className="min-h-[120px] text-gray-900"
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {reflectionText.length} characters
            {reflectionText.length < 10 && " (minimum: 10)"}
          </p>
          {reflectionText.length >= 10 && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>
      </div>

      <Button
        onClick={handleComplete}
        disabled={reflectionText.trim().length < 10}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        size="lg"
      >
        Continue to Next Activity
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  );

  return (
    <Card className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            Say What You See
          </h2>
          <p className="text-lg text-gray-600">
            Practice describing images for AI — the more precise you are, the better it understands!
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          {[
            { step: 'play', label: 'Play Game', done: hasPlayedGame && currentStep !== 'play' },
            { step: 'upload', label: 'Upload', done: isVerified && currentStep !== 'upload' },
            { step: 'reflect', label: 'Reflect', done: false },
          ].map(({ step, label, done }, idx) => (
            <React.Fragment key={step}>
              {idx > 0 && <div className="w-12 h-0.5 bg-gray-300" />}
              <div className={`flex items-center space-x-2 ${currentStep === step ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step ? 'bg-purple-600 text-white' :
                  done ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {done ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                </div>
                <span className="font-medium text-sm">{label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {currentStep === 'play' && renderPlayStep()}
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'reflect' && renderReflectStep()}

        {isDevMode && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-500 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Dev Mode: Auto-progressed through steps
            </p>
          </div>
        )}
      </motion.div>
    </Card>
  );
};

export default SayWhatYouSeeActivity;
