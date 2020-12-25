import { LitElement, html, css } from 'lit-element';
import { getSourceProvider } from '@webbitjs/store';
import hotkeys from 'hotkeys-js';
import './tools-bottom';
import './wom-viewer';
const beautify_html = require('js-beautify').html;
const isMac = navigator.userAgent.indexOf('Mac OS X') != -1;

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
        display: flex;
        flex-direction: column;
      }

      [part=top-menu] {
        width: 100%;
        background: #eee;
        display: block;
        display: flex;
        align-items: center;
        overflow: hidden;
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
    const isClipboardSet = this.wom.getClipboard() !== null;
    
    const canSelectedContainClipboardNode = (
      isClipboardSet 
      && isNodeSelected 
      && this.wom.getSelectedNode().canContainComponent(this.wom.getClipboard().componentType, this.wom.getClipboard().slot)
    );

    const dashboardMenuItems = [
      { text: 'About', action: this.openAboutDialog },
      { text: 'Documentation', action: () => window.open('https://frc-web-components.github.io/', '_blank') },
      { component: 'hr' },
      { text: 'Preferences', action: this.openPreferencesDialog },
    ];

    this.menuItems = [
      {
        text: 'Dashboard',
        children: dashboardMenuItems
      },
      {
        text: 'File',
        children: [
          { component: this.getMenuItemWithShortcut('New Layout', isMac ? '&#8984;N' : 'Ctrl+N'), action: this.newLayout },
          { component: 'hr' },
          { component: this.getMenuItemWithShortcut('Upload Layout', isMac ? '&#8984;U' : 'Ctrl+U'), action: this.uploadLayout },
          { component: this.getMenuItemWithShortcut('Open Layout', isMac ? '&#8984;O' : 'Ctrl+O'), action: this.openOpenLayoutDialog },
          { 
            text: 'Open Recent Layout', 
            disabled: this.wom.layout.getSavedLayoutNames().length === 0,
            children: this.wom.layout.getSavedLayoutNames().slice(0, 10)
              .map(layoutName => ({ text: layoutName, action: () => this.loadRecentLayout(layoutName) }))
          },
          // { text: 'Open Robot Layout', disabled: true },
          { component: 'hr' },
          { component: this.getMenuItemWithShortcut('Save Layout', isMac ? '&#8984;S' : 'Ctrl+S'), action: 'saveLayout' },
          { component: this.getMenuItemWithShortcut('Rename Layout', isMac ? '&#8679;&#8984;R' : 'Ctrl+Shift+R'), action: this.openRenameDialog },
          { component: this.getMenuItemWithShortcut('Download Layout', isMac ? '&#8984;D' : 'Ctrl+D'), action: 'downloadLayout' },
          { component: 'hr' },
          { text: 'Load Extension', action: this.onLoadExtension, disabled: true },
        ]
      },
      { 
        text: 'Edit',
        children: [
          { component: this.getMenuItemWithShortcut('Undo', isMac ? '&#8984;Z' : 'Ctrl+Z'), disabled: this.wom.history.atBeginning(), action: 'undo' },
          { component: this.getMenuItemWithShortcut('Redo', isMac ? '&#8679;&#8984;Z' : 'Ctrl+Y'), disabled: this.wom.history.atEnd(), action: 'redo' },
          { component: 'hr' },
          { component: this.getMenuItemWithShortcut('Cut Node', isMac ? '&#8984;X' : 'Ctrl+X'), disabled: !isNonRootSelected, action: 'cutNode' },
          { component: this.getMenuItemWithShortcut('Copy Node', isMac ? '&#8984;C' : 'Ctrl+C'), disabled: !isNonRootSelected, action: 'copyNode' },
          { component: this.getMenuItemWithShortcut('Paste Node', isMac ? '&#8984;V' : 'Ctrl+V'), disabled: !canSelectedContainClipboardNode, action: 'pasteNode' },
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
      }
    ];
  }
  
  getMenuItemWithShortcut(text, shortcut) {
    const item = window.document.createElement('vaadin-context-menu-item');
    item.innerHTML = `
      <div style="
        display: flex;
        justify-content: space-between;
      ">
        <span>${text}</span>
        <span style="
          margin-left: px;
          margin-left: 15px;
          font-size: 15px;
        ">${shortcut}</span>
      </div>
    `;
    return item;
  }

  addWomListeners() {
    [
      'womNodeSelect', 'womNodeDeselect', 'womActionExecute',
      'womNodeAdd', 'womNodeRemove', 'womClipboardSet',
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
        const html = await selectedNode.getHtml(!isRootNode);
        this.nodeHtmlEditorContent = '\n' + beautify_html(html, {
          'wrap-attributes': 'force-expand-multiline'
        }) + '\n';
      } else {
        
      }
      this.requestUpdate();
    });
  }

  addShortcuts() {

    hotkeys.setScope('dashboard');

    hotkeys('command+z,ctrl+z', 'dashboard', ev => {

      if (document.activeElement !== document.body) {
        return;
      }

      ev.preventDefault();
      if (!this.wom.history.atBeginning()) {
        this.wom.executeAction('undo');
      }
    });

    hotkeys('shift+command+z,ctrl+y', 'dashboard', ev => {

      if (document.activeElement !== document.body) {
        return;
      }

      ev.preventDefault();
      if (!this.wom.history.atEnd()) {
        this.wom.executeAction('redo');
      }
    });

    hotkeys('backspace,del,delete', 'dashboard', ev => {

      if (document.activeElement !== document.body) {
        return;
      }

      ev.preventDefault();
      const isNonRootSelected = this.wom.getSelectedNode() && this.wom.getSelectedNode() !== this.wom.getRootNode();
      if (isNonRootSelected) {
        this.wom.executeAction('removeNode');
      }
    });

    hotkeys('command+n,ctrl+n', 'dashboard', ev => {
      if (document.activeElement !== document.body) {
        return;
      }
      ev.preventDefault();
      this.newLayout();
    });

    hotkeys('command+u,ctrl+u', 'dashboard', ev => {
      if (document.activeElement !== document.body) {
        return;
      }
      ev.preventDefault();
      this.uploadLayout();
    });

    hotkeys('command+o,ctrl+o', 'dashboard', ev => {
      if (document.activeElement !== document.body) {
        return;
      }
      ev.preventDefault();
      this.openOpenLayoutDialog();
    });

    hotkeys('command+s,ctrl+s', 'dashboard', ev => {
      if (document.activeElement !== document.body) {
        return;
      }
      ev.preventDefault();
      this.wom.executeAction('saveLayout');
    });

    hotkeys('command+d,ctrl+d', 'dashboard', ev => {
      if (document.activeElement !== document.body) {
        return;
      }
      ev.preventDefault();
      this.wom.executeAction('downloadLayout');
    });

    hotkeys('command+r,ctrl+r', 'dashboard', ev => {
      if (document.activeElement !== document.body) {
        return;
      }
      ev.preventDefault();
      this.openRenameDialog();
    });
    

    hotkeys('command+c,ctrl+c', 'dashboard', ev => {
      if (document.activeElement !== document.body) {
        return;
      }
      ev.preventDefault();
      const isNonRootSelected = this.wom.getSelectedNode() && this.wom.getSelectedNode() !== this.wom.getRootNode();
      if (isNonRootSelected) {
        this.wom.executeAction('copyNode');
      }
    });

    hotkeys('command+x,ctrl+x', 'dashboard', ev => {
      if (document.activeElement !== document.body) {
        return;
      }
      ev.preventDefault();
      const isNonRootSelected = this.wom.getSelectedNode() && this.wom.getSelectedNode() !== this.wom.getRootNode();
      if (isNonRootSelected) {
        this.wom.executeAction('cutNode');
      }
    });

    hotkeys('command+v,ctrl+v', 'dashboard', ev => {
      if (document.activeElement !== document.body) {
        return;
      }
      ev.preventDefault();
      const isNodeSelected = this.wom.getSelectedNode();
      const isClipboardSet = this.wom.getClipboard() !== null;
      
      const canSelectedContainClipboardNode = (
        isClipboardSet 
        && isNodeSelected 
        && this.wom.getSelectedNode().canContainComponent(this.wom.getClipboard().componentType, this.wom.getClipboard().slot)
      );
      if (canSelectedContainClipboardNode) {
        this.wom.executeAction('pasteNode');
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    hotkeys.deleteScope('dashboard');
  }

  initAboutDialog() {
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

  initPreferencesDialog() {

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

  initRenameDialog() {

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

  initOpenLayoutDialog() {
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
  
  firstUpdated() {
    this.addShortcuts();

    this.toolsTopElement = this.shadowRoot.querySelector('[part="tools-top"]');

    const observer = new MutationObserver(() => {
      const nodeHtmlEditor = this.shadowRoot.querySelector('juicy-ace-editor');
      nodeHtmlEditor.editor.setValue(this.nodeHtmlEditorContent);
    });
    observer.observe(this.shadowRoot, {
      childList: true
    });

    this.initAboutDialog();
    this.initPreferencesDialog();
    this.initRenameDialog();
    this.initOpenLayoutDialog();
    
    window.addEventListener('beforeinstallprompt', () => {
      this.setMenuItems();
      this.requestUpdate();
    });
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

  async onConfirmEditHtml() {
    const selectedNode = this.wom.getSelectedNode();
    const isRootNode = selectedNode === this.wom.getRootNode();
    const editorNode = this.shadowRoot.querySelector('juicy-ace-editor');
    const domNode = selectedNode.getNode();

    if (isRootNode) {
      domNode.innerHTML = editorNode.editor.getValue();
      this.wom.history.push(await this.wom.getHtml());
    } else {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = editorNode.editor.getValue();
      
      if (tempElement.children.length !== 1) {
        alert(`Error setting node HTML: Trying to replace element with multiple elements`);
      }

      const newElement = tempElement.children[0];
      domNode.replaceWith(newElement);
      setTimeout(async () => {
        this.wom.selectNode(newElement.__WOM_NODE__);
        this.wom.setEditingNodeHtml(true);
        this.wom.history.push(await this.wom.getHtml());
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

  openRenameDialog() {
    const renameDialog = this.shadowRoot.querySelector('[part=rename-dialog]');
    renameDialog.opened = true;
  }


  openOpenLayoutDialog() {
    if (
      this.wom.layout.hasNewChanges()
      && !confirm(`You have unsaved changes. Are you sure you want to open a layout?`)
    ) {
      return;
    }
    const openLayoutDialog = this.shadowRoot.querySelector('[part=open-layout-dialog]');
    openLayoutDialog.opened = true;
  }

  menuItemSelected(ev) {
    const item = ev.detail.value;
    if (typeof item.action === 'string') {
      this.wom.executeAction(item.action);
    } else if (typeof item.action === 'function') {
      item.action.bind(this)();
    }
  }

  loadRecentLayout(layoutName) {
    if (
      this.wom.layout.hasNewChanges()
      && !confirm(`You have unsaved changes. Are you sure you want to open a layout?`)
    ) {
      return;
    }
    
    this.wom.executeAction('loadRecentLayout', { layoutName });
  }

  newLayout() {
    if (this.wom.layout.hasNewChanges()) {
      if (confirm(`You have unsaved changes. Are you sure you want to create a new layout?`)) {
        this.wom.executeAction('newLayout');
      }
    } else {
      this.wom.executeAction('newLayout');
    }
  }

  uploadLayout() {
    if (this.wom.layout.hasNewChanges()) {
      if (confirm(`You have unsaved changes. Are you sure you want to upload a layout?`)) {
        this.wom.executeAction('uploadLayout');
      }
    } else {
      this.wom.executeAction('uploadLayout');
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
        <vaadin-dialog part="rename-dialog"></vaadin-dialog>
        <vaadin-dialog part="open-layout-dialog"></vaadin-dialog>
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