import HtmlLogger from './html-logger';
import { html, css, LitElement } from 'lit';

export const elementName = 'frc-logger';

export const elementConfig = {
  dashboard: {
    displayName: 'Logger',
  },
  properties: {
    title: { type: String, defaultValue: 'Robot Logger' },
    maxLogCount: {
      type: Number,
      attribute: 'max-log-count',
      defaultValue: 1000,
    },
    debug: { type: String },
    info: { type: String, primary: true },
    success: { type: String },
    warning: { type: String },
    error: { type: String },
    level: {
      type: String,
      defaultValue: 'info',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return ['debug', 'info', 'success', 'warning', 'error'];
        },
      },
    },
    disabled: { type: Boolean },
  },
};

class Logger extends LitElement {
  static properties = elementConfig.properties;

  static styles = css`
    :host {
      display: inline-block;
      width: 500px;
      height: 400px;
      font-family: monospace;
      font-size: 14px;
    }

    [part='logger'] {
      width: 100%;
      height: 100%;
    }
  `;

  constructor() {
    super();
    this.levels = ['debug', 'info', 'success', 'warning', 'error'];
    this.logger = null;

    this.title = 'Robot Logger';
    this.maxLogCount = 1000;
    this.info = '';
    this.debug = '';
    this.warning = '';
    this.success = '';
    this.error = '';
    this.level = 'info';
    this.disabled = false;
  }

  firstUpdated() {
    const loggerElement = this.shadowRoot.querySelector('[part=logger]');
    this.logger = new HtmlLogger(
      {
        name: this.title,
        maxLogCount: Math.max(0, this.maxLogCount),
        level: this.levels.indexOf(this.level),
        enabled: !this.disabled,
      },
      loggerElement
    );
    this.logger.init(true);
  }

  updated(changedProperties) {
    this.levels.forEach((level) => {
      if (changedProperties.has(level) && this[level]) {
        this.logger[level](this[level]);
        this[level] = '';
      }
    });

    if (changedProperties.has('maxLogCount')) {
      this.logger.options.maxLogCount = Math.max(0, this.maxLogCount);
    }

    if (changedProperties.has('level')) {
      this.logger.setLevel(this.levels.indexOf(this.level));
    }

    if (changedProperties.has('disabled')) {
      this.logger.setEnable(!this.disabled);
    }
  }

  render() {
    return html` <div part="logger"></div> `;
  }
}

customElements.define(elementName, Logger);
