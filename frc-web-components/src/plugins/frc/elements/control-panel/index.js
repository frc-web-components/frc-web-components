import { html, css, svg, LitElement } from 'lit';
import RotationAnimator from './rotation-animator';

export const elementName = 'frc-control-panel';

export const elementConfig = {
  dashboard: {
    displayName: 'Control Panel',
  },
  properties: {
    currentColor: {
      type: String,
      attribute: 'current-color',
      primary: true,
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return ['', 'red', 'yellow', 'blue', 'green'];
        },
      },
    },
    desiredColor: {
      type: String,
      attribute: 'desired-color',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return ['', 'red', 'yellow', 'blue', 'green'];
        },
      },
    },
    clockwise: { type: Boolean },
    duration: { type: Number, defaultValue: 1 },
  },
};

class ControlPanel extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: inline-flex;
      width: 300px;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      position: relative;
      margin: 15px;
    }

    [part='control-panel'] {
      width: 100%;
      max-width: var(--control-panel-height, 100%);
      display: inline-block;
      border: none;
      border-radius: 50%;
      box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
      position: relative;
      font-size: 0;
    }

    svg {
      --deg: 25;
      width: 100%;
      transform: rotate(var(--deg));
    }

    [part='indicator'] {
      margin-left: 15px;
      width: 50px;
      height: 50px;
      display: block;
      color: darkgray;
    }

    [part='indicator'] vaadin-icon {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  constructor() {
    super();
    this.colors = [
      'red',
      'yellow',
      'blue',
      'green',
      'red',
      'yellow',
      'blue',
      'green',
    ];
    this.positionIndex = 3;
    this.animator = null;

    // default values
    this.currentColor = '';
    this.desiredColor = '';
    this.clockwise = false;
    this.duration = 1;
  }

  getRotation() {
    return 25 - (this.positionIndex - 3) * 45;
  }

  setPositionIndex() {
    const prevColorIndex = this.positionIndex % 8;
    for (let i = 1; i < 4; i++) {
      const colorIndex = (prevColorIndex + (this.clockwise ? -i : i)) % 8;
      if (
        this.colors[colorIndex >= 0 ? colorIndex : colorIndex + 8] ===
        this.currentColor
      ) {
        this.positionIndex = this.positionIndex + (this.clockwise ? -i : i);
        this.animator.animate(this.getRotation());
        break;
      }
    }
  }

  getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  getPath(index) {
    const [startX, startY] = this.getCoordinatesForPercent(0.125 * index);
    const [endX, endY] = this.getCoordinatesForPercent(0.125 * (index + 1));
    return [
      `M ${startX} ${startY}`, // Move
      `A 1 1 0 0 1 ${endX} ${endY}`, // Arc
      `L 0 0`, // Line
    ].join(' ');
  }

  updated(changedProperties) {
    if (
      changedProperties.has('currentColor') &&
      this.colors.indexOf(this.currentColor) >= 0
    ) {
      this.setPositionIndex();
    }

    if (changedProperties.has('duration')) {
      this.animator.setDuration(Math.max(0, this.duration));
    }
  }

  firstUpdated() {
    this.svg = this.shadowRoot.querySelector('svg');
    this.animator = new RotationAnimator(
      this.shadowRoot.querySelector('svg'),
      this.getRotation()
    );
  }

  setDesiredColor(color) {
    this.desiredColor = color;
  }

  resized() {
    const { height } = this.getBoundingClientRect();
    this.style.setProperty('--control-panel-height', `${height}px`);
    this.requestUpdate();
  }

  render() {
    return html`
      <div part="control-panel">
        ${svg`
        <svg viewBox="-1 -1 2 2">
          ${this.colors.map(
            (color, index) => svg`
          <path class="color" fill="${color}" @click="${() =>
              this.setDesiredColor(color)}" d="${this.getPath(index)}">
          </path>
          `
          )}
        </svg>
        `}
      </div>
      <span part="indicator">
        <vaadin-icon icon="vaadin:caret-left"></vaadin-icon>
      </span>
    `;
  }
}

customElements.define(elementName, ControlPanel);
