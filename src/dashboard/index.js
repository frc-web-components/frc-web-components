import { LitElement, html, css } from 'lit-element';
import Wom from './wom';
import AddNode from './actions/add-node';
import RemoveNode from './actions/remove-node';
import SetSource from './actions/set-source';
import SetProperties from './actions/set-properties';
import './builder/index';
import './tools';

class WebbitDashboard extends LitElement {

  static get properties() {
    return {
      wom: { type: Object },
      editMode: { type: Boolean, attribute: 'edit-mode', reflect: true },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
      }

      :host(:not([edit-mode])) {
        min-height: 100vh;
      }

      :host [part=editor] {
        height: 100vh;
      }

      [part=container] {
        height: auto;
      }

      [part=wom] {
        padding: 5px;
      }
    `
  }

  constructor() {
    super();
    this.wom = null;
    this.editMode = false;
    this.dashboardNode = null;
  }

  firstUpdated() {
    const css = document.createElement('style');
    css.type = 'text/css';
    const styles = 'body { margin: 0; }';

    if (css.styleSheet) css.styleSheet.cssText = styles;
    else css.appendChild(document.createTextNode(styles));
    
    document.getElementsByTagName('head')[0].appendChild(css);

    document.body.addEventListener('keydown', ev => {
      this.onKeyDown(ev);
    });
  }

  addWomListeners() {
    [
      'womNodeSelect', 'womNodeDeselect', 'womActionSelect',
      'womNodeTarget', 'womActionDeselect', 'womActionExecute',
      'womActionContextSet', 'womNodeAdd', 'womNodeRemove',
      'womChange', 'womNodePreview', 'womNodePreviewRemove'
    ].forEach(eventName => {
      this.wom.addListener(eventName, () => {
        this.requestUpdate();
      });
    });
  }

  updated(changedProperties) {
    if (changedProperties.has('editMode')) {
      if (!this.editMode) {
        if (this.wom) {
          this.wom.destroy();
        }
      } else {
        this.dashboardNode = this.shadowRoot.querySelector('[part=dashboard]');
        this.wom = new Wom(this, this.dashboardNode);
        this.addWomListeners();

        // add actions
        this.wom.addAction('addNode', new AddNode());
        this.wom.addAction('removeNode', new RemoveNode());
        this.wom.addAction('setSource', new SetSource());
        this.wom.addAction('setProperties', new SetProperties());
      }
    }
  }

  onKeyDown(ev) {
    // Toggle edit mode
    if (ev.shiftKey && ev.code === 'KeyE') {
      this.editMode = !this.editMode;
    }

    if(ev.key === "Escape") {
      if (this.wom.getSelectedActionId()) {
        this.wom.deselectAction();
      } else {
        this.wom.deselectNode();
      }
    }
  }

  render() {
    return html`
      ${this.editMode ? html`
        <vaadin-split-layout part="editor" theme="small">
          <wom-dashboard-builder part="dashboard" .wom="${this.wom}">
            <slot></slot>
          </wom-dashboard-builder>
          <dashboard-wom-tools part="tools-container" .wom="${this.wom}">
          </dashboard-wom-tools>
        </vaadin-split-layout>
      `: html`
        <div part="container">
          <slot></slot>
        </div>
      `}
    `;
  }
}

export default WebbitDashboard;