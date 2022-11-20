type KeyParts = {
  [part: string]: KeyParts | symbol;
};

export default class KeyStore {
  private partsLength: number;
  private keys: KeyParts;

  constructor(partsLength: number) {
    this.partsLength = partsLength;
    this.keys = {};
  }

  getKey(...keyParts: string[]): symbol | null {
    if (keyParts.length !== this.partsLength) {
      return null;
    }
    let currentObject: KeyParts = this.keys;
    for (let i = 0; i < keyParts.length - 1; i += 1) {
      if (!currentObject[keyParts[i]]) {
        currentObject[keyParts[i]] = {};
      }
      currentObject = currentObject[keyParts[i]] as KeyParts;
    }
    if (!currentObject[keyParts[keyParts.length - 1]]) {
      currentObject[keyParts[keyParts.length - 1]] = Symbol('');
    }
    return currentObject[keyParts[keyParts.length - 1]] as symbol;
  }
}
