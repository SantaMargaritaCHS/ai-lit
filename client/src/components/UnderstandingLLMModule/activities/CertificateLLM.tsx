// Create: /client/src/components/UnderstandingLLMModule/activities/CertificateLLM.tsx

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Award, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
  userName: string;
}

export default function CertificateLLM({ userName }: Props) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          width: 800,
          height: 600
        });
        
        const link = document.createElement('a');
        link.download = `Understanding_LLMs_Certificate_${userName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error generating certificate:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">
            Congratulations!
          </h1>
          <p className="text-xl text-white">
            You've completed the Understanding Large Language Models module
          </p>
        </div>

        {/* Certificate Design */}
        <div 
          ref={certificateRef}
          className="bg-white mx-auto p-12 rounded-lg shadow-2xl"
          style={{ width: '800px', height: '600px' }}
        >
          <div className="h-full flex flex-col justify-between">
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="w-12 h-12 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-800">Certificate of Completion</h1>
                <Award className="w-12 h-12 text-blue-600" />
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
            </div>

            {/* Main Content */}
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-6">This certifies that</p>
              <h2 className="text-4xl font-bold text-blue-800 mb-6 border-b-2 border-blue-400 pb-2 inline-block">
                {userName}
              </h2>
              <p className="text-lg text-gray-600 mb-4">has successfully completed</p>
              <h3 className="text-2xl font-semibold text-purple-700 mb-6">
                Understanding Large Language Models
              </h3>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 text-sm leading-relaxed">
                  This comprehensive module covered the fundamentals of how Large Language Models work, 
                  including tokenization, neural networks, training data, and the importance of 
                  understanding AI as sophisticated pattern matching rather than true intelligence.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end">
              <div className="text-center">
                <div className="w-32 h-0.5 bg-gray-400 mb-2"></div>
                <p className="text-sm text-gray-600">Date Completed</p>
                <p className="text-sm font-medium text-gray-800">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Award className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-0.5 bg-gray-400 mb-2"></div>
                <p className="text-sm text-gray-600">AI Education Platform</p>
                <p className="text-sm font-medium text-gray-800">Certified Program</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadCertificate}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Certificate
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Print Certificate
          </button>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">What You've Learned:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-white">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>How LLMs predict text through pattern matching</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>The massive scale of training data (trillions of tokens)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>How tokenization breaks text into processable pieces</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Neural networks as mathematical pattern detectors</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}