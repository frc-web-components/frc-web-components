import { html, css } from 'lit-element';
import { Webbit, define } from '../../webbit';
import './editor';

class CodeEditor extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Code Editor',
      category: 'General',
      description: 'Component for writing code',
      // documentationLink: 'https://frc-web-components.github.io/components/checkbox-group/',
      slots: [],
      editorTabs: ['properties', 'sources'],
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
      content: { 
        type: String, 
        defaultValue: '',
        inputType: 'Textarea',
        primary: true 
      },
      mode: { 
        type: String,
        defaultValue: 'javascript',
        inputType: 'StringDropdown',
        getOptions() {
          return ['javascript', 'json', 'html', 'xml', 'css'];
        }
      },
      theme: { 
        type: String,
        defaultValue: 'monokai',
        inputType: 'StringDropdown',
        getOptions() {
          return ['monokai', 'plain'];
        }
      },
      fontsize: { type: String, defaultValue: '12px' },
      softtab: { type: Boolean, defaultValue: false },
      tabsize: { type: Number, defaultValue: 4 },
      readonly: { type: Boolean, defaultValue: false },
      wrapmode: { type: Boolean, defaultValue: false },
      maxLines: { type: Number, defaultValue: Infinity },
      minLines: { type: Number, defaultValue: 0 },
    };
  }

  constructor() {
    super();
    this.onEditTimeoutId = null;
  }

  updated(changedProps) {
    if (changedProps.has('content')) {
      const editorElement = this.shadowRoot.querySelector('juicy-ace-editor');
      const currentContent = editorElement.value;
      if (currentContent !== this.content) {
        editorElement.value = this.content;
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
      this.content = editorElement.value;
    }, 500);
  }

  render() {
    return html`   
      <juicy-ace-editor
        mode="${this.mode ? ('ace/mode/' + this.mode) : ''}"
        theme="${this.theme && this.theme !== 'plain' ? ('ace/theme/' + this.theme) : ''}"
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

define('frc-code-editor', CodeEditor);