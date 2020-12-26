import { LitElement, html } from 'lit-element';


class AboutDialog extends LitElement {

  open() {
    const aboutDialog = this.shadowRoot.querySelector('[part=about-dialog]');
    aboutDialog.opened = true;
  }

  firstUpdated() {
    const aboutDialog = this.shadowRoot.querySelector('[part=about-dialog]');
    
    aboutDialog.renderer = function(root, dialog) {

      if (root.firstElementChild) {
        return;
      }

      const div = window.document.createElement('div');
      div.innerHTML = `
        <style>
          .about-dialog-content {
            text-align: center;
          }

          .about-dialog-content p {
            font-size: 20px;
            font-weight: bold;
          }
        </style>
        <div class="about-dialog-content">
          <p>FWC Dashboard</p>
          <vaadin-button>Close</vaadin-button>
        </div>
      `;
      const closeButton = div.querySelector('vaadin-button');
      closeButton.addEventListener('click', function() {
        aboutDialog.opened = false;
      });
      root.appendChild(div);
    }
  }

  render() {
    return html`
      <vaadin-dialog part="about-dialog"></vaadin-dialog>
    `;
  }
}

customElements.define('dashboard-about-dialog', AboutDialog);