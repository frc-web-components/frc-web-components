export default class DashboardSelections {
  constructor(connector, onSelection) {
    this._connector = connector;
    this._eventListeners = new Map();
    this._listen = true;

    connector.subscribeElementConnected(({ element }) => {
      const listener = ev => {
        if (this._listen) {
          ev.stopPropagation();
          onSelection(element);
        }
      };
      element.addEventListener('mouseup', listener);
      element.addEventListener('click', listener);
      this._eventListeners.set(element, listener);
    });

    connector.subscribeElementDisconnected(({ element }) => {
      element.removeEventListener('mouseup', this._eventListeners.get(element));
      element.removeEventListener('click', this._eventListeners.get(element));
      this._eventListeners.delete(element);
    });
  }

  setListening(listen) {
    this._listen = listen;
  }
}