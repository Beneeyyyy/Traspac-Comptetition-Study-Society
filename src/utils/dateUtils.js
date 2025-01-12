export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ' tahun yang lalu';
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' bulan yang lalu';
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' hari yang lalu';
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' jam yang lalu';
  }

  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' menit yang lalu';
  }

  if (seconds < 10) return 'baru saja';

  return Math.floor(seconds) + ' detik yang lalu';
}; 