
import { Webbit, html, css, svg } from '@webbitjs/webbit';

const easeOut = t => t * (2 - t);

class RotationAnimator {

  constructor(svg, startingAngle) {
    this.svg = svg;
    this.angle = null;
    this.setAngle(startingAngle);
    this.animationStartAngle = startingAngle;
    this.animationEndAngle = startingAngle;
    this.animationStartTime = 0;
    this.animationTime = 0;
    this.duration = 1;

    const step = () => {
      if (this.duration > this.animationTime) {
        this.animationTime = Math.min((Date.now() - this.animationStartTime) / 1000, this.duration);
      }
      const t = easeOut(this.animationTime / this.duration);
      this.setAngle(this.animationStartAngle + t * (this.animationEndAngle - this.animationStartAngle));

      window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }

  animate(angle) {
    this.animationStartTime = Date.now();
    this.animationTime = 0;
    this.animationStartAngle = this.angle;
    this.animationEndAngle = angle;
  }

  setAngle(angle) {
    this.angle = angle;
    this.svg.style.setProperty('--deg', `${angle}deg`);
  }
  
  setDuration(duration) {
    this.duration = duration;
  }
}


class ControlPanel extends Webbit {
  
  static get styles() {
    return css`

      :host {
        display: inline-flex;
        width: 300px;
        align-items: center;
        flex-direction: row;
        position: relative;
        margin: 15px;
      }

      [part=control-panel] {
        width: 100%;
        display: inline-block;
        border: none;
        border-radius: 50%;
        box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
        position: relative;
        font-size: 0;
      }

      svg {
        --deg: 25;
        width: 100%;
        transform: rotate(var(--deg));
      }

      [part=indicator] {
        margin-left: 15px;
        width: 50px;
        height: 50px;
        display: block;
        color: darkgray;
      }

      [part=indicator] iron-icon {
        display: block;
        width: 100%;
        height: 100%;
      }
    `;
  }

  static get properties() {
    return {
      currentColor: {type: String, primary: true },
      desiredColor: {type: String },
      clockwise: { type: Boolean },
      duration : { 
        type: Number,
        get() {
          return Math.max(0, this._duration);
        }
      },
    };
  }

  constructor() {
    super();
    this.colors = ['red','yellow','blue','green','red','yellow','blue','green'];
    this.desiredColor = '';
    this.currentColor = '';
    this.clockwise = false;
    this.positionIndex = 3;
    this.animator = null;
    this.duration = 1;
  }

  getRotation() {
    return 25 - (this.positionIndex - 3) * 45;
  }

  setPositionIndex() {
    const prevColorIndex = this.positionIndex % 8;
    for (let i = 1; i < 4; i++) {
      const colorIndex = (prevColorIndex + (this.clockwise ? -i : i)) % 8;
      if (this.colors[colorIndex >= 0 ? colorIndex : colorIndex + 8] === this.currentColor) {
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
    const [startX, startY] = this.getCoordinatesForPercent(.125 * index);
    const [endX, endY] = this.getCoordinatesForPercent(.125 * (index + 1));
    return  [
      `M ${startX} ${startY}`, // Move
      `A 1 1 0 0 1 ${endX} ${endY}`, // Arc
      `L 0 0`, // Line
    ].join(' ');
  }

  updated(changedProperties) {
    if (changedProperties.has('currentColor') && this.colors.indexOf(this.currentColor) >= 0) {
      this.setPositionIndex();
    }

    if (changedProperties.has('duration')) {
      this.animator.setDuration(this.duration);
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

  render() {
    return html`
      <div part="control-panel">
        ${svg`
          <svg viewBox="-1 -1 2 2">
            ${this.colors.map((color, index) => svg`
              <path
                class="color"
                fill="${color}"
                @click="${() => this.setDesiredColor(color)}"
                d="${this.getPath(index)}"
              >
              </path> 
            `)}   
          </svg>
        `}
      </div>
      <span 
        part="indicator" 
        style="${this.colors.indexOf(this.currentColor) >= 0 ? `color: ${this.currentColor}` : ''}">
        <iron-icon icon="vaadin:caret-left"></iron-icon>
      </span>
    `;
  }
}

webbitRegistry.define('frc-control-panel', ControlPanel);

