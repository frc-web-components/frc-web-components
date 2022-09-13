import { LitElement, html, css } from 'lit';
import CodeFlask from 'codeflask';

const styles = css`
  :host {
    display: block;
    padding: 5px;
    font-family: sans-serif;
    height: 320px;
    box-sizing: border-box;
  }

  p {
    margin-top: 0;
    font-weight: bold;
  }

  p span {
    color: purple;
  }

  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  wc-codemirror {
    height: 100%;
  }

  .editor {
    flex: 1;
    position: relative;
    overflow: auto;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    margin-top: 5px;
  }

  textarea.codeflask__textarea {
    border: 1px solid #ccc;
  }
`;

class HtmlEditor extends LitElement {
  #flask;

  static properties = {
    dashboard: { attribute: false },
  };

  static styles = styles;

  constructor() {
    super();
    this.#flask = null;
  }

  get #element() {
    return this.dashboard.getSelectedElement();
  }

  get #editor() {
    return this.renderRoot.querySelector('#editor');
  }

  #updateCode() {
    if (this.#element) {
      const html = this.dashboard.getElementHtml(this.#element);
      this.#flask.updateCode(html);
      this.requestUpdate();
    }
  }

  firstUpdated() {
    this.#flask = new CodeFlask(this.#editor, {
      language: 'js',
      styleParent: this.renderRoot,
    });
    this.dashboard.subscribe('elementSelect', () => {
      this.#updateCode();
    });
    this.#updateCode();
  }

  #onConfirm() {
    const code = this.#flask.getCode();
    const container = document.createElement('div');
    container.innerHTML = code;
    const updatedElement = container.firstElementChild;
    const isValid =
      updatedElement && updatedElement.nodeName === this.#element.nodeName;

    if (!isValid) {
      return;
    }

    const clonedElement = this.#element.cloneNode(true);

    // remove attributes
    clonedElement.getAttributeNames().forEach((attribute) => {
      if (!updatedElement.hasAttribute(attribute)) {
        clonedElement.removeAttribute(attribute);
      }
    });

    updatedElement.getAttributeNames().forEach((attribute) => {
      clonedElement.setAttribute(
        attribute,
        updatedElement.getAttribute(attribute)
      );
    });

    if (clonedElement.tagName.toLowerCase() === 'dashboard-tab') {
      clonedElement.setAttribute('slot', 'tab');
    }

    while (clonedElement.lastChild) {
      clonedElement.removeChild(clonedElement.lastChild);
    }

    [...updatedElement.childNodes].forEach((node) => {
      clonedElement.append(node);
    });

    this.#element.parentNode.replaceChild(clonedElement, this.#element);
    this.dashboard.setSelectedElement(clonedElement);
  }

  render() {
    if (!this.#element) {
      return html``;
    }

    return html`
      <div class="container">
        <div class="editor">
          <div id="editor"></div>
        </div>
        <div class="buttons">
          <vaadin-button theme="small primary success" @click=${this.#onConfirm}
            >Confirm</vaadin-button
          >
        </div>
      </div>
    `;
  }
}

customElements.define('dashboard-html-editor', HtmlEditor);
