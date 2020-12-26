import { LitElement, html } from 'lit-element';


class RenameDialog extends LitElement {

  get properties() {
    return {
      wom: { type: Object }
    };
  }

  constructor() {
    super();
  }

  open() {
    const renameDialog = this.shadowRoot.querySelector('[part=rename-dialog]');
    renameDialog.opened = true;
  }

  firstUpdated() {

    const wom = this.wom;
    const renameDialog = this.shadowRoot.querySelector('[part=rename-dialog]');
    
    renameDialog.renderer = function(root, dialog) {

      if (!root.firstElementChild) {


        const div = window.document.createElement('div');
        div.innerHTML = `
          <style>
            .rename-dialog-content {
              width: 250px;
            }

            .rename-dialog-content p {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 5px;
            }

            .rename-dialog-content vaadin-text-field {
              width: 100%;
            }

            .rename-dialog-buttons {
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
            }

            .rename-dialog-buttons vaadin-button {
              margin-left: 5px;
            }
          </style>
          <div class="rename-dialog-content">
            <p>Rename Layout</p>
            <vaadin-text-field label="Name" theme="small"></vaadin-text-field>
            <div class="rename-dialog-buttons">
              <vaadin-button part="confirm-button" theme="success primary small">Confirm</vaadin-button>
              <vaadin-button part="close-button" theme="small">Close</vaadin-button>
            </div>
          </div>
        `;
        const closeButton = div.querySelector('[part=close-button]');
        closeButton.addEventListener('click', function() {
          renameDialog.opened = false;
        });

        const nameInput = div.querySelector('vaadin-text-field');
        const confirmButton = div.querySelector('[part=confirm-button]');
        confirmButton.addEventListener('click', function() {
          wom.executeAction('renameLayout', { name: nameInput.value });
        });
        root.appendChild(div);
      }

      const nameInput = root.querySelector('.rename-dialog-content vaadin-text-field');
      nameInput.value = wom.layout.getOpenedLayoutName();
    }
  }

  render() {
    return html`
      <vaadin-dialog part="rename-dialog"></vaadin-dialog>
    `;
  }
}

customElements.define('dashboard-rename-dialog', RenameDialog);