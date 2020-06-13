
export default class Action {

  constructor({ needsSelection, needsTarget }) {
    this.needsSelection = needsSelection;
    this.needsTarget = needsTarget;
  }

  isReady(hasSelection, hasTarget) {
    if (this.needsSelection && !hasSelection) {
      return false;
    }

    if (this.needsTarget && !hasTarget) {
      return false;
    }

    return true;
  }

  execute() {

  }
}