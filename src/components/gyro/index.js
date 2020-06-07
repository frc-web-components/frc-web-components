import { css, svg } from '@webbitjs/webbit';
import Container from '../container';

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

class Gyro extends Container {

  static get metadata() {
    return {
      displayName: 'Gyro',
      category: 'Robot & Field Info',
      //description: 'Component for displaying data from a 3-axis accelerometer.',
      documentationLink: 'https://frc-web-components.github.io/components/gyro/'
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host { 
          position: relative;
        }

        .container {
          height: var(--gyro-container-height);
        }

        svg {
          width: 80%;
          height: 80%;
          position: relative;
          top: 5%;
          left: 10%;
          overflow: visible;
        }

        :host([hide-label]) svg {
          width: 90%;
          height: 90%;
          top: 5%;
          left: 5%;
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
          font-size: var(--degree-label-font-size);
        }

        .angle-label {
          fill: black;
          text-anchor: middle;
          font-size: var(--angle-label-font-size);
        }
      `
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      value: { type: Number, primary: true },
      hideLabel: { type: Boolean, attribute: 'hide-label' },
      precision: { 
        type: Number,
        get() {
          return clamp(this._precision, 0, 100);
        }
      }
    };
  }

  constructor() {
    super();
    this.width = '300px';
    this.height = 'auto';
    this.value = 0;
    this.hideLabel = false;
    this.precision = 2;

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
    this.containerNode = this.shadowRoot.querySelector('.container');
  }

  resized() {
    const { width } = this.getBoundingClientRect();
    this.containerNode.style.setProperty('--gyro-container-height', `${width}px`);
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

  renderAngleLabel() {

    if (this.hideLabel) {
      return null;
    }

    const width = this.getWidth();

    const edgeElement = this.shadowRoot.querySelector('svg');

    if (edgeElement) {
      edgeElement.style.setProperty('--angle-label-font-size', `${width * .08}px`);
    }

    const x = width / 2;
    const y = width + width * .15;

    return svg`
      <text class="angle-label" x="${x}" y="${y}">${this.value.toFixed(this.precision)}&deg;</text>
    `;
  }
  

  render() {
    return svg`
      <div class="container">
        <svg>
          ${this.renderEdge()}
          ${this.renderTicks()}
          ${this.renderDialHand()}
          ${this.renderDialCircle()}
          ${this.renderDegreeLabels()}
          ${this.renderAngleLabel()}
        </svg>
      </div>
    `;
  }
}

webbitRegistry.define('frc-gyro', Gyro);