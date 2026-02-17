import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Shield, AlertTriangle } from 'lucide-react';

interface SecretKeyPromptProps {
  isOpen: boolean;
  onSubmit: (key: string) => void;
  onCancel: () => void;
}

export function SecretKeyPrompt({ isOpen, onSubmit, onCancel }: SecretKeyPromptProps) {
  const [secretKey, setSecretKey] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey.trim()) {
      const wasInvalid = isInvalid;
      onSubmit(secretKey.trim());
      
      // Check if key was invalid by seeing if modal is still open after a brief delay
      setTimeout(() => {
        if (isOpen) {
          setAttempts(prev => prev + 1);
          setIsInvalid(true);
          setSecretKey('');
        }
      }, 100);
    }
  };

  const handleCancel = () => {
    setSecretKey('');
    setAttempts(0);
    setIsInvalid(false);
    onCancel();
  };

  return (
    <>
      {/* High-contrast overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-[9998]" />
      )}
      
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <DialogContent className="sm:max-w-md bg-white text-black border-4 border-red-600 shadow-2xl z-[9999] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ring-4 ring-red-500/50"
          style={{
            backgroundColor: '#ffffff',
            color: '#000000'
          }}
        >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black font-bold">
            <Shield className="w-5 h-5 text-red-600" />
            Developer Mode Access
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-900 font-bold">
                  Restricted Access Required
                </p>
                <p className="text-xs text-yellow-800 mt-1 font-medium">
                  Developer mode provides advanced testing tools and should only be used by authorized personnel.
                </p>
              </div>
            </div>
          </div>

          {isInvalid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-800">
                  Invalid secret key. Please try again.
                  {attempts > 2 && (
                    <span className="block text-xs mt-1">
                      Contact your administrator if you need access.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secretKey" className="flex items-center gap-2 text-black font-medium">
                <Key className="w-4 h-4 text-black" />
                Secret Key
              </Label>
              <Input
                id="secretKey"
                type="password"
                value={secretKey}
                onChange={(e) => {
                  setSecretKey(e.target.value);
                  setIsInvalid(false);
                }}
                placeholder="Enter developer secret key..."
                className={`bg-white text-black border-2 ${isInvalid ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'}`}
                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                autoFocus
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!secretKey.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                <Key className="w-4 h-4 mr-2" />
                Unlock Developer Mode
              </Button>
            </div>
          </form>

          <div className="text-xs text-black border-t border-gray-300 pt-3">
            <p className="font-bold text-black">What is Developer Mode?</p>
            <ul className="mt-1 space-y-1 text-black font-medium">
              <li>• Auto-fill reflection responses for testing</li>
              <li>• Skip video segments and activities</li>
              <li>• Jump to any activity in the module</li>
              <li>• Advanced debugging and testing tools</li>
            </ul>
            <div className="mt-2 p-2 bg-blue-100 border border-blue-400 rounded">
              <p className="text-xs text-blue-900 font-medium">
                <strong>Secret Key:</strong> Check the browser console (F12) for debugging info if authentication fails.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}