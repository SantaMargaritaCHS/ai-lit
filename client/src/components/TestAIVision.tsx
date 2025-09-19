import React, { useState } from 'react';
import { Camera, Loader2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const TestAIVision = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Test with a known public image
  const testWithSampleImage = () => {
    setImageUrl('https://via.placeholder.com/512x512/FF6B6B/ffffff?text=Test+Image');
    setTimeout(() => testVision(), 100);
  };

  const testVision = async () => {
    if (!imageUrl) {
      setError('Please enter an image URL');
      return;
    }

    setTesting(true);
    setError(null);
    setResult(null);

    try {
      // First test if we can reach the endpoint
      console.log('🧪 Testing AI Vision with URL:', imageUrl);
      
      const response = await fetch('/api/ai-literacy/test-visual-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (response.ok && data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Vision test failed');
      }
    } catch (err) {
      console.error('❌ Test failed:', err);
      setError('Failed to test vision: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setTesting(false);
    }
  };

  // Also test the advanced scoring directly
  const testAdvancedScoring = async () => {
    setTesting(true);
    setError(null);
    setResult(null);

    try {
      console.log('🎯 Testing advanced scoring endpoint...');
      
      const response = await fetch('/api/ai-literacy/advanced-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPrompt: 'A red apple on a white table',
          userPrompt: 'Red fruit on table',
          originalImageUrl: 'https://via.placeholder.com/512x512/FF0000/ffffff?text=Apple',
          userImageUrl: 'https://via.placeholder.com/512x512/FF0000/ffffff?text=Apple',
          keywords: ['apple', 'red', 'table'],
          tomSmithBonus: false
        })
      });

      console.log('📡 Advanced scoring response status:', response.status);
      const data = await response.json();
      console.log('📊 Advanced scoring data:', data);
      
      if (response.ok) {
        setResult({
          success: true,
          type: 'advancedScoring',
          scoreBreakdown: data.scoreBreakdown,
          hasVisualAnalysis: !!data.scoreBreakdown?.visualAnalysis
        });
      } else {
        setError('Advanced scoring failed');
      }
    } catch (err) {
      console.error('❌ Advanced scoring test failed:', err);
      setError('Failed to test advanced scoring: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Camera className="h-8 w-8 mr-3" />
          AI Vision Test Panel
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Image URL:
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={testVision}
              disabled={testing || !imageUrl}
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Test Vision
                </>
              )}
            </Button>
            
            <Button
              onClick={testWithSampleImage}
              variant="outline"
              disabled={testing}
            >
              Use Sample Image
            </Button>
            
            <Button
              onClick={testAdvancedScoring}
              variant="outline"
              disabled={testing}
            >
              Test Scoring Endpoint
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-4 border-red-500 bg-red-50">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700">Test Failed</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Success Result */}
      {result && result.success && (
        <Card className="p-4 border-green-500 bg-green-50">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-700">✅ Test Successful!</p>
              
              {result.type === 'advancedScoring' ? (
                <div className="mt-3 space-y-2">
                  <p className="text-sm">
                    <strong>Has Visual Analysis:</strong> {result.hasVisualAnalysis ? '✅ YES' : '❌ NO'}
                  </p>
                  {result.scoreBreakdown && (
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm font-semibold mb-2">Score Breakdown:</p>
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(result.scoreBreakdown, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-sm">
                    Image analyzed: {(result.imageAnalysis?.imageSize / 1024).toFixed(1)}KB
                  </p>
                  <div className="mt-2 bg-white p-3 rounded border">
                    <p className="font-semibold text-sm mb-1">AI's Description:</p>
                    <p className="text-sm whitespace-pre-wrap">
                      {result.imageAnalysis?.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
      
      {/* Instructions */}
      <Card className="p-4 bg-blue-50">
        <h3 className="font-semibold mb-2">🔍 How to Test:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Use Sample Image" to test with a placeholder image</li>
          <li>Or enter any public image URL and click "Test Vision"</li>
          <li>Click "Test Scoring Endpoint" to test the full scoring system</li>
          <li>Check the browser console (F12) for detailed logs</li>
        </ol>
        <p className="mt-3 text-sm text-gray-600">
          If tests fail, check: API keys configured? CORS enabled? Images accessible?
        </p>
      </Card>
    </div>
  );
};

export default TestAIVision;