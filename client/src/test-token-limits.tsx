// Test file for Token Limits activity
import React from 'react';
import WhyTokenLimitsMatter from '@/components/UnderstandingLLMModule/activities/WhyTokenLimitsMatter';

export default function TestTokenLimits() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">
          Testing Token Limits Interactive Scenarios
        </h1>
        <div className="bg-white rounded-lg shadow-xl">
          <WhyTokenLimitsMatter
            onComplete={() => console.log('Activity completed!')}
          />
        </div>
      </div>
    </div>
  );
}