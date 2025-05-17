/**
 * Formats duration in seconds to a human-readable time string
 * @param {number} totalSeconds - Duration in seconds
 * @returns {string} Formatted time string (e.g. "1:30" or "1:23:45")
 */
export const formatDuration = (totalSeconds) => {
  if (!totalSeconds) return "0:00";
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Pad single digit numbers with leading zero
  const padNumber = (num) => num.toString().padStart(2, "0");
  
  if (hours > 0) {
    return `${hours}:${padNumber(minutes)}:${padNumber(seconds)}`;
  }
  
  return `${minutes}:${padNumber(seconds)}`;
};

/**
 * Formats a timestamp in MM:SS format to total seconds
 * @param {string} timestamp - Time in MM:SS format
 * @returns {number} Total seconds
 */
export const timestampToSeconds = (timestamp) => {
  if (!timestamp) return 0;
  
  const [minutes, seconds] = timestamp.split(":").map(Number);
  return minutes * 60 + seconds;
};

/**
 * Formats progress percentage to a decimal between 0 and 1
 * @param {number} current - Current time in seconds
 * @param {number} total - Total duration in seconds
 * @returns {number} Progress value between 0 and 1
 */
export const formatProgress = (current, total) => {
  if (!current || !total) return 0;
  return Math.min(Math.max(current / total, 0), 1);
};