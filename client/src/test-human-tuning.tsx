// Test file for Human Tuning Approaches activity
import React from 'react';
import HumanTuningApproaches from '@/components/UnderstandingLLMModule/activities/HumanTuningApproaches';

export default function TestHumanTuning() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">
          Testing Human Tuning Approaches Activity
        </h1>
        <div className="bg-white rounded-lg shadow-xl">
          <HumanTuningApproaches
            onComplete={() => console.log('Activity completed!')}
          />
        </div>
      </div>
    </div>
  );
}