import { LitElement, html, css } from 'lit';

class ElementEditor extends LitElement {

  #currentEditor;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .current-editor {
      flex: 1;
      overflow: auto;
    }

    .current-editor > div {
      height: 100%;
    }

    p {
      margin-top: 0;
      font-weight: bold;
      margin-bottom: 5px;
    }
  
    p span {
      color: purple;
    }

    .edit-html-header {
      padding: 15px 10px;
    }
  `;

  static properties = {
    selectedTab: { state: true },
    dashboard: { attribute: false },
  };

  constructor() {
    super();
    this.selectedTab = null;
  }

  #selectedTabChanged(ev) {
    this.selectedTab = this.#tabs[ev.detail.value];
  }

  get #tabs() {
    return this.dashboard.getComponentIdsOfType('elementEditor');
  }

  #updateSelectedTab() {
    if (!this.#tabs.includes(this.selectedTab)) {
      this.selectedTab = this.#tabs[0];
    }
  }

  #updateCurrentEditor() {
    if (this.#currentEditor) {
      this.#currentEditor.remove();
      this.dashboard.unmount(this.#currentEditor);
    }
    this.#currentEditor = this.dashboard.create('elementEditor', this.selectedTab);
    this.renderRoot.querySelector('.current-editor').append(this.#currentEditor);
  }

  updated(changedProps) {
    if (changedProps.has('selectedTab')) {
      this.#updateCurrentEditor();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#currentEditor) {
      this.dashboard.unmount(this.#currentEditor);
    }
  }

  firstUpdated() {
    this.dashboard.subscribe('elementSelect', () => {
      this.#updateCurrentEditor();
      this.#updateSelectedTab();
    });
    this.#updateSelectedTab();
  }

  render() {
    const tabs = this.#tabs;
    const selectedElement = this.dashboard.getSelectedElement();
    return html`
      <div class="edit-html-header">
        ${!selectedElement ? html`
          <p>No element is currently selected.</p>
        ` : html`
          <p>Edit element <span>${this.dashboard.getElementDisplayName(selectedElement)}</span></p>
        `}
      </div>
      <vaadin-tabs theme="small" @selected-changed=${this.#selectedTabChanged} selected=${tabs.indexOf(this.selectedTab)}>
        ${tabs.map(tab => html`
        <vaadin-tab>${tab}</vaadin-tab>
        `)}
      </vaadin-tabs>
      <div class="current-editor"></div>
    `;
  }
}

customElements.define('dashboard-element-editor', ElementEditor);