import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, Users, AlertTriangle, BookOpen } from 'lucide-react';

interface ResponsibleEthicalAIModuleProps {
  userName?: string;
}

export default function ResponsibleEthicalAIModule({ userName }: ResponsibleEthicalAIModuleProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Responsible and Ethical Use of AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding the principles and practices for using AI technology responsibly and ethically
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <BookOpen className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Coming Soon
            </CardTitle>
            <CardDescription className="text-lg">
              This comprehensive module is currently in development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-gray-600 mb-6">
              <p>
                We're working on creating an engaging learning experience that will cover:
              </p>
            </div>
            
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <Heart className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">AI Bias and Fairness</h3>
                  <p className="text-sm text-gray-600">Understanding how bias can affect AI systems and learning to identify and mitigate unfair outcomes</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Inclusive AI Development</h3>
                  <p className="text-sm text-gray-600">Best practices for creating AI systems that serve diverse communities and perspectives</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Ethical Guidelines</h3>
                  <p className="text-sm text-gray-600">Core principles for responsible AI use in personal and professional contexts</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Accountability and Transparency</h3>
                  <p className="text-sm text-gray-600">Understanding the importance of explainable AI and taking responsibility for AI decisions</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Check back soon for this important module on AI ethics and responsibility.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}