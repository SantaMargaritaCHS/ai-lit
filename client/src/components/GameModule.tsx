import React, { useState } from 'react';
import IntroLLMsModule from './modules/IntroLLMsModule';

interface GameModuleProps {
  moduleId: string;
  onComplete: () => void;
}

export function GameModule({ moduleId, onComplete }: GameModuleProps) {
  const renderModule = () => {
    switch (moduleId) {
      case 'intro-llms':
        return <IntroLLMsModule onComplete={onComplete} />;
      default:
        return <div className="text-white">Module not found</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderModule()}
    </div>
  );
}