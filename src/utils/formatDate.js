// utils/formatDate.js
import { format } from 'date-fns';

const formatDate = (timestamp) => {
  const now = new Date();
  const updated = new Date(timestamp);
  const diffInSeconds = Math.floor((now - updated) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec${diffInSeconds > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) { // less than 7 days
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return format(updated, 'dd MMM yyyy'); // Example: 16 Aug 2025
  }
};

export default formatDate;
