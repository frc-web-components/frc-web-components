export default function uploadImage() {
  return new Promise((resolve) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (ev) => {
      const { files } = fileInput;

      if (files.length < 1) {
        resolve({
          path: null,
          cancelled: true,
        });
      } else {
        resolve({
          path: files.item(0).path ?? '',
          cancelled: false,
        });
      }
    };

    const evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    fileInput.dispatchEvent(evt);
  });
}
