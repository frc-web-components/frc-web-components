import { Webbit, html, css } from '@webbitjs/webbit';
import './editor';

class CodeEditor extends Webbit {

  static get metadata() {
    return {
      displayName: 'Code Editor',
      category: 'General',
      description: 'Component for writing code',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      slots: [],
    };
  }


  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 300px;
        height: 200px;
        /* font-family: sans-serif; */
      }

      juicy-ace-editor {
        width: 100%;
        height: 100%;
      }
    `;
  }	

  static get properties() {
    return {
      content: { type: String, primary: true },
      mode: { type: String },
      theme: { type: String },
      fontsize: { type: String },
      softtab: { type: Boolean },
      tabsize: { type: Number },
      readonly: { type: Boolean },
      wrapmode: { type: Boolean },
      maxLines: { type: Number },
      minLines: { type: Number },
    };
  }

  constructor() {
    super();
    this.content = '';
    this.mode = 'javascript';
    this.theme = 'monokai';
    this.fontsize = '12px';
    this.softtabs = false;
    this.tabsize = 4;
    this.readonly = false;
    this.wrapmode = false;
    this.maxLines = Infinity;
    this.minLines = 0;

    this.onEditTimeoutId = null;
  }

  updated(changedProps) {
    if (changedProps.has('content')) {
      const editorElement = this.shadowRoot.querySelector('juicy-ace-editor');
      const currentContent = editorElement.editor.getValue();
      if (currentContent !== this.content) {
        editorElement.editor.setValue(this.content);
      }
    }
  }

  onChange(ev) {

    if (this.onEditTimeoutId) {
      clearTimeout(this.onEditTimeoutId);
      this.onEditTimeoutId = null;
    }

    this.onEditTimeoutId = setTimeout(() => {
      const editorElement = this.shadowRoot.querySelector('juicy-ace-editor');
      this.content = editorElement.editor.getValue();
    }, 500);
  }

  render() {
    return html`   
      <juicy-ace-editor
        mode="${this.mode ? ('ace/mode/' + this.mode) : ''}"
        theme="${this.theme ? ('ace/theme/' + this.theme) : ''}"
        fontsize="${this.fontsize}"
        ?softtabs="${this.softtabs}"
        tabsize="${this.tabsize}"
        ?readonly="${this.readonly}"
        ?wrapmode="${this.wrapmode}"
        max-lines="${this.maxLines}"
        min-lines="${this.minLines}"
        @change="${this.onChange}"
      ></juicy-ace-editor>
    `;
  }
}

webbitRegistry.define('frc-code-editor', CodeEditor);