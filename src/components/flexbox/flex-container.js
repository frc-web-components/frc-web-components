import { Webbit, html, css } from '@webbitjs/webbit';

const FLEX_ALIASES = {
  'start': 'flex-start',
  'end': 'flex-end',
  'center': 'center',
  'space-between': 'space-between',
  'space-around': 'space-around',
  'space-evenly': 'space-evenly',
  'stretch': 'stretch',
  'baseline': 'baseline'
}

class FlexContainer extends Webbit {

  static get metadata() {
    return {
      displayName: 'Flex Container',
      category: 'Layout',
    };
  }

  static get styles() {
    return css`
      :host {
        width: var(--flex-container-width, auto);
        height: var(--flex-container-height, auto);
        display: var(--flex-container-display, flex);
        flex-direction: var(--flex-container-direction, flex-start);
        flex-wrap: var(--flex-container-wrap, wrap);
        justify-content: var(--flex-container-justify-content, flex-start);
        align-items: var(--flex-container-align-items, flex-start);
        align-content: var(--flex-container-align-content, flex-start);
      }
    `;
  }

  static get properties() {
    return {
      width: { type: String },
      height: { type: String },
      inline: { type: Boolean },
      direction: { type: String },
      wrap: { type: String },
      justifyContent: { type: String },
      alignItems: { type: String },
      alignContent: { type: String },
    };
  }

  constructor() {
    super();
    this.width = 'auto';
    this.height = 'auto';
    this.inline = false;
    this.direction = 'row';
    this.wrap = 'wrap';
    this.justifyContent = 'start';
    this.alignItems = 'start';
    this.alignContent = 'start';
  }

  render() {
    return html`   
      <slot></slot>
    `;
  }

  updated(changedProps) {

    if (changedProps.has('width')) {
      this.style.setProperty('--flex-container-width', this.width);
    }

    if (changedProps.has('height')) {
      this.style.setProperty('--flex-container-height', this.height);
    }

    if (changedProps.has('inline')) {
      this.style.setProperty('--flex-container-display', this.inline ? 'inline-flex' : 'flex');
    }

    if (changedProps.has('direction')) {
      this.style.setProperty('--flex-container-direction', this.direction);
    }

    if (changedProps.has('wrap')) {
      this.style.setProperty('--flex-container-wrap', this.wrap);
    }

    if (changedProps.has('justifyContent')) {
      this.style.setProperty('--flex-container-justify-content', FLEX_ALIASES[this.justifyContent]);
    }
    
    if (changedProps.has('alignItems')) {
      this.style.setProperty('--flex-container-align-items', FLEX_ALIASES[this.alignItems]);
    }

    if (changedProps.has('alignContent')) {
      this.style.setProperty('--flex-container-align-content', FLEX_ALIASES[this.alignContent]);
    }
  }
}

webbitRegistry.define('frc-flex-container', FlexContainer);