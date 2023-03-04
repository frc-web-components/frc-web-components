/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import { svg, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import Store, { Source, SourceProvider } from '@webbitjs/store';

export const elementName = 'frc-mechanism2d';

interface Mechanism2dLine {
  angle: number;
  color: string;
  length: number;
  weight: number;
  children: Mechanism2dLine[];
}

interface Mechanism2dRoot {
  x: number;
  y: number;
  children: Mechanism2dLine[];
}

interface Mechanism2d {
  backgroundColor: string;
  dims: [number, number];
  roots: Mechanism2dRoot[];
}

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
export class Mechanism2dElement extends LitElement {
  @property({ type: String, attribute: 'background-color' }) backgroundColor =
    '#000020';
  @property({ type: Array }) dims: [number, number] = [3, 3];
  @property({ type: Object, attribute: false }) provider?: SourceProvider;
  @property({ type: Object, attribute: false }) store?: Store;
  @property({ type: String, attribute: 'source-provider' }) sourceProvider = '';
  @property({ type: String, attribute: 'source-key' }) sourceKey = '';

  @query('svg') _svg!: SVGSVGElement;
  @state() mechanism2d: Mechanism2d = this.getMechanism2d();

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

    requestAnimationFrame(() => {
      this.updateMechanism2d();
    });
  }

  getMech2dSize(): [number, number] {
    const { width, height } = this.getBoundingClientRect();
    const [mechWidth, mechHeight] = this.dims;

    if ((mechHeight / mechWidth) * width < height) {
      return [width, (mechHeight / mechWidth) * width];
    } else {
      return [(mechWidth / mechHeight) * height, height];
    }
  }

  resized(): void {
    this.requestUpdate();
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
      this.requestUpdate();
    }
  }

  getSource(): Source | undefined {
    const { provider, store, sourceProvider, sourceKey } = this;
    if (!provider || !store || !sourceProvider || !sourceKey) {
      return undefined;
    }
    return store.getSource(sourceProvider, sourceKey);
  }

  updateMechanism2d(): void {
    this.mechanism2d = this.getMechanism2d();
    requestAnimationFrame(() => {
      this.updateMechanism2d();
    });
  }

  getMechanism2d(): Mechanism2d {
    const mech2d: Mechanism2d = {
      backgroundColor: this.backgroundColor,
      dims: this.dims,
      roots: this.getMechanism2dRoots(),
    };
    return mech2d;
  }

  getMechanism2dRoots(): Mechanism2dRoot[] {
    const source = this.getSource();
    if (!source) {
      return [];
    }
    const children: Record<string, Source> = source?.getChildren() ?? {};
    const rootSources = Object.values(children).filter((source) => {
      return source.hasChildren();
    });
    const roots: Mechanism2dRoot[] = rootSources.map((rootSource) => {
      const root: Mechanism2dRoot = {
        x: (rootSource.getChildren()['x'].getSourceValue() as number) ?? 0,
        y: (rootSource.getChildren()['y'].getSourceValue() as number) ?? 0,
        children: this.getMechanism2dLines(rootSource),
      };
      return root;
    });
    return roots;
  }

  getMechanism2dLines(source: Source): Mechanism2dLine[] {
    const children: Record<string, Source> = source?.getChildren() ?? {};
    const lineSources = Object.values(children).filter((source) => {
      return (
        source.hasChildren() &&
        source.getChildren()['.type']?.getSourceValue() === 'line'
      );
    });
    const lines: Mechanism2dLine[] = lineSources.map((lineSource) => {
      const children = lineSource.getChildren();
      const line: Mechanism2dLine = {
        angle: (children['angle'].getSourceValue() as number) ?? 0,
        color: (children['color'].getSourceValue() as string) ?? '#ffffff',
        length: (children['length'].getSourceValue() as number) ?? 1,
        weight: (children['weight'].getSourceValue() as number) ?? 1,
        children: this.getMechanism2dLines(lineSource),
      };
      return line;
    });
    return lines;
  }

  render(): TemplateResult {
    const [width, height] = this.getMech2dSize();
    return svg`
      <svg
        style="width: ${width}px; height: ${height}px; background: ${
      this.mechanism2d.backgroundColor
    }"
      >
        ${this.mechanism2d.roots.map((root) =>
          this.renderMechanism2dRoot(root)
        )}
      </svg>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  renderMechanism2dRoot(root: Mechanism2dRoot): TemplateResult {
    const [width, height] = this.dims;
    const [svgWidth, svgHeight] = this.getMech2dSize();

    const x = (root.x / width) * svgWidth;
    const y = (root.y / height) * svgHeight;

    return svg`
      <g style="transform: translate(${x}px, ${svgHeight - y}px)">
        ${root.children.map((line) => this.renderMechanism2dLine(line))}
      </g>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  renderMechanism2dLine(line: Mechanism2dLine): TemplateResult {
    const [width] = this.dims;
    const [svgWidth] = this.getMech2dSize();
    const length = (svgWidth / width) * line.length;
    const angleRadians = (line.angle * Math.PI) / 180;
    const x = Math.cos(angleRadians) * length;
    const y = -Math.sin(angleRadians) * length;
    const weight = Math.max(1, (line.weight * 2) / 3);
    return svg`
      <line stroke=${
        line.color
      } stroke-width=${weight} x1="0" y1="0" x2="${x}px" y2="${y}px"  />
      <g style="transform: translate(${x}px, ${y}px) rotate(${-line.angle}deg)">
        ${line.children.map((child) => this.renderMechanism2dLine(child))}
      </g>
    `;
  }
}
