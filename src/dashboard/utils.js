
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

/**
 * https://stackoverflow.com/a/41553494
 * 
 * function to save JSON to file from browser
 * adapted from http://bgrins.github.io/devtools-snippets/#console-save
 * @param {Object} data -- json object to save
 * @param {String} file -- file name to save to 
 */
export const saveJson = (data, filename = 'layout.json') => {

  data = JSON.stringify(data, undefined, 2);
  const blob = new Blob([data], {type: 'text/json'});
  const a = document.createElement('a')

  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
  const evt = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window
  });
  a.dispatchEvent(evt);
}

window.saveJson = saveJson;

