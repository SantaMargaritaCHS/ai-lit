import { storage } from '@/lib/firebase';
import { ref, getDownloadURL, uploadBytes, listAll } from 'firebase/storage';

export const getVideoUrl = async (videoPath: string): Promise<string> => {
  try {
    const storageRef = ref(storage, videoPath);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error getting video URL:', error);
    throw new Error(`Failed to load video: ${videoPath}`);
  }
};

export const videoSources = {
  intro: 'Videos/1 Introduction to Artificial Intelligence.mp4',
  history: 'Videos/History of AI.mp4',
  promptBasics: 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2F6%20Introduction%20to%20Basic%20Prompting.mp4?alt=media&token=175e4307-5f08-46f8-b16c-389eff862d26',
  rtfFramework: 'https://firebasestorage.googleapis.com/v0/b/ai-literacy-platform-175d4.firebasestorage.app/o/Videos%2F7%20Prompting%20Framework%20-%20RTF.mp4?alt=media&token=995f2130-5c61-4779-b5fb-d83a059af78d'
};

// Upload video to Firebase Storage
export const uploadVideo = async (file: File, videoPath: string): Promise<string> => {
  try {
    const storageRef = ref(storage, videoPath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
};

// List all videos in a directory
export const listVideos = async (directory: string = 'Videos'): Promise<{ name: string; url: string }[]> => {
  try {
    const storageRef = ref(storage, directory);
    const result = await listAll(storageRef);
    
    const videos = await Promise.all(
      result.items.map(async (item) => ({
        name: item.name,
        url: await getDownloadURL(item)
      }))
    );
    
    return videos;
  } catch (error) {
    console.error('Error listing videos:', error);
    return [];
  }
};

// Video utilities
export const VideoUtils = {
  // Get video duration (requires HTML video element)
  getDuration: (videoUrl: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.onerror = () => reject(new Error('Failed to load video metadata'));
      video.src = videoUrl;
    });
  },

  // Check if video exists
  exists: async (videoPath: string): Promise<boolean> => {
    try {
      await getVideoUrl(videoPath);
      return true;
    } catch {
      return false;
    }
  },

  // Format video path for consistent naming
  formatPath: (moduleName: string, videoName: string): string => {
    return `Videos/${moduleName}/${videoName}`;
  }
};