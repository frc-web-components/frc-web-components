import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    overflow: hidden;
  }

  [part='field'] {
    position: relative;
    width: var(--field-width, 100%);
    height: var(--field-height, 400px);
    background-image: var(--field-image);
    background-size: cover;
  }

  [part='field-image'] {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  [part='playing-field-area'] {
    position: absolute;
    left: var(--playing-field-left, 0);
    top: var(--playing-field-top, 0);
    width: var(--playing-field-width, 100%);
    height: var(--playing-field-height, 100%);
    border: 2px solid yellow;
    box-sizing: border-box;
  }

  [part='grid'] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  [part='grid'] path {
    stroke: var(--frc-grid-line-color, gray);
    stroke-width: var(--frc-grid-line-width, 1);
  }

  [part='top-canvas'],
  [part='bottom-canvas'] {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  ::slotted(frc-field-object) {
    position: absolute;
  }
`;
