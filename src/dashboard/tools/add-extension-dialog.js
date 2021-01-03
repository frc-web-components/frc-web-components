import { LitElement, html } from 'lit-element';
import { loadJavascript } from '../utils';


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

            .file-from-url vaadin-text-field {
              width: 100%;
              padding-bottom: 0;
              margin-bottom: 0;
            }

            .file-from-url vaadin-text-field::part(input-field) {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
              padding-right: 0;
            }

            .file-from-url vaadin-button {
              border-radius: 0;
              margin: 0;
              color: white;
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
                  <input type="file" accept="application/javascript" id="myFile">
                </div>
                <div class="file-from-url">
                  <vaadin-text-field theme="small" label="URL" placeholder="Enter extension URL">
                    <vaadin-button id="go" theme="primary contrast" slot="suffix">Go</vaadin-button>
                  </vaadin-text-field>
                </div>
              </div>
              <vaadin-form-layout>
                <vaadin-text-field id="name" theme="small" label="Name" colspan="1"></vaadin-text-field>
                <vaadin-number-field id="version" theme="small" label="Version" value="1.0" colspan="1"></vaadin-number-field>
                <vaadin-text-area id="description" theme="small" label="Description" colspan="2" value="Just another extension"></vaadin-text-area>
              </vaadin-form-layout>
            </div>
            <div class="add-extension-dialog-buttons">
              <vaadin-button part="confirm-button" theme="success primary small">Confirm</vaadin-button>
              <vaadin-button part="close-button" theme="small">Cancel</vaadin-button>
            </div>
          </div>
        `;
        const closeButton = div.querySelector('[part=close-button]');
        const tabContent = div.querySelector('[data-tab]');
        const tabs = div.querySelector('vaadin-tabs');
        const nameField = div.querySelector('#name');
        const versionField = div.querySelector('#version');
        const descField = div.querySelector('#description');
        const fileInput = div.querySelector('#myFile');
        const goButton = div.querySelector('#go');

        closeButton.addEventListener('click', function() {
          addExtensionDialog.opened = false;
        });

        tabs.addEventListener('selected-changed', () => {
          tabContent.setAttribute('data-tab', tabs.selected.toString());
        });

        fileInput.onchange = () => {

          const { files } = fileInput;
    
          const reader = new FileReader();
    
          reader.onload = (e) => { 
            try {
              const javascript = e.target.result;
              const getExtension = new Function(`${javascript}; return extension;`);
              const { name, version, description, code } = getExtension();
              console.log(name, version, description);
              nameField.value = name;
              versionField.value = version;
              descField.value = description;

              const entire = code.toString();
              var body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
              console.log('body:', body);

            }
            catch(e) {
              console.error(e);
            }
          }
    
          reader.readAsText(files.item(0));
        };

        goButton.onclick = () => {
          alert('go');
        };

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