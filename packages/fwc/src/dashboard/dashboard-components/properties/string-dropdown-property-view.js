import PropertyView from './property-view';
import { html, css } from 'lit';
import uploadImage from './upload-image';

class StringDropdownPropertyView extends PropertyView {
  static get styles() {
    return [
      super.styles,
      css`
        .input-container {
          display: flex;
        }

        [part='input'] {
          flex: 1;
        }
      `,
    ];
  }

  allowCustomValues() {
    const input = this.property?.input ?? {};
    return 'allowCustomValues' in input ? input.allowCustomValues : true;
  }

  onInputChange() {
    this.setValue(this.inputElement.value);
  }

  async upload() {
    const { cancelled, path } = await uploadImage();
    if (!cancelled) {
      this.inputElement.value = path;
      this.setValue(path);
    }
  }

  getOptions() {
    const getOptions = this.property?.input?.getOptions;
    if (typeof getOptions !== 'function') {
      return [];
    }
    return getOptions(this.element);
  }

  renderInputField() {
    return html`
      <div class="input-container">
        <vaadin-combo-box
          part="input"
          .items="${this.getOptions()}"
          value="${this.getValue()}"
          @change="${this.onInputChange}"
          theme="small"
          ?disabled="${this.isDisabled()}"
          ?allow-custom-value="${this.allowCustomValues()}"
        >
        </vaadin-combo-box>
        ${this.allowCustomValues() && this.property?.input?.enableUpload
          ? html`
              <vaadin-button
                theme="icon small tertiary"
                title="Upload Image"
                @click=${this.upload}
                ?disabled=${this.isDisabled()}
              >
                <vaadin-icon
                  slot="suffix"
                  icon="vaadin:upload"
                  style="cursor: pointer"
                ></vaadin-icon>
              </vaadin-button>
            `
          : ''}
      </div>
    `;
  }
}

customElements.define(
  'dashboard-string-dropdown-property-view',
  StringDropdownPropertyView
);
