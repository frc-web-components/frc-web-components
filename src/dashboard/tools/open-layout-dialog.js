import { LitElement, html } from 'lit-element';


class OpenLayoutDialog extends LitElement {

  get properties() {
    return {
      wom: { type: Object }
    };
  }

  constructor() {
    super();
  }

  open() {
    if (
      this.wom.layout.hasNewChanges()
      && !confirm(`You have unsaved changes. Are you sure you want to open a layout?`)
    ) {
      return;
    }
    const openLayoutDialog = this.shadowRoot.querySelector('[part=open-layout-dialog]');
    openLayoutDialog.opened = true;
  }

  firstUpdated() {
    const openLayoutDialog = this.shadowRoot.querySelector('[part=open-layout-dialog]');
    const wom = this.wom;
    
    openLayoutDialog.renderer = function(root, dialog) {

      if (!root.firstElementChild) {


        const div = window.document.createElement('div');
        div.innerHTML = `
          <style>
            .open-layout-dialog-content {
              width: 350px;
            }

            .open-layout-dialog-content p {
              font-size: 20px;
              font-weight: bold;
              margin: 0 0 5px;
            }

            .list-box-container {
              max-height: 300px;
              overflow: auto;
            }

            .open-layout-dialog-content vaadin-list-box {
              width: 100%;
              margin-bottom: 10px;
            }

            .open-layout-dialog-buttons {
              display: flex;
              justify-content: flex-end;
              margin-top: 10px;
            }

            .open-layout-dialog-buttons vaadin-button {
              margin-left: 5px;
            }
          </style>
          <div class="open-layout-dialog-content">
            <p>Open Layout</p>
            <div class="list-box-container">
              <vaadin-list-box selected="0"></vaadin-list-box>
            </div>
            <div class="open-layout-dialog-buttons">
              <vaadin-button part="confirm-button" theme="success primary small">Open</vaadin-button>
              <vaadin-button part="close-button" theme="small">Cancel</vaadin-button>
            </div>
          </div>
        `;
        const closeButton = div.querySelector('[part=close-button]');
        closeButton.addEventListener('click', function() {
          openLayoutDialog.opened = false;
        });

        const listBox = div.querySelector('vaadin-list-box');
        const confirmButton = div.querySelector('[part=confirm-button]');
        confirmButton.addEventListener('click', function() {
          const item = listBox.children.item(listBox.selected);
          const layoutName = item.innerText;
          wom.executeAction('openLayout', { layoutName });
          openLayoutDialog.opened = false;
        });
        root.appendChild(div);
      }

      const listBox = root.querySelector('.open-layout-dialog-content vaadin-list-box');
      listBox.innerHTML = '';
      wom.layout.getSavedLayoutNames().sort().forEach(layoutName => {
        const item = window.document.createElement('vaadin-item');
        item.innerText = layoutName;
        listBox.appendChild(item);
      });
      listBox.selected = 0;
    }
  }

  render() {
    return html`
      <vaadin-dialog part="open-layout-dialog"></vaadin-dialog>
    `;
  }
}

customElements.define('dashboard-open-layout-dialog', OpenLayoutDialog);