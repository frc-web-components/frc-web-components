import Action from '../action';

export default class LoadStoredLayout extends Action {

  execute({ wom }) {
    
    let layoutName = wom.layout.getLayoutNameFromUrl();

    if (layoutName === null) {
      const [recentLayout] = wom.layout.getSavedLayoutNames();
      layoutName = typeof recentLayout === 'undefined' ? wom.layout.generateLayoutName() : recentLayout;
    }

    const layoutHtml = wom.layout.openSavedLayout(layoutName);
    wom.layout.setTitleFromLayoutName();

    wom.history.push(layoutHtml);
    wom.setHtml(layoutHtml);
    wom.deselectNode();
  };
}