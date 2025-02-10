import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import getPoses from './get-poses';
import { FieldObjectApi } from './field-interfaces';

export class FieldPath extends LitElement {
  @property({ type: Array }) poses:
    | Uint8Array
    | number[]
    | (Uint8Array | number[])[] = [];
  @property({ type: Array }) translations: Uint8Array | number[] = [];
  @property({ type: String }) color = '#FFA500';
  @property({ type: String }) unit: string | null = 'inherit';
  @property({ type: Number, attribute: 'line-width' }) lineWidth = 4;
  @property({ type: Number }) opacity = 0.7;

  @state() _poses: (Uint8Array | number[])[] = [];
  @state() _translations: (Uint8Array | number[])[] = [];

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('poses')) {
      if (
        typeof this.poses?.[0] === 'number' ||
        this.poses instanceof Uint8Array
      ) {
        this._poses = getPoses(this.poses as any);
      } else {
        this._poses = this.poses as any;
      }
    }
    if (changedProps.has('translations')) {
      this._translations = getPoses(this.translations, 2);
    }
  }

  draw({ canvas, unit: parentUnit, xToPx, yToPx }: FieldObjectApi): void {
    const unit =
      this.unit === 'inherit' || this.unit === null ? parentUnit : this.unit;

    canvas.lineWidth = this.lineWidth;
    canvas.strokeStyle = this.color;
    canvas.globalAlpha = this.opacity;

    if (this._poses.length > 1) {
      for (let i = 0; i < this._poses.length - 1; i += 1) {
        const [x1, y1] = this._poses[i];
        const [x2, y2] = this._poses[i + 1];
        canvas.moveTo(xToPx(x1, unit), yToPx(y1, unit));
        canvas.lineTo(xToPx(x2, unit), yToPx(y2, unit));
      }

      canvas.stroke();
    }

    if (this._translations.length > 1) {
      for (let i = 0; i < this._translations.length - 1; i += 1) {
        const [x1, y1] = this._translations[i];
        const [x2, y2] = this._translations[i + 1];
        canvas.moveTo(xToPx(x1, unit), yToPx(y1, unit));
        canvas.lineTo(xToPx(x2, unit), yToPx(y2, unit));
      }

      canvas.stroke();
    }
  }
}

if (!customElements.get('frc-field-path')) {
  customElements.define('frc-field-path', FieldPath);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-field-path': FieldPath;
  }
}
