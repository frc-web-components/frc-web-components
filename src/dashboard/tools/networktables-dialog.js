import { LitElement, html } from 'lit-element';
import { getSourceProvider } from '@webbitjs/store';

class NetworkTablesDialog extends LitElement {

  open() {
    const dialog = this.shadowRoot.querySelector('[part=networktables-dialog]');
    dialog.opened = true;
  }

  firstUpdated() {
    const networkTablesProvider = getSourceProvider('NetworkTables');
    const preferencesDialog = this.shadowRoot.querySelector('[part=networktables-dialog]');
    
    preferencesDialog.renderer = function(root, dialog) {

      if (!root.firstElementChild) {


        const div = window.document.createElement('div');
        div.innerHTML = `
          <style>
            .networktables-dialog-content {
              width: 250px;
            }

            .networktables-dialog-content p {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 5px;
            }

            .networktables-dialog-content vaadin-text-field {
              width: 100%;
            }

            .networktables-dialog-buttons {
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
            }

            .networktables-dialog-buttons vaadin-button {
              margin-left: 5px;
            }
          </style>
          <div class="networktables-dialog-content">
            <p>NetworkTables Settings</p>
            <vaadin-text-field label="Robot Address" theme="small"></vaadin-text-field>
            <div class="networktables-dialog-buttons">
              <vaadin-button part="confirm-button" theme="success primary small">Confirm</vaadin-button>
              <vaadin-button part="close-button" theme="small">Close</vaadin-button>
            </div>
          </div>
        `;
        const closeButton = div.querySelector('[part=close-button]');
        closeButton.addEventListener('click', function() {
          preferencesDialog.opened = false;
        });

        const serverInput = div.querySelector('vaadin-text-field');
        const confirmButton = div.querySelector('[part=confirm-button]');
        confirmButton.addEventListener('click', function() {
          networkTablesProvider.connect(serverInput.value);
        });
        root.appendChild(div);
      }

      const serverInput = root.querySelector('.networktables-dialog-content vaadin-text-field');
      serverInput.value = localStorage.networkTablesAddress;
    }
  }

  render() {
    return html`
      <vaadin-dialog part="networktables-dialog"></vaadin-dialog>
    `;
  }
}

customElements.define('dashboard-networktables-dialog', NetworkTablesDialog);