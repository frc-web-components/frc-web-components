import { } from '@webbitjs/webbit';


const { isInstanceOfWebbit, whenAnyDefined, getDashboardConfig, getWebbit, _generateWebbitId } = window.webbitRegistry;

class ManageExistingComponents {


  constructor() {

    // map from html element to config
    this.elements = new Map();

    const observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
          const addedElements = [];

        }
      }
    });
    observer.observe(this.rootNode, {
      childList: true,
      subtree: true,
    });

  }

  addElement(element) {

    // check to see if there's a config for this element and it's not a webbit

    // observe changes to this element so it can be updated
  }

  subscribe(element, sourceProvider, sourceKey) {

  }

  unsubscribe(element) {

  }

  removeElement(element) {

  }

  mapAttributeToProp(element, attribute, value) {

  }

  mapPropToAttribute(element, prop, value) {

  }
}