// javascript!!!
// load svg, moveable by mouseDrag. Hit test with Rectangle

// goal: extend with interactive.js multitouch gestures.

function listener (event) {
  console.log(event.type, event.pageX, event.pageY, event.dx, event.dy);
}

//
window.onload = function() {


    // ******************************************
    // Paper.js

    // attention! this is polluting the global scope.
    // paper.install(window);
    // now we explicitly use the global "paper." name.

    paper.setup('myCanvas');
    // import svg
    // based on example:
    // https://groups.google.com/d/msg/paperjs/dWG2FBlrr7Y/iR8XPl3hEAAJ
    // related: use FileReader
    // https://groups.google.com/d/msg/paperjs/no6gegoLFmo/HwKUbyg-UpIJ
    var svg_import = new paper.Group();
    paper.project.importSVG(
        "svg/Colibri__single_lineart.svg",
        {
            expandShapes: true,
            onLoad: function (item) {
                // Do something with item
                // console.log(item);
                console.log("svg loaded.");
                item.name = "The Imported SVG things..";
                svg_import.addChild(item);
                svg_import.fillColor = new paper.Color(0.4, 0.7, 1, 0.4);
                svg_import.strokeColor = new paper.Color(0.4, 0.7, 1, 0.8);
                svg_import.strokeWidth = 2;
                svg_import.strokeCap = 'round';
                svg_import.strokeJoin = 'round';
                // svg_import.data.origStrokeColor = svg_import.strokeColor;
                svg_import.shadowColor = svg_import.strokeColor;
                svg_import.shadowBlur = 5;
                svg_import.shadowOffset = new paper.Point(0, 0);
                // fill with transparent white :-)
                // that helps so we can hitTest against the fill...
                // svg_import.fillColor = new Color(1, 1, 1, 0.001);
                // anchor.position = group.position;
                // anchor.position = svg_import.position;
                anchor.fitBounds(svg_import.bounds);
            },
            onError: function (message) {
                console.error(message);
            }
        }
    );


    // make a helper circle
    var anchor = paper.Path.Rectangle({
        point: [0, 0],
        size: [300, 450],
        strokeColor: 'lime'
        // strokeColor: null
    });

    var group = new paper.Group(
        svg_import,
        anchor
    );
    group.position = paper.view.center;
    group.data.drag_active = false;
    group.data.check_collisions = function() {
        if (group.intersects(collision_object)) {
        // if (svg_import.children[0].intersects(collision_object)) {
            svg_import.fillColor = new paper.Color(1, 0, 0, 0.5);
        } else {
            // group.fillColor = null;
            svg_import.fillColor = new paper.Color(0.4, 0.7, 1, 0.4);
        }
    };

    // var collision_object = Path.RoundRectangle(
    //     new Rectangle(
    //         view.center,
    //         view.bounds.bottomRight - (view.size/3)
    //     ),
    //     50
    // );
    var collision_object = paper.Path.Rectangle(
        new paper.Rectangle(
            paper.view.center,
            paper.view.bounds.bottomRight
        )
    );
    collision_object.strokeColor = new paper.Color(0.3, 0.3, 0.3);
    collision_object.fillColor =  new paper.Color(0.3, 0.3, 0.3);
    collision_object.moveBelow(group);



    // this way you have to hit the lines to be able to drag..
    // http://paperjs.org/reference/group/#onmousedrag
    // group.onMouseDrag = function(event) {
    //     group.position += event.delta;
    // };


    // paper.view.onMouseDown = function(event) {
    function onDownHandler(event) {
        console.log("onDownHandler!");
        console.log("event", event);
        // console.log("event.point", event.point);
        // this is a finer way to test:
        //var event_point = event.point;
        var event_point = new paper.Point(event.x0, event.y0);
        var hit_result = group.hitTest(
            event_point,
            {
                // fill: true,
                fill: false,
                stroke: true,
                segments: true,
                tolerance: 50
            }
        );
        if (hit_result) {
            console.log("hit_result:", hit_result);
            group.data.drag_active = true;
        }
    }
    // paper.view.onMouseDown = onDownHandler;

    // that is the global handller.
    // paper.view.onMouseDrag = function(event) {
    function onDragHandler(event) {
        // console.log("onDragHandler!");
        // console.log("event", event);
        // so we have to first check if the event is inside of our group bounds:
        // if (group.contains(event.point)) {
        //     group.position += event.delta;
        // }

        if (group.data.drag_active) {

            // console.log("event.dx", event.dx, "event.dy", event.dy);
            //var event_delta = event.delta;
            var event_delta = new paper.Point(event.dx, event.dy);
            // console.log("event_delta", event_delta);

            // this is only possible in paperscript:
            // group.position += event.delta;
            // the same in javascript:
            // group.position = group.position.add(event_delta);
            group.translate(event_delta);
            // if (group.isInside(view.bounds)) {
            //     group.position += event.delta;
            // }
            group.data.check_collisions();
        }
    }
    // paper.view.onMouseDrag = onDragHandler;

    function onRotateHandler(event) {
        console.log("onRotateHandler!");
        console.log("event", event);

        if (group.data.drag_active) {

            var event_delta = new paper.Point(event.dx, event.dy);
            group.translate(event_delta);

            var event_deltaAngle = event.da;
            console.log("event_deltaAngle", event_deltaAngle);
            group.rotate(event_deltaAngle);

            group.data.check_collisions();
        }
    }

    // paper.view.onMouseUp = function(event) {
    function onUpHandler(event) {

        if (group.data.drag_active) {
            console.log("onUpHandler!");
            console.log("event", event);
            // var event_deltaAngle = event.da;
            // console.log("event_deltaAngle", event_deltaAngle);

            console.log("group.rotation", group.rotation);
            // this is only possible in paperscript:
            // group.position += event.delta;
            // the same in javascript:
            // if (group.rotation) {
            //
            // }
            // if (group.isInside(view.bounds)) {
            //     group.position += event.delta;
            // }
            group.data.check_collisions();

            group.data.drag_active = false;
        }
    }
    // paper.view.onMouseUp = onUpHandler;


    paper.view.onKeyDown = function(event) {
        if(event.key == 'b') {
            // toggle show boundingbox
            group.selected = !group.selected;
        }
        if(event.key == '-') {
            svg_import.shadowBlur -= 2.5;
        }
        if(event.key == '+') {
            svg_import.shadowBlur += 2.5;
        }
        if (event.modifiers.control) {
            if(event.key == '-') {
                svg_import.strokeWidth -= 1;
            }
            if(event.key == '+') {
                svg_import.strokeWidth += 1;
            }
        }
    };


    paper.view.onResize = function (event) {
        collision_object.bounds = new paper.Rectangle(
            paper.view.center,
            paper.view.bounds.bottomRight
        );
    };


    paper.view.draw();


    // ******************************************
    // Interact.js

    var myCanvas_element = document.querySelector("#myCanvas");
    console.log("myCanvas_element", myCanvas_element);

    // interact('.draggable')
    interact(myCanvas_element)
        .on('click', listener)
        .on('tab', listener)
        .on('doubletap', listener)
        .on('hold', listener)
        // .on('dragstart', listener)
        // .on('dragmove', listener)
        // .on('dragend', listener)
        // .on(['resizemove', 'resizeend'], listener)
        // .on({
        //     gesturestart: listener,
        //     gesturemove: listener,
        //     gestureend: listener
        // })
        ;

    // target elements with the "draggable" class
    // interact('.draggable')
    interact(myCanvas_element)
    .draggable({
        enabled: true,
        // manualStart: true,
        // enable inertial throwing
        inertia: true,
        maxPerElement: 10,
        onstart: onDownHandler,
        // call this function on every dragmove event
        onmove: onDragHandler,
        // call this function on every dragend event
        onend: onUpHandler
    })
    // .on('dragstart', function (event) {
    //     var interaction = event.interaction;
    //     onDownHandler(event);
    //     if (!interaction.interacting()) {
    //       interaction.start({ name: 'drag' },
    //                         event.interactable,
    //                         event.currentTarget);
    //     }
    // })
    // .on('dragstart', function (event) {
    //     onDownHandler(event);
    // })
    // .resizable({
    //     enabled: false,
    // })
    .gesturable({
        enabled: true,
        maxPerElement: 10,
        onstart: onDownHandler,
        // call this function on every gesturemove event
        onmove: onRotateHandler,
        // call this function on every gestureend event
        onend: onUpHandler
    });

};
