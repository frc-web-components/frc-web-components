import { LitElement, html } from 'lit-element';
const beautify = require('js-beautify').js;
import { addExtension } from '../../db';

function beautifyCode(code) {
  try {
    return beautify(code, { indent_with_tabs: true, space_in_empty_paren: true });
  } catch(e) {
    return code;
  }
}

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

            .file-from-url {
              margin-top: 5px;
            }

            .upload-file {
              margin: 15px 0 5px;
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

            label {
              color: var(--lumo-secondary-text-color);
              font-size: var(--lumo-font-size-xs);
              font-family: var(--lumo-font-family);
              font-weight: 500;
              margin-top: var(--lumo-space-m);
              margin-left: calc(var(--lumo-border-radius) / 4);
              margin-bottom: var(--lumo-space-xs);
              transition: color 0.4s;
              line-height: 1.333;
            }

            juicy-ace-editor {
              height: 200px;
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
                  <vaadin-text-field id="url" theme="small" label="URL" placeholder="Enter extension URL">
                    <vaadin-button id="go" theme="primary contrast" slot="suffix">Go</vaadin-button>
                  </vaadin-text-field>
                </div>
              </div>
              <vaadin-form-layout>
                <vaadin-text-field required error-message="Please enter a name" id="name" theme="small" label="Name" colspan="1"></vaadin-text-field>
                <vaadin-number-field required error-message="Please enter a version number" id="version" theme="small" label="Version" value="1.0" colspan="1"></vaadin-number-field>
                <vaadin-text-area id="description" theme="small" label="Description" colspan="2" value="Just another extension"></vaadin-text-area>
              </vaadin-form-layout>
              <label slot="label" for="code">Code</label>
              <juicy-ace-editor
                id="code"
                mode="ace/mode/javascript"
                theme="ace/theme/monokai"
              ></juicy-ace-editor>
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
        const urlField = div.querySelector('#url');
        const codeField = div.querySelector('#code');
        const confirmButton = div.querySelector('[part=confirm-button]');

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
              nameField.value = name;
              versionField.value = version;
              descField.value = description;

              const entire = code.toString();
              var body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
              codeField.value = beautifyCode(body);
            }
            catch(e) {
              console.error(e);
            }
          }
    
          reader.readAsText(files.item(0));
        };

        goButton.onclick = () => {
          const Http = new XMLHttpRequest();
          const url = urlField.value;
          Http.open("GET", url);
          Http.send();

          Http.onreadystatechange = (e) => {
            try {
              const javascript = Http.responseText;
              const getExtension = new Function(`${javascript}; return extension;`);
              const { name, version, description, code } = getExtension();
              nameField.value = name;
              versionField.value = version;
              descField.value = description;

              const entire = code.toString();
              var body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
              codeField.value = beautifyCode(body);

            } catch(e) {}
          }
        };

        confirmButton.onclick = () => {
          if (nameField.validate() && versionField.validate()) {
            addExtension({
              name: nameField.value,
              version: parseFloat(versionField.value),
              description: descField.value,
              code: codeField.value
            });
            addExtensionDialog.opened = false;
          }
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

      const nameField = root.querySelector('#name');
      const versionField = root.querySelector('#version');
      const descField = root.querySelector('#description');
      const fileInput = root.querySelector('#myFile');
      const urlField = root.querySelector('#url');
      const codeField = root.querySelector('#code');

      nameField.value = '';
      versionField.value = '';
      descField.value = '';
      fileInput.value = '';
      urlField.value = '';
      codeField.value = '';

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