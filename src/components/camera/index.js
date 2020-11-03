import { Webbit, html, css } from '@webbitjs/webbit';

let nextStreamId = 0;

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
    this.streamsLoadingIds = [];
  }

  getStreams() {
    let uniqueStreams = [...new Set(this.streams)].map(stream => {
      return stream.replace('mjpg:', ''); 
    });

    [...uniqueStreams].forEach(stream => {
      const url = new URL(stream);
      uniqueStreams.push(`${url.protocol}//127.0.0.1:${url.port}${url.pathname}${url.search}`);
    });

    return [...new Set(uniqueStreams)];
  }

  isStreaming() {
    return this.connected && this.url;
  }

  firstUpdated() {
    super.firstUpdated();

    setInterval(() => {

      // If the element is not in the dom, don't try to load streams
      if (!this.isConnected) {
        return;
      }

      if (!this.isStreaming()) {
        this.getStreams().forEach(stream => {
          this.loadStream(stream);
        });
      }

    }, 1000);
  }

  loadStream(url) {
    const streamId = nextStreamId;
    nextStreamId++;
    this.streamsLoadingIds.push(streamId);

    let img = new Image();
    img.src = url;

    const timeoutId = setTimeout(() => {
      img.onload = () => {};

      // If the current stream is no longer streaming, disconnect from it
      if (this.url === url && this.streamsLoadingIds.indexOf(streamId) >= 0) {
        this.url = '';
      }

      // Remove from the streamsLoadingIds array
      const index = this.streamsLoadingIds.indexOf(streamId);
      if (index >= 0) {
        this.streamsLoadingIds.splice(index, 1);
      }
    }, 10000);

    img.onload = () => {
      clearTimeout(timeoutId);

      img.onload = () => {};
      if (!this.isStreaming() && this.streamsLoadingIds.indexOf(streamId) >= 0) {
        this.url = img.src;
        this.streamsLoadingIds = [];

        setTimeout(() => {
          this.loadStream(url);
        }, 2000);
      }
      this.loaded = true;
    };
  }

  updated(changedProps) {
    if (changedProps.has('streams') || changedProps.has('connected')) {
      this.url = '';
      this.streamsLoadingIds = [];
    }
  }

  render() {
    return html`
      <img part="camera-feed" .src="${this.url}" />
    `;
  }
}

webbitRegistry.define('frc-camera', Camera);