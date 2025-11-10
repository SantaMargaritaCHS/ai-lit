import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, XCircle, Plus, Trash2, Edit, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  generateQuizQuestions,
  type QuizQuestion,
  type TranscriptData,
} from '@/services/builderAIService';

/**
 * QuizGenerator - AI-powered quiz question generator from video transcripts
 *
 * Phase 2.2 of Module Builder
 *
 * Features:
 * - Transcript-based AI generation using Gemini API
 * - Configurable count, difficulty, focus topics
 * - Real-time generation progress
 * - Edit/review generated questions
 * - Export to Module Assembly
 *
 * User Flow:
 * 1. Paste transcript or load from Video Segment Editor
 * 2. Configure generation settings (count, difficulty, topics)
 * 3. Click "Generate Questions" → Gemini analyzes transcript
 * 4. Review/edit generated questions
 * 5. Export to Module Assembly or download JSON
 */

interface QuizGeneratorProps {
  initialTranscript?: TranscriptData;
}

export default function QuizGenerator({ initialTranscript }: QuizGeneratorProps) {
  // Transcript input
  const [videoTitle, setVideoTitle] = useState(initialTranscript?.videoTitle || '');
  const [videoUrl, setVideoUrl] = useState(initialTranscript?.videoUrl || '');
  const [transcriptText, setTranscriptText] = useState(initialTranscript?.fullText || '');

  // Generation settings
  const [questionCount, setQuestionCount] = useState(3);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [focusTopics, setFocusTopics] = useState('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editing state
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  const handleGenerate = async () => {
    // Validation
    if (!transcriptText.trim()) {
      setError('Please provide a video transcript before generating questions.');
      return;
    }
    if (!videoTitle.trim()) {
      setError('Please provide a video title.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const transcript: TranscriptData = {
        fullText: transcriptText,
        videoUrl,
        videoTitle,
      };

      const topics = focusTopics
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const questions = await generateQuizQuestions(transcript, {
        count: questionCount,
        difficulty,
        focusTopics: topics.length > 0 ? topics : undefined,
      });

      setGeneratedQuestions(questions);
      setSuccessMessage(`Successfully generated ${questions.length} quiz questions!`);
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      setError(err.message || 'Failed to generate quiz questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setEditingQuestion({ ...generatedQuestions[index] });
  };

  const handleSaveEdit = () => {
    if (editingQuestionIndex !== null && editingQuestion) {
      const updated = [...generatedQuestions];
      updated[editingQuestionIndex] = editingQuestion;
      setGeneratedQuestions(updated);
      setEditingQuestionIndex(null);
      setEditingQuestion(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestionIndex(null);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (index: number) => {
    const updated = generatedQuestions.filter((_, i) => i !== index);
    setGeneratedQuestions(updated);
  };

  const handleExportJSON = () => {
    const exportData = {
      videoTitle,
      videoUrl,
      generatedAt: new Date().toISOString(),
      questions: generatedQuestions,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-questions-${videoTitle.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Quiz Generator</h2>
        <p className="text-sm text-gray-600 mt-1">
          Generate multiple-choice quiz questions from video transcripts using AI
        </p>
      </div>

      {/* Transcript Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 1: Video Transcript</CardTitle>
          <CardDescription className="text-xs">
            Paste your video transcript or load from Video Segment Editor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="video-title" className="text-sm font-medium text-gray-700">
                Video Title *
              </Label>
              <Input
                id="video-title"
                type="text"
                placeholder="Introduction to AI Ethics"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="video-url" className="text-sm font-medium text-gray-700">
                Video URL (optional)
              </Label>
              <Input
                id="video-url"
                type="text"
                placeholder="https://... or Videos/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="transcript" className="text-sm font-medium text-gray-700">
              Transcript Text *
            </Label>
            <Textarea
              id="transcript"
              placeholder="Paste the full video transcript here... AI will analyze this content to generate relevant quiz questions."
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              className="mt-1 font-mono text-sm"
              rows={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Longer, more detailed transcripts produce better questions. Include at least 500 words for best results.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 2: Generation Settings</CardTitle>
          <CardDescription className="text-xs">
            Configure AI generation parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="question-count" className="text-sm font-medium text-gray-700">
                Number of Questions
              </Label>
              <Input
                id="question-count"
                type="number"
                min={1}
                max={10}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 3)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 3-5 questions</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Difficulty Level</Label>
              <div className="flex gap-1 mt-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setDifficulty('easy')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                    difficulty === 'easy'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setDifficulty('medium')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                    difficulty === 'medium'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setDifficulty('hard')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                    difficulty === 'hard'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Hard
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="focus-topics" className="text-sm font-medium text-gray-700">
                Focus Topics (optional)
              </Label>
              <Input
                id="focus-topics"
                type="text"
                placeholder="bias, privacy, ethics"
                value={focusTopics}
                onChange={(e) => setFocusTopics(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated keywords</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              <strong>AI Model:</strong> Gemini 2.0 Flash • <strong>Context:</strong> High school (ages 14-18)
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !transcriptText.trim() || !videoTitle.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Questions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">Generation Error</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {successMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-green-900 mb-1">Success!</h3>
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Questions */}
      {generatedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Step 3: Review & Edit Questions</CardTitle>
                <CardDescription className="text-xs">
                  {generatedQuestions.length} questions generated • Click any question to edit
                </CardDescription>
              </div>
              <Button
                onClick={handleExportJSON}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Export JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedQuestions.map((question, index) => (
              <Card key={index} className="border-2 border-gray-200">
                <CardContent className="pt-6">
                  {editingQuestionIndex === index && editingQuestion ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Question</Label>
                        <Textarea
                          value={editingQuestion.question}
                          onChange={(e) =>
                            setEditingQuestion({ ...editingQuestion, question: e.target.value })
                          }
                          className="mt-1 text-sm"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Answer Options</Label>
                        <div className="space-y-2 mt-1">
                          {editingQuestion.options.map((option, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-answer-${index}`}
                                checked={editingQuestion.correctAnswer === optIdx}
                                onChange={() =>
                                  setEditingQuestion({ ...editingQuestion, correctAnswer: optIdx })
                                }
                                className="w-4 h-4"
                              />
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...editingQuestion.options];
                                  newOptions[optIdx] = e.target.value;
                                  setEditingQuestion({ ...editingQuestion, options: newOptions });
                                }}
                                className="text-sm"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Select the radio button for the correct answer
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Explanation</Label>
                        <Textarea
                          value={editingQuestion.explanation}
                          onChange={(e) =>
                            setEditingQuestion({ ...editingQuestion, explanation: e.target.value })
                          }
                          className="mt-1 text-sm"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Hint</Label>
                        <Textarea
                          value={editingQuestion.hint}
                          onChange={(e) =>
                            setEditingQuestion({ ...editingQuestion, hint: e.target.value })
                          }
                          className="mt-1 text-sm"
                          rows={2}
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700 text-white">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                            Q{index + 1}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${getDifficultyColor(
                              difficulty
                            )}`}
                          >
                            {difficulty}
                          </span>
                          {question.topic && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                              {question.topic}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditQuestion(index)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                            title="Edit question"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(index)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="font-medium text-gray-900 mb-3">{question.question}</p>

                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border-2 ${
                              question.correctAnswer === optIdx
                                ? 'border-green-300 bg-green-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="font-semibold text-gray-700">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span className="text-gray-900">{option}</span>
                              {question.correctAnswer === optIdx && (
                                <CheckCircle className="w-4 h-4 text-green-600 ml-auto flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">
                            ✅ Explanation:
                          </p>
                          <p className="text-sm text-gray-600">{question.explanation}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">💡 Hint:</p>
                          <p className="text-sm text-gray-600">{question.hint}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={handleGenerate}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate More Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Next Steps</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Review and edit generated questions for accuracy and clarity</li>
                <li>• Export as JSON to save for later use</li>
                <li>
                  • Copy questions to Module Assembly (Phase 1.4) to add to your module
                </li>
                <li>
                  • Generate multiple batches and select the best questions
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
