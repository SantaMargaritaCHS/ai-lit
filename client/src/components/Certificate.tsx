import React, { useRef, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Sparkles, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
// import { useGame } from '../context/GameContext';

interface CertificateProps {
  userName?: string;
  courseName: string;
  completionDate: string;
  score?: number;
  instructor?: string;
  moduleId?: string;
  onComplete?: () => void;
  onDownload?: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({
  userName,
  courseName,
  completionDate,
  score,
  instructor = 'AI Literacy Platform',
  moduleId = 'intro-to-gen-ai',
  onComplete,
  onDownload
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Use provided userName or fallback
  const displayName = userName || 'Valued Educator';

  // Generate unique verification code (memoized so it stays consistent)
  const verificationCode = useMemo(() => {
    // Generate 8 random hex characters
    const randomBytes = new Uint8Array(4);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }, []); // Empty deps = generated once on mount

  // Format code as XXXX-XXXX
  const formattedCode = `${verificationCode.slice(0, 4)}-${verificationCode.slice(4)}`;

  const downloadCertificate = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    console.log('📸 Generating certificate image...');
    
    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      // Create a temporary certificate element for download with clean styling
      const tempCertificate = document.createElement('div');
      tempCertificate.style.position = 'absolute';
      tempCertificate.style.left = '-9999px';
      tempCertificate.style.width = '800px';
      tempCertificate.style.height = '600px';
      tempCertificate.innerHTML = `
        <div style="
          width: 800px;
          height: 600px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 16px solid #2563eb;
          padding: 50px 60px;
          box-sizing: border-box;
          text-align: center;
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        ">
          <!-- Verification Code Badge (Top Right) -->
          <div style="
            position: absolute;
            top: 20px;
            right: 20px;
            background: #1e40af;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            padding: 8px 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">
            <div style="
              font-size: 9px;
              color: #93c5fd;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 2px;
            ">Verification Code</div>
            <div style="
              font-family: 'Courier New', monospace;
              font-size: 16px;
              font-weight: bold;
              color: #ffffff;
              letter-spacing: 2px;
            ">${formattedCode}</div>
          </div>

          <div>
            <h1 style="
              font-size: 38px;
              font-weight: bold;
              color: #2563eb;
              margin: 0 0 40px 0;
            ">Certificate of Completion</h1>
          </div>

          <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
            <p style="
              font-size: 16px;
              color: #374151;
              margin: 0 0 20px 0;
            ">This certifies that</p>

            <h2 style="
              font-size: 32px;
              font-weight: bold;
              color: #2563eb;
              margin: 0 0 20px 0;
            ">${displayName}</h2>

            <p style="
              font-size: 16px;
              color: #374151;
              margin: 0 0 20px 0;
            ">has successfully completed the</p>

            <h3 style="
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin: 0 0 15px 0;
            ">${courseName}</h3>

            <p style="
              font-size: 16px;
              color: #374151;
              margin: 0;
            ">learning activity</p>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <!-- Left: Date and Seal -->
            <div style="display: flex; flex-direction: column; align-items: flex-start; flex: 1;">
              <p style="
                font-size: 14px;
                color: #6b7280;
                margin: 0 0 10px 0;
              ">Completed on ${completionDate}</p>

              <div style="
                width: 50px;
                height: 50px;
                background: #fbbf24;
                border: 3px solid #f59e0b;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#b45309" stroke="none">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </div>
            </div>

            <!-- Right: Verification Info -->
            <div style="
              text-align: right;
              padding: 12px 16px;
              background: rgba(255, 255, 255, 0.7);
              border-left: 3px solid #3b82f6;
              border-radius: 4px;
            ">
              <p style="
                font-size: 10px;
                color: #6b7280;
                margin: 0 0 4px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">Certificate ID</p>
              <p style="
                font-family: 'Courier New', monospace;
                font-size: 14px;
                font-weight: bold;
                color: #1e40af;
                margin: 0;
                letter-spacing: 1px;
              ">${formattedCode}</p>
              <p style="
                font-size: 9px;
                color: #9ca3af;
                margin: 4px 0 0 0;
              ">Unique certificate identifier</p>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(tempCertificate);
      
      // Generate canvas from temporary certificate
      const canvas = await html2canvas(tempCertificate, {
        scale: 2,
        backgroundColor: 'white',
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Remove temporary element
      document.body.removeChild(tempCertificate);
      
      // Convert to PNG and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `AI-Literacy-Certificate-${moduleId}-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          console.log('✅ Certificate downloaded successfully');
          
          // Set downloaded state
          setIsDownloaded(true);
          
          // Log analytics
          logCertificateDownload({
            moduleId,
            studentName: displayName,
            score
          });
          
          if (onDownload) onDownload();
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('❌ Error generating certificate:', error);
      alert('Unable to download certificate. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Analytics logging function
  const logCertificateDownload = async (data: {
    moduleId: string;
    studentName: string;
    score?: number;
  }) => {
    try {
      await fetch('/api/analytics/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'certificate_downloaded',
          ...data,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-2xl mx-auto"
    >
      <Card
        ref={certificateRef}
        className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-2 border-yellow-500 relative overflow-hidden group"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl" />
        </div>

        {/* Verification Code Badge (Top Right) */}
        <div className="absolute top-4 right-4 z-20 bg-blue-800 border-2 border-blue-500 rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3 h-3 text-blue-300" />
            <p className="text-[10px] text-blue-300 uppercase tracking-wider">Verification Code</p>
          </div>
          <p className="font-mono font-bold text-lg text-white tracking-widest">{formattedCode}</p>
        </div>

        <CardContent className="relative z-10 p-12 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Award className="w-20 h-20 text-yellow-400" />
                <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2" />
              </motion.div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Certificate of Completion
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full" />
          </div>

          {/* Content */}
          <div className="space-y-6 mb-8">
            <p className="text-xl text-gray-300">This certifies that</p>
            
            <h2 className="text-3xl font-bold text-white">
              {displayName}
            </h2>
            
            <p className="text-xl text-gray-300">has successfully completed</p>
            
            <h3 className="text-2xl font-bold text-yellow-400 px-4 py-2">
              {courseName}
            </h3>
          </div>

          {/* Instructions Section */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">
              Important Instructions
            </h3>
            <ol className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-400 font-bold mr-2">1.</span>
                <span>Download your certificate using the button below</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 font-bold mr-2">2.</span>
                <span>Upload the certificate to your Alludo activity for completion credit</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 font-bold mr-2">3.</span>
                <span>You can close this window after downloading - but make sure to save your certificate first!</span>
              </li>
            </ol>
            <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded flex items-start gap-2">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 text-sm font-semibold mb-1">Verification Code: {formattedCode}</p>
                <p className="text-blue-200 text-xs">
                  Each certificate has a unique verification code (shown in the top-right corner). This helps prevent certificate sharing and ensures authenticity.
                </p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
              <p className="text-yellow-300 text-sm">
                <strong>Note:</strong> You cannot access this certificate again without completing the entire module, so please download it now.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={downloadCertificate}
              disabled={isDownloading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Certificate for Alludo
                </>
              )}
            </Button>
          </div>

          {/* Success Message After Download */}
          {isDownloaded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg"
            >
              <p className="text-green-300 text-center">
                ✅ Certificate downloaded! You can now upload it to Alludo and close this window.
              </p>
            </motion.div>
          )}

          {/* Footer */}
          <div className="border-t border-white/20 pt-6">
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <p className="text-gray-400">Date</p>
                <p className="text-white font-semibold">{completionDate}</p>
              </div>
              <div>
                <p className="text-gray-400">Instructor</p>
                <p className="text-white font-semibold">{instructor}</p>
              </div>
            </div>
          </div>

          {/* Download Indicator */}
          <motion.div
            className="download-btn absolute bottom-4 right-4 bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Download className="w-6 h-6 text-white" />
          </motion.div>
        </CardContent>
      </Card>

      {/* Complete Module Button */}
      {onComplete && (
        <div className="mt-6 text-center">
          <button
            onClick={onComplete}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Complete Module
          </button>
        </div>
      )}

      {isDownloading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            <p className="text-white">Generating certificate...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};