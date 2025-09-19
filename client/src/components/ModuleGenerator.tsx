import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

interface GeneratedContent {
  suggestedEmoji: string;
  moduleDescription: string;
  landingPage: string;
  rawContent: string;
}

export default function ModuleGenerator() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isPrePopulated, setIsPrePopulated] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    moduleName: '',
    moduleId: '',
    emoji: '',
    description: '',
    learningObjectives: ['', '', ''],
    keyTerms: [
      { term: '', definition: '' },
      { term: '', definition: '' },
      { term: '', definition: '' },
      { term: '', definition: '' }
    ]
  });

  // Parse URL parameters and pre-populate form
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = urlParams.get('moduleId');
    const moduleName = urlParams.get('moduleName');
    const description = urlParams.get('description');
    const objectives = urlParams.get('objectives');

    if (moduleId && moduleName) {
      // Parse learning objectives if provided
      let parsedObjectives = ['', '', ''];
      if (objectives) {
        try {
          const parsed = JSON.parse(decodeURIComponent(objectives));
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsedObjectives = parsed;
          }
        } catch (error) {
          console.log('Could not parse objectives:', error);
        }
      }

      // Generate a default emoji based on module name
      const getDefaultEmoji = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('ai') || lower.includes('artificial')) return '🤖';
        if (lower.includes('algorithm')) return '⚙️';
        if (lower.includes('neural') || lower.includes('network')) return '🧠';
        if (lower.includes('data') || lower.includes('training')) return '📊';
        if (lower.includes('ethics') || lower.includes('bias')) return '⚖️';
        if (lower.includes('prompt')) return '💬';
        if (lower.includes('future') || lower.includes('innovation')) return '🚀';
        if (lower.includes('privacy') || lower.includes('security')) return '🔐';
        if (lower.includes('pattern') || lower.includes('recognition')) return '🔍';
        return '🎓'; // Default education emoji
      };

      setFormData({
        moduleName: decodeURIComponent(moduleName),
        moduleId: decodeURIComponent(moduleId),
        emoji: getDefaultEmoji(moduleName),
        description: description ? decodeURIComponent(description) : '',
        learningObjectives: parsedObjectives,
        keyTerms: [
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' },
          { term: '', definition: '' }
        ]
      });

      setIsPrePopulated(true);
      toast({
        title: "Module Pre-loaded",
        description: `Form populated with data from "${decodeURIComponent(moduleName)}"`,
      });
    }
  }, [toast]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setGeneratedContent(data);
      toast({
        title: "Success",
        description: "Module content generated with AI suggestions!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard!`,
    });
  };

  const useSuggestedEmoji = () => {
    if (generatedContent?.suggestedEmoji) {
      setFormData({
        ...formData,
        emoji: generatedContent.suggestedEmoji
      });
      toast({
        title: "Emoji Updated",
        description: "Using AI-suggested emoji!",
      });
    }
  };

  const addObjective = () => {
    setFormData({
      ...formData,
      learningObjectives: [...formData.learningObjectives, '']
    });
  };

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      learningObjectives: formData.learningObjectives.filter((_, i) => i !== index)
    });
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.learningObjectives];
    newObjectives[index] = value;
    setFormData({ ...formData, learningObjectives: newObjectives });
  };

  const updateKeyTerm = (index: number, field: 'term' | 'definition', value: string) => {
    const newTerms = [...formData.keyTerms];
    newTerms[index][field] = value;
    setFormData({ ...formData, keyTerms: newTerms });
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-8">
      {/* Back button and header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Modules
          </Button>
        </Link>
        {isPrePopulated && (
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Pre-loaded from existing module
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            Module Content Generator
          </CardTitle>
          <CardDescription>
            Generate module descriptions and landing pages using AI. {isPrePopulated ? 'Form has been pre-populated with module data.' : 'Fill out the form to create new module content.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Module Name */}
          <div className="space-y-2">
            <Label htmlFor="moduleName">Module Name</Label>
            <Input
              id="moduleName"
              placeholder="e.g., Introduction to Neural Networks"
              value={formData.moduleName}
              onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
            />
          </div>

          {/* Module ID */}
          <div className="space-y-2">
            <Label htmlFor="moduleId">Module ID (URL slug)</Label>
            <Input
              id="moduleId"
              placeholder="e.g., intro-neural-networks"
              value={formData.moduleId}
              onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">
              This will be used in the URL: https://ai-literacy-sm.replit.app/activity/{formData.moduleId || 'your-module-id'}
            </p>
          </div>

          {/* Emoji */}
          <div className="space-y-2">
            <Label htmlFor="emoji">Module Emoji</Label>
            <Input
              id="emoji"
              placeholder="e.g., 🧠"
              value={formData.emoji}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              className="w-24"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Module Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what students will learn..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <Label>Learning Objectives</Label>
            {formData.learningObjectives.map((objective, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="e.g., Understand how neural networks process information"
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                />
                {formData.learningObjectives.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeObjective(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={addObjective}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Objective
            </Button>
          </div>

          {/* Key Terms */}
          <div className="space-y-2">
            <Label>Key Terms</Label>
            {formData.keyTerms.map((term, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Term (e.g., Neural Network)"
                  value={term.term}
                  onChange={(e) => updateKeyTerm(index, 'term', e.target.value)}
                />
                <Input
                  placeholder="Definition"
                  value={term.definition}
                  onChange={(e) => updateKeyTerm(index, 'definition', e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={loading || !formData.moduleName || !formData.moduleId}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Module Content'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <div className="space-y-6">
          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                AI Suggestions
              </CardTitle>
              <CardDescription>
                AI-generated recommendations for your module
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl mb-2">{generatedContent.suggestedEmoji}</div>
                  <p className="text-sm text-gray-600">Suggested Icon</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Perfect Emoji Match</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    AI suggests this emoji best represents your module content
                  </p>
                  <Button
                    size="sm"
                    onClick={useSuggestedEmoji}
                    className="flex items-center gap-2"
                  >
                    Use This Emoji
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">📄</span>
                  Module Description
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedContent.moduleDescription, "Module Description")}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
              </CardTitle>
              <CardDescription>
                HTML content for module overview and instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{generatedContent.moduleDescription}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Landing Page */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Landing Page
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedContent.landingPage, "Landing Page")}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
              </CardTitle>
              <CardDescription>
                Complete landing page HTML with embedded links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{generatedContent.landingPage}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}