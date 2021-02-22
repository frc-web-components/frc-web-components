import interact from 'interactjs';

/**
 * https://zellwk.com/blog/css-translate-values-in-javascript/
 * 
 * Gets computed translate values
 * @param {HTMLElement} element
 * @returns {Object}
 */

function getTranslateValues (element) {
  const style = window.getComputedStyle(element)
  const matrix = style['transform'] || style.webkitTransform || style.mozTransform

  // No transform property. Simply return 0 values.
  if (matrix === 'none') {
    return {
      x: 0,
      y: 0,
      z: 0
    }
  }

  // Can either be 2d or 3d transform
  const matrixType = matrix.includes('3d') ? '3d' : '2d'
  const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ')

  // 2d matrices have 6 values
  // Last 2 values are X and Y.
  // 2d matrices does not have Z value.
  if (matrixType === '2d') {
    return {
      x: parseFloat(matrixValues[4]),
      y: parseFloat(matrixValues[5]),
      z: 0
    }
  }

  // 3d matrices have 16 values
  // The 13th, 14th, and 15th values are X, Y, and Z
  if (matrixType === '3d') {
    return {
      x: matrixValues[12],
      y: matrixValues[13],
      z: matrixValues[14]
    }
  }
}

export function removeInteraction(womNode) {
  if (womNode.getSelectionBox()) {
    interact(womNode.getSelectionBox()).unset();
  }
}

export function addInteraction(wom, womNode) {

  const layout = womNode.getParent().getLayout();

  if (layout === 'none') {
    return;
  }

  const dashboardConfig = womNode.getDashboardConfig() || {};
  const resizable = dashboardConfig.resizable || { 
    left: true, right: true, bottom: true, top: true
  };
  const movable = layout === 'absolute' && ('movable' in dashboardConfig ? dashboardConfig.movable : true);
  const minSize = dashboardConfig.minSize || { width: 20, height: 20 };


  setTimeout(() => {
    const realWomNode = womNode.getNode().__WOM_NODE__;
    const interactive = interact(realWomNode.getSelectionBox());

    interactive.resizable({
      // resize from all edges and corners
      edges: resizable,
      listeners: {
        move (event) {
          var target = womNode.getNode();

          let { x, y } = getTranslateValues(target);

          // update the element's style
          if (resizable.left || resizable.right) {
            target.style.width = event.rect.width + 'px';
          }
          if (resizable.top || resizable.bottom) {
            target.style.height = event.rect.height + 'px';
          }

          // translate when resizing from top or left edges
          x += event.deltaRect.left
          y += event.deltaRect.top

          target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)'
        },
        end: async () => {
          wom.history.push(await wom.getHtml());
        }
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent'
        }),

        // minimum size
        interact.modifiers.restrictSize({
          min: minSize
        })
      ],

      inertia: true
    });
      
    if (movable) {
      interactive.draggable({
        listeners: { 
          move (event) {

            var target = womNode.getNode();

            let { x, y } = getTranslateValues(target);
            x += event.dx;
            y += event.dy;
          
            // translate the element
            target.style.webkitTransform =
              target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)'
          },
          end: async () => {
            wom.history.push(await wom.getHtml());
          }
        },
        inertia: true,
      });
    }
  }, 50);

  
}
