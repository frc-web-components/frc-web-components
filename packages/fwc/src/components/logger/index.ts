import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { WebbitConfig } from '@webbitjs/webbit';
import HtmlLogger from './html-logger';

export const loggerDashboardConfig: Partial<WebbitConfig> = {
  dashboard: {
    displayName: 'Logger',
  },
  properties: {
    title: { type: 'String', defaultValue: 'Robot Logger' },
    maxLogCount: {
      type: 'Number',
      attribute: 'max-log-count',
      defaultValue: 1000,
    },
    debug: { type: 'String' },
    info: { type: 'String', primary: true },
    success: { type: 'String' },
    warning: { type: 'String' },
    error: { type: 'String' },
    level: {
      type: 'String',
      defaultValue: 'info',
      input: {
        type: 'StringDropdown',
        allowCustomValues: false,
        getOptions() {
          return ['debug', 'info', 'success', 'warning', 'error'];
        },
      },
    },
    disabled: { type: 'Boolean' },
  },
};

export default class Logger extends LitElement {
  @property({ type: String }) title = 'Robot Logger';
  @property({ type: Number, attribute: 'max-log-count' }) maxLogCount = 1000;
  @property({ type: String }) debug = '';
  @property({ type: String }) info = '';
  @property({ type: String }) success = '';
  @property({ type: String }) warning = '';
  @property({ type: String }) error = '';
  @property({ type: String }) level = 'info';
  @property({ type: Boolean }) disabled = false;

  logger!: HtmlLogger;
  levels = ['debug', 'info', 'success', 'warning', 'error'];

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

  firstUpdated() {
    const loggerElement = this.renderRoot.querySelector(
      '[part=logger]',
    ) as HTMLElement;
    this.logger = new HtmlLogger(
      {
        name: this.title,
        maxLogCount: Math.max(0, this.maxLogCount),
        level: this.levels.indexOf(this.level),
        enabled: !this.disabled,
      },
      loggerElement,
    );
    this.logger.init();
  }

  updated(changedProperties: Map<string, unknown>) {
    this.levels.forEach((level) => {
      if (changedProperties.has(level) && (this as any)[level]) {
        (this.logger as any)[level]((this as any)[level]);
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

if (!customElements.get('frc-logger')) {
  customElements.define('frc-logger', Logger);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-logger': Logger;
  }
}
