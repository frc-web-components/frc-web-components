import { css, html } from 'lit-element';
import { Webbit, define } from '../../webbit';
import HtmlLogger from './html-logger';

class Logger extends Webbit {

  static get dashboardConfig() {
    return {
      displayName: 'Logger',
      category: 'General',
      description: 'A component used for logging.',
			// documentationLink: 'https://frc-web-components.github.io/components/line-chart/',
      slots: [],
      editorTabs: ['properties', 'sources'],
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        width: 500px;
        height: 400px;
        font-family: monospace;
        font-size: 14px;
      }

      [part=logger] {
        width: 100%;
        height: 100%;
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String, defaultValue: 'Robot Logger' },
      maxLogCount: { 
        type: Number,
        defaultValue: 1000,
        get() {
          return Math.max(0, this._maxLogCount);
        }
      },
      info: { type: String, primary: true },
      debug: { type: String },
      warning: { type: String },
      success: { type: String },
      error: { type: String },
      level: { type: Number },
      disabled: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.levels = ['info', 'debug', 'warning', 'success', 'error'];
    this.logger = null;
  }

  firstUpdated() {
    const loggerElement = this.shadowRoot.querySelector('[part=logger]');
    this.logger = new HtmlLogger(
      {
        name: this.title,
        maxLogCount: this.maxLogCount,
        level: this.level,
        enabled: !this.disabled
      }, 
      loggerElement
    );
    this.logger.init(true);
  }

  updated(changedProperties) {

    this.levels.forEach(level => {
      if (changedProperties.has(level) && this[level]) {
        this.logger[level](this[level]);
        this[level] = '';
      }
    });

    if (changedProperties.has('maxLogCount')) {
      this.logger.options.maxLogCount = this.maxLogCount;
    }

    if (changedProperties.has('level')) {
      this.logger.setLevel(this.level);
    }

    if (changedProperties.has('disabled')) {
      this.logger.setEnable(!this.disabled);
    }
  }

  render() {
    return html`
      <div part="logger"></div>
    `;
  }
}

define('frc-logger', Logger);