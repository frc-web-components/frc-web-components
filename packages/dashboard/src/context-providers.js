import { createContext, ContextConsumer, ContextProvider } from '@lit-labs/context';

class CreateContext {

  constructor(name) {
    this.name = name;
    this.context = createContext('name');
    this.provider = null;
  }

  addConsumer(element) {
    let previousValue = undefined;
    new ContextConsumer(
      element,
      this.context,
      value => {
        const oldValue = previousValue;
        previousValue = value;
        element[this.name] = value;
        element.requestUpdate(this.name, oldValue);
      },
      true
    );
  }

  setProvider(element, initialValue) {
    this.provider = new ContextProvider(element, this.context, initialValue);
  }

  setValue(value) {
    this.provider?.setValue(value);
  }
}

export const dashboardProvider = new CreateContext('dashboard');
