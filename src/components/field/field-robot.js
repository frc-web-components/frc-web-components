import FieldDrawing from './field-drawing';

class FieldRobot extends FieldDrawing {

  static get metadata() {
    return {
      displayName: 'Field Robot',
      category: 'Field',
      // description: 'Component for displaying information about an encoder',
      // documentationLink: 'https://frc-web-components.github.io/components/encoder/',
      slots: [],
      allowedParents: ['frc-field-object'],
    };
  }

  static get properties() {
    return {
      ...super.properties,
      color: { type: String }
    };
  }

  constructor() {
    super();
    this.color = 'blue';
  }

  renderDrawing({ bottomCtx, scalingFactor, parentWidth, parentHeight }) {
    bottomCtx.fillStyle = this.color;
    bottomCtx.moveTo(0, 0);
    bottomCtx.fillRect(-parentWidth / 2,  -parentHeight / 2, parentWidth, parentHeight);

    bottomCtx.beginPath();
    bottomCtx.strokeStyle = 'black';
    bottomCtx.lineWidth = 2 / scalingFactor;
    bottomCtx.moveTo(0, 0);
    bottomCtx.rect(-parentWidth / 2,  -parentHeight / 2, parentWidth, parentHeight);
    bottomCtx.stroke();


    // draw wheels
    const wheelRadius = Math.min(parentWidth * .17, parentHeight * .19);
    const wheelWidth = wheelRadius;

    const verticalPadding = parentHeight * .1;

    bottomCtx.beginPath();
    bottomCtx.fillStyle = 'black';
    bottomCtx.moveTo(0, 0);
    
    // front left
    bottomCtx.fillRect(
      -parentWidth / 2 - wheelWidth / 2, 
      parentHeight / 2 - wheelRadius * 2 - verticalPadding, 
      wheelWidth, 
      wheelRadius * 2
    );

    // front right
    bottomCtx.fillRect(
      parentWidth / 2 - wheelWidth / 2, 
      parentHeight / 2 - wheelRadius * 2 - verticalPadding, 
      wheelWidth, 
      wheelRadius * 2
    );

    // rear left
    bottomCtx.fillRect(
      -parentWidth / 2 - wheelWidth / 2, 
      -parentHeight / 2 + verticalPadding,
      wheelWidth, 
      wheelRadius * 2
    );

    // rear right
    bottomCtx.fillRect(
      parentWidth / 2 - wheelWidth / 2, 
      -parentHeight / 2 + verticalPadding,
      wheelWidth, 
      wheelRadius * 2
    );
  }
}

webbitRegistry.define('frc-field-robot', FieldRobot);