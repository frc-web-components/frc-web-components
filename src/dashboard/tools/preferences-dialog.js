import { LitElement, html } from 'lit-element';
import { getSourceProvider } from '@webbitjs/store';

class PreferencesDialog extends LitElement {

  open() {
    const dialog = this.shadowRoot.querySelector('[part=preferences-dialog]');
    dialog.opened = true;
  }

  firstUpdated() {
    const halsimProvider = getSourceProvider('HALSim');
    const preferencesDialog = this.shadowRoot.querySelector('[part=preferences-dialog]');
    
    preferencesDialog.renderer = function(root, dialog) {

      if (!root.firstElementChild) {


        const div = window.document.createElement('div');
        div.innerHTML = `
          <style>
            .preferences-dialog-content {
              width: 250px;
            }

            .preferences-dialog-content p {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 5px;
            }

            .preferences-dialog-content vaadin-text-field {
              width: 100%;
            }

            .preferences-dialog-buttons {
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
            }

            .preferences-dialog-buttons vaadin-button {
              margin-left: 5px;
            }
          </style>
          <div class="preferences-dialog-content">
            <p>Connection Settings</p>
            <vaadin-text-field label="Server" theme="small"></vaadin-text-field>
            <div class="preferences-dialog-buttons">
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
          localStorage.robotAddress = serverInput.value;
          halsimProvider.setAddress(localStorage.robotAddress);
        });
        root.appendChild(div);
      }

      const serverInput = root.querySelector('.preferences-dialog-content vaadin-text-field');
      serverInput.value = localStorage.robotAddress;
    }
  }

  render() {
    return html`
      <vaadin-dialog part="preferences-dialog"></vaadin-dialog>
    `;
  }
}

customElements.define('dashboard-preferences-dialog', PreferencesDialog);