import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from 'lucide-react';

interface NameEntryProps {
  activityTitle: string;
  onNameSubmit: (name: string) => void;
}

export function NameEntry({ activityTitle, onNameSubmit }: NameEntryProps) {
  const [name, setName] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    if (!acknowledged) {
      setError('Please confirm that you are completing this activity yourself');
      return;
    }

    onNameSubmit(name.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 mx-auto">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="tracking-tight text-2xl font-bold text-gray-900 dark:text-white">
            {activityTitle}
          </CardTitle>
          <p className="text-gray-800 dark:text-gray-300 mt-2">
            Enter your name to begin this learning activity and receive your certificate
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-800 dark:text-gray-300">
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Enter your full name"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="acknowledge"
                checked={acknowledged}
                onCheckedChange={(checked) => {
                  setAcknowledged(checked === true);
                  setError('');
                }}
                className="mt-1 border-2 border-gray-400 dark:border-gray-300 bg-white dark:bg-gray-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white"
              />
              <Label htmlFor="acknowledge" className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed cursor-pointer">
                I confirm that I am completing this learning activity myself and that the name entered above is my own.
              </Label>
            </div>
            
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button
              type="submit"
              disabled={!name.trim() || !acknowledged}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Learning
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Your name will be used to generate your completion certificate
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}