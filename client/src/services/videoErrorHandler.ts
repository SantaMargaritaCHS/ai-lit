import { videoAnalytics } from './videoAnalytics';

export interface VideoError {
  code: number;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userMessage: string;
  solutions: string[];
  fallbackOptions: string[];
}

export interface VideoErrorContext {
  videoUrl: string;
  segmentId: string;
  timestamp: number;
  userId?: string;
  userAgent: string;
  networkType?: string;
  connectionSpeed?: string;
}

class VideoErrorHandler {
  private errorHistory: Array<VideoError & VideoErrorContext> = [];
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries = 3;

  // Comprehensive error mapping
  private getErrorDetails(error: MediaError | Error): VideoError {
    if (error instanceof MediaError) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          return {
            code: 1,
            message: 'Media playback aborted by user',
            severity: 'low',
            userMessage: 'Video playback was stopped. You can restart it anytime.',
            solutions: ['Click play to restart video', 'Refresh the page if issues persist'],
            fallbackOptions: ['Try alternative video format', 'Download video for offline viewing']
          };

        case MediaError.MEDIA_ERR_NETWORK:
          return {
            code: 2,
            message: 'Network error during media loading',
            severity: 'high',
            userMessage: 'Connection issue detected. Checking your internet connection...',
            solutions: [
              'Check your internet connection',
              'Try switching to a different network',
              'Wait a moment and try again'
            ],
            fallbackOptions: [
              'Switch to lower quality video',
              'Download transcript for reading',
              'Access mobile-optimized version'
            ]
          };

        case MediaError.MEDIA_ERR_DECODE:
          return {
            code: 3,
            message: 'Media decode error',
            severity: 'high',
            userMessage: 'Video format issue. Trying alternative version...',
            solutions: [
              'Switch to different video quality',
              'Try a different browser',
              'Clear browser cache and reload'
            ],
            fallbackOptions: [
              'Use alternative video format',
              'Download video for external player',
              'Access audio-only version'
            ]
          };

        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          return {
            code: 4,
            message: 'Media source not supported',
            severity: 'critical',
            userMessage: 'Video format not supported by your browser.',
            solutions: [
              'Update your browser to the latest version',
              'Try a different browser (Chrome, Firefox, Safari)',
              'Enable hardware acceleration'
            ],
            fallbackOptions: [
              'Use alternative video player',
              'Download video for local playback',
              'Access content in different format'
            ]
          };

        default:
          return {
            code: 0,
            message: 'Unknown media error',
            severity: 'medium',
            userMessage: 'Unexpected playback issue occurred.',
            solutions: ['Refresh the page', 'Try again in a few moments'],
            fallbackOptions: ['Contact support', 'Try alternative browser']
          };
      }
    }

    // Handle general errors
    return {
      code: 999,
      message: error.message || 'Unknown error',
      severity: 'medium',
      userMessage: 'Video player encountered an issue.',
      solutions: ['Refresh the page', 'Check your internet connection'],
      fallbackOptions: ['Try alternative viewing method', 'Contact support']
    };
  }

  // Enhanced error handling with context
  handleVideoError(
    error: MediaError | Error, 
    context: VideoErrorContext,
    onRetry?: () => void,
    onFallback?: (option: string) => void
  ): VideoError {
    const errorDetails = this.getErrorDetails(error);
    const errorWithContext = { ...errorDetails, ...context };
    
    // Log error to history
    this.errorHistory.push(errorWithContext);
    
    // Track error in analytics
    videoAnalytics.segmentStarted(context.segmentId, context.userId);
    
    // Log to external error tracking (if configured)
    this.logToErrorService(errorWithContext);
    
    // Determine retry strategy
    const retryKey = `${context.videoUrl}_${context.segmentId}`;
    const currentRetries = this.retryAttempts.get(retryKey) || 0;
    
    if (currentRetries < this.maxRetries && this.shouldRetry(errorDetails)) {
      this.retryAttempts.set(retryKey, currentRetries + 1);
      setTimeout(() => {
        console.log(`🔄 Retrying video load (attempt ${currentRetries + 1}/${this.maxRetries})`);
        onRetry?.();
      }, this.getRetryDelay(currentRetries));
    } else {
      // Max retries reached, offer fallback options
      console.log('🚫 Max retries reached, offering fallback options');
      this.offerFallbackOptions(errorDetails, onFallback);
    }
    
    return errorDetails;
  }

  // Intelligent retry strategy
  private shouldRetry(error: VideoError): boolean {
    return error.severity !== 'critical' && 
           ['low', 'medium', 'high'].includes(error.severity);
  }

  private getRetryDelay(attemptNumber: number): number {
    // Exponential backoff: 1s, 3s, 9s
    return Math.pow(3, attemptNumber) * 1000;
  }

  // Fallback option handling
  private offerFallbackOptions(error: VideoError, onFallback?: (option: string) => void) {
    if (error.fallbackOptions.length > 0 && onFallback) {
      // Automatically try the first fallback option
      onFallback(error.fallbackOptions[0]);
    }
  }

  // Error analytics and reporting
  private async logToErrorService(error: VideoError & VideoErrorContext) {
    try {
      // Log to backend analytics
      await fetch('/api/video-errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...error,
          browserInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled
          },
          networkInfo: {
            connection: (navigator as any).connection || null,
            onLine: navigator.onLine
          },
          timestamp: new Date().toISOString()
        })
      });
    } catch (logError) {
      console.warn('Failed to log video error:', logError);
    }
  }

  // Network diagnostics
  async performNetworkDiagnostics(): Promise<{
    speed: string;
    latency: number;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
  }> {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/ping', { method: 'HEAD' });
      const endTime = performance.now();
      
      const latency = endTime - startTime;
      let quality: 'excellent' | 'good' | 'fair' | 'poor';
      
      if (latency < 100) quality = 'excellent';
      else if (latency < 300) quality = 'good';
      else if (latency < 800) quality = 'fair';
      else quality = 'poor';
      
      return {
        speed: this.getConnectionSpeed(),
        latency,
        quality
      };
    } catch {
      return {
        speed: 'unknown',
        latency: -1,
        quality: 'poor'
      };
    }
  }

  private getConnectionSpeed(): string {
    const connection = (navigator as any).connection;
    if (connection) {
      return `${connection.effectiveType || 'unknown'} (${connection.downlink || 'unknown'}Mbps)`;
    }
    return 'unknown';
  }

  // Recovery suggestions based on error patterns
  getRecoverySuggestions(segmentId: string): string[] {
    const segmentErrors = this.errorHistory.filter(e => e.segmentId === segmentId);
    
    if (segmentErrors.length === 0) return [];
    
    const networkErrors = segmentErrors.filter(e => e.code === 2);
    const decodeErrors = segmentErrors.filter(e => e.code === 3);
    
    const suggestions: string[] = [];
    
    if (networkErrors.length > 1) {
      suggestions.push('Multiple network issues detected. Consider downloading content for offline viewing.');
    }
    
    if (decodeErrors.length > 0) {
      suggestions.push('Video format issues detected. Try using a different browser or update your current one.');
    }
    
    return suggestions;
  }

  // Clear error history for segment
  clearErrorHistory(segmentId?: string) {
    if (segmentId) {
      this.errorHistory = this.errorHistory.filter(e => e.segmentId !== segmentId);
      this.retryAttempts.delete(segmentId);
    } else {
      this.errorHistory = [];
      this.retryAttempts.clear();
    }
  }

  // Get error summary for analytics
  getErrorSummary() {
    const totalErrors = this.errorHistory.length;
    const errorsByType = this.errorHistory.reduce((acc, error) => {
      acc[error.code] = (acc[error.code] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const criticalErrors = this.errorHistory.filter(e => e.severity === 'critical').length;
    
    return {
      totalErrors,
      errorsByType,
      criticalErrors,
      successRate: totalErrors > 0 ? ((totalErrors - criticalErrors) / totalErrors) * 100 : 100
    };
  }
}

// Export singleton instance
export const videoErrorHandler = new VideoErrorHandler();

// Legacy interface for backward compatibility  
export const handleVideoError = (
  error: MediaError | Error,
  context: Partial<VideoErrorContext> = {}
) => {
  const fullContext: VideoErrorContext = {
    videoUrl: '',
    segmentId: 'unknown',
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    ...context
  };
  
  return videoErrorHandler.handleVideoError(error, fullContext);
};