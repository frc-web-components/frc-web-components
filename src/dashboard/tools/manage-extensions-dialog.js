import { LitElement, html } from 'lit-element';
import { getExtensions } from '../../db';


class ManageExtensionsTable extends LitElement {

  constructor() {
    super();
    this.extensions = [];
  }


  async firstUpdated() {
    try {
      this.extensions = await getExtensions();
      const grid = this.shadowRoot.querySelector('vaadin-grid');
      grid.items = this.extensions.map(extension => ({
        ...extension,
        version: extension.version.toFixed(1)
      }));
      console.log('extensions:', this.extensions);
    } catch(e) {
      console.error(e.message);
    }
  }

  render() {
    return html`
      <vaadin-grid>
        <vaadin-grid-column path="name" header="Name"></vaadin-grid-column>
        <vaadin-grid-column path="version" header="Version"></vaadin-grid-column>
      </vaadin-grid>
    `;
  }
}

customElements.define('dashboard-manage-extensions-table', ManageExtensionsTable);

class ManageExtensionsDialog extends LitElement {

  get properties() {
    return {
      wom: { type: Object }
    };
  }

  open() {
    const dialog = this.shadowRoot.querySelector('[part=manage-extensions-dialog]');
    dialog.opened = true;
  }

  firstUpdated() {
    const manageExtensionsDialog = this.shadowRoot.querySelector('[part=manage-extensions-dialog]');
    const wom = this.wom;
    
    manageExtensionsDialog.renderer = function(root, dialog) {

      if (!root.firstElementChild) {


        const div = window.document.createElement('div');
        div.innerHTML = `
          <style>
            .manage-extensions-dialog-content {
              width: 600px;
            }

            .manage-extensions-dialog-content p {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 5px;
            }

            .manage-extensions-dialog-content dashboard-manage-extensions-table {
              width: 100%;
              margin-bottom: 10px;
            }

            .manage-extensions-dialog-buttons {
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
            }

            .manage-extensions-dialog-buttons vaadin-button {
              margin-left: 5px;
            }
          </style>
          <div class="manage-extensions-dialog-content">
            <p>Manage Extensions</p>
            <div class="table-container"></div>
            <div class="manage-extensions-dialog-buttons">
              <vaadin-button part="add-extension-button" theme="success primary small">Add Extension</vaadin-button>
              <vaadin-button part="close-button" theme="small">Close</vaadin-button>
            </div>
          </div>
        `;
        const closeButton = div.querySelector('[part=close-button]');
        closeButton.addEventListener('click', function() {
          manageExtensionsDialog.opened = false;
        });

        const addExtensionButton = div.querySelector('[part=add-extension-button]');
        addExtensionButton.addEventListener('click', function() {
          
        });
        root.appendChild(div);
      }

      const tableContainer = root.querySelector('.manage-extensions-dialog-content .table-container');
      tableContainer.innerHTML = '<dashboard-manage-extensions-table></dashboard-manage-extensions-table>';
    }
  }

  render() {
    return html`
      <vaadin-dialog part="manage-extensions-dialog"></vaadin-dialog>
    `;
  }
}

customElements.define('dashboard-manage-extensions-dialog', ManageExtensionsDialog);