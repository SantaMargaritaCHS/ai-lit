import React, { useState } from 'react';
import { Download, Copy, CheckCircle, AlertCircle, Code2, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateCompleteModule, downloadCode, type ModuleDefinition } from '@/services/codeGenerator';

/**
 * CodeExporter - Code preview and export interface
 *
 * Phase 3.3 of Module Builder
 *
 * Features:
 * - Generate TypeScript/React code from module definition
 * - Syntax-highlighted preview
 * - Copy to clipboard
 * - Download as .tsx file
 * - Installation instructions
 * - Warnings about manual steps
 *
 * User Flow:
 * 1. User clicks "Generate Code" button
 * 2. Code is generated using codeGenerator.ts
 * 3. Preview shows generated code with syntax highlighting
 * 4. User can copy to clipboard or download
 * 5. Instructions guide manual integration steps
 */

interface CodeExporterProps {
  moduleDefinition?: ModuleDefinition;
}

export default function CodeExporter({ moduleDefinition }: CodeExporterProps) {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCode = () => {
    if (!moduleDefinition) {
      setError('No module definition provided. Please assemble a module first.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const code = generateCompleteModule(moduleDefinition);
      setGeneratedCode(code);
    } catch (err: any) {
      console.error('Code generation error:', err);
      setError(err.message || 'Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedCode) return;

    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDownload = () => {
    if (!generatedCode || !moduleDefinition) return;

    const filename = `${moduleDefinition.id}Module.tsx`;
    downloadCode(generatedCode, filename);
  };

  const getModuleName = () => {
    if (!moduleDefinition) return 'UntitledModule';
    return moduleDefinition.id
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Code Generator & Exporter</h2>
        <p className="text-sm text-gray-600 mt-1">
          Generate production-ready TypeScript/React code from your module definition
        </p>
      </div>

      {/* Module Info */}
      {moduleDefinition && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Module Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Module Title:</span>
              <span className="font-medium text-gray-900">{moduleDefinition.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Module ID:</span>
              <span className="font-mono text-gray-900">{moduleDefinition.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Activities:</span>
              <span className="font-medium text-gray-900">{moduleDefinition.activities.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Time:</span>
              <span className="font-medium text-gray-900">{moduleDefinition.estimatedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Output Filename:</span>
              <span className="font-mono text-blue-600">{getModuleName()}Module.tsx</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      {!generatedCode && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Code2 className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to Generate Code
            </h3>
            <p className="text-sm text-gray-600 max-w-md mb-6">
              Click below to transform your module definition into production-ready TypeScript/React code.
              The generated code will follow all platform patterns and best practices.
            </p>
            <Button
              onClick={handleGenerateCode}
              disabled={isGenerating || !moduleDefinition}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <FileCode className="w-4 h-4 mr-2 animate-pulse" />
                  Generating Code...
                </>
              ) : (
                <>
                  <FileCode className="w-4 h-4 mr-2" />
                  Generate TypeScript Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">Generation Error</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code Preview */}
      {generatedCode && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Generated Code</CardTitle>
                  <CardDescription className="text-xs">
                    {generatedCode.split('\n').length} lines • TypeScript/React
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download .tsx File
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-gray-100 font-mono leading-relaxed">
                  <code>{generatedCode}</code>
                </pre>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Use Copy button for quick access, or Download to save as a file
              </p>
            </CardContent>
          </Card>

          {/* Installation Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-600" />
                Installation Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-blue-900 mb-2">Step 1: Save the File</p>
                <ul className="space-y-1 text-blue-800 ml-4">
                  <li>• Download the generated code as <code className="bg-white px-1 py-0.5 rounded">{getModuleName()}Module.tsx</code></li>
                  <li>
                    • Save it to: <code className="bg-white px-1 py-0.5 rounded">client/src/components/modules/</code>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-blue-900 mb-2">Step 2: Register the Module</p>
                <ul className="space-y-1 text-blue-800 ml-4">
                  <li>• Open <code className="bg-white px-1 py-0.5 rounded">client/src/App.tsx</code></li>
                  <li>
                    • Add import:{' '}
                    <code className="bg-white px-1 py-0.5 rounded">
                      import {getModuleName()}Module from './components/modules/{getModuleName()}Module';
                    </code>
                  </li>
                  <li>
                    • Add to moduleMap:{' '}
                    <code className="bg-white px-1 py-0.5 rounded">
                      '{moduleDefinition?.id}': {getModuleName()}Module
                    </code>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-blue-900 mb-2">Step 3: Add to HomePage</p>
                <ul className="space-y-1 text-blue-800 ml-4">
                  <li>• Open <code className="bg-white px-1 py-0.5 rounded">client/src/pages/HomePage.tsx</code></li>
                  <li>• Add module card to module grid</li>
                  <li>• Include title, description, estimated time, completion status</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-blue-900 mb-2">Step 4: Test the Module</p>
                <ul className="space-y-1 text-blue-800 ml-4">
                  <li>• Run TypeScript check: <code className="bg-white px-1 py-0.5 rounded">npx tsc --noEmit</code></li>
                  <li>• Test Dev Mode (Ctrl+Alt+D) navigation</li>
                  <li>• Test Progress Persistence (refresh mid-module)</li>
                  <li>• Test all activities and certificate generation</li>
                  <li>• Verify accessibility (contrast ratios, keyboard nav)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Manual Steps Warning */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                    ⚠️ Manual Steps Required
                  </h3>
                  <ul className="text-sm text-yellow-800 space-y-1 ml-4">
                    <li>
                      • <strong>Video Components</strong>: If using video activities, ensure PremiumVideoPlayer is properly configured with Firebase Storage URLs
                    </li>
                    <li>
                      • <strong>Interactive Activities</strong>: Custom interactive components need manual implementation (placeholders generated)
                    </li>
                    <li>
                      • <strong>AI Validation</strong>: Verify GEMINI_API_KEY is configured in Replit Secrets for reflection activities
                    </li>
                    <li>
                      • <strong>Assets</strong>: Any images, videos, or external resources need manual upload to Firebase Storage
                    </li>
                    <li>
                      • <strong>Testing</strong>: Comprehensive testing required before deployment (all 9 existing modules must still work)
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Message */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-green-900 mb-1">
                    ✅ Code Generation Complete!
                  </h3>
                  <p className="text-sm text-green-800">
                    Your module code has been generated successfully. Follow the installation instructions above to integrate it into the platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Feature List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generated Code Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">TypeScript interfaces for all props</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Dev Mode integration (Ctrl+Alt+D)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Progress Persistence (resume on refresh)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">AI Validation (reflection activities)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">2-attempt escape hatch (validation)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Certificate generation on completion</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Accessibility compliance (WCAG 2.1 AA)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Self-contained module pattern</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Sequential activity flow</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Responsive design (mobile/tablet/desktop)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
