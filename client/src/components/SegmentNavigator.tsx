import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, Lock, Play, Clock, 
  BookOpen, MessageSquare, Zap, ArrowRight 
} from 'lucide-react';
import { VideoSegment } from '@/services/videoSegments';

interface SegmentNavigatorProps {
  segments: VideoSegment[];
  currentIndex: number;
  progress: Record<string, number>;
  onNavigate: (index: number) => void;
  canNavigate: (index: number) => boolean;
  completedSegments: Set<string>;
}

export function SegmentNavigator({
  segments,
  currentIndex,
  progress,
  onNavigate,
  canNavigate,
  completedSegments
}: SegmentNavigatorProps) {
  
  const formatDuration = (start: number, end: number): string => {
    const duration = Math.round(end - start);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSegmentIcon = (segment: VideoSegment, index: number) => {
    if (completedSegments.has(segment.id)) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
        >
          <CheckCircle className="h-4 w-4 text-green-600" />
        </motion.div>
      );
    }
    if (index === currentIndex) {
      return (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex items-center justify-center"
        >
          <Play className="h-4 w-4 text-primary" />
        </motion.div>
      );
    }
    if (!canNavigate(index)) {
      return <Lock className="h-4 w-4 text-muted-foreground" />;
    }
    return (
      <motion.div 
        className="h-4 w-4 rounded-full border-2 border-muted-foreground"
        whileHover={{ scale: 1.2, borderColor: 'hsl(var(--primary))' }}
      />
    );
  };

  const getSegmentStatus = (segment: VideoSegment, index: number) => {
    if (completedSegments.has(segment.id)) return 'completed';
    if (index === currentIndex) return 'active';
    if (!canNavigate(index)) return 'locked';
    return 'available';
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle className="flex items-center justify-between">
            <span>Your Learning Journey</span>
            <motion.div 
              className="text-sm text-muted-foreground"
              key={completedSegments.size}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              {completedSegments.size} of {segments.filter(s => s.mandatory).length} required completed
            </motion.div>
          </CardTitle>
          <CardDescription>
            Navigate through interactive video segments at your own pace
          </CardDescription>
        </motion.div>
      </CardHeader>
      
      <CardContent>
        {/* Overall Progress */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Module Progress</span>
            <motion.span
              key={completedSegments.size}
              initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
              animate={{ scale: 1, color: 'inherit' }}
              transition={{ duration: 0.3 }}
            >
              {Math.round((completedSegments.size / segments.filter(s => s.mandatory).length) * 100)}%
            </motion.span>
          </div>
          <div className="relative">
            <Progress 
              value={(completedSegments.size / segments.filter(s => s.mandatory).length) * 100} 
              className="h-3" 
            />
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/20 to-transparent rounded-full pointer-events-none"
              initial={{ width: 0 }}
              animate={{ width: `${(completedSegments.size / segments.filter(s => s.mandatory).length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Segment Timeline */}
        <div className="space-y-3">
          {segments.map((segment, index) => {
            const status = getSegmentStatus(segment, index);
            const segmentProgress = progress[segment.id] || 0;
            const isClickable = canNavigate(index);
            
            return (
              <motion.div 
                key={segment.id}
                className={`relative segment-item ${status}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={isClickable ? { scale: 1.02, y: -2 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
              >
                <Card 
                  className={`transition-all cursor-pointer hover:shadow-md ${
                    status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''
                  } ${status === 'completed' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : ''} ${
                    status === 'active' ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => isClickable && onNavigate(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Segment Icon */}
                      <div className="mt-1 segment-indicator relative">
                        {getSegmentIcon(segment, index)}
                        {status === 'active' && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary"
                            animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          />
                        )}
                      </div>
                      
                      {/* Segment Info */}
                      <div className="flex-1 min-w-0 segment-info">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{segment.title}</h3>
                          {status === 'active' && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2, type: "spring" }}
                            >
                              <Badge variant="default" className="text-xs">
                                Now Playing
                              </Badge>
                            </motion.div>
                          )}
                          {segment.mandatory && (
                            <Badge variant="outline" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {segment.description}
                        </p>
                        
                        {/* Segment Progress */}
                        {segmentProgress > 0 && segmentProgress < 100 && (
                          <motion.div 
                            className="mb-2 segment-progress"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative">
                              <Progress value={segmentProgress} className="h-2" />
                              <motion.div
                                className="absolute top-0 left-0 h-full bg-primary/20 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${segmentProgress}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {Math.round(segmentProgress)}% watched
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Segment Metadata */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(segment.start, segment.end)}</span>
                            </div>
                            <span className="capitalize">{segment.source}</span>
                          </div>
                          
                          {/* Features */}
                          <div className="flex items-center gap-1">
                            {segment.interactive && (
                              <Badge variant="secondary" className="text-xs">
                                Interactive
                              </Badge>
                            )}
                            {segment.crossfade && (
                              <Badge variant="outline" className="text-xs">
                                Seamless
                              </Badge>
                            )}
                            {segment.interactive && (
                              <Badge variant="secondary" className="text-xs">
                                <MessageSquare className="h-2 w-2 mr-1" />
                                Interactive
                              </Badge>
                            )}
                            {segment.reflection && (
                              <Badge variant="outline" className="text-xs">
                                <BookOpen className="h-2 w-2 mr-1" />
                                Reflection
                              </Badge>
                            )}
                            {segment.crossfade && (
                              <Badge variant="outline" className="text-xs">
                                <Zap className="h-2 w-2 mr-1" />
                                Seamless
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Navigation Arrow */}
                      {isClickable && status !== 'active' && (
                        <div className="mt-1">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Connection Line to Next Segment */}
                {index < segments.length - 1 && (
                  <div className="absolute left-6 top-full w-px h-3 bg-border" />
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default SegmentNavigator;