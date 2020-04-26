import { Webbit, css, svg } from '@webbitjs/webbit';

class Gyro extends Webbit {

  static get styles() {
    return css`
      :host { 
        display: inline-block; 
        width: 300px;
        height: 300px;
        position: relative;
        font-family: sans-serif;
      }

      svg {
        width: calc(90%);
        height: calc(90%);
        position: relative;
        top: 5%;
        left: 5%;
        overflow: visible;
        font-size: var(--degree-label-font-size);
      }

      svg .edge {
        fill: none;
        stroke: black;
        stroke-width: 1px;
        color: black;
        overflow: overlay;
      }

      .tick {
        stroke: #bbb;
        stroke-width: 1px;
      }

      .tick.big {
        stroke-width: 2px;
        stroke: black;
      }

      .dial-circle {
        fill: #ddd;
        stroke: white;
        stroke-width: 1%;
      }

      .dial-hand {
        fill: blue;
        stroke: blue;
        stroke-width: 3px;
      }

      .degree-label {
        fill: black;
        text-anchor: middle;
        alignment-baseline: middle;
      }
    `;
  }

  static get properties() {
    return {
      value: { type: Number, primary: true },
    };
  }

  constructor() {
    super();
    this.value = 0;

    this.tickAngles = [];

    for (let angle = 0; angle <= 360; angle += 5) {
      this.tickAngles.push(angle);
    }

    this.degreeLabelAngles = [];

    for (let angle = 0; angle < 360; angle += 45) {
      this.degreeLabelAngles.push(angle);
    }
  }

  firstUpdated() {
    const resizeObserver = new ResizeObserver(() => {
      this.requestUpdate();
    });
    resizeObserver.observe(this);
    this.requestUpdate();
  }

  getWidth() {
    const edgeElement = this.shadowRoot.querySelector('svg');

    if (!edgeElement) {
      return 0;
    }

    const { width } = edgeElement.getBoundingClientRect();
    return width;
  }

  renderTicks() {
    const width = this.getWidth();
    const innerRadius = width / 2 - width / 20;
    const outerRadius = width / 2 - width / 10;
    
    return svg`
      ${this.tickAngles.map(angle => {
        const radians = angle * Math.PI / 180;
        const x1 = width / 2 + innerRadius * Math.cos(radians);
        const y1 = width / 2 + innerRadius * Math.sin(radians);
        const x2 = width / 2 + outerRadius * Math.cos(radians);
        const y2 = width / 2 + outerRadius * Math.sin(radians);
        const bigTick = angle % 45 === 0;
        return svg`
          <line
            class="tick ${bigTick ? 'big' : ''}"
            x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          />
        `;
      })}
    `;
  }

  renderEdge() {
    const width = this.getWidth();
    const cx = width * .5;
    const cy = width * .5;
    const radius = width * .4;

    return svg`
      <circle class="edge" cx="${cx}" cy="${cy}" r="${radius}" />
    `;
  }

  renderDialHand() {
    const width = this.getWidth();

    const outerRadius = width / 2 - width / 20 - width / 40;

    const radians = (this.value - 90) * Math.PI / 180;

    const x1 = width / 2;
    const y1 = width / 2;
    const x2 = width / 2 + outerRadius * Math.cos(radians);
    const y2 = width / 2 + outerRadius * Math.sin(radians);

    return svg`
      <line
        class="dial-hand"
        x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
      />
    `;
  }

  renderDialCircle() {
    const width = this.getWidth();
    const cx = width * .5;
    const cy = width * .5;
    const radius = width * .04;

    return svg`
      <circle class="dial-circle" cx="${cx}" cy="${cy}" r="${radius}" />
    `;
  }

  renderDegreeLabels() {
    const width = this.getWidth();
    const radius = width / 2 + width / 100;

    const edgeElement = this.shadowRoot.querySelector('svg');

    if (edgeElement) {
      edgeElement.style.setProperty('--degree-label-font-size', `${width * .055}px`);
    }
    
    return svg`
      ${this.degreeLabelAngles.map(angle => {
        const radians = (angle - 90) * Math.PI / 180;
        const x = width / 2 + radius * Math.cos(radians);
        const y = width / 2 + radius * Math.sin(radians);

        return svg`
          <text class="degree-label" x="${x}" y="${y}">${angle}</text>
        `;
      })}
    `;
  }
  

  render() {
    return svg`
      <svg>
        ${this.renderEdge()}
        ${this.renderTicks()}
        ${this.renderDialHand()}
        ${this.renderDialCircle()}
        ${this.renderDegreeLabels()}
      </svg>
    `;
  }
}

webbitRegistry.define('frc-gyro', Gyro);