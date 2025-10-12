import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, SkipForward } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Slide {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  icon?: LucideIcon;
  bgColor?: string;
  image?: string;
}

interface ActivityIntroSlidesProps {
  slides: Slide[];
  onComplete: () => void;
  activityName: string;
  allowSkip?: boolean;
}

export default function ActivityIntroSlides({
  slides,
  onComplete,
  activityName,
  allowSkip = true
}: ActivityIntroSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const skipIntro = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="min-h-[70vh] relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden">
      {/* Skip button */}
      {allowSkip && !isLastSlide && (
        <Button
          onClick={skipIntro}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          Skip Intro
          <SkipForward className="w-4 h-4 ml-1" />
        </Button>
      )}

      {/* Slide Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="slide-container flex flex-col items-center justify-center min-h-[70vh] p-8 md:p-12"
          style={{
            background: slide.bgColor || undefined
          }}
        >
          {/* Icon */}
          {IconComponent && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-full shadow-xl">
                <IconComponent className="w-16 h-16 text-blue-600 dark:text-blue-400" />
              </div>
            </motion.div>
          )}

          {/* Title */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4"
          >
            {slide.title}
          </motion.h2>

          {/* Subtitle */}
          {slide.subtitle && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center mb-8 max-w-2xl"
            >
              {slide.subtitle}
            </motion.p>
          )}

          {/* Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl w-full"
          >
            {slide.content}
          </motion.div>

          {/* Image */}
          {slide.image && (
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              src={slide.image}
              alt=""
              className="mt-6 max-w-md rounded-lg shadow-lg"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0">
        <div className="flex items-center justify-center gap-4">
          {/* Previous Button */}
          <Button
            onClick={previousSlide}
            disabled={currentSlide === 0}
            variant="outline"
            size="lg"
            className={`${
              currentSlide === 0 ? 'invisible' : ''
            } bg-white/90 dark:bg-gray-800/90 backdrop-blur`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-blue-600 dark:bg-blue-400'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next/Start Button */}
          <Button
            onClick={nextSlide}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLastSlide ? "Let's Start!" : 'Next'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}