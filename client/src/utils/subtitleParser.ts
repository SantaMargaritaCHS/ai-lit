export interface Subtitle {
  start: number;
  end: number;
  text: string;
}

// Alias for compatibility with existing code
export type SubtitleCue = Subtitle;

export function parseSRT(srtText: string): Subtitle[] {
  console.log('🔧 Parsing SRT content, length:', srtText.length);
  
  // Normalize line endings and clean up
  const normalizedSRT = srtText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  
  // Split by double newline or sequence number patterns
  const subtitleBlocks = normalizedSRT.split(/\n\s*\n/).filter(block => block.trim().length > 0);
  
  console.log('🔧 Found subtitle blocks:', subtitleBlocks.length);
  
  const subtitles = subtitleBlocks.map((block, index) => {
    const lines = block.trim().split('\n').filter(line => line.trim().length > 0);
    
    if (lines.length < 3) {
      console.warn('⚠️ Block', index, 'has insufficient lines:', lines.length);
      return null;
    }
    
    // Find the timeline (should be second line, but be flexible)
    let timeLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('-->')) {
        timeLineIndex = i;
        break;
      }
    }
    
    if (timeLineIndex === -1) {
      console.warn('⚠️ No timeline found in block:', lines);
      return null;
    }
    
    const timeLine = lines[timeLineIndex];
    const [startTime, endTime] = timeLine.split(' --> ').map(timeStr => timeToSeconds(timeStr.trim()));
    const text = lines.slice(timeLineIndex + 1).join(' ').trim();
    
    if (!text) {
      console.warn('⚠️ No text found in block:', lines);
      return null;
    }
    
    const subtitle = { start: startTime, end: endTime, text };
    if (index < 3) {
      console.log('🔧 Sample subtitle', index, ':', subtitle);
    }
    
    return subtitle;
  }).filter(Boolean) as Subtitle[];
  
  console.log('🔧 Successfully parsed', subtitles.length, 'subtitles');
  return subtitles;
}

export function getCurrentSubtitle(subtitles: Subtitle[], currentTime: number): string | null {
  const subtitle = subtitles.find(s => currentTime >= s.start && currentTime <= s.end);
  return subtitle?.text || null;
}

function timeToSeconds(timeString: string): number {
  const [hours, minutes, secondsWithMs] = timeString.split(':');
  const [seconds, milliseconds] = secondsWithMs.split(',');
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 1000;
}