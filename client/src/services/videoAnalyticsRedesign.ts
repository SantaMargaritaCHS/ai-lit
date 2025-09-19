/**
 * Video Analytics System for Redesigned "What is AI?" Module
 * Tracks segmented video progress according to the complete redesign specifications
 */

export interface VideoSegmentAnalytics {
  segmentId: string;
  videoId: string;
  startTime: number;
  endTime: number;
  watchedDuration: number;
  completionRate: number;
  pauseCount: number;
  seekCount: number;
  interactionsCompleted: number;
  totalInteractions: number;
  started: boolean;
  completed: boolean;
  timestamp: number;
}

export interface VideoModuleAnalytics {
  videoId: string;
  totalTime: number;
  watchedTime: number;
  completionRate: number;
  segmentsCompleted: number;
  totalSegments: number;
  interactionsCompleted: number;
  pauseCount: number;
  seekCount: number;
  averageSegmentTime: number;
}

class VideoAnalyticsRedesign {
  private analytics: Map<string, VideoSegmentAnalytics> = new Map();
  private moduleAnalytics: Map<string, VideoModuleAnalytics> = new Map();
  private startTimes: Map<string, number> = new Map();
  private segmentStartTimes: Map<string, number> = new Map();

  /**
   * Start tracking a video segment
   */
  startSegment(segmentId: string, videoId: string, startTime: number, endTime: number): void {
    const timestamp = Date.now();
    this.segmentStartTimes.set(segmentId, timestamp);
    
    if (!this.analytics.has(segmentId)) {
      this.analytics.set(segmentId, {
        segmentId,
        videoId,
        startTime,
        endTime,
        watchedDuration: 0,
        completionRate: 0,
        pauseCount: 0,
        seekCount: 0,
        interactionsCompleted: 0,
        totalInteractions: 0,
        started: true,
        completed: false,
        timestamp
      });
    }
    
    console.log('📊 Segment started:', segmentId);
  }

  /**
   * Update segment progress
   */
  updateSegmentProgress(segmentId: string, currentTime: number, duration: number): void {
    const analytics = this.analytics.get(segmentId);
    if (!analytics) return;
    
    const segmentDuration = analytics.endTime - analytics.startTime;
    const watchedInSegment = Math.min(currentTime - analytics.startTime, segmentDuration);
    const completionRate = Math.min((watchedInSegment / segmentDuration) * 100, 100);
    
    analytics.watchedDuration = Math.max(analytics.watchedDuration, watchedInSegment);
    analytics.completionRate = completionRate;
    
    // Auto-complete segment if watched 90% or more
    if (completionRate >= 90 && !analytics.completed) {
      this.completeSegment(segmentId);
    }
  }

  /**
   * Complete a video segment
   */
  completeSegment(segmentId: string): void {
    const analytics = this.analytics.get(segmentId);
    if (!analytics) return;
    
    const segmentStartTime = this.segmentStartTimes.get(segmentId);
    if (segmentStartTime) {
      const totalTime = Date.now() - segmentStartTime;
      analytics.watchedDuration = Math.max(analytics.watchedDuration, analytics.endTime - analytics.startTime);
      analytics.completionRate = 100;
      analytics.completed = true;
      
      console.log(`✅ Segment completed: ${segmentId} (${totalTime}ms)`);
      this.updateModuleAnalytics(analytics.videoId);
    }
  }

  /**
   * Track video pause
   */
  trackPause(segmentId: string): void {
    const analytics = this.analytics.get(segmentId);
    if (analytics) {
      analytics.pauseCount += 1;
    }
  }

  /**
   * Track video seek
   */
  trackSeek(segmentId: string): void {
    const analytics = this.analytics.get(segmentId);
    if (analytics) {
      analytics.seekCount += 1;
    }
  }

  /**
   * Track interaction completion
   */
  trackInteraction(segmentId: string, interactionId: string, completed: boolean = true): void {
    const analytics = this.analytics.get(segmentId);
    if (analytics && completed) {
      analytics.interactionsCompleted += 1;
      console.log('Activity completed:', { pauseId: interactionId, response: 'completed' });
    }
  }

  /**
   * Complete entire video module
   */
  completeVideo(videoId: string): VideoModuleAnalytics {
    const videoSegments = Array.from(this.analytics.values())
      .filter(a => a.videoId === videoId);
    
    const totalTime = videoSegments.reduce((sum, s) => sum + (s.endTime - s.startTime), 0);
    const watchedTime = videoSegments.reduce((sum, s) => sum + s.watchedDuration, 0);
    const completionRate = totalTime > 0 ? (watchedTime / totalTime) * 100 : 0;
    const segmentsCompleted = videoSegments.filter(s => s.completed).length;
    const totalSegments = videoSegments.length;
    const interactionsCompleted = videoSegments.reduce((sum, s) => sum + s.interactionsCompleted, 0);
    const pauseCount = videoSegments.reduce((sum, s) => sum + s.pauseCount, 0);
    const seekCount = videoSegments.reduce((sum, s) => sum + s.seekCount, 0);
    const averageSegmentTime = segmentsCompleted > 0 
      ? videoSegments.filter(s => s.completed).reduce((sum, s) => sum + s.watchedDuration, 0) / segmentsCompleted
      : 0;

    const moduleAnalytics: VideoModuleAnalytics = {
      videoId,
      totalTime,
      watchedTime,
      completionRate,
      segmentsCompleted,
      totalSegments,
      interactionsCompleted,
      pauseCount,
      seekCount,
      averageSegmentTime
    };

    this.moduleAnalytics.set(videoId, moduleAnalytics);
    console.log('🎬 Video completed:', videoId, moduleAnalytics);
    
    return moduleAnalytics;
  }

  /**
   * Update module analytics for a specific video
   */
  private updateModuleAnalytics(videoId: string): void {
    if (this.moduleAnalytics.has(videoId)) {
      this.completeVideo(videoId);
    }
  }

  /**
   * Get analytics for a specific segment
   */
  getSegmentAnalytics(segmentId: string): VideoSegmentAnalytics | null {
    return this.analytics.get(segmentId) || null;
  }

  /**
   * Get analytics for a specific video
   */
  getVideoAnalytics(videoId: string): VideoModuleAnalytics | null {
    return this.moduleAnalytics.get(videoId) || null;
  }

  /**
   * Get all segment analytics for a video
   */
  getVideoSegments(videoId: string): VideoSegmentAnalytics[] {
    return Array.from(this.analytics.values())
      .filter(a => a.videoId === videoId);
  }

  /**
   * Export analytics data
   */
  exportAnalytics(): {
    segments: VideoSegmentAnalytics[];
    modules: VideoModuleAnalytics[];
  } {
    return {
      segments: Array.from(this.analytics.values()),
      modules: Array.from(this.moduleAnalytics.values())
    };
  }

  /**
   * Clear all analytics data
   */
  clearAnalytics(): void {
    this.analytics.clear();
    this.moduleAnalytics.clear();
    this.startTimes.clear();
    this.segmentStartTimes.clear();
  }
}

// Export singleton instance
export const videoAnalyticsRedesign = new VideoAnalyticsRedesign();

// Video Segment Definitions for "What is AI?" Module Redesign
export const redesignedVideoSegments = {
  // Video 1: Introduction to AI - Segment 1 (0:00 - 0:59)
  'intro-segment-1': {
    id: 'intro-segment-1',
    videoId: 'intro-ai',
    title: 'Introduction to AI',
    videoPath: 'Videos/1 Introduction to Artificial Intelligence.mp4',
    startTime: 0,
    endTime: 59,
    pausePoints: [
      {
        timestamp: 59,
        type: 'reflection',
        question: "Think about your day so far. Can you identify 3 ways you've already interacted with AI today? Share your examples.",
        promptType: 'daily-ai',
        required: true
      }
    ]
  },

  // Video 1: Introduction to AI - Segment 2 (0:59 - 1:17)
  'intro-segment-2': {
    id: 'intro-segment-2',
    videoId: 'intro-ai',
    title: 'What is AI?',
    videoPath: 'Videos/1 Introduction to Artificial Intelligence.mp4',
    startTime: 59,
    endTime: 77,
    pausePoints: [
      {
        timestamp: 77,
        type: 'question',
        question: "What exactly is artificial intelligence?",
        promptType: 'ai-definition'
      }
    ]
  },

  // Video 2: History of AI (Full video)
  'history-complete': {
    id: 'history-complete',
    videoId: 'history-ai',
    title: 'History of AI',
    videoPath: 'Videos/History of AI.mp4',
    startTime: 0,
    endTime: -1, // Full video
    pausePoints: [
      // Will be dynamically added based on video content analysis
    ]
  },

  // Video 1: Introduction to AI - Segment 3 (2:22 - end)
  'intro-segment-3': {
    id: 'intro-segment-3',
    videoId: 'intro-ai',
    title: 'Closing Concepts',
    videoPath: 'Videos/1 Introduction to Artificial Intelligence.mp4',
    startTime: 142, // 2:22
    endTime: -1, // End of video
    pausePoints: []
  }
};

/**
 * Initialize analytics tracking for the redesigned module
 */
export const initializeRedesignAnalytics = (): void => {
  console.log('🚀 Initializing Redesigned Video Analytics System');
  
  // Pre-register all video segments
  Object.values(redesignedVideoSegments).forEach(segment => {
    videoAnalyticsRedesign.startSegment(
      segment.id,
      segment.videoId,
      segment.startTime,
      segment.endTime === -1 ? 999999 : segment.endTime
    );
  });
  
  console.log('✅ Analytics system initialized with', Object.keys(redesignedVideoSegments).length, 'segments');
};