export function throttle(callback, time) {
  let isReady = true;
  let currentTime = time;
  const timeoutIds = new Set();

  return {
    reset() {
      isReady = true;
      timeoutIds.forEach(clearTimeout);
    },
    setTime(newTime) {
      currentTime = newTime;
    },
    throttledCallback() {
      if (!isReady) {
        return;
      }
      isReady = false;
      callback.apply(this, [...arguments]);
      const timeoutId = setTimeout(() => {
        isReady = true;
        timeoutIds.delete(timeoutId);
      }, currentTime);
      timeoutIds.add(timeoutId);
    },
  };
}
