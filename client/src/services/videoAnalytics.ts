// Video engagement tracking service
export interface VideoEngagementData {
  segmentId: string;
  userId?: string;
  timestamp: number;
  action: 'segment_started' | 'segment_completed' | 'interaction_started' | 'interaction_completed' | 'video_paused' | 'video_resumed' | 'seeking' | 'volume_changed';
  metadata?: {
    response?: string;
    totalTime?: number;
    completionRate?: number;
    seekTime?: number;
    volume?: number;
    interactionType?: string;
  };
}

export interface VideoCompletionMetrics {
  videoId: string;
  totalTime: number;
  completionRate: number;
  segmentsCompleted: number;
  totalSegments: number;
  interactionsCompleted: number;
  pauseCount: number;
  seekCount: number;
  averageSegmentTime: number;
}

class VideoAnalyticsService {
  private engagementData: VideoEngagementData[] = [];
  private sessionStartTime: number = Date.now();
  private currentSegmentStartTime: number = 0;
  private pauseCount: number = 0;
  private seekCount: number = 0;

  // Track when a video segment starts
  segmentStarted(segmentId: string, userId?: string) {
    this.currentSegmentStartTime = Date.now();
    const event: VideoEngagementData = {
      segmentId,
      userId,
      timestamp: Date.now(),
      action: 'segment_started'
    };
    
    this.engagementData.push(event);
    this.sendToAnalytics(event);
    console.log(`📊 Segment started: ${segmentId}`);
  }

  // Track segment completion
  segmentCompleted(segmentId: string, userId?: string) {
    const segmentTime = Date.now() - this.currentSegmentStartTime;
    const event: VideoEngagementData = {
      segmentId,
      userId,
      timestamp: Date.now(),
      action: 'segment_completed',
      metadata: {
        totalTime: segmentTime
      }
    };
    
    this.engagementData.push(event);
    this.sendToAnalytics(event);
    console.log(`✅ Segment completed: ${segmentId} (${segmentTime}ms)`);
  }

  // Track interactive element completion with user response
  interactionCompleted(segmentId: string, response: string, interactionType: string, userId?: string) {
    const event: VideoEngagementData = {
      segmentId,
      userId,
      timestamp: Date.now(),
      action: 'interaction_completed',
      metadata: {
        response,
        interactionType
      }
    };
    
    this.engagementData.push(event);
    this.sendToAnalytics(event);
    console.log(`🎯 Interaction completed: ${segmentId} - ${interactionType}`);
    
    // Store reflection responses for learning analytics
    this.storeReflectionResponse(segmentId, response, interactionType);
  }

  // Track video pause events
  videoPaused(segmentId: string, currentTime: number, userId?: string) {
    this.pauseCount++;
    const event: VideoEngagementData = {
      segmentId,
      userId,
      timestamp: Date.now(),
      action: 'video_paused',
      metadata: {
        totalTime: currentTime
      }
    };
    
    this.engagementData.push(event);
    this.sendToAnalytics(event);
  }

  // Track video resume events
  videoResumed(segmentId: string, currentTime: number, userId?: string) {
    const event: VideoEngagementData = {
      segmentId,
      userId,
      timestamp: Date.now(),
      action: 'video_resumed',
      metadata: {
        totalTime: currentTime
      }
    };
    
    this.engagementData.push(event);
    this.sendToAnalytics(event);
  }

  // Track seeking behavior
  seekPerformed(segmentId: string, seekTime: number, userId?: string) {
    this.seekCount++;
    const event: VideoEngagementData = {
      segmentId,
      userId,
      timestamp: Date.now(),
      action: 'seeking',
      metadata: {
        seekTime
      }
    };
    
    this.engagementData.push(event);
    this.sendToAnalytics(event);
  }

  // Track volume changes
  volumeChanged(segmentId: string, volume: number, userId?: string) {
    const event: VideoEngagementData = {
      segmentId,
      userId,
      timestamp: Date.now(),
      action: 'volume_changed',
      metadata: {
        volume
      }
    };
    
    this.engagementData.push(event);
    this.sendToAnalytics(event);
  }

  // Track complete video session
  videoCompleted(videoId: string, totalTime: number, completionRate: number, userId?: string) {
    const sessionDuration = Date.now() - this.sessionStartTime;
    const completedSegments = this.engagementData.filter(e => e.action === 'segment_completed').length;
    const totalSegments = new Set(this.engagementData.map(e => e.segmentId)).size;
    const completedInteractions = this.engagementData.filter(e => e.action === 'interaction_completed').length;
    const averageSegmentTime = completedSegments > 0 ? sessionDuration / completedSegments : 0;

    const metrics: VideoCompletionMetrics = {
      videoId,
      totalTime,
      completionRate,
      segmentsCompleted: completedSegments,
      totalSegments,
      interactionsCompleted: completedInteractions,
      pauseCount: this.pauseCount,
      seekCount: this.seekCount,
      averageSegmentTime
    };

    this.sendCompletionMetrics(metrics);
    console.log(`🎬 Video completed: ${videoId}`, metrics);
    
    // Reset session data
    this.resetSession();
  }

  // Get current session analytics
  getSessionAnalytics() {
    const currentTime = Date.now();
    const sessionDuration = currentTime - this.sessionStartTime;
    const completedSegments = this.engagementData.filter(e => e.action === 'segment_completed').length;
    const totalSegments = new Set(this.engagementData.map(e => e.segmentId)).size;
    
    return {
      sessionDuration,
      completedSegments,
      totalSegments,
      pauseCount: this.pauseCount,
      seekCount: this.seekCount,
      engagementEvents: this.engagementData.length
    };
  }

  // Send individual events to analytics endpoint
  private async sendToAnalytics(event: VideoEngagementData) {
    try {
      await fetch('/api/video-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Send completion metrics to analytics
  private async sendCompletionMetrics(metrics: VideoCompletionMetrics) {
    try {
      await fetch('/api/video-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics)
      });
    } catch (error) {
      console.error('Failed to send completion metrics:', error);
    }
  }

  // Store reflection responses for learning analytics
  private async storeReflectionResponse(segmentId: string, response: string, interactionType: string) {
    try {
      await fetch('/api/learning-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segmentId,
          response,
          interactionType,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to store reflection response:', error);
    }
  }

  // Reset session data
  private resetSession() {
    this.engagementData = [];
    this.sessionStartTime = Date.now();
    this.currentSegmentStartTime = 0;
    this.pauseCount = 0;
    this.seekCount = 0;
  }
}

// Export singleton instance
export const videoAnalytics = new VideoAnalyticsService();

// Legacy interface for backward compatibility
export const trackVideoEngagement = {
  segmentStarted: (segmentId: string, userId?: string) => {
    videoAnalytics.segmentStarted(segmentId, userId);
  },
  interactionCompleted: (segmentId: string, response: string, interactionType: string = 'reflection', userId?: string) => {
    videoAnalytics.interactionCompleted(segmentId, response, interactionType, userId);
  },
  videoCompleted: (videoId: string, totalTime: number, completionRate: number, userId?: string) => {
    videoAnalytics.videoCompleted(videoId, totalTime, completionRate, userId);
  }
};