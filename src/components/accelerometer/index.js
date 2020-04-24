import NumberBar from '../number-bar';

class Accelerometer extends NumberBar {

  constructor() {
    super();
    this.unit = 'g';
  }
}

window.webbitRegistry.define('frc-accelerometer', Accelerometer);