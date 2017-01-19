// javascript!!!
// goal: extend with interactive.js multitouch gestures.

function listener (event) {
  console.log(event.type, event.pageX, event.pageY, event.dx, event.dy);
}

//
window.onload = function() {

    // ******************************************
    // Paper.js

    paper.setup('myCanvas');

    var test = new paper.Path.Rectangle({
        point: [0, 0],
        size: [150, 150],
        strokeColor: 'lime',
        fillColor: new paper.Color(1,1,1, 0.2),
        name:"rect0"
    });

    // make some objects
    var obj_list = [
        paper.Path.Rectangle({
            point: [20, 20],
            size: [150, 500],
            strokeColor: 'lime',
            fillColor: new paper.Color(1,1,1, 0.2),
            name:"rect1"
        }),
        paper.Path.Rectangle({
            point: [100, 20],
            size: [150, 150],
            strokeColor: 'red',
            fillColor: new paper.Color(1,1,1, 0.2),
            name:"rect2"
        }),
        paper.Path.Circle({
            center: paper.view.center,
            radius: 170,
            strokeColor: 'blue',
            fillColor: new paper.Color(1,1,1, 0.2),
            name:"circle1"
        }),
        paper.Path.Circle({
            center: paper.view.center.subtract(new paper.Point(300, 0)),
            radius: [160, 70],
            strokeColor: 'orange',
            fillColor: new paper.Color(1,1,1, 0.2),
            name:"circle2"
        }),
    ];

    // with this we check / get the item we want to move..
    function getItemAtPoint(x, y) {
        console.log("getItemAtPoint!");
        // console.log("event", event);
        // console.log("event.point", event.point);
        console.log("x", x, "y", y);
        // this is a finer way to test:
        //var event_point = event.point;
        var event_point = new paper.Point(x, y);
        var hit_result = paper.project.hitTest(
            event_point,
            {
                fill: true,
                stroke: true,
                segments: true,
                tolerance: 5
            }
        );
        var hit_item = null;
        if (hit_result) {
            hit_item = hit_result.item;
        }
        console.log("hit_item:", hit_item);
        return hit_item;
    }


    function onDragHandler(event) {
        // console.group("onDragHandler:");

        // console.log("event.target", event.target);
        // console.log("event.target.name", event.target.name);
        // console.log("event.dx", event.dx, "event.dy", event.dy);

        var event_delta = new paper.Point(event.dx, event.dy);
        // console.log("event_delta", event_delta);
        event.target.translate(event_delta);

        console.groupEnd();
    }

    function onRotateHandler(event) {
        console.log("onRotateHandler!");
        // console.log("event", event);

        var event_delta = new paper.Point(event.dx, event.dy);
        event.target.translate(event_delta);

        var event_deltaAngle = event.da;
        // console.log("event_deltaAngle", event_deltaAngle);
        event.target.rotate(event_deltaAngle);

    }

    function onUpHandler(event) {
        console.log("onUpHandler:");
        console.log("event.target.name", event.target.name);
        // if (event.target.data.drag_active) {
        //     console.log("event", event);
        //     // event.target.data.drag_active = false;
        // }
    }

    paper.view.draw();


    // ******************************************
    // Interact.js

    var myCanvas_element = document.querySelector("#myCanvas");
    console.log("myCanvas_element", myCanvas_element);

    // interact(myCanvas_element)
    //     .on('click', listener)
    //     .on('tab', listener)
    //     .on('doubletap', listener)
    //     .on('hold', listener)
    //     .on('dragstart', listener)
    //     .on('dragmove', listener)
    //     .on('dragend', listener)
    //     .on(['resizemove', 'resizeend'], listener)
    //     .on({
    //         gesturestart: listener,
    //         gesturemove: listener,
    //         gestureend: listener
    //     })
    //     ;

    interact(myCanvas_element)
    .draggable({
        enabled: true,
        manualStart: true,
        // enable inertial throwing
        inertia: true,
        maxPerElement: 10,
        // onstart: onDownHandler,
        // call this function on every dragmove event
        onmove: onDragHandler,
        // call this function on every dragend event
        onend: onUpHandler
    })
    .on('down', function (event) {
        // console.group("down handler");
        // console.log("event", event);
        var interaction = event.interaction;
        var hit_item = getItemAtPoint(event.clientX, event.clientY);
        // var hit_item = getItemAtPoint(event.x0, event.y0);
        if (hit_item) {
            if (!interaction.interacting()) {
                interaction.start(
                    { name: 'drag' },
                    // { name: 'gesture' },
                    event.interactable,
                    // event.currentTarget
                    hit_item
                 );
            }
        }
        // console.groupEnd();
    })
    .gesturable({
        enabled: true,
        maxPerElement: 10,
        // onstart: onDownHandler,
        // call this function on every gesturemove event
        onmove: onRotateHandler,
        // call this function on every gestureend event
        // onend: onUpHandler
    })
    .rectChecker(function (element) {
        // https://hacks.mozilla.org/2014/11/interact-js-for-drag-and-drop-resizing-and-multi-touch-gestures/
        // console.log("rectChecker");
        // console.log("element", element);
        // console.log("element instanceof paper.Path", element instanceof paper.Path);
        // return a suitable object for interact.js
        var result_rect = null;
        // check for paper js thing
        if (element.bounds) {
            result_rect = {
              left  : element.bounds.left,
              top   : element.bounds.top,
              right : element.bounds.right,
              bottom: element.bounds.bottom
            };
        } else {
            // echeck for html element
            if (element.getClientRects) {
                result_rect = element.getClientRects()[0];
            }
        }
        return result_rect;
    })
    ;

};
