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

          .about-dialog-content h1 {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 0px;
          }

          .about-dialog-content p {
            font-size: 16px;
            margin-top: 5px;
            margin-bottom: 10px;
          }

          .about-dialog-content p span {
            color: purple;
          }
        </style>
        <div class="about-dialog-content">
          <h1>FWC Dashboard</h1>
          <p>Version <span>3.0.0</span></p>
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