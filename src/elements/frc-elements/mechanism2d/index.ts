/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { svg, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import Store, { Source, SourceProvider } from '@webbitjs/store';

export const elementName = 'frc-mechanism2d';

export default {
  dashboard: {
    displayName: 'Mechanism2d',
  },
  properties: {
    backgroundColor: {
      type: 'String',
      attribute: 'background-color',
      defaultValue: '#000020',
      input: { type: 'ColorPicker' },
    },
    dims: {
      type: 'Array',
      defaultValue: [3, 3],
      input: { type: 'NumberArray' },
    },
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
  },
};

@customElement('frc-mechanism2d')
export class Mechanism2d extends LitElement {
  @property({ type: String, attribute: 'background-color' }) backgroundColor =
    '#000020';
  @property({ type: Array }) dims: [number, number] = [3, 3];
  @property({ type: Object, attribute: false }) provider?: SourceProvider;
  @property({ type: Object, attribute: false }) store?: Store;
  @property({ type: String, attribute: 'source-provider' }) sourceProvider = '';
  @property({ type: String, attribute: 'source-key' }) sourceKey = '';

  @query('svg') _svg!: SVGSVGElement;

  #unsubscriber?: () => void;

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 300px;
      height: 300px;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `;

  firstUpdated(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.resized();
    });
    resizeObserver.observe(this);
    this.updateMech2dSize();
  }

  updateMech2dSize(): void {
    const { width, height } = this.getBoundingClientRect();
    const [mechWidth, mechHeight] = this.dims;
    if ((mechHeight / mechWidth) * width < height) {
      this._svg.style.setProperty('width', `${width}px`);
      this._svg.style.setProperty(
        'height',
        `${(mechHeight / mechWidth) * width}px`
      );
    } else {
      this._svg.style.setProperty(
        'width',
        `${(mechWidth / mechHeight) * height}px`
      );
      this._svg.style.setProperty('height', `${height}px`);
    }
  }

  resized(): void {
    this.updateMech2dSize();
  }

  getSize(): number {
    const { width } = this.getBoundingClientRect();
    return width;
  }

  updated(changedProps: Map<string, unknown>): void {
    if (changedProps.has('backgroundColor')) {
      this._svg.style.setProperty('background-color', this.backgroundColor);
    }

    if (changedProps.has('dims')) {
      this.updateMech2dSize();
    }

    if (
      changedProps.has('provider') ||
      changedProps.has('store') ||
      changedProps.has('sourceProvider') ||
      changedProps.has('sourceKey')
    ) {
      this.updateSource();
    }
  }

  updateSource(): void {
    this.#unsubscriber?.();
    const { provider, store, sourceProvider, sourceKey } = this;
    if (!provider || !store || !sourceProvider || !sourceKey) {
      return;
    }

    this.#unsubscriber = store.subscribe(
      sourceProvider,
      sourceKey,
      () => {
        this.updateChildren(store.getSource(sourceProvider, sourceKey));
      },
      true
    );
  }

  // eslint-disable-next-line class-methods-use-this
  updateChildren(source: Source | undefined): void {
    if (!source) {
      // remove children
    }
    const children: Record<string, Source> = source?.getChildren() ?? {};
    console.log('children:', children);
  }

  // eslint-disable-next-line class-methods-use-this
  render(): TemplateResult {
    return svg`
        <svg></svg>
    `;
  }
}
