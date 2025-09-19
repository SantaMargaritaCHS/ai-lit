import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play, Clock, BookOpen } from 'lucide-react';
import { SegmentedVideoPlayer } from './SegmentedVideoPlayer';
import { videoSegments, VideoSegment, getNextSegment } from '@/services/videoSegments';

interface SegmentedVideoSequenceProps {
  onComplete?: () => void;
  className?: string;
}

export function SegmentedVideoSequence({ onComplete, className = "" }: SegmentedVideoSequenceProps) {
  const [currentSegmentId, setCurrentSegmentId] = useState<string>(videoSegments[0]?.id || '');
  const [completedSegments, setCompletedSegments] = useState<Set<string>>(new Set());
  const [showSequence, setShowSequence] = useState(false);

  const handleSegmentComplete = (segmentId: string) => {
    const newCompleted = new Set(completedSegments);
    newCompleted.add(segmentId);
    setCompletedSegments(newCompleted);

    // Auto-advance to next segment
    const nextSegment = getNextSegment(segmentId);
    if (nextSegment) {
      setCurrentSegmentId(nextSegment.id);
    } else {
      // All segments completed
      onComplete?.();
    }
  };

  const handleSegmentSelect = (segmentId: string) => {
    setCurrentSegmentId(segmentId);
    setShowSequence(true);
  };

  const calculateTotalProgress = (): number => {
    const mandatorySegments = videoSegments.filter(s => s.mandatory);
    const completedMandatory = mandatorySegments.filter(s => completedSegments.has(s.id));
    return mandatorySegments.length > 0 ? (completedMandatory.length / mandatorySegments.length) * 100 : 0;
  };

  const formatDuration = (start: number, end: number): string => {
    const duration = Math.round(end - start);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!showSequence) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle>AI Learning Video Series</CardTitle>
            <CardDescription>
              Interactive video segments with pause points, reflections, and key concepts
            </CardDescription>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(calculateTotalProgress())}%</span>
              </div>
              <Progress value={calculateTotalProgress()} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {videoSegments.map((segment) => {
                const isCompleted = completedSegments.has(segment.id);
                const canStart = segment.id === videoSegments[0].id || completedSegments.has(
                  videoSegments[videoSegments.indexOf(segment) - 1]?.id
                );

                return (
                  <Card 
                    key={segment.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isCompleted ? 'ring-2 ring-green-500' : ''
                    } ${!canStart ? 'opacity-50' : ''}`}
                    onClick={() => canStart && handleSegmentSelect(segment.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm line-clamp-2">{segment.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {segment.description}
                          </p>
                        </div>
                        {isCompleted && (
                          <CheckCircle className="h-4 w-4 text-green-600 ml-2 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(segment.start, segment.end)}</span>
                        </div>
                        <span className="capitalize">{segment.source}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {segment.mandatory && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        {segment.interactive && (
                          <Badge variant="secondary" className="text-xs">Interactive</Badge>
                        )}
                        {segment.reflection && (
                          <Badge variant="outline" className="text-xs">
                            <BookOpen className="h-2 w-2 mr-1" />Reflection
                          </Badge>
                        )}
                        {segment.chapters && (
                          <Badge variant="outline" className="text-xs">
                            {segment.chapters.length} Chapters
                          </Badge>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full text-xs"
                        disabled={!canStart}
                        variant={isCompleted ? "outline" : "default"}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        {isCompleted ? 'Rewatch' : 'Watch'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => setShowSequence(false)}
          className="mb-4"
        >
          ← Back to Segment List
        </Button>
        
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Video Learning Sequence</h2>
          <span className="text-sm text-muted-foreground">
            {completedSegments.size} of {videoSegments.filter(s => s.mandatory).length} required completed
          </span>
        </div>
        <Progress value={calculateTotalProgress()} className="h-2" />
      </div>

      <SegmentedVideoPlayer
        segmentId={currentSegmentId}
        onSegmentComplete={handleSegmentComplete}
        onAllSegmentsComplete={onComplete}
      />

      {/* Segment Navigation */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Segment Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {videoSegments.map((segment) => {
              const isCompleted = completedSegments.has(segment.id);
              const isCurrent = segment.id === currentSegmentId;
              
              return (
                <Button
                  key={segment.id}
                  variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSegmentId(segment.id)}
                  className="text-xs"
                >
                  {isCompleted && <CheckCircle className="h-3 w-3 mr-1" />}
                  {segment.title}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SegmentedVideoSequence;