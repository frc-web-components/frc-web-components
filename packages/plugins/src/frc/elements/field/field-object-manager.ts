import Store from '@webbitjs/store';
import throttle from 'lodash.throttle';
import getPoses from './get-poses';

export default class FieldObjectManager {
  private sourceKey = '';
  private sourceProvider = '';
  private store: Store;
  private fieldElement: HTMLElement;
  private unsubscriber?: () => void;

  constructor(fieldElement: HTMLElement, store: Store) {
    this.fieldElement = fieldElement;
    this.store = store;
  }

  setSource(key: string, provider: string): void {
    this.sourceKey = key;
    this.sourceProvider = provider;
    this.addFieldObjectsFromSources();
    this.unsubscriber?.();
    const subscriber = throttle(() => {
      this.addFieldObjectsFromSources();
    }, 500) as () => void;
    this.unsubscriber = this.store.subscribe(provider, key, subscriber, true);
  }

  private addFieldObjectsFromSources(): void {
    const source = this.store.getSource(this.sourceProvider, this.sourceKey);
    if (!source) {
      return;
    }
    if (source.getChildren()['.type']?.getValue() !== 'Field2d') {
      return;
    }
    Object.entries(source.getChildren()).forEach(([property, childSource]) => {
      // Keys that start with '.' are metadata
      if (property.startsWith('.') || this.hasChild(childSource.getKey())) {
        return;
      }
      const poses = getPoses(childSource.getValue());
      const type =
        poses.length === 1 ? 'frc-field-robot' : 'frc-field-trajectory';
      this.addChild(childSource.getKey(), type);
    });
  }

  private addChild(key: string, elementType: string) {
    const fieldObject = document.createElement(elementType) as HTMLElement;
    fieldObject.setAttribute('source-key', key);
    fieldObject.setAttribute('source-provider', this.sourceProvider);
    this.fieldElement.appendChild(fieldObject);
  }

  private hasChild(key: string) {
    return typeof this.getChildren()[key] !== 'undefined';
  }

  private getChildren(): Record<string, HTMLElement> {
    const children: Record<string, HTMLElement> = {};
    [...this.fieldElement.children].forEach((child) => {
      if (child.hasAttribute('source-key')) {
        children[child.getAttribute('source-key') as string] =
          child as HTMLElement;
      }
    });
    return children;
  }
}
