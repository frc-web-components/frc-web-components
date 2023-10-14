import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import './source-view';
import Store, { Source } from '@webbitjs/store';

@customElement('dashboard-sources-view')
export class SourcesView extends LitElement {
  @property({ type: String }) sourceKey = '';
  @property({ type: String }) sourceProvider = '';
  @property({ type: String }) store!: Store;
  @property({ type: Boolean }) disabled = false;

  @state() selectedProviderIndex = 0;

  openedSources: Record<string, boolean> = {};

  get sourceProviderNames() {
    return this.store?.getSourceProviderNames() ?? [];
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.store.sourceProviderAdded((name) => {
      this.store.subscribeAll(
        name,
        () => {
          this.requestUpdate();
        },
        true
      );
    });
    this.sourceProviderNames.forEach((name) => {
      this.store.subscribeAll(
        name,
        () => {
          this.requestUpdate();
        },
        true
      );
    });
  }

  renderSources(
    providerName: string,
    source: Source | undefined,
    level: number
  ): TemplateResult {
    const sources = source?.getChildren() ?? {};
    const sourceEntries = Object.entries(sources).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    const selectedSource =
      this.sourceKey && this.store
        ? this.store.getSource(this.sourceProvider, this.sourceKey)
        : null;

    return html`
      ${sourceEntries.map(
        ([name, childSource]) => html`
          <dashboard-source-view
            ?only-child="${sourceEntries.length === 1}"
            .label="${name}"
            .providerName="${providerName}"
            .source="${childSource}"
            .selectedSourceKey="${this.sourceKey}"
            .selectedSourceProvider="${this.sourceProvider}"
            .selectedSource="${selectedSource}"
            .store="${this.store}"
            ?disabled=${this.disabled}
            level=${level}
            ?open=${!!this.openedSources[childSource.getKey()]}
            @open=${() => {
              this.openedSources[childSource.getKey()] = true;
              this.requestUpdate();
            }}
            @close=${() => {
              this.openedSources[childSource.getKey()] = false;
              this.requestUpdate();
            }}
          >
          </dashboard-source-view>
          ${this.openedSources[childSource.getKey()]
            ? this.renderSources(providerName, childSource, level + 1)
            : html``}
        `
      )}
    `;
  }

  render() {
    if (this.sourceProviderNames.length === 0) {
      return html` <p>There are no sources currently available.</p> `;
    }

    return html`
      <div class="accordion">
        ${this.sourceProviderNames.map(
          (name, index) => html`
            <label
              class=${classMap({
                selected: index === this.selectedProviderIndex,
              })}
            >
              <dashboard-sources-caret
                ?open=${index === this.selectedProviderIndex}
                @toggle=${() => {
                  if (this.selectedProviderIndex === index) {
                    this.selectedProviderIndex = -1;
                  } else {
                    this.selectedProviderIndex = index;
                  }
                }}
              ></dashboard-sources-caret>
              ${name}
            </label>
            <div class="content">
              <table class="key-value-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.renderSources(name, this.store.getSource(name, ''), 0)}
                </tbody>
              </table>
            </div>
          `
        )}
      </div>
    `;
  }
}
