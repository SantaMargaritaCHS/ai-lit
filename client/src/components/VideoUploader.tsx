import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Video, AlertCircle, CheckCircle } from 'lucide-react';
import { FirebaseStorageService, VideoUtils } from '@/services/firebaseStorage';
import { useToast } from '@/hooks/use-toast';

interface VideoUploaderProps {
  moduleName: string;
  onUploadComplete?: (videoURL: string) => void;
  maxSizeMB?: number;
}

export function VideoUploader({ moduleName, onUploadComplete, maxSizeMB = 100 }: VideoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!VideoUtils.isValidVideoFile(file)) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid video file (MP4, WebM, OGG, MOV, AVI)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size
    const fileSizeMB = VideoUtils.getFileSizeMB(file);
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: "File too large",
        description: `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress updates during upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const videoURL = await FirebaseStorageService.uploadVideo(
        selectedFile,
        moduleName,
        selectedFile.name
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadComplete(true);

      toast({
        title: "Upload successful",
        description: "Video has been uploaded to Firebase Storage",
      });

      onUploadComplete?.(videoURL);
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const resetUploader = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Upload Video
        </CardTitle>
        <CardDescription>
          Upload videos for the {moduleName} module
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="video-upload">Select Video File</Label>
          <Input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </div>

        {selectedFile && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="h-4 w-4" />
              <span>{selectedFile.name}</span>
              <span>({VideoUtils.getFileSizeMB(selectedFile)}MB)</span>
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {uploadComplete ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Upload complete!</span>
              </div>
            ) : (
              <Button 
                onClick={handleUpload} 
                disabled={uploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Video'}
              </Button>
            )}

            {uploadComplete && (
              <Button 
                variant="outline" 
                onClick={resetUploader}
                className="w-full"
              >
                Upload Another Video
              </Button>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Supported formats: MP4, WebM, OGG, MOV, AVI</span>
          </div>
          <div>Maximum file size: {maxSizeMB}MB</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default VideoUploader;