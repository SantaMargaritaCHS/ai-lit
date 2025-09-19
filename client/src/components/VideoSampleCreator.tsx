import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadVideo } from '@/services/videoService';
import { Video, Upload, AlertCircle } from 'lucide-react';

export function VideoSampleCreator() {
  
  const createSampleVideo = (duration: number = 30): Blob => {
    // Create a simple colored canvas video
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d')!;
    
    // Create sample video data (this is a placeholder)
    const frames: ImageData[] = [];
    
    for (let i = 0; i < duration * 30; i++) { // 30fps
      ctx.fillStyle = `hsl(${(i * 2) % 360}, 70%, 50%)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text overlay
      ctx.fillStyle = 'white';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Sample Video - Frame ${i}`, canvas.width / 2, canvas.height / 2);
      
      frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
    
    // Note: This is a simplified example. In reality, you'd need a proper video encoder
    return new Blob(['Sample video data'], { type: 'video/mp4' });
  };

  const handleCreateSamples = async () => {
    try {
      const sampleVideos = [
        { name: 'sample-intro.mp4', duration: 60 },
        { name: 'sample-history.mp4', duration: 45 },
        { name: 'sample-ethics.mp4', duration: 90 },
        { name: 'sample-future.mp4', duration: 75 },
        { name: 'sample-tutorial.mp4', duration: 120 },
        { name: 'sample-reflection.mp4', duration: 30 },
        { name: 'sample-conclusion.mp4', duration: 40 }
      ];

      for (const video of sampleVideos) {
        const blob = createSampleVideo(video.duration);
        const file = new File([blob], video.name, { type: 'video/mp4' });
        await uploadVideo(file, `Videos/${video.name}`);
      }
      
      alert('Sample videos created successfully!');
    } catch (error) {
      console.error('Error creating sample videos:', error);
      alert('Error creating sample videos. Please check console.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Sample Video Creator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              <p className="font-medium mb-1">Sample Videos Notice</p>
              <p>This creates placeholder sample videos for testing the video player. Replace with your actual educational content.</p>
            </div>
          </div>
          
          <Button onClick={handleCreateSamples} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Create Sample Videos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default VideoSampleCreator;