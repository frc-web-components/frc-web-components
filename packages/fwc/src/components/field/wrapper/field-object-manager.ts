import Store from '@webbitjs/store';
import throttle from 'lodash.throttle';
import getPoses from '../get-poses';

export interface FieldObject {
  type: 'robot' | 'trajectory';
  poses: (Uint8Array | number[])[];
}

export default class FieldObjectManager {
  private sourceKey = '';
  private sourceProvider = '';
  private store: Store;
  private unsubscriber?: () => void;
  private onUpdate: (objects: FieldObject[]) => void;

  constructor(store: Store, onUpdate: (objects: FieldObject[]) => void) {
    this.store = store;
    this.onUpdate = onUpdate;
  }

  setSource(key: string, provider: string): void {
    this.sourceKey = key;
    this.sourceProvider = provider;
    this.addFieldObjectsFromSources();
    this.unsubscriber?.();
    const subscriber = throttle(() => {
      this.addFieldObjectsFromSources();
    }, 1000 / 60) as () => void;
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

    const objects: FieldObject[] = [];

    Object.entries(source.getChildren()).forEach(([property, childSource]) => {
      // Keys that start with '.' are metadata
      if (property.startsWith('.')) {
        return;
      }
      const poseValue = childSource.hasChildren()
        ? childSource.getChildren().pose.getValue()
        : childSource.getValue();
      const poses = getPoses(poseValue as any);
      objects.push({
        type: poses.length === 1 ? 'robot' : 'trajectory',
        poses,
      });
      this.onUpdate(objects);
    });
  }
}
