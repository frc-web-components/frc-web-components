import { LitElement, css, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, query, state } from 'lit/decorators.js';

@customElement('dashboard-resize-handler')
export default class ResizeHandler extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      height: 400px;
      // height: 100%;
      width: 20px;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
    }

    .resize-handler {
      width: 100%;
      height: 100%;
      background: green;
    }
  `;

  @state() dragging = false;
  @state() overlay = document.createElement('div');

  protected firstUpdated(): void {
    this.overlay.style.width = '100vw';
    this.overlay.style.height = '100vh';
    this.overlay.style.position = 'fixed';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.zIndex = '1000';
    this.overlay.className = 'overlay';

    console.log('overlay:', this.overlay);
    document.body.appendChild(this.overlay);
    this.overlay.addEventListener('mousemove', (ev) => {
      console.log('mousemove:', ev.clientX, ev.clientY);
    });
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('dragging')) {
      if (this.dragging) {
        this.overlay.style.display = 'block';
      } else {
        this.overlay.style.display = 'none';
      }
    }
  }

  render() {
    return html`
      <!-- <div
        class="overlay"
        style=${styleMap({
        display: this.dragging ? 'block' : 'none',
      })}
      ></div> -->
      <div
        class="resize-handler"
        @mousedown=${() => {
          this.dragging = true;
        }}
        @mouseup=${() => {
          this.dragging = false;
        }}
      ></div>
    `;
  }
}
