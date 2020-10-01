
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
  const a = document.createElement('a');

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

/**
 * function to save HTML to file from browser
 * adapted from http://bgrins.github.io/devtools-snippets/#console-save
 * @param {Object} html -- html to save
 * @param {String} file -- file name to save to 
 */
export const saveHtml = (html, filename = 'layout.html') => {
  const blob = new Blob([html], {type: 'text/html'});
  const a = document.createElement('a');

  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl =  ['text/html', a.download, a.href].join(':');
  const evt = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window
  });
  a.dispatchEvent(evt);
}

export const loadJson = () => {
  return new Promise(resolve => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/JSON';

    fileInput.onchange = () => {
      const { files } = fileInput;

      if (files.length < 1) {
        resolve({
          result: {},
          cancelled: true,
          error: false,
        });
      }

      const reader = new FileReader();

      reader.onload = (e) => { 
        try {
          const result = JSON.parse(e.target.result);
          resolve({
            result,
            cancelled: false,
            error: false,
          });
        }
        catch(e) {
          resolve({
            result: {},
            cancelled: false,
            error: true,
          });
        }
      }

      reader.readAsText(files.item(0));
    };

    const evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });
    fileInput.dispatchEvent(evt);
  });
};

export const loadHtml = () => {
  return new Promise(resolve => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/HTML';

    fileInput.onchange = () => {
      const { files } = fileInput;

      if (files.length < 1) {
        resolve({
          result: {},
          cancelled: true,
          error: false,
        });
      }

      const reader = new FileReader();

      reader.onload = (e) => { 
        try {
          const result = e.target.result;
          resolve({
            result,
            cancelled: false,
            error: false,
          });
        }
        catch(e) {
          resolve({
            result: '',
            cancelled: false,
            error: true,
          });
        }
      }

      reader.readAsText(files.item(0));
    };

    const evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });
    fileInput.dispatchEvent(evt);
  });
};

