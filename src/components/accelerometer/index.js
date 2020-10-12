import NumberBar from '../number-bar';

class Accelerometer extends NumberBar {

  static get metadata() {
    return {
      displayName: 'Accelerometer',
      category: 'Robot & Field Info',
      description: 'Component for displaying data from a single axis accelerometer.',
      documentationLink: 'https://frc-web-components.github.io/components/accelerometer/',
      slots: [],
      resizable: { left: true, right: true },
      minSize: { width: 80, height: 10 }
    };
  }

  constructor() {
    super();
    this.unit = 'g';
  }
}

window.webbitRegistry.define('frc-accelerometer', Accelerometer);