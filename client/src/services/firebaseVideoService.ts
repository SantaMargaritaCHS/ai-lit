import { storage } from '@/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

export class FirebaseVideoService {
  static async getVideoUrl(firebaseId: string): Promise<string> {
    try {
      const videoRef = ref(storage, firebaseId);
      const url = await getDownloadURL(videoRef);
      return url;
    } catch (error) {
      console.error('Error fetching video from Firebase:', error);
      throw new Error('Failed to load video');
    }
  }

  static async preloadVideo(firebaseId: string): Promise<void> {
    try {
      const url = await this.getVideoUrl(firebaseId);
      // Preload video for better performance
      const video = document.createElement('video');
      video.src = url;
      video.load();
    } catch (error) {
      console.error('Error preloading video:', error);
    }
  }

  static async trackVideoProgress(videoId: string, progress: number, userId?: string): Promise<void> {
    try {
      await fetch('/api/video-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || localStorage.getItem('userName') || 'anonymous',
          videoId,
          progress,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error tracking video progress:', error);
    }
  }
}