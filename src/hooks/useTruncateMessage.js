/**
 * Truncates a message to a specific length
 * @param {string} message - The message to truncate
 * @param {number} maxLength - Maximum length before truncation (default: 15)
 * @returns {string} - Truncated message with ellipsis if needed
 */
export const truncateMessage = (message, maxLength = 15) => {
    if (!message) return '';
    
    // Return the original message if it's shorter than maxLength
    if (message.length <= maxLength) {
      return message;
    }
    
    // Return truncated message with ellipsis
    return `${message.substring(0, maxLength)}...`;
  };