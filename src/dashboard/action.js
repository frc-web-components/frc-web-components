
export default class Action {

  get needsSelection() {
    return false;
  }

  isReady(hasSelection) {
    if (this.needsSelection && !hasSelection) {
      return false;
    }

    return true;
  }

  select() {}

  deselect() {}

  contextChange() {}

  execute() {}
}