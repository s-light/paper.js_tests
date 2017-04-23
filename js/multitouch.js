// javascript!!!
// goal: extend with interactive.js multitouch gestures.


import ShowFPS from './showfps';

import paper from 'paper';
import animatePaper from 'paper-animate';

import interact from 'interactjs';



class MainApp {
    constructor(canvas_el) {
        this.canvas_el = canvas_el;

        this._initPaperJS();

        this._initInteract();
        // document.addEventListener("keypress", (event) => this.handleKeyPress(event));
    }

    _initPaperJS() {
        console.log("paperjs version:", paper.version);

        this.paperscope = paper.setup(this.canvas_el);
        // console.log("this.paperscope", this.paperscope);

        // set applyMatrix=false --> this means matrix can be read back...
        this.paperscope.settings.applyMatrix = false;
        // set this scope.project active:
        // all newly created paper Objects go into this project.
        this.paperscope.project.activate();

        this.paperscope.view.draw();

        this._drawThings();

        this.paperscope.view.onFrame = (event) => {
            this._onFrame(event);
        };
    }

    _onFrame(event) {
        // nothing to do here.
    }



    _drawThings() {
        // make some objects
        this.obj_list = [
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
            // paper.Path.Circle({
            //     center: paper.view.center,
            //     radius: 170,
            //     strokeColor: 'blue',
            //     fillColor: new paper.Color(1,1,1, 0.2),
            //     name:"circle1"
            // }),
            paper.Path.Circle({
                center: paper.view.center.subtract(new paper.Point(300, 0)),
                radius: [200, 80],
                strokeColor: 'orange',
                fillColor: new paper.Color(1,1,1, 0.2),
                name:"circle2"
            }),
        ];
    }


    // with this we check / get the item we want to move..
    getItemAtPoint(x, y) {
        // console.log("getItemAtPoint!");
        // console.log("event", event);
        // console.log("event.point", event.point);
        // console.log("x", x, "y", y);
        // this is a finer way to test:
        //const event_point = event.point;
        const event_point = new paper.Point(x, y);
        const hit_result = paper.project.hitTest(
            event_point,
            {
                fill: true,
                stroke: true,
                segments: true,
                tolerance: 5
            }
        );
        let hit_item = null;
        if (hit_result) {
            hit_item = hit_result.item;
        }
        // console.log("hit_item:", hit_item);
        return hit_item;
    }


    onDragHandler(event) {
        // console.group("onDragHandler:");

        // console.log("event.target", event.target);
        // console.log("event.target.name", event.target.name);
        // console.log("event.dx", event.dx, "event.dy", event.dy);

        // create new paper.js point
        const event_delta = new paper.Point(event.dx, event.dy);
        // console.log("event_delta", event_delta);
        event.target.translate(event_delta);

        console.groupEnd();
    }

    onRotateHandler(event) {
        console.log("onRotateHandler!");
        // console.log("event", event);

        const event_delta = new paper.Point(event.dx, event.dy);
        event.target.translate(event_delta);

        const event_deltaAngle = event.da;
        // console.log("event_deltaAngle", event_deltaAngle);
        event.target.rotate(event_deltaAngle);

    }

    onUpHandler(event) {
        console.log("onUpHandler:");
        console.log("event.target.name", event.target.name);
        // if (event.target.data.drag_active) {
        //     console.log("event", event);
        //     // event.target.data.drag_active = false;
        // }
    }


    log_event(event) {
      console.log(event.type, event.pageX, event.pageY, event.dx, event.dy);
    }


    _initInteract() {
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

            interact(this.canvas_el)
            .draggable({
                enabled: true,
                manualStart: true,
                // enable inertial throwing
                // inertia: true,
                inertia: false,
                maxPerElement: 10,
                // onstart: onDownHandler,
                // call this function on every dragmove event
                onmove: this.onDragHandler,
                // call this function on every dragend event
                onend: this.onUpHandler
            })
            .gesturable({
                enabled: true,
                manualStart: true,
                maxPerElement: 10,
                // onstart: onDownHandler,
                // call this function on every gesturemove event
                onmove: this.onRotateHandler,
                // call this function on every gestureend event
                // onend: this.onUpHandler
            })
            .on('down', (event)=> {
                console.group("down handler");
                // console.log("event", event);
                // console.log("event.interactable", event.interactable);
                console.log("event.interaction.interacting()", event.interaction.interacting());

                const interaction = event.interaction;
                const hit_item = this.getItemAtPoint(event.clientX, event.clientY);
                // const hit_item = this.getItemAtPoint(event.x0, event.y0);
                if (hit_item) {
                    console.log("hit_item.name", hit_item.name);
                    // console.log("event.currentTarget", event.currentTarget);
                    // console.log("interaction.interacting()", interaction.interacting());

                    // https://github.com/taye/interact.js/issues/480#issuecomment-275708556
                    if (interaction.interacting()) {

                        // stop dragging
                        interaction.end();

                        // start gesture
                        interaction.start(
                            { name: 'gesture' },
                            event.interactable,
                            // event.currentTarget
                            hit_item
                         );
                    } else {
                        // first pointer goes down, start a drag
                        interaction.start(
                            { name: 'drag' },
                            event.interactable,
                            // event.currentTarget
                            hit_item
                         );
                    }
                }

                console.groupEnd();
            })
            .rectChecker(function (element) {
                // https://hacks.mozilla.org/2014/11/interact-js-for-drag-and-drop-resizing-and-multi-touch-gestures/
                // console.log("rectChecker");
                // console.log("element", element);
                // console.log("element instanceof paper.Path", element instanceof paper.Path);
                // return a suitable object for interact.js
                let result_rect = null;
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

    }


}






// https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
// The DOMContentLoaded event is fired when the initial HTML document has been
// completely loaded and parsed, without waiting for stylesheets, images,
// and subframes to finish loading.
// A very different event 'load' should be used only to detect a fully-loaded page.
// It is an incredibly popular mistake to use load where DOMContentLoaded
// would be much more appropriate, so be cautious.

let myapp = {};

window.addEventListener("load", function(event) {
    const canvas = document.getElementById('myCanvas');
    myapp = new MainApp(canvas);
});
