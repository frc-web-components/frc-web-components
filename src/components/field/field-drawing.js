import { Webbit, html, svg, css } from '@webbitjs/webbit';

export default class FieldDrawing extends Webbit {

  static get metadata() {
    return {
      displayName: 'Field Drawing',
      category: 'Field',
      // description: 'Component for displaying information about an encoder',
      // documentationLink: 'https://frc-web-components.github.io/components/encoder/',
      slots: [],
      allowedParents: ['frc-field-object'],
    };
  }

  static get __IS_FIELD_DRAWING__() {
    return true;
  }

  static get properties() {
    return {
      draw: { 
        type: Function,
        converter: (value) => {
          return new Function(value);
        }
      },
      unit: { type: String }
    };
  }

  constructor() {
    super();
    this.draw = () => {};
    this.unit = '';
  }

  renderDrawing(args) {
    this.draw.bind(args)();
  }
}

webbitRegistry.define('frc-field-drawing', FieldDrawing);