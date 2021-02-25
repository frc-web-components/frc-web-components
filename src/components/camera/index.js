import { Webbit, html, css } from '@webbitjs/webbit';

let nextStreamId = 0;

class Camera extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Camera',
      category: 'Robot & Field Info',
      // description: `A box that's shown as one color if true and another color if false.`,
      // documentationLink: 'https://frc-web-components.github.io/components/boolean-box/',
      slots: [],
      editorTabs: ['properties', 'sources'],
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
        display: var(--image-display, block);
        width: var(--image-width, 100%);
        height: var(--image-height, 100%);
        max-width: 100%;
        max-height: 100%;
      }

      [part=x-crosshair], [part=y-crosshair] {
        position: absolute;
        box-sizing: border-box;
        border-style: dashed;
      }

      [part=x-crosshair] {
        border-top-width: var(--crosshair-width, 2px);
        border-bottom-width: 0px;
        border-color: var(--crosshair-color, white);
        width: var(--image-width, 100%);
        height: 0px;
      } 

      [part=y-crosshair] {
        border-left-width: var(--crosshair-width, 2px);
        border-right-width: 0px;
        border-color: var(--crosshair-color, white);
        width: 0px;
        height: var(--image-height, 100%);
      }
    `;
  }

  static get properties() {
    return {
      fps: { type: Number },
      width: { type: Number },
      height: { type: Number },
      compression: { type: Number },
      hideCrosshair: { type: Boolean },
      crosshairColor: { type: String, inputType: 'ColorPicker' },
      crosshairWidth: { type: Number },
      streams: { type: Array, inputType: 'StringArray' },
      waitImage: { type: String },
      connected: { type: Boolean },
      url: { type: String, reflect: false, attribute: false },
    };
  }

  constructor() {
    super();
    this.streams = [];
    this.connected = false;
    this.url = '';
    this.loaded = false;
    this.streamsLoadingIds = [];
    this.fps = -1;
    this.width = -1;
    this.height = -1;
    this.compression = -1;
    this.hideCrosshair = false;
    this.crosshairColor = '#ffffff';
    this.crosshairWidth = 2;
    this.waitImage = 'https://i.ytimg.com/vi/w6geNk3QnBQ/maxresdefault.jpg';
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

    this.cameraFeedNode = this.shadowRoot.querySelector('[part=camera-feed]');

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

    setInterval(() => {
      // If the element is not in the dom, don't try to load streams
      if (!this.isConnected) {
        return;
      }

      this.setImageSize();
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

    this.setImageSize();
    const crosshairWidth = Math.max(0, parseInt(this.crosshairWidth));
    this.style.setProperty('--crosshair-width', `${crosshairWidth}px`);
    this.style.setProperty('--crosshair-color', this.crosshairColor);
    this.style.setProperty('--image-display', this.url || this.waitImage ? 'block' : 'none');
  }

  resized() {
    this.setImageSize();
  }

  setImageSize() {

    const { naturalWidth, naturalHeight } = this.cameraFeedNode;
    const { width, height } = this.getBoundingClientRect();

    if (height < (naturalHeight / naturalWidth * width)) {
      this.style.setProperty('--image-width', `${naturalWidth / naturalHeight * height}px`);
      this.style.setProperty('--image-height', `${height}px`);
    } else {
      this.style.setProperty('--image-width', `${width}px`);
      this.style.setProperty('--image-height', `${naturalHeight / naturalWidth * width}px`);
    }
  }

  getUrl() {

    if (!this.isStreaming()) {
      return this.waitImage;
    }

    try {
      const url = new URL(this.url);

      if (this.fps > 0) {
        url.searchParams.set('fps', this.fps);
      }

      if (this.width >= 0 && this.height >= 0) {
        url.searchParams.set('resolution', `${this.width}x${this.height}`);
      }

      if (this.compression >= 0) {
        url.searchParams.set('compression', this.compression);
      }
      return url.toString();
    } catch(e) {
      return '';
    }
  }

  render() {
    return html`
      <img part="camera-feed" .src="${this.getUrl()}" />
      ${this.url && !this.hideCrosshair ? html`
        <div part="x-crosshair"></div>
        <div part="y-crosshair"></div>
      ` : ''}
    `;
  }
}

webbitRegistry.define('frc-camera', Camera);