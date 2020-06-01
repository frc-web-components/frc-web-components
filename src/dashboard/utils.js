
const inRange = (x, min, max) => {
  return x > min && x < max;
};

export const isElementInViewport = (el, container) => {

  if (!el || !container) {
    return true;
  }

  const rect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const containedVertically = (
    inRange(rect.y, containerRect.y, containerRect.bottom) ||
    inRange(rect.bottom, containerRect.y, containerRect.bottom)
  );

  const containedHorizontally = (
    inRange(rect.x, containerRect.x, containerRect.right) ||
    inRange(rect.right, containerRect.x, containerRect.right)
  );

  return containedVertically && containedHorizontally;
}