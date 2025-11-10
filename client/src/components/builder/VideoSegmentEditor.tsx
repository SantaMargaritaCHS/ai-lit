import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Play, Save, X, Upload, Youtube, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * VideoSegmentEditor - Component for managing video segments with time codes
 *
 * Phase 1.2 of Module Builder
 * Features:
 * - Video URL input (Firebase Storage, YouTube, external)
 * - Time-coded segment definition
 * - Segment preview
 * - Transcript extraction/upload (future enhancement)
 *
 * Segment Structure (matches existing module pattern):
 * {
 *   id: string;
 *   title: string;
 *   start: number;  // seconds
 *   end: number;    // seconds
 *   source: string; // video URL
 *   description: string;
 *   mandatory: boolean;
 * }
 */

interface VideoSegment {
  id: string;
  title: string;
  start: number;
  end: number;
  source: string;
  description: string;
  mandatory: boolean;
}

interface VideoData {
  url: string;
  title: string;
  type: 'firebase' | 'youtube' | 'external';
  segments: VideoSegment[];
}

interface TranscriptData {
  fullText: string;
  segments: {
    startTime: number;
    endTime: number;
    text: string;
  }[];
}

export default function VideoSegmentEditor() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Record<string, TranscriptData>>({});

  // Segment form state
  const [segmentTitle, setSegmentTitle] = useState('');
  const [segmentStart, setSegmentStart] = useState('0');
  const [segmentEnd, setSegmentEnd] = useState('');
  const [segmentDescription, setSegmentDescription] = useState('');
  const [segmentMandatory, setSegmentMandatory] = useState(true);

  const detectVideoType = (url: string): 'firebase' | 'youtube' | 'external' => {
    if (url.startsWith('Videos/') || url.includes('firebasestorage')) {
      return 'firebase';
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    }
    return 'external';
  };

  const addVideo = () => {
    if (!currentVideoUrl.trim() || !currentVideoTitle.trim()) {
      alert('Please enter both video URL and title');
      return;
    }

    const newVideo: VideoData = {
      url: currentVideoUrl.trim(),
      title: currentVideoTitle.trim(),
      type: detectVideoType(currentVideoUrl.trim()),
      segments: [],
    };

    setVideos([...videos, newVideo]);
    setCurrentVideoUrl('');
    setCurrentVideoTitle('');
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const addSegment = (videoIndex: number) => {
    if (!segmentTitle.trim() || !segmentEnd.trim()) {
      alert('Please enter segment title and end time');
      return;
    }

    const start = parseFloat(segmentStart);
    const end = parseFloat(segmentEnd);

    if (isNaN(start) || isNaN(end) || end <= start) {
      alert('Invalid time codes. End time must be greater than start time.');
      return;
    }

    const newSegment: VideoSegment = {
      id: `segment-${Date.now()}`,
      title: segmentTitle.trim(),
      start,
      end,
      source: videos[videoIndex].url,
      description: segmentDescription.trim(),
      mandatory: segmentMandatory,
    };

    const updatedVideos = [...videos];
    updatedVideos[videoIndex].segments.push(newSegment);
    setVideos(updatedVideos);

    // Reset form
    setSegmentTitle('');
    setSegmentStart('0');
    setSegmentEnd('');
    setSegmentDescription('');
    setSegmentMandatory(true);
    setEditingSegmentId(null);
  };

  const removeSegment = (videoIndex: number, segmentId: string) => {
    const updatedVideos = [...videos];
    updatedVideos[videoIndex].segments = updatedVideos[videoIndex].segments.filter(
      (seg) => seg.id !== segmentId
    );
    setVideos(updatedVideos);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exportJSON = () => {
    const exportData = {
      videos: videos.map((v) => ({
        url: v.url,
        title: v.title,
        type: v.type,
        segments: v.segments,
      })),
      transcripts,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `module-videos-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Video Segment Editor</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add videos and define time-coded segments for your module
          </p>
        </div>
        {videos.length > 0 && (
          <Button onClick={exportJSON} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
        )}
      </div>

      {/* Add Video Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="w-5 h-5 text-purple-600" />
            Add Video
          </CardTitle>
          <CardDescription>
            Enter video URL from Firebase Storage, YouTube, or external source
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="video-url" className="text-sm font-medium text-gray-700">
                Video URL
              </Label>
              <Input
                id="video-url"
                type="text"
                placeholder="Videos/Student Videos/Topic/video.mp4"
                value={currentVideoUrl}
                onChange={(e) => setCurrentVideoUrl(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Firebase: Videos/... | YouTube: https://youtube.com/watch?v=...
              </p>
            </div>
            <div>
              <Label htmlFor="video-title" className="text-sm font-medium text-gray-700">
                Video Title
              </Label>
              <Input
                id="video-title"
                type="text"
                placeholder="Introduction to AI Ethics"
                value={currentVideoTitle}
                onChange={(e) => setCurrentVideoTitle(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <Button
            onClick={addVideo}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </CardContent>
      </Card>

      {/* Video List with Segments */}
      {videos.map((video, videoIndex) => (
        <Card key={videoIndex} className="border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {video.type === 'youtube' && <Youtube className="w-5 h-5 text-red-600" />}
                  {video.type === 'firebase' && <FileVideo className="w-5 h-5 text-orange-600" />}
                  {video.type === 'external' && <FileVideo className="w-5 h-5 text-gray-600" />}
                  {video.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    {video.url}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({video.segments.length} segments)
                  </span>
                </CardDescription>
              </div>
              <Button
                onClick={() => removeVideo(videoIndex)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Transcript Section (Placeholder for Phase 1.2 enhancement) */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    Transcript Extraction (Coming Soon)
                  </h4>
                  <p className="text-xs text-blue-800 mb-2">
                    Future enhancement: Auto-extract transcripts from YouTube or upload manually for AI content generation
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled className="text-xs">
                      <Youtube className="w-3 h-3 mr-1" />
                      Extract from YouTube
                    </Button>
                    <Button size="sm" variant="outline" disabled className="text-xs">
                      <Upload className="w-3 h-3 mr-1" />
                      Upload Transcript
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Segment Form */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Add Time-Coded Segment</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <Label htmlFor={`segment-title-${videoIndex}`} className="text-xs font-medium text-gray-700">
                    Segment Title *
                  </Label>
                  <Input
                    id={`segment-title-${videoIndex}`}
                    type="text"
                    placeholder="Introduction"
                    value={segmentTitle}
                    onChange={(e) => setSegmentTitle(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor={`segment-start-${videoIndex}`} className="text-xs font-medium text-gray-700">
                    Start Time (seconds) *
                  </Label>
                  <Input
                    id={`segment-start-${videoIndex}`}
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={segmentStart}
                    onChange={(e) => setSegmentStart(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor={`segment-end-${videoIndex}`} className="text-xs font-medium text-gray-700">
                    End Time (seconds) *
                  </Label>
                  <Input
                    id={`segment-end-${videoIndex}`}
                    type="number"
                    step="0.1"
                    placeholder="60"
                    value={segmentEnd}
                    onChange={(e) => setSegmentEnd(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`segment-desc-${videoIndex}`} className="text-xs font-medium text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id={`segment-desc-${videoIndex}`}
                    placeholder="What students will learn in this segment..."
                    value={segmentDescription}
                    onChange={(e) => setSegmentDescription(e.target.value)}
                    className="mt-1 text-sm"
                    rows={2}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id={`segment-mandatory-${videoIndex}`}
                    type="checkbox"
                    checked={segmentMandatory}
                    onChange={(e) => setSegmentMandatory(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <Label htmlFor={`segment-mandatory-${videoIndex}`} className="ml-2 text-xs font-medium text-gray-700">
                    Mandatory (students must watch)
                  </Label>
                </div>
              </div>
              <Button
                onClick={() => addSegment(videoIndex)}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white w-full md:w-auto text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Segment
              </Button>
            </div>

            {/* Segment List */}
            {video.segments.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Segments</h4>
                <div className="space-y-2">
                  {video.segments.map((segment, segIndex) => (
                    <div
                      key={segment.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            {segIndex + 1}
                          </span>
                          <h5 className="text-sm font-semibold text-gray-900">{segment.title}</h5>
                          {segment.mandatory && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatTime(segment.start)} → {formatTime(segment.end)}{' '}
                          <span className="text-gray-400">
                            ({(segment.end - segment.start).toFixed(1)}s)
                          </span>
                        </p>
                        {segment.description && (
                          <p className="text-xs text-gray-500 mt-1">{segment.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900"
                          title="Preview segment"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => removeSegment(videoIndex, segment.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Empty State */}
      {videos.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileVideo className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Videos Added</h3>
            <p className="text-sm text-gray-600 max-w-md">
              Start by adding a video URL above. You can add multiple videos and define time-coded
              segments for each one.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {videos.length > 0 && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-semibold text-purple-900">Total Videos:</span>{' '}
                <span className="text-purple-700">{videos.length}</span>
              </div>
              <div>
                <span className="font-semibold text-purple-900">Total Segments:</span>{' '}
                <span className="text-purple-700">
                  {videos.reduce((sum, v) => sum + v.segments.length, 0)}
                </span>
              </div>
              <div>
                <span className="font-semibold text-purple-900">Total Duration:</span>{' '}
                <span className="text-purple-700">
                  {formatTime(
                    videos.reduce(
                      (sum, v) =>
                        sum + v.segments.reduce((s, seg) => s + (seg.end - seg.start), 0),
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
