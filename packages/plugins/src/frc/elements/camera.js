import { html, css, LitElement } from 'lit';

let nextStreamId = 0;

export const elementName = 'frc-camera';

const DEFAULT_WAIT_IMAGE = '/public/no-camera-stream.jpg';

export const elementConfig = {
  dashboard: {
    displayName: 'Camera',
  },
  properties: {
    fps: { type: Number, defaultValue: -1 },
    width: { type: Number, defaultValue: -1 },
    height: { type: Number, defaultValue: -1 },
    compression: { type: Number, defaultValue: -1 },
    hideCrosshair: { type: Boolean, attribute: 'hide-crosshair' },
    crosshairColor: {
      type: String,
      input: { type: 'ColorPicker' },
      attribute: 'crosshair-color',
      defaultValue: '#ffffff',
    },
    crosshairWidth: {
      type: Number,
      attribute: 'crosshair-width',
      defaultValue: 2,
    },
    streams: { type: Array },
    waitImage: {
      type: String,
      input: { type: 'Upload' },
      attribute: 'wait-image',
    },
  },
};

class Camera extends LitElement {
  static properties = {
    ...elementConfig.properties,
    url: { type: String, reflect: false, attribute: false },
  };

  static styles = css`
    :host {
      display: inline-flex;
      width: 350px;
      height: 350px;
      justify-content: center;
      align-items: center;
    }

    [part='camera-feed'] {
      display: var(--image-display, block);
      width: var(--image-width, 100%);
      height: var(--image-height, 100%);
      max-width: 100%;
      max-height: 100%;
    }

    [part='x-crosshair'],
    [part='y-crosshair'] {
      position: absolute;
      box-sizing: border-box;
      border-style: dashed;
    }

    [part='x-crosshair'] {
      border-top-width: var(--crosshair-width, 2px);
      border-bottom-width: 0px;
      border-color: var(--crosshair-color, white);
      width: var(--image-width, 100%);
      height: 0px;
    }

    [part='y-crosshair'] {
      border-left-width: var(--crosshair-width, 2px);
      border-right-width: 0px;
      border-color: var(--crosshair-color, white);
      width: 0px;
      height: var(--image-height, 100%);
    }
  `;

  constructor() {
    super();
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
    this.streams = [];
    this.waitImage = '';
  }

  getStreams() {
    let uniqueStreams = [...new Set(this.streams)].map((stream) => {
      return stream.replace('mjpg:', '');
    });

    [...uniqueStreams].forEach((stream) => {
      const url = new URL(stream);
      uniqueStreams.push(
        `${url.protocol}//127.0.0.1:${url.port}${url.pathname}${url.search}`
      );
    });

    return [...new Set(uniqueStreams)];
  }

  isStreaming() {
    return this.url;
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
        this.getStreams().forEach((stream) => {
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

    const resizeObserver = new ResizeObserver(() => {
      this.resized();
    });

    resizeObserver.observe(this);
  }

  loadStream(url) {
    const streamId = nextStreamId;
    nextStreamId++;
    this.streamsLoadingIds.push(streamId);

    let img = new Image();
    img.src = url;

    console.log('load stream:', url);

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
      console.log('load:', url);
      clearTimeout(timeoutId);

      img.onload = () => {};
      if (
        !this.isStreaming() &&
        this.streamsLoadingIds.indexOf(streamId) >= 0
      ) {
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
    if (changedProps.has('streams')) {
      this.url = '';
      this.streamsLoadingIds = [];
    }

    this.setImageSize();
    const crosshairWidth = Math.max(0, parseInt(this.crosshairWidth));
    this.style.setProperty('--crosshair-width', `${crosshairWidth}px`);
    this.style.setProperty('--crosshair-color', this.crosshairColor);
    this.style.setProperty(
      '--image-display',
      this.url || this.waitImage || DEFAULT_WAIT_IMAGE ? 'block' : 'none'
    );
  }

  resized() {
    this.setImageSize();
  }

  setImageSize() {
    const { naturalWidth, naturalHeight } = this.cameraFeedNode;
    const { width, height } = this.getBoundingClientRect();

    if (height < (naturalHeight / naturalWidth) * width) {
      this.style.setProperty(
        '--image-width',
        `${(naturalWidth / naturalHeight) * height}px`
      );
      this.style.setProperty('--image-height', `${height}px`);
    } else {
      this.style.setProperty('--image-width', `${width}px`);
      this.style.setProperty(
        '--image-height',
        `${(naturalHeight / naturalWidth) * width}px`
      );
    }
  }

  getUrl() {
    if (!this.isStreaming()) {
      return this.waitImage || DEFAULT_WAIT_IMAGE;
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
    } catch (e) {
      return '';
    }
  }

  render() {
    return html`
      <img part="camera-feed" .src="${this.getUrl()}" />
      ${this.url && !this.hideCrosshair
        ? html`
            <div part="x-crosshair"></div>
            <div part="y-crosshair"></div>
          `
        : ''}
    `;
  }
}

customElements.define(elementName, Camera);
