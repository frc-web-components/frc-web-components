import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import Store, { SourceProvider } from '@webbitjs/store';
import { WebbitConfig } from '@webbitjs/webbit';
import { configs as fieldConfigs } from '../field-configs';
import FieldObjectManager, { FieldObject } from './field-object-manager';
import { baseUnit, toBaseConversions } from '../units';
import { CropType } from '../field-interfaces';

export const fieldDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Field',
  },
  properties: {
    provider: { type: 'SourceProvider', property: 'provider' },
    store: { type: 'Store', property: 'store' },
    sourceProvider: {
      type: 'String',
      attribute: 'source-provider',
      input: { type: 'None' },
    },
    sourceKey: {
      type: 'String',
      attribute: 'source-key',
      input: { type: 'None' },
    },
    game: {
      type: 'String',
      defaultValue: 'Charged Up',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions(): string[] {
          return fieldConfigs.map((field) => field.game);
        },
      },
    },
    rotationUnit: {
      type: 'String',
      attribute: 'rotation-unit',
      defaultValue: 'deg',
      input: {
        type: 'StringDropdown',
        getOptions: () => ['deg', 'rad'],
        allowCustomValues: false,
      },
    },
    unit: {
      type: 'String',
      defaultValue: baseUnit,
      input: {
        type: 'StringDropdown',
        getOptions(): string[] {
          return Object.keys(toBaseConversions);
        },
        allowCustomValues: false,
      },
    },
    rotation: {
      type: 'Number',
      input: {
        type: 'Number',
        min: -360,
        max: 360,
      },
    },
    showGrid: {
      type: 'Boolean',
      attribute: 'show-grid',
    },
    gridSize: {
      type: 'Number',
      attribute: 'grid-size',
      input: {
        type: 'Number',
        min: 0,
      },
    },
    origin: {
      type: 'String',
      defaultValue: 'blue',
      input: {
        type: 'StringDropdown',
        getOptions: () => ['blue', 'red'],
        allowCustomValues: false,
      },
    },
    cropLeft: {
      type: 'Number',
      attribute: 'crop-left',
      input: {
        type: 'Number',
        min: 0,
        max: 100,
      },
    },
    cropRight: {
      type: 'Number',
      defaultValue: 100,
      attribute: 'crop-right',
      input: {
        type: 'Number',
        min: 0,
        max: 100,
      },
    },
    cropTop: {
      type: 'Number',
      attribute: 'crop-top',
      input: {
        type: 'Number',
        min: 0,
        max: 100,
      },
    },
    cropBottom: {
      type: 'Number',
      defaultValue: 100,
      attribute: 'crop-bottom',
      input: {
        type: 'Number',
        min: 0,
        max: 100,
      },
    },
  },
  demos: [
    {
      html: `
      <frc-field-wrapper source-key="/SmartDashboard/Field" source-provider="NetworkTables">
      </frc-field-wrapper>
    `,
    },
  ],
};

export class FieldWrapper extends LitElement {
  @property({ type: Object, attribute: false }) provider?: SourceProvider;
  @property({ type: Object, attribute: false }) store?: Store;
  @property({ type: String, attribute: 'source-provider' }) sourceProvider = '';
  @property({ type: String, attribute: 'source-key' }) sourceKey = '';

  @property({ type: String }) game = fieldConfigs[0].game;
  @property({ type: Number, attribute: 'crop-top' }) cropTop = 0;
  @property({ type: Number, attribute: 'crop-bottom' }) cropBottom = 100;
  @property({ type: Number, attribute: 'crop-left' }) cropLeft = 0;
  @property({ type: Number, attribute: 'crop-right' }) cropRight = 100;
  @property({ type: String, attribute: 'crop-type' }) cropType: CropType =
    'percent';
  @property({ type: String }) unit = baseUnit;
  @property({ type: String, attribute: 'rotation-unit' }) rotationUnit:
    | 'deg'
    | 'rad' = 'deg';
  @property({ type: Number }) rotation = 0;
  @property({ type: Boolean, attribute: 'show-grid' }) showGrid = false;
  @property({ type: Number, attribute: 'grid-size' }) gridSize = 1;
  @property({ type: String }) origin: 'red' | 'blue' = 'blue';
  @state() fieldObjects: FieldObject[] = [];

  private fieldObjectManager!: FieldObjectManager;

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      width: 500px;
      height: 300px;
    }

    frc-field {
      width: 100%;
      height: 100%;
    }
  `;

  protected firstUpdated(): void {
    if (this.store) {
      this.fieldObjectManager = new FieldObjectManager(
        this.store,
        (objects) => {
          this.fieldObjects = objects;
        }
      );
    }
  }

  protected updated(changedProperties: Map<string, any>) {
    if (
      changedProperties.has('sourceKey') ||
      changedProperties.has('sourceProvider')
    ) {
      this.fieldObjectManager.setSource(this.sourceKey, this.sourceProvider);
    }
  }

  render() {
    return html`
      <frc-field
        game=${this.game}
        unit=${this.unit}
        rotation-unit=${this.rotationUnit}
        rotation=${this.rotation}
        ?show-grid=${this.showGrid}
        grid-size=${this.gridSize}
        origin=${this.origin}
        crop-top=${this.cropTop / 100}
        crop-bottom=${this.cropBottom / 100}
        crop-left=${this.cropLeft / 100}
        crop-right=${this.cropRight / 100}
        crop-type=${this.cropType}
      >
        ${this.fieldObjects.map((object) => {
          if (object.type === 'robot') {
            return html`<frc-field-robot
              .pose=${object.poses[0]}
            ></frc-field-robot>`;
          }
          return html`<frc-field-path .poses=${object.poses}></frc-field-path>`;
        })}
      </frc-field>
    `;
  }
}

if (!customElements.get('frc-field-wrapper')) {
  customElements.define('frc-field-wrapper', FieldWrapper);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-field-wrapper': FieldWrapper;
  }
}
