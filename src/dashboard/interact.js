import interact from 'interactjs';

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

export function removeInteraction(element) {
  interact(element).unset();
}

export function addInteraction(element) {

  interact(element)
    .resizable({
      // resize from all edges and corners
      edges: { left: true, right: true, bottom: true, top: true },
  
      listeners: {
        move (event) {
          var target = event.target
          var x = (parseFloat(target.getAttribute('data-x')) || 0)
          var y = (parseFloat(target.getAttribute('data-y')) || 0)
  
          // update the element's style
          target.style.width = event.rect.width + 'px'
          target.style.height = event.rect.height + 'px'
  
          // translate when resizing from top or left edges
          x += event.deltaRect.left
          y += event.deltaRect.top
  
          target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)'
  
          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        }
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent'
        }),
  
        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 }
        })
      ],
  
      inertia: true
    })
    .draggable({
      listeners: { move: dragMoveListener },
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          // restriction: 'parent',
          // endOnly: true
        })
      ]
    })


    // interact('frc-absolute-layout div').dropzone({
    //   // only accept elements matching this CSS selector
    //   accept: '[webbit-id]',
    //   // Require a 75% element overlap for a drop to be possible
    //   overlap: 0.75,
    
    //   // listen for drop related events:
    
    //   ondropactivate: function (event) {
    //     // add active dropzone feedback
    //     event.target.classList.add('drop-active')
    //   },
    //   ondragenter: function (event) {
    //     var draggableElement = event.relatedTarget
    //     var dropzoneElement = event.target
    
    //     // feedback the possibility of a drop
    //     dropzoneElement.classList.add('drop-target')
    //     draggableElement.classList.add('can-drop')
    //     draggableElement.textContent = 'Dragged in'
    //   },
    //   ondragleave: function (event) {
    //     // remove the drop feedback style
    //     event.target.classList.remove('drop-target')
    //     event.relatedTarget.classList.remove('can-drop')
    //     event.relatedTarget.textContent = 'Dragged out'
    //   },
    //   ondrop: function (event) {
    //     event.relatedTarget.textContent = 'Dropped'
    //     var draggableElement = event.relatedTarget
    //     var dropzoneElement = event.target;
    //     // console.log('dropsies:', dropzoneElement, draggableElement);
    //     dropzoneElement.append(draggableElement);
    //   },
    //   ondropdeactivate: function (event) {
    //     // remove active dropzone feedback
    //     event.target.classList.remove('drop-active')
    //     event.target.classList.remove('drop-target')
    //   }
    // })

}
