import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SegmentedVideoSequence } from './SegmentedVideoSequence';
import { PremiumVideoPlayer } from './PremiumVideoPlayer';
import { FirebaseVideoPlayer } from './FirebaseVideoPlayer';
import { VideoUploader } from './VideoUploader';
import VideoSampleCreator from './VideoSampleCreator';
import { listVideos, videoSources, uploadVideo } from '@/services/videoService';
import { Upload, Video, List } from 'lucide-react';

export function VideoManager() {
  const [selectedVideoPath, setSelectedVideoPath] = useState<string>('');
  const [availableVideos, setAvailableVideos] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAvailableVideos = async () => {
    setLoading(true);
    try {
      const videos = await listVideos('Videos');
      setAvailableVideos(videos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUploadComplete = async (videoURL: string) => {
    console.log('Video uploaded successfully:', videoURL);
    // Refresh the video list
    await loadAvailableVideos();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Firebase Video Management</h1>
        <p className="text-muted-foreground">Upload, manage, and play videos from Firebase Storage</p>
      </div>

      <Tabs defaultValue="premium" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="premium">Premium Player</TabsTrigger>
          <TabsTrigger value="segments">Video Segments</TabsTrigger>
          <TabsTrigger value="player">Video Player</TabsTrigger>
          <TabsTrigger value="upload">Upload Videos</TabsTrigger>
          <TabsTrigger value="library">Video Library</TabsTrigger>
          <TabsTrigger value="presets">Preset Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="premium" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Premium Interactive Video Experience
              </CardTitle>
              <CardDescription>
                Advanced segmented video player with crossfades, interactive pauses, and seamless navigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PremiumVideoPlayer 
                onSegmentComplete={(id) => console.log('Segment completed:', id)}
                onModuleComplete={() => console.log('All segments completed!')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <SegmentedVideoSequence 
            onComplete={() => console.log('All video segments completed!')}
          />
        </TabsContent>

        <TabsContent value="player" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Firebase Video Player
              </CardTitle>
              <CardDescription>
                Enter a Firebase Storage path to play videos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="video-path">Video Path</Label>
                  <Input
                    id="video-path"
                    placeholder="e.g., Videos/1 Introduction to Artificial Intelligence.mp4"
                    value={selectedVideoPath}
                    onChange={(e) => setSelectedVideoPath(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => setSelectedVideoPath(selectedVideoPath)}
                  className="mt-6"
                >
                  Load Video
                </Button>
              </div>

              {selectedVideoPath && (
                <FirebaseVideoPlayer
                  videoPath={selectedVideoPath}
                  title="Custom Video"
                  description={`Playing: ${selectedVideoPath}`}
                  requireCompletion={false}
                  onProgress={(progress) => console.log('Progress:', progress)}
                  onComplete={() => console.log('Video completed!')}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <VideoSampleCreator />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Videos to Firebase
              </CardTitle>
              <CardDescription>
                Upload video files to Firebase Storage for use in your modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoUploader
                moduleName="general"
                onUploadComplete={handleVideoUploadComplete}
                maxSizeMB={200}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Video Library
              </CardTitle>
              <CardDescription>
                Browse and play videos from Firebase Storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={loadAvailableVideos} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh Video List'}
              </Button>

              {availableVideos.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableVideos.map((video, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-medium truncate">{video.name}</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => setSelectedVideoPath(`Videos/${video.name}`)}
                        >
                          Play Video
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preset Video Sources</CardTitle>
              <CardDescription>
                Pre-configured video paths for your AI learning modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(videoSources).map(([key, path]) => (
                  <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <p className="text-sm text-muted-foreground truncate">{path}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => setSelectedVideoPath(path)}
                      >
                        Load Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default VideoManager;