import { svg, css, LitElement, TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { Source } from '@webbitjs/store';

export interface Mechanism2dLine {
  angle: number;
  color: string;
  length: number;
  weight: number;
  children: Mechanism2dLine[];
}

export interface Mechanism2dRoot {
  x: number;
  y: number;
  children: Mechanism2dLine[];
}

interface IMechanism2d {
  backgroundColor: string;
  dims: [number, number];
  roots: Mechanism2dRoot[];
}

export function getMechanism2dLines(source: Source): Mechanism2dLine[] {
  const children: Record<string, Source> = source?.getChildren() ?? {};
  const lineSources = Object.values(children).filter(
    (lineSource) =>
      lineSource.hasChildren() &&
      lineSource.getChildren()['.type']?.getSourceValue() === 'line',
  );
  const lines: Mechanism2dLine[] = lineSources.map((lineSource) => {
    const lineChildren = lineSource.getChildren();
    const line: Mechanism2dLine = {
      angle: (lineChildren.angle.getSourceValue() as number) ?? 0,
      color: (lineChildren.color.getSourceValue() as string) ?? '#ffffff',
      length: (lineChildren.length.getSourceValue() as number) ?? 1,
      weight: (lineChildren.weight.getSourceValue() as number) ?? 1,
      children: getMechanism2dLines(lineSource),
    };
    return line;
  });
  return lines;
}

export function getMechanism2dRoots(source: Source): Mechanism2dRoot[] {
  const children: Record<string, Source> = source?.getChildren() ?? {};
  const rootSources = Object.values(children).filter((rootSource) =>
    rootSource.hasChildren(),
  );
  const roots: Mechanism2dRoot[] = rootSources.map((rootSource) => {
    const root: Mechanism2dRoot = {
      x: (rootSource.getChildren().x.getSourceValue() as number) ?? 0,
      y: (rootSource.getChildren().y.getSourceValue() as number) ?? 0,
      children: getMechanism2dLines(rootSource),
    };
    return root;
  });
  return roots;
}

export class Mechanism2d extends LitElement {
  @property({ type: String, attribute: 'background-color' }) backgroundColor =
    '#000020';
  @property({ type: Array }) dims: [number, number] = [3, 3];
  @property({ type: Array }) roots: Mechanism2dRoot[] = [];

  @query('svg') _svg!: SVGSVGElement;
  @state() mechanism2d: IMechanism2d = this.getMechanism2d();

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
    }
    return [(mechWidth / mechHeight) * height, height];
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

  updateMechanism2d(): void {
    this.mechanism2d = this.getMechanism2d();
    requestAnimationFrame(() => {
      this.updateMechanism2d();
    });
  }

  getMechanism2d(): IMechanism2d {
    const mech2d: IMechanism2d = {
      backgroundColor: this.backgroundColor,
      dims: this.dims,
      roots: this.roots,
    };
    return mech2d;
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
          this.renderMechanism2dRoot(root),
        )}
      </svg>
    `;
  }

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

export default Mechanism2d;

if (!customElements.get('frc-mechanism2d')) {
  customElements.define('frc-mechanism2d', Mechanism2d);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-mechanism2d': Mechanism2d;
  }
}
