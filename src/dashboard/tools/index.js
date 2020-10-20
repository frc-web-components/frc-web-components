import { LitElement, html, css } from 'lit-element';
import { getSourceProvider } from '@webbitjs/store';
import './tools-bottom';
import './wom-viewer';
const beautify_html = require('js-beautify').html;


class WomTools extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        width: 30%;
        position: relative;
        min-width: 5px;
        z-index: 2;
        background: white;
      }

      [part=tools] {
        position: absolute;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: scroll;
        display: flex;
        flex-direction: column;
      }

      [part=top-menu] {
        width: 100%;
        background: #eee;
        display: block;
        display: flex;
        align-items: center;
      }

      [part=top-menu] vaadin-button {
        color: black;
        padding: 0;
      }

      [part=top-menu] vaadin-button[disabled] {
        color: #999;
      }

      [part=top-menu] vaadin-button[selected] {
        color: blue;
      }

      [part=top-tools-separator] {
        height: 70%;
        width: 1px;
        background: #aaa;
        margin: 0 10px;
      }

      [part=tools-top], [part=tools-bottom] {
        min-height: 10%;
      }

      [part=tools-top] {
        margin: 5px;
        padding-bottom: 15px;
      }

      [part=tools-splitter] {
        height: 100%;
        flex: 1;
      }

      dashboard-tools-bottom {
        overflow: unset;
      }

      [part=node-html-editor] {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding-top: 10px;
        box-sizing: border-box;
      }

      [part=node-html-editor] juicy-ace-editor {
        flex: 1;
      }

      [part=node-html-editor] [part=editor-buttons] {
        display: flex;
        justify-content: flex-end;
      }

      [part=node-html-editor] [part=editor-buttons] vaadin-button {
        margin-right: 5px;
      }
      
    `;
  }

  static get properties() {
    return {
      wom: { type: Object },
      menuItems: { type: Array },
      nodeHtmlEditorContent: { type: String }
    };
  }

  constructor() {
    super();
    this.wom = null;
    this.toolsTopElement = null;
    this.setMenuItems();
    this.nodeHtmlEditorContent = '';
  }

  setMenuItems() {

    if (!this.wom) {
      return;
    }

    const isNodeSelected = this.wom.getSelectedNode();
    const isNonRootSelected = this.wom.getSelectedNode() && this.wom.getSelectedNode() !== this.wom.getRootNode();

    this.menuItems = [
      {
        text: 'Dashboard',
        children: [
          { text: 'About', action: this.openAboutDialog },
          { text: 'Documentation', action: () => window.open('https://frc-web-components.github.io/', '_blank') },
          { text: 'Update' },
          { component: 'hr' },
          { text: 'Preferences', action: this.openPreferencesDialog },
        ]
      },
      {
        text: 'File',
        children: [
          { text: 'New Layout', action: 'newLayout' },
          { text: 'New Window' },
          { component: 'hr' },
          { text: 'Open Layout', action: 'loadLayout' },
          { text: 'Open Recent Layout' },
          { text: 'Open Robot Layout' },
          { component: 'hr' },
          { text: 'Save Layout', action: 'saveLayout' },
          { text: 'Save Robot Layout' },
          { component: 'hr' },
          { text: 'Load Extension', action: this.onLoadExtension },
        ]
      },
      { 
        text: 'Edit',
        children: [
          { text: 'Undo', disabled: this.wom.history.atBeginning(), action: 'undo' },
          { text: 'Redo', disabled: this.wom.history.atEnd(), action: 'redo' },
          { component: 'hr' },
          { text: 'Cut Node', disabled: !isNonRootSelected },
          { text: 'Copy Node', disabled: !isNonRootSelected },
          { text: 'Paste Node', disabled: !isNonRootSelected },
          { text: 'Delete Node', disabled: !isNonRootSelected, action: 'removeNode' },
          { component: 'hr' },
          { text: 'Edit Node HTML', disabled: !isNodeSelected, action: this.editNodeHtml },
        ]
      },
      { 
        text: 'View',
        children: [
          { text: 'Scroll to Node', disabled: !isNonRootSelected, action: this.onScrollToNode },
        ]
      },
      { 
        text: 'Recording',
        children: [
          { text: 'Start Recording' },
          { text: 'Load Playback' },
        ]
      },
    ];
  }

  addWomListeners() {
    [
      'womNodeSelect', 'womNodeDeselect', 'womActionExecute',
      'womNodeAdd', 'womNodeRemove',
      'womChange', 'womNodePreview', 'womNodePreviewRemove', 'selectionToolToggle'
    ].forEach(eventName => {
      this.wom.addListener(eventName, () => {
        this.setMenuItems();
        this.requestUpdate();
      });
    });

    this.wom.addListener('womEditingNodeHtmlChange', async ev => {
      if (ev.detail.editing) {
        const selectedNode = this.wom.getSelectedNode();
        const isRootNode = selectedNode === this.wom.getRootNode();
        const editorNode = this.shadowRoot.querySelector('juicy-ace-editor');
        const html = await selectedNode.getHtml(!isRootNode);
        this.nodeHtmlEditorContent = '\n' + beautify_html(html, {
          'wrap-attributes': 'force-expand-multiline'
        }) + '\n';
      } else {
        
      }
      this.requestUpdate();
    });
  }
  
  firstUpdated() {
    const halsimProvider = getSourceProvider('HALSim');

    this.toolsTopElement = this.shadowRoot.querySelector('[part="tools-top"]');

    const observer = new MutationObserver(() => {
      const nodeHtmlEditor = this.shadowRoot.querySelector('juicy-ace-editor');
      nodeHtmlEditor.editor.setValue(this.nodeHtmlEditorContent);
    });
    observer.observe(this.shadowRoot, {
      childList: true
    });

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

  updated(changedProps) {
    if (changedProps.has('wom') && this.wom) {
      this.addWomListeners();
      this.wom.addListener('womChange', () => {
        if (!this.womViewerNode) {
          this.womViewerNode = this.shadowRoot.querySelector('wom-viewer');
        }
        this.womViewerNode.requestUpdate();
      });
      this.setMenuItems();
    }
  }

  toggleSelectionTool() {
    this.wom.toggleSelectionTool();
  }

  onScrollToNode() {
    this.wom.getSelectedNode().getNode().scrollIntoView();
  }

  onLoadExtension() {
    alert(`Loading Extensions hasn't been implemented yet!`);
  }

  async editNodeHtml() {
    this.wom.setEditingNodeHtml(true);
  }

  onCancelEditHtml() {
    this.wom.setEditingNodeHtml(false);
  }

  onConfirmEditHtml() {
    const selectedNode = this.wom.getSelectedNode();
    const isRootNode = selectedNode === this.wom.getRootNode();
    const editorNode = this.shadowRoot.querySelector('juicy-ace-editor');
    const domNode = selectedNode.getNode();

    if (isRootNode) {
      domNode.innerHTML = editorNode.editor.getValue();
    } else {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = editorNode.editor.getValue();
      
      if (tempElement.children.length !== 1) {
        alert(`Error setting node HTML: Trying to replace element with multiple elements`);
      }

      const newElement = tempElement.children[0];
      domNode.replaceWith(newElement);
      setTimeout(() => {
        this.wom.selectNode(newElement.__WOM_NODE__);
        this.wom.setEditingNodeHtml(true);
      });
    }
  }

  openAboutDialog() {
    const aboutDialog = this.shadowRoot.querySelector('[part=about-dialog]');
    aboutDialog.opened = true;
  }

  openPreferencesDialog() {
    const aboutDialog = this.shadowRoot.querySelector('[part=preferences-dialog]');
    aboutDialog.opened = true;
  }

  menuItemSelected(ev) {
    const item = ev.detail.value;
    if (typeof item.action === 'string') {
      this.wom.executeAction(item.action);
    } else if (typeof item.action === 'function') {
      item.action.bind(this)();
    }
  }

  render() {

    if (this.wom.isEditingNodeHtml()) {
      return html`
        <div part="tools">
          <div part="node-html-editor">
            <juicy-ace-editor
              theme="ace/theme/monokai"
              mode="ace/mode/html"
              tabsize="4"
            ></juicy-ace-editor>
            <div part="editor-buttons">
              <vaadin-button 
                part="confirm-button" 
                theme="success primary small" 
                aria-label="Confirm"
                @click="${this.onConfirmEditHtml}"
              >
                Set Node HTML
              </vaadin-button>

              <vaadin-button 
                part="cancel-button" 
                theme="error primary small" 
                aria-label="Cancel"
                @click="${this.onCancelEditHtml}"
              >
                Close
              </vaadin-button>
            </div>
          </div>
        </div>
      `;
    }

    return html`
      <div part="tools">
        <vaadin-dialog part="about-dialog"></vaadin-dialog>
        <vaadin-dialog part="preferences-dialog"></vaadin-dialog>
        <div part="top-menu">

          <vaadin-button 
            theme="icon tertiary" 
            aria-label="Selection Tool"
            title="Selection Tool"
            ?selected="${this.wom.isSelectionEnabled()}"
            @click="${this.toggleSelectionTool}"
          >
            <iron-icon icon="vaadin:area-select"></iron-icon>
          </vaadin-button>
          <vaadin-menu-bar 
            .items="${this.menuItems}"
            theme="small tertiary"
            @item-selected="${this.menuItemSelected}"
          ></vaadin-menu-bar>

        </div>
        <vaadin-split-layout part="tools-splitter" theme="small" orientation="vertical">
          <div part="tools-top" style="height: 40%">
            <div part="wom">
              ${this.wom ? html`
                <wom-viewer
                  .wom="${this.wom}"
                  .node="${this.wom.getRootNode()}"
                  .selectedNode="${this.wom ? this.wom.getSelectedNode() : null}"
                  .container="${this.toolsTopElement}"
                  level="0"
                ></wom-viewer>
              ` : ''}
            </div>
          </div>
          <dashboard-tools-bottom
            part="tools-bottom"
            style="height: 60%"
            .wom="${this.wom}"
          >
          </dashboard-tools-bottom>        
        </vaadin-split-layout>
      </div>
    `;
  }
}

customElements.define('dashboard-wom-tools', WomTools);