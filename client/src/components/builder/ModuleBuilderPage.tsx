import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Wrench, Info, FileVideo, Blocks, Eye, Download, Sparkles, MessageSquare, Scale, FileCode } from 'lucide-react';
import VideoSegmentEditor from './VideoSegmentEditor';
import ActivityCatalog from './ActivityCatalog';
import ModuleAssembly from './ModuleAssembly';
import ModulePreview from './ModulePreview';
import QuizGenerator from './QuizGenerator';
import ReflectionGenerator from './ReflectionGenerator';
import ScenarioGenerator from './ScenarioGenerator';
import CodeExporter from './CodeExporter';
import BuilderTips from './BuilderTips';

/**
 * ModuleBuilderPage - Main container for the module builder interface
 *
 * This is the entry point for the module builder feature. It provides a visual
 * interface for creating new educational modules without writing code.
 *
 * ISOLATION GUARANTEE: This component and its children are completely isolated
 * from the existing module system. No existing module code is modified or affected.
 *
 * Phase 1 (MVP): Visual assembly, JSON export
 * Phase 2: AI content generation
 * Phase 3: TypeScript code generation
 * Phase 4: Validation and polish
 */

type Tab = 'welcome' | 'video-editor' | 'activity-catalog' | 'module-assembly' | 'preview' | 'quiz-generator' | 'reflection-generator' | 'scenario-generator' | 'code-exporter';

export default function ModuleBuilderPage() {
  const [activeTab, setActiveTab] = useState<Tab>('welcome');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <a className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </a>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">Module Builder</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded">BETA</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Phase 3.3 - Code Exporter</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          {activeTab !== 'welcome' && (
            <div className="flex gap-2 mt-4 border-t border-gray-200 pt-4">
              <button
                onClick={() => setActiveTab('video-editor')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'video-editor'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <FileVideo className="w-4 h-4" />
                Video Editor
              </button>
              <button
                onClick={() => setActiveTab('activity-catalog')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'activity-catalog'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <Blocks className="w-4 h-4" />
                Activity Catalog
              </button>
              <button
                onClick={() => setActiveTab('module-assembly')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'module-assembly'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <Wrench className="w-4 h-4" />
                Module Assembly
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={() => setActiveTab('quiz-generator')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'quiz-generator'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                AI Quiz Generator
              </button>
              <button
                onClick={() => setActiveTab('reflection-generator')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'reflection-generator'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                AI Reflection Generator
              </button>
              <button
                onClick={() => setActiveTab('scenario-generator')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'scenario-generator'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <Scale className="w-4 h-4" />
                AI Scenario Generator
              </button>
              <button
                onClick={() => setActiveTab('code-exporter')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'code-exporter'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <FileCode className="w-4 h-4" />
                Code Exporter
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'welcome' && (
          <div className="max-w-4xl mx-auto">
            {/* Welcome Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Wrench className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to the Module Builder
                  </h2>
                  <p className="text-gray-600">
                    Create new educational modules through a visual interface, AI-assisted content generation,
                    and automated code generation. No coding required.
                  </p>
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">
                      Isolated Development Environment
                    </h3>
                    <p className="text-sm text-blue-800">
                      This builder is completely separate from the existing modules. Changes made here
                      will not affect any of the 9 existing modules currently in production.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Start Workflow */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Quick Start Workflow (90% Time Reduction!)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Upload Video & Extract Transcript</p>
                      <p className="text-sm text-gray-600">Video Segment Editor → Time-coded segments → Extract transcript (YouTube/Speech-to-Text/manual)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">AI-Generate Content</p>
                      <p className="text-sm text-gray-600">Quiz Generator, Reflection Generator, Scenario Generator → AI analyzes transcript → Edit & approve</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Assemble Module</p>
                      <p className="text-sm text-gray-600">Module Assembly → Arrange activities → Add videos → Configure settings → Export JSON</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Generate Code & Deploy</p>
                      <p className="text-sm text-gray-600">Code Exporter → Generate TypeScript → Copy/Download → Install following instructions</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>Time Savings:</strong> Manual module creation takes ~60 hours. With the builder: <strong>~6 hours</strong> (mostly testing)!
                  </p>
                </div>
              </div>

              {/* Features Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">✅ Phase 1: Visual Assembly</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Video segment editor with time codes</li>
                    <li>• Activity catalog (50+ activities)</li>
                    <li>• Sequential activity arrangement</li>
                    <li>• JSON export/import (save & resume)</li>
                    <li>• Module preview simulation</li>
                  </ul>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
                    ✅ Complete & Functional
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">✅ Phase 2: AI Content Generation</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Quiz generator (transcript-aware)</li>
                    <li>• Reflection prompt creator (4 types)</li>
                    <li>• Scenario generator (3 frameworks)</li>
                    <li>• Full edit interface for all content</li>
                    <li>• Age-appropriate (14-18) validation</li>
                  </ul>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
                    ✅ Complete & Functional
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">✅ Phase 3: Code Generation</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• TypeScript/React code generator</li>
                    <li>• Production-ready 1000+ line modules</li>
                    <li>• Code preview & export (.tsx files)</li>
                    <li>• 4-step installation instructions</li>
                    <li>• All platform patterns included</li>
                  </ul>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
                    ✅ Complete & Functional
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">⏳ Phase 4: Polish & Enhance</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Accessibility validation tools</li>
                    <li>• Structure validation checker</li>
                    <li>• In-app documentation & help</li>
                    <li>• Video tutorials & templates</li>
                    <li>• Advanced integrations</li>
                  </ul>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded">
                    ⏳ Optional Enhancements
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setActiveTab('video-editor')}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Get Started
                </button>
                <Link href="/">
                  <a className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-300 transition-colors">
                    Back to Home
                  </a>
                </Link>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Development Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phase 1.1 - Foundation Setup</span>
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phase 1.2 - Video Segment Editor</span>
                  <span className="px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-600 rounded">
                    Pending
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phase 1.3 - Activity Catalog</span>
                  <span className="px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-600 rounded">
                    Pending
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Reference: BUILDER_PROGRESS.md for full implementation plan
              </p>
            </div>
          </div>
        )}

        {activeTab === 'video-editor' && (
          <div className="max-w-7xl mx-auto">
            <BuilderTips context="video-editor" />
            <VideoSegmentEditor />
          </div>
        )}

        {activeTab === 'activity-catalog' && (
          <div className="max-w-7xl mx-auto">
            <BuilderTips context="activity-catalog" />
            <ActivityCatalog />
          </div>
        )}

        {activeTab === 'module-assembly' && (
          <div className="max-w-7xl mx-auto">
            <BuilderTips context="module-assembly" />
            <ModuleAssembly />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="max-w-7xl mx-auto">
            <BuilderTips context="preview" />
            <ModulePreview
              moduleTitle="Sample Module"
              moduleDescription="This is a preview of how your module will look to students"
              activities={[]}
            />
          </div>
        )}

        {activeTab === 'quiz-generator' && (
          <div className="max-w-7xl mx-auto">
            <BuilderTips context="quiz-generator" />
            <QuizGenerator />
          </div>
        )}

        {activeTab === 'reflection-generator' && (
          <div className="max-w-7xl mx-auto">
            <BuilderTips context="reflection-generator" />
            <ReflectionGenerator />
          </div>
        )}

        {activeTab === 'scenario-generator' && (
          <div className="max-w-7xl mx-auto">
            <BuilderTips context="scenario-generator" />
            <ScenarioGenerator />
          </div>
        )}

        {activeTab === 'code-exporter' && (
          <div className="max-w-7xl mx-auto">
            <BuilderTips context="code-exporter" />
            <CodeExporter />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500">
            <p>AI Literacy Student Platform - Module Builder v0.1.0 (Phase 1.1)</p>
            <p className="mt-1">Completely isolated from existing modules - Safe to experiment</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
