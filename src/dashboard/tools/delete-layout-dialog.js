import { LitElement, html } from 'lit-element';


class DeleteLayoutDialog extends LitElement {

  get properties() {
    return {
      wom: { type: Object }
    };
  }

  open() {
    const dialog = this.shadowRoot.querySelector('[part=delete-layout-dialog]');
    dialog.opened = true;
  }

  firstUpdated() {
    const deleteLayoutDialog = this.shadowRoot.querySelector('[part=delete-layout-dialog]');
    const wom = this.wom;
    
    deleteLayoutDialog.renderer = function(root, dialog) {

      if (!root.firstElementChild) {


        const div = window.document.createElement('div');
        div.innerHTML = `
          <style>
            .delete-layout-dialog-content {
              width: 350px;
            }

            .delete-layout-dialog-content p {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 5px;
            }

            .checkbox-group-container {
              max-height: 300px;
              overflow: auto;
            }

            .delete-layout-dialog-content vaadin-checkbox-group {
              width: 100%;
              margin-bottom: 10px;
            }

            .delete-layout-dialog-buttons {
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
            }

            .delete-layout-dialog-buttons vaadin-button {
              margin-left: 5px;
            }
          </style>
          <div class="delete-layout-dialog-content">
            <p>Delete Layouts</p>
            <div class="checkbox-group-container">
              <vaadin-checkbox-group theme="vertical"></vaadin-checkbox-group>
            </div>
            <div class="delete-layout-dialog-buttons">
              <vaadin-button part="confirm-button" theme="success primary small">Delete</vaadin-button>
              <vaadin-button part="close-button" theme="small">Cancel</vaadin-button>
            </div>
          </div>
        `;
        const closeButton = div.querySelector('[part=close-button]');
        closeButton.addEventListener('click', function() {
          deleteLayoutDialog.opened = false;
        });

        const checkboxGroup = div.querySelector('vaadin-checkbox-group');
        const confirmButton = div.querySelector('[part=confirm-button]');
        confirmButton.addEventListener('click', function() {
          const layouts = checkboxGroup.value;
          wom.executeAction('deleteLayouts', { layouts });
          deleteLayoutDialog.opened = false;
        });
        root.appendChild(div);
      }

      const checkboxGroup = root.querySelector('.delete-layout-dialog-content vaadin-checkbox-group');
      checkboxGroup.innerHTML = '';
      wom.layout.getSavedLayoutNames().sort().forEach(layoutName => {
        const checkbox = window.document.createElement('vaadin-checkbox');
        checkbox.value = layoutName;
        checkbox.innerText = layoutName;
        checkboxGroup.appendChild(checkbox);
      });
    }
  }

  render() {
    return html`
      <vaadin-dialog part="delete-layout-dialog"></vaadin-dialog>
    `;
  }
}

customElements.define('dashboard-delete-layout-dialog', DeleteLayoutDialog);