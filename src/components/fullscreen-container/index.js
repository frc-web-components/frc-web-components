import Container from '../container';

export default class FullscreenContainer extends Container {

  static get metadata() {
    return {
      displayName: 'Fullscreen Container',
      category: 'Layout',
    };
  }

  constructor() {
    super();
    this.display = 'block';
    this.height = '100vh';
  }
}

webbitRegistry.define('frc-fullscreen-container', FullscreenContainer);