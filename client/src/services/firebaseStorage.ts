import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

export class FirebaseStorageService {
  // Upload video file to Firebase Storage
  static async uploadVideo(file: File, moduleName: string, fileName?: string): Promise<string> {
    try {
      const fileExtension = file.name.split('.').pop();
      const sanitizedFileName = fileName || file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const videoPath = `videos/modules/${moduleName}/${sanitizedFileName}`;
      
      const storageRef = ref(storage, videoPath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  // Get video URL from Firebase Storage
  static async getVideoURL(moduleName: string, fileName: string): Promise<string> {
    try {
      const videoPath = `videos/modules/${moduleName}/${fileName}`;
      const storageRef = ref(storage, videoPath);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error getting video URL:', error);
      throw new Error('Video not found');
    }
  }

  // List all videos in a module
  static async listModuleVideos(moduleName: string): Promise<string[]> {
    try {
      const modulePath = `videos/modules/${moduleName}/`;
      const storageRef = ref(storage, modulePath);
      const result = await listAll(storageRef);
      
      const videoURLs = await Promise.all(
        result.items.map(async (item) => {
          return await getDownloadURL(item);
        })
      );
      
      return videoURLs;
    } catch (error) {
      console.error('Error listing videos:', error);
      return [];
    }
  }

  // Delete video from Firebase Storage
  static async deleteVideo(moduleName: string, fileName: string): Promise<void> {
    try {
      const videoPath = `videos/modules/${moduleName}/${fileName}`;
      const storageRef = ref(storage, videoPath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new Error('Failed to delete video');
    }
  }

  // Upload multiple videos for a module
  static async uploadModuleVideos(files: File[], moduleName: string): Promise<string[]> {
    try {
      const uploadPromises = files.map((file, index) => 
        this.uploadVideo(file, moduleName, `video_${index + 1}.${file.name.split('.').pop()}`)
      );
      
      const videoURLs = await Promise.all(uploadPromises);
      return videoURLs;
    } catch (error) {
      console.error('Error uploading multiple videos:', error);
      throw new Error('Failed to upload videos');
    }
  }
}

// Video metadata interface
export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  moduleName: string;
  fileName: string;
  url: string;
  duration?: number;
  thumbnailUrl?: string;
  uploadedAt: Date;
}

// Video management utilities
export const VideoUtils = {
  // Validate video file type
  isValidVideoFile: (file: File): boolean => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/mov', 'video/avi'];
    return validTypes.includes(file.type);
  },

  // Get video file size in MB
  getFileSizeMB: (file: File): number => {
    return Math.round((file.size / 1024 / 1024) * 100) / 100;
  },

  // Generate thumbnail from video file
  generateThumbnail: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        video.currentTime = 1; // Capture frame at 1 second
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          resolve(thumbnail);
        } else {
          reject(new Error('Failed to generate thumbnail'));
        }
      };

      video.onerror = () => reject(new Error('Error loading video'));
      
      video.src = URL.createObjectURL(file);
      video.load();
    });
  }
};