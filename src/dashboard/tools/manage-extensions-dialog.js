import { LitElement, html, css } from 'lit-element';
import { getExtensions, addExtension, removeExtension } from '../../db';
import './add-extension-dialog';


class ManageExtensionsTable extends LitElement {


  static get styles() {
    return css`
      :host {
        display: flex;
        font-family: sans-serif;
      }

      [part=details] {
        width: 250px;
        margin-left: 0px;
        border: 1px solid #ddd;
        border-left: none;
        padding: 7px 10px;
      }

      [part=details] vaadin-button {
        margin-right: 5px;
      }

      [part=details-buttons] {
        margin-top: 10px;
        display: flex;
        justify-content: right;
      }

      h1 {
        margin: 0 0 8px;
        padding: 0;
        line-height: normal;
        font-size: 30px;
        color: purple;
      }

      h2 {
        margin: 0 0 5px;
        font-size: 18px;
        line-height: normal;
      }

      p {
        overflow-wrap: break-word;
      }
    `;
  }

  static get properties() {
    return {
      selectedItem: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this.extensions = [];
    this.selectedItem = null;
  }

  async setGridItems() {
    try {
      this.extensions = await getExtensions();
      const grid = this.shadowRoot.querySelector('vaadin-grid');

      grid.addEventListener('active-item-changed', (event) => {
        const item = event.detail.value;
        this.selectedItem = item;
        grid.selectedItems = item ? [item] : [];
      });

      grid.items = this.extensions.map(extension => ({
        ...extension,
        version: parseFloat(extension.version)
      }));
    } catch(e) {
      console.error(e.message);
    }
  }


  firstUpdated() {
    this.setGridItems();  
  }

  onEdit() {
    this.dispatchEvent(new CustomEvent("editItem", {
      detail: this.selectedItem
    }));
  }

  async onDisable() {
    const { name, version } = this.selectedItem;
    await addExtension(this.selectedItem, false);
    await this.setGridItems();
    const grid = this.shadowRoot.querySelector('vaadin-grid');
    this.selectedItem = grid.items.find(item => {
      return item.name === name && item.version === version;
    });
  }

  async onEnable() {
    const { name, version } = this.selectedItem;
    await addExtension(this.selectedItem, true);
    await this.setGridItems();
    this.setSelectedItem(name, version);
  }

  setSelectedItem(name, version) {
    const grid = this.shadowRoot.querySelector('vaadin-grid');

    this.selectedItem = grid.items.find(item => {
      return item.name === name && item.version.toString() === version.toString();
    });
  }

  async onRemove() {
    const { name, version } = this.selectedItem;
    await removeExtension(name, version);
    await this.setGridItems();
    this.selectedItem = null;
  }

  render() {
    return html`
      <vaadin-grid>
        <vaadin-grid-column path="name" header="Name"></vaadin-grid-column>
        <vaadin-grid-column path="version" header="Version"></vaadin-grid-column>
        <vaadin-grid-column path="enabled" header="Enabled">
          <template>
            <vaadin-checkbox disabled checked="{{item.enabled}}"></vaadin-checkbox>
          </template>
        </vaadin-grid-column>
      </vaadin-grid>
      <div part="details">
        ${this.selectedItem ? html`
          <h1>${this.selectedItem.name}</h1>
          <h2>Version ${this.selectedItem.version}</h2>
          <p>${this.selectedItem.description}</p>
          <div part="details-buttons">
            ${this.selectedItem.enabled ? html`
              <vaadin-button theme="error small" @click="${this.onDisable}">Disable</vaadin-button>
            ` : html`
              <vaadin-button theme="success small" @click="${this.onEnable}">Enable</vaadin-button>
            `}
            <vaadin-button theme="contrast small" @click="${this.onEdit}">Edit</vaadin-button>
            <vaadin-button theme="error small" @click="${this.onRemove}">Remove</vaadin-button>
          </div>
        ` : html`
          <p>Select an extension to view details</p>
        `}
      </div>
    `;
  }
}

customElements.define('dashboard-manage-extensions-table', ManageExtensionsTable);

class ManageExtensionsDialog extends LitElement {

  open() {
    const dialog = this.shadowRoot.querySelector('[part=manage-extensions-dialog]');
    dialog.opened = true;
  }

  async openAddExtensionDialog(name, version, description, code) {
    let dialogContainer = this.shadowRoot.querySelector('[part=add-extension-dialog-container]');
    dialogContainer.innerHTML = `<dashboard-add-extension-dialog></dashboard-add-extension-dialog>`;
    const dialog = this.shadowRoot.querySelector('dashboard-add-extension-dialog');
    await dialog.updateComplete;
    if (name) {
      dialog.name = name;
      dialog.version = version;
      dialog.description = description;
      dialog.code = code; 
    }
    dialog.open();
  }

  firstUpdated() {

    const that = this;
    const manageExtensionsDialog = this.shadowRoot.querySelector('[part=manage-extensions-dialog]');

    const openAddExtensionDialog = this.openAddExtensionDialog.bind(this);

    manageExtensionsDialog.renderer = function(root, dialog) {

      if (!root.firstElementChild) {


        const div = window.document.createElement('div');
        div.innerHTML = `
          <style>
            .manage-extensions-dialog-content {
              width: 730px;
            }

            .manage-extensions-dialog-content p {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 10px;
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
          openAddExtensionDialog();
        });
        root.appendChild(div);
      }

      const tableContainer = root.querySelector('.manage-extensions-dialog-content .table-container');
      tableContainer.innerHTML = '<dashboard-manage-extensions-table></dashboard-manage-extensions-table>';
      const extensionsTable = tableContainer.querySelector('dashboard-manage-extensions-table');
      that.extensionsTable = extensionsTable;
      extensionsTable.addEventListener('editItem', (ev) => {
        const { name, version, description, code } = ev.detail;
        openAddExtensionDialog(name, version, description, code);
      });
    }
  }

  async onAddExtension(ev) {
    const { name, version } = ev.detail;
    await this.extensionsTable.setGridItems();
    this.extensionsTable.setSelectedItem(name, parseFloat(version));
  }

  render() {
    return html`
      <vaadin-dialog part="manage-extensions-dialog"></vaadin-dialog>
      <div part="add-extension-dialog-container" @addExtension="${this.onAddExtension}"></div>
    `;
  }
}

customElements.define('dashboard-manage-extensions-dialog', ManageExtensionsDialog);