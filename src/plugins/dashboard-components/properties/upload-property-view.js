import PropertyView from './property-view';
import { html } from 'lit';
import uploadImage from './upload-image';

class UploadPropertyView extends PropertyView {
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

  renderInputField() {
    return html`
      <vaadin-text-field
        part="input"
        .value=${this.getValue() ?? ''}
        @change="${this.onInputChange}"
        theme="small"
        ?disabled="${this.isDisabled()}"
      >
        <vaadin-icon
          title="Upload Image"
          slot="suffix"
          icon="vaadin:upload"
          style="cursor: pointer"
          @click=${this.upload}
        ></vaadin-icon>
      </vaadin-text-field>
    `;
  }
}

customElements.define('dashboard-upload-property-view', UploadPropertyView);
