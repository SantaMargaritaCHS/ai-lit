import { Download, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CertificateGeneratorProps {
  userName: string;
  activityTitle: string;
  onDownload: () => void;
}

export function CertificateGenerator({ userName, activityTitle, onDownload }: CertificateGeneratorProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const generateCertificate = () => {
    // Create a canvas element for the certificate
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Inner border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Title
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 120);
    
    // Subtitle
    ctx.fillStyle = '#374151';
    ctx.font = '24px Arial';
    ctx.fillText('This certifies that', canvas.width / 2, 180);
    
    // Name
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(userName, canvas.width / 2, 240);
    
    // Activity completion text
    ctx.fillStyle = '#374151';
    ctx.font = '24px Arial';
    ctx.fillText('has successfully completed the', canvas.width / 2, 290);
    
    // Activity title
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(activityTitle, canvas.width / 2, 340);
    
    // Completion text
    ctx.fillStyle = '#374151';
    ctx.font = '24px Arial';
    ctx.fillText('learning activity', canvas.width / 2, 380);
    
    // Date
    ctx.fillStyle = '#6b7280';
    ctx.font = '20px Arial';
    ctx.fillText(`Completed on ${currentDate}`, canvas.width / 2, 480);
    
    // Award icon (simplified)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 520, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('★', canvas.width / 2, 530);
    
    // Download the certificate
    const link = document.createElement('a');
    link.download = `${activityTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_certificate.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    onDownload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Congratulations, {userName}!
            </h1>
            <p className="text-lg text-gray-600">
              You have successfully completed the
            </p>
            <p className="text-xl font-semibold text-blue-600 mt-2">
              {activityTitle}
            </p>
          </div>
          
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-800 mb-2">
                Certificate of Completion
              </h2>
              <p className="text-gray-600 mb-2">This certifies that</p>
              <p className="text-xl font-bold text-blue-600 mb-2">{userName}</p>
              <p className="text-gray-600 mb-2">has successfully completed the</p>
              <p className="text-lg font-semibold text-blue-800 mb-2">{activityTitle}</p>
              <p className="text-gray-600 mb-4">learning activity</p>
              <p className="text-sm text-gray-500">
                Completed on {currentDate}
              </p>
              <div className="mt-4">
                <span className="text-2xl text-yellow-500">★</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={generateCertificate} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg border-2 border-blue-700" 
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}