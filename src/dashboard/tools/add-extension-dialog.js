import { LitElement, html } from 'lit-element';


class AddExtensionDialog extends LitElement {

  open() {
    const dialog = this.shadowRoot.querySelector('[part=add-extension-dialog]');
    dialog.opened = true;
  }

  firstUpdated() {
    const addExtensionDialog = this.shadowRoot.querySelector('[part=add-extension-dialog]');
    
    addExtensionDialog.renderer = function(root, dialog) {

      if (!root.firstElementChild) {


        const div = window.document.createElement('div');
        div.innerHTML = `
          <style>
            .add-extension-dialog-content {
              width: 450px;
            }

            .add-extension-dialog-content p {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 5px;
            }

            .add-extension-form-container {
              
            }

            .add-extension-dialog-buttons {
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
            }

            .add-extension-dialog-buttons vaadin-button {
              margin-left: 5px;
            }

            [data-tab="0"] .file-from-url {
              display: none;
            }

            [data-tab="1"] .upload-file {
              display: none;
            }

            .upload-file, .file-from-url {
              margin-top: 5px;
            }

            .extension-form {
              display: flex;
              flex-direction: column;
            }

            .extension-form-row {
              display: flex;
            }
          </style>
          <div class="add-extension-dialog-content">
            <p>Add Extension</p>
            <div class="add-extension-form-container">
              <vaadin-tabs theme="small">
                <vaadin-tab>Upload</vaadin-tab>
                <vaadin-tab>URL</vaadin-tab>
              </vaadin-tabs>
              <div data-tab="">
                <div class="upload-file">
                  <input type="file" id="myFile" name="filename">
                </div>
                <div class="file-from-url">
                  <vaadin-text-field theme="small" label="URL" placeholder="Enter extension URL"></vaadin-text-field>
                </div>
              </div>
              <div class="extension-form">
                <div class="extension-form-row">
                  <vaadin-text-field theme="small" label="Name"></vaadin-text-field>
                  <vaadin-number-field theme="small" label="Version" value="1.0"></vaadin-number-field>
                </div>
                <vaadin-checkbox>Enabled</vaadin-checkbox>
                <vaadin-text-area theme="small" label="Description"  value="Just another extension"></vaadin-text-area>
              </div>
            </div>
            <div class="add-extension-dialog-buttons">
              <vaadin-button part="confirm-button" theme="success primary small">Confirm</vaadin-button>
              <vaadin-button part="close-button" theme="small">Cancel</vaadin-button>
            </div>
          </div>
        `;
        const closeButton = div.querySelector('[part=close-button]');
        closeButton.addEventListener('click', function() {
          addExtensionDialog.opened = false;
        });

        // const listBox = div.querySelector('vaadin-list-box');
        // const confirmButton = div.querySelector('[part=confirm-button]');
        // confirmButton.addEventListener('click', function() {
        //   const item = listBox.children.item(listBox.selected);
        //   const layoutName = item.innerText;
        //   wom.executeAction('openLayout', { layoutName });
        //   openLayoutDialog.opened = false;
        // });
        root.appendChild(div);
      }

      // const listBox = root.querySelector('.open-layout-dialog-content vaadin-list-box');
      // listBox.innerHTML = '';
      // wom.layout.getSavedLayoutNames().sort().forEach(layoutName => {
      //   const item = window.document.createElement('vaadin-item');
      //   item.innerText = layoutName;
      //   listBox.appendChild(item);
      // });
      // listBox.selected = 0;
    }
  }

  render() {
    return html`
      <vaadin-dialog part="add-extension-dialog"></vaadin-dialog>
    `;
  }
}

customElements.define('dashboard-add-extension-dialog', AddExtensionDialog);