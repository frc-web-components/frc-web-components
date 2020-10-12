import { Webbit, html, css } from '@webbitjs/webbit';
import * as CurvedArrow from '../curved-arrow';

/** 
 * Copyright (c) 2017-2018 FIRST
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of FIRST nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY FIRST AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY NONINFRINGEMENT AND FITNESS FOR A PARTICULAR 
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL FIRST OR CONTRIBUTORS BE LIABLE FOR 
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function clamp(value, min, max) {
  return Math.min(max, Math.max(value, min));
}

function map(x, minInput, maxInput, minOutput, maxOutput) {
  return (x - minInput) * (maxOutput - minOutput) / (maxInput - minInput) + minOutput;
}

function generateX(width) {
  const halfW = width / 2;
  const lineA = `
    <line 
      x1="${-halfW}"
      y1="${-halfW}"
      x2="${halfW}"
      y2="${halfW}"
    />
  `;

  const lineB = `
    <line 
      x1="${-halfW}"
      y1="${halfW}"
      x2="${halfW}"
      y2="${-halfW}"
    />
  `;

  return `<g class="x">${lineA} ${lineB}</g>`;
}

class DifferentialDrivebase extends Webbit {

  static get metadata() {
    return {
      displayName: 'Differential Drivebase',
      category: 'Robot & Field Info',
      description: 'Component used to display wheel speeds and robot trajectory information for differential drivebases.',
      documentationLink: 'https://frc-web-components.github.io/components/differential-drivebase/',
      slots: [],
      minSize: { width: 220, height: 100 },
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 400px;
        height: 300px;
        padding: 0 10px;
      }

      .diff-drive-container {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
      }

      svg {
        overflow: overlay;
        flex: 1;
        height: 100%;
      }

      svg .x {
          stroke: rgb(50,50,255);
          stroke-width: 2;
      }

      svg .arrow line, svg .arrow path {
          stroke: rgb(50,50,255);
          stroke-width: 2;
          fill: none;
      }

      svg .arrow polygon {
          stroke: rgb(50,50,255);
          fill: rgb(50,50,255);
      }

      svg .drivetrain {
          fill: none;
          stroke: black;
      }

      .bar {
          position: relative;
          height: calc(100% - 30px);
          width: 20px;
          border-radius: 3px;
          margin: 15px 0;
          background: #DDD;
      }

      .speed {
          display: flex;
          height: 100%;
          flex-direction: row;
          align-items: center;
          margin-left: 30px;
      }

      table-axis {
          width: 10px;
          height: calc(100% - 35px);
      }

      .foreground {
          position: absolute;
          top: 0;
          width: 20px;
          background: lightblue;
          border-radius: 3px;
      }
    `;
  }

  static get properties() {
    return {
      leftMotorSpeed: { 
        type: Number, 
        attribute: 'left-motor-speed',
        get() {
          return clamp(this._leftMotorSpeed, -1, 1);
        }
       },
      rightMotorSpeed: { 
        type: Number, 
        attribute: 'right-motor-speed',
        get() {
          return clamp(this._rightMotorSpeed, -1, 1);
        }
       }
    };
  }

  constructor() {
    super();
    this.leftMotorSpeed = 0;
    this.rightMotorSpeed = 0;
  }

  drawMotionVector(left, right) {

    const svgNode = this.shadowRoot.getElementById('svg');
    const rect = svgNode.getBoundingClientRect();

    const wheelWidth = rect.width * .13;
    const padding = 20;
    const verticalPadding = 20;

    const FRAME_WIDTH = rect.width - (wheelWidth + padding) * 2;
    const FRAME_HEIGHT = rect.height - verticalPadding * 2;

    // Barely moving, or not moving at all. Curved arrows look weird at low radii, so show an X instead
    if (Math.abs(left) <= 0.05 && Math.abs(right) <= 0.05) {
      return generateX(rect.width * .2);
    }

    // Max radius is half of the narrowest dimension, minus padding to avoid clipping with the frame
    const maxRadius = Math.min(FRAME_WIDTH, FRAME_HEIGHT) / 2 - 8;
    const arrowheadSize = 8;
    if (Math.abs(left - right) <= 0.001) {
      // Moving more-or-less straight (or not moving at all)
      // Using a threshold instead of a simpler `if(left == right)` avoids edge cases where left and right are very
      // close, which can cause floating-point issues with extremely large radii (on the order of 1E15 pixels)
      // and extremely small arc lengths (on the order of 1E-15 degrees)
      let arrow = CurvedArrow.createStraight(Math.abs(left * maxRadius), -Math.sign(left) * Math.PI / 2, 0, arrowheadSize);
      return `<g class="arrow">${arrow}</g>`;
    }
    // Moving in an arc

    const pi = Math.PI;
    const moment = (right - left) / 2;
    const avgSpeed = (left + right) / 2;
    const turnRadius = avgSpeed / moment;

    let arrow;

    if (Math.abs(turnRadius) >= 1) {
      // Motion is mostly forward/backward, and curving to a side

      const arcSign = -Math.sign(turnRadius);  // +1 if arc is to left of frame, -1 if arc is to the right
      const startAngle = (arcSign + 1) * pi / 2; // pi if arc is to the right, 0 if to the left
      let radius = Math.abs(turnRadius * maxRadius);
      arrow = CurvedArrow.create(startAngle, radius, arcSign * avgSpeed * maxRadius, arcSign * radius, arrowheadSize);
    } 
    else {
      // Turning about a point inside the frame of the robot
      const turnSign = Math.sign(left - right); // positive for clockwise, negative for counter-clockwise
      if (turnRadius == 0) {
        // Special case, rotating about the center of the frame
        let radius = Math.max(left, right) * maxRadius; // left == -right, we just want the positive one
        let angle = turnSign * pi;
        let start = moment < 0 ? pi : 0;
        arrow = CurvedArrow.createPolar(start, radius, angle, 0, arrowheadSize);
      } else {
        let dominant = turnRadius < 0 ? left : right;  // the dominant side that's driving the robot
        let secondary = turnRadius < 0 ? right : left; // the non-dominant side
        let radius = Math.abs(dominant) * maxRadius;   // make radius dependent on how fast the dominant side is
        let centerX = -turnRadius * radius;
        let angle = map(secondary / dominant, 0, -1, 0.5, pi);
        let start = turnRadius < 0 ? pi : 0;
        arrow = CurvedArrow.createPolar(start, radius, turnSign * angle, centerX, arrowheadSize);
      }
    }
    return `<g class="arrow">${arrow}</g>`;
  }

  drawDrivetrain() {

    const svgNode = this.shadowRoot.getElementById('svg');
    const rect = svgNode.getBoundingClientRect();

    const wheelWidth = rect.width * .13;
    const wheelRadius = Math.min(rect.width * .13, rect.height * .15);
    const padding = 20;
    const verticalPadding = 20;
    
    
    const base = `
      <rect 
        width="calc(100% - ${(wheelWidth + padding) * 2}px)" 
        height="calc(100% - ${verticalPadding * 2}px)"
        x="${wheelWidth + padding}" 
        y="20px" 
      />
    `;

    const tlWheel = `
      <rect 
        width="${wheelWidth}px" 
        height="${wheelRadius * 2}" 
        x="${padding}px" 
        y="${verticalPadding}px" 
      />
    `;

    const trWheel = `
      <rect 
        width="${wheelWidth}px" 
        height="${wheelRadius * 2}" 
        x="calc(100% - ${wheelWidth + padding}px)" 
        y="${verticalPadding}px" 
      />
    `;

    const blWheel = `
      <rect 
        width="${wheelWidth}px" 
        height="${wheelRadius * 2}" 
        x="${padding}px"
        y="calc(100% - ${wheelRadius * 2 + verticalPadding}px)"
      />
    `;

    const brWheel = `
      <rect 
        width="${wheelWidth}px" 
        height="${wheelRadius * 2}" 
        x="calc(100% - ${wheelWidth + padding}px)" 
        y="calc(100% - ${wheelRadius * 2 + verticalPadding}px)"
      />
    `;

    return base + tlWheel + trWheel + blWheel + brWheel;
  }


  getLeftForegroundStyle() {
    return this.getForegroundStyle(this.leftMotorSpeed);
  }

  getRightForegroundStyle() {
    return this.getForegroundStyle(this.rightMotorSpeed);
  }

  getForegroundStyle(value) {
    const min = -1;
    const max = 1;
    const val = clamp(value, min, max);

    if (max < 0) {
      return `
        height: ${Math.abs(val - max) / (max - min) * 100}%;
        top: 'auto';
        bottom: 0;
      `;
    }
    else if (min > 0) {
      return `
        height: ${Math.abs(val - min) / (max - min) * 100}%;
        top: 0;
        bottom: 'auto';
      `;
    }
    else if (val > 0) {
      return `
        height: ${Math.abs(val) / (max - min) * 100}%;
        top: auto;
        bottom: 50%;
      `;
    }
    else {
      return `
        height: ${Math.abs(val) / (max - min) * 100}%;
        top: 50%;
        bottom: auto;
      `;
    }
  }

  firstUpdated() {
    super.firstUpdated();
    let drawing = this.drawMotionVector(0, 0);
    this.shadowRoot.getElementById('drivetrain').innerHTML = this.drawDrivetrain();
    this.shadowRoot.getElementById('forceVector').innerHTML = drawing;
  }

  resized() {
    let drawing = this.drawMotionVector(this.leftMotorSpeed, this.rightMotorSpeed);
    this.shadowRoot.getElementById('forceVector').innerHTML = drawing;
    const svgNode = this.shadowRoot.getElementById('svg');
    const rect = svgNode.getBoundingClientRect();
    this.shadowRoot.getElementById('forceVector').style.transform = `translate(${rect.width * .5}px, ${rect.height * .5}px)`;
    this.shadowRoot.getElementById('drivetrain').innerHTML = this.drawDrivetrain();
  }

  updated() {
    let drawing = this.drawMotionVector(this.leftMotorSpeed, this.rightMotorSpeed);
    this.shadowRoot.getElementById('forceVector').innerHTML = drawing;
  }

  render() {
    return html`
      <div class="diff-drive-container">

        <div class="speed">
            <table-axis ticks="5" vertical .range="${[1, -1]}"></table-axis>
            <div class="bar">
                <div class="foreground" style="${this.getLeftForegroundStyle()}"></div>
            </div>
        </div>
        <svg id="svg">
            <g id="forceVector"></g>
            <g id="drivetrain" class="drivetrain"></g>
        </svg>

        <div class="speed">
            <table-axis ticks="5" vertical .range="${[1, -1]}"></table-axis>
            <div class="bar">
                <div class="foreground" style="${this.getRightForegroundStyle()}"></div>
            </div>
        </div>
      </div>
    `;
  }
}

webbitRegistry.define('frc-differential-drivebase', DifferentialDrivebase);