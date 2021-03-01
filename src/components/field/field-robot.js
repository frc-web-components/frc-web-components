import FieldObject from './field-object';
import { objectWithout } from './utils';
import { convert } from './units';

class FieldRobot extends FieldObject {

  static get dashboardConfig() {
    return {
      displayName: 'Field Robot',
      category: 'Field',
      // description: 'Component for displaying information about an encoder',
      // documentationLink: 'https://frc-web-components.github.io/components/encoder/',
      allowedParents: ['frc-field'],
      allowedChildren: ['frc-field-camera', 'frc-field-object']
    };
  }

  static get properties() {
    return {
      ...objectWithout(super.properties, ['draw']),
      color: { type: String, inputType: 'ColorPicker' },
      pose: { type: Array, inputType: 'hidden', primary: true },
    };  
  }

  constructor() {
    super();
    this.color = '#0000ff';
    this.width = .6;
    this.height = .9;
    this.sourceKey = '/SmartDashboard/Field/Robot';
    this.sourceProvider = 'NetworkTables';
    this.unit = 'm';
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('pose') && this.pose instanceof Array && this.pose.length === 3) {
      const [x, y, angle] = this.pose;
      this.x = x;
      this.y = y;
      this.rot = angle;
    }
  }

  renderDrawing({ bottomCtx, scalingFactor }) {
    bottomCtx.fillStyle = this.color;
    bottomCtx.moveTo(0, 0);
    bottomCtx.fillRect(-this.width / 2,  -this.height / 2, this.width, this.height);

    bottomCtx.beginPath();
    bottomCtx.strokeStyle = 'black';
    bottomCtx.lineWidth = 2 / scalingFactor;
    bottomCtx.moveTo(0, 0);
    bottomCtx.rect(-this.width / 2,  -this.height / 2, this.width, this.height);
    bottomCtx.stroke();


    // draw wheels
    const wheelRadius = Math.min(this.width * .17, this.height * .19);
    const wheelWidth = wheelRadius;

    const verticalPadding = this.height * .1;

    bottomCtx.beginPath();
    bottomCtx.fillStyle = 'black';
    bottomCtx.moveTo(0, 0);
    
    // front left
    bottomCtx.fillRect(
      -this.width / 2 - wheelWidth / 2, 
      this.height / 2 - wheelRadius * 2 - verticalPadding, 
      wheelWidth, 
      wheelRadius * 2
    );

    // front right
    bottomCtx.fillRect(
      this.width / 2 - wheelWidth / 2, 
      this.height / 2 - wheelRadius * 2 - verticalPadding, 
      wheelWidth, 
      wheelRadius * 2
    );

    // rear left
    bottomCtx.fillRect(
      -this.width / 2 - wheelWidth / 2, 
      -this.height / 2 + verticalPadding,
      wheelWidth, 
      wheelRadius * 2
    );

    // rear right
    bottomCtx.fillRect(
      this.width / 2 - wheelWidth / 2, 
      -this.height / 2 + verticalPadding,
      wheelWidth, 
      wheelRadius * 2
    );
  }
}

webbitRegistry.define('frc-field-robot', FieldRobot);