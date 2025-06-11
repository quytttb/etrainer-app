/**
 * Format seconds into HH:MM:SS or MM:SS format
 */
export const formatTime = (seconds: number): string => {
     const hours = Math.floor(seconds / 3600);
     const minutes = Math.floor((seconds % 3600) / 60);
     const secs = seconds % 60;

     if (hours > 0) {
          return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
     }
     return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatDuration = (seconds: number): string => {
     const hours = Math.floor(seconds / 3600);
     const minutes = Math.floor((seconds % 3600) / 60);

     if (hours > 0) {
          return `${hours}h ${minutes}m`;
     }
     return `${minutes}m`;
};

export const isLowTime = (timeRemaining: number, threshold: number = 300): boolean => {
     return timeRemaining <= threshold; // Default 5 minutes
}; 