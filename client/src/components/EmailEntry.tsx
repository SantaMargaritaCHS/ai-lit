import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Shield } from 'lucide-react';

interface EmailEntryProps {
  onEmailSubmit: (email: string) => void;
  moduleName: string;
}

export function EmailEntry({ onEmailSubmit, moduleName }: EmailEntryProps) {
  const [email, setEmail] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    if (!email.endsWith('@smhs.org')) {
      return 'Email must be from @smhs.org domain';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!acknowledged) {
      setError('Please acknowledge that you are completing this activity yourself');
      return;
    }
    setError('');
    onEmailSubmit(email);
  };

  const isValid = email && acknowledged && !validateEmail(email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Access Learning Activity
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {moduleName}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.name@smhs.org"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={error && !acknowledged ? 'border-red-500' : ''}
              />
              <p className="text-sm text-gray-500">
                Please use your @smhs.org email address
              </p>
            </div>

            <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
              <Checkbox
                id="acknowledge"
                checked={acknowledged}
                onCheckedChange={(checked) => {
                  setAcknowledged(checked as boolean);
                  setError('');
                }}
              />
              <div className="space-y-1">
                <Label htmlFor="acknowledge" className="text-sm font-medium leading-none">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Academic Integrity Confirmation
                  </div>
                </Label>
                <p className="text-xs text-gray-600">
                  I confirm that I am completing this learning activity myself and will engage 
                  authentically with the educational content.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!isValid}
            >
              Begin Activity
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Your activity progress will be tracked for educational analytics purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}