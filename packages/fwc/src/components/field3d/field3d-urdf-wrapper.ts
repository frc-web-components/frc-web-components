import { LitElement, PropertyValueMap, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import Store, { SourceProvider } from '@webbitjs/store';
import { WebbitConfig } from '@webbitjs/webbit';

export function getField3dUrdfDashboardConfig(
  urdfNames: string[],
): WebbitConfig {
  const config: Partial<WebbitConfig> = {
    dashboard: {
      displayName: 'Field 3D URDF',
      topLevel: false,
    },
    properties: {
      name: {
        type: 'String',
        defaultValue: urdfNames[0],
        input: {
          type: 'StringDropdown',
          allowCustomValues: false,
          getOptions(): string[] {
            return urdfNames;
          },
        },
      },
      pose: {
        type: 'Array',
        input: { type: 'NumberArray' },
      },
      provider: { type: 'SourceProvider', property: 'provider' },
      store: { type: 'Store', property: 'store' },
      sourceProvider: {
        type: 'String',
        attribute: 'source-provider',
        input: { type: 'None' },
      },
      sourceKey: {
        type: 'String',
        attribute: 'source-key',
        input: { type: 'None' },
      },
    },
  };

  return config as WebbitConfig;
}

export default class Urdf3dWrapper extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: Array }) pose = [0, 0, 0];

  @property({ type: Object, attribute: false }) provider?: SourceProvider;
  @property({ type: Object, attribute: false }) store?: Store;
  @property({ type: String, attribute: 'source-provider' }) sourceProvider = '';
  @property({ type: String, attribute: 'source-key' }) sourceKey = '';

  #jointNames: string[] = [];
  #jointsPublished = false;

  #unsubscriber?: () => unknown;

  #getSource() {
    const { provider, store, sourceProvider, sourceKey } = this;
    if (!provider || !store || !sourceProvider || !sourceKey) {
      return undefined;
    }

    return store.getSource(sourceProvider, sourceKey);
  }

  #updateSourceListener() {
    this.#unsubscriber?.();
    if (!this.sourceProvider || !this.sourceKey) {
      return;
    }
    this.#unsubscriber = this.store?.subscribe(
      this.sourceProvider,
      this.sourceKey,
      () => {
        this.#publishJointValues();
        this.requestUpdate();
      },
      true,
    );
  }

  getJointValues(): Record<string, number> {
    const source = this.#getSource();

    if (!source?.hasChildren()) {
      const values: Record<string, number> = {};
      this.#jointNames.forEach((jointName) => {
        values[jointName] = 0;
      });
      return values;
    }

    const jointValuesSourceKey = [this.sourceKey, 'joints'].join('/');
    const jointValuesSource = this.store!.getSource(
      this.sourceProvider,
      jointValuesSourceKey,
    );
    const jointValues: any = jointValuesSource?.getJson(false) ?? {};
    const values: Record<string, number> = {};
    this.#jointNames.forEach((jointName) => {
      values[jointName] = jointValues[jointName] ?? 0;
    });
    return values;
  }

  #publishJointValues(): void {
    if (this.#jointsPublished) {
      return;
    }

    const source = this.#getSource();

    if (!source) {
      return;
    }

    this.#jointNames.forEach((jointName) => {
      const jointValuesSourceKey = [this.sourceKey, 'joints', jointName].join(
        '/',
      );
      const joinValuesSource = this.store!.getSource(
        this.sourceProvider,
        jointValuesSourceKey,
      );
      if (!joinValuesSource?.hasValue()) {
        this.provider?.userUpdate(jointValuesSourceKey, 0);
      }
    });
    this.#jointsPublished = true;
  }

  #onUrdfLoad(ev: CustomEvent) {
    const urdf = (ev as any).detail.urdf;
    this.#jointNames = Object.keys(urdf.joints).sort();
    Object.values(urdf.joints).forEach((joint) => {
      (joint as any).ignoreLimits = true;
    });
    this.requestUpdate();
  }

  protected createRenderRoot() {
    return this;
  }

  protected updated(
    changedProps: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    if (
      changedProps.has('sourceProvider') ||
      changedProps.has('sourceKey') ||
      changedProps.has('store')
    ) {
      this.#jointsPublished = false;
      this.#updateSourceListener();
    }
  }

  render(): TemplateResult {
    return html`
      <frc-field3d-urdf
        @urdfLoad=${this.#onUrdfLoad}
        .jointValues=${this.getJointValues()}
        .pose=${this.pose}
        .name=${this.name}
      ></frc-field3d-urdf>
    `;
  }
}

if (!customElements.get('frc-field3d-urdf-wrapper')) {
  customElements.define('frc-field3d-urdf-wrapper', Urdf3dWrapper);
}

declare global {
  interface HTMLElementTagNameMap {
    'frc-field3d-urdf-wrapper': Urdf3dWrapper;
  }
}
