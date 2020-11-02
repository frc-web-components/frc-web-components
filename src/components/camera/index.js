import { Webbit, html, css } from '@webbitjs/webbit';

class Camera extends Webbit {

  static get metadata() {
    return {
      displayName: 'Camera',
      category: 'Robot & Field Info',
      // description: `A box that's shown as one color if true and another color if false.`,
      // documentationLink: 'https://frc-web-components.github.io/components/boolean-box/',
      slots: [],
    };
  }

  static get styles() {
    return css`
      :host { 
        display: inline-flex; 
        width: 350px;
        height: 350px;
        justify-content: center;
        align-items: center;
      }

      [part=camera-feed] {
        width: 100%;
        height: 100%;
      }
    `;
  }

  static get properties() {
    return {
      streams: { type: Array, inputType: 'StringArray' },
      connected: { type: Boolean },
      url: { type: String, reflect: false, attribute: false }
    };
  }

  constructor() {
    super();
    this.streams = [];
    this.connected = false;
    this.url = '';
    this.loaded = false;
  }

  getStreams() {
    let uniqueStreams = [...new Set(this.streams)].map(stream => {
      return stream.replace('mjpg:', ''); 
    });

    uniqueStreams.forEach(stream => {
      if (stream.indexOf('0.0.0.0') > -1) {
        uniqueStreams.push(stream.replace('0.0.0.0', '127.0.0.1'));
      }
    });

    return uniqueStreams;
  }

  updated(changedProps) {
    if (changedProps.has('streams')) {
      this.getStreams().forEach((stream) => {
        let img = new Image();
        // remove mjpg:
        img.src = stream;

        img.onload = () => {
          img.onload = () => {}
          if (!this.loaded) {
              this.url = img.src;
              console.log('src loaded:', img.src);
          }
          this.loaded = true;
        }
      });
    }
  }

  render() {
    return html`
      <img part="camera-feed" .src="${this.url}" />
    `;
  }
}

webbitRegistry.define('frc-camera', Camera);