
import ShowFPS from './showfps';

import paper from 'paper';
import animatePaper from 'paper-animate';

import {
    MultiAnimation,
    MultiAnimationSVG,
} from './animation_multi';


class MainApp {
    constructor(canvas_el) {
        this.canvas_el = canvas_el;

        this._initPaperJS();


        this.compAni = new MultiAnimationSVG({
            // filenameSVG:"./svg/button_complex.svg"
            filenameSVG:"./svg/button_simple.svg"
            // filenameSVG:"./svg/Colibri__single_lineart.svg"
        });
        this.compAni.loop = true;
        // this.compAni.group.position = paper.Point(400, 200);

        this._addCustomAnimations();
        this._initAnimations();

    }

    _initPaperJS() {
        this.paperscope = paper.setup(this.canvas_el);
        // console.log("this.paperscope", this.paperscope);

        // set applyMatrix=false --> this means matrix can be read back...
        this.paperscope.settings.applyMatrix = false;
        // set this scope.project active:
        // all newly created paper Objects go into this project.
        this.paperscope.project.activate();

        this._initPathToMoveOn();


        this.paperscope.view.draw();
    }

    _initPathToMoveOn() {
        // create some path to move on
        // const center = new paper.Point(300, 300);
        // const points = 5;
        // const radius1 = 50;
        // const radius2 = 200;
        // this.path0 = new paper.Path.Star(center, points, radius1, radius2);
        // // const rectangle = new paper.Rectangle(
        // //     new paper.Point(200, 200),
        // //     new paper.Size(550, 200)
        // // );
        // // this.path0 = new paper.Path.Ellipse(rectangle);
        // this.path0.strokeColor = 'yellow';
        // this.path0.name = 'path0';
        // // console.log(this.path0 instanceof paper.Path);

        // import path to move on..
        this.graphic_starloop = new paper.Group();
        this.graphic_starloop.importSVG(
            "./svg/starloop.svg",
            {
                expandShapes: true,
                insert: true,
                // onLoad: (item) => onSVGload(item),
                onLoad: (item) => {
                    console.log("this", this);
                    console.log("svg loaded", item.name);
                    // console.log("get path", item.children.layer1.children.myloop);
                    // this.path0.removeSegments();
                    // this.path0 = new paper.Path();
                    item.clipped = false;
                    this.path0 = item.children.layer1.children.myloop;
                    this.path0.strokeColor = 'yellow';
                    this.path0.name = 'path0';
                    this.path0.position = new paper.Point(500, 300);
                    console.log("apply matrix to path:", this.path0.matrix.apply());
                },
                onError: (message) => {console.error(message);}
            }
        );
        // this.graphic_starloop.position = [500, 100];

    }

    _addCustomAnimations() {
        animatePaper.extendPropHooks({
            "moveOnPath": {
                get: function(tween) {
                    if (!tween.item.data._animatePaperVals) {
                        tween.item.data._animatePaperVals = {};
                    }
                    if (typeof tween.item.data._animatePaperVals.moveOnPath === "undefined") {
                        tween.item.data._animatePaperVals.moveOnPath = 0;
                    }
                    var output = tween.item.data._animatePaperVals.moveOnPath;
                    return output;
                },
                set: function(tween) {
                    var curOffsetOnPath = tween.item.data._animatePaperVals.moveOnPath;
                    // var trueOffsetOnPath = tween.now - curOffsetOnPath;
                    tween.item.data._animatePaperVals.moveOnPath = tween.now;
                    if (tween.A.settings.targetPath instanceof paper.Path) {
                        // console.log("curOffsetOnPath", curOffsetOnPath);
                        const pathOffset = tween.A.settings.targetPath.length * curOffsetOnPath / 1;
                        // console.log("pathOffset", pathOffset);
                        // console.log("tween.A.settings.targetPath", tween.A.settings.targetPath);
                        // const curCurveLocation = tween.A.settings.targetPath.getLocationAt(pathOffset);
                        const curPos = tween.A.settings.targetPath.getPointAt(pathOffset);
                        const curRot = tween.A.settings.targetPath.getTangentAt(pathOffset).angle;
                        tween.item.position = curPos;
                        tween.item.rotation = curRot;
                    } else {
                        // do nothing.
                    }
                }
            }
        });


        // animatePaper.fx.moveOnPathStart2End = function(target, path, loop) {
        //     target.animate([
        //         {
        //             properties: {
        //                 moveOnPath: 1
        //             },
        //             settings: {
        //                 path: path,
        //                 duration: 5000,
        //                 easing: "linear",
        //                 complete: function() {
        //                     // Hack to fix start/stop issues
        //                     target.data._animatePaperVals.moveOnPath = 0;
        //                     if (!loop) return;
        //                     ANIMATE.revolve(target, referencePoint, loop);
        //                 }
        //             }
        //         }
        //     ]);
        // };


    }

    _initAnimations() {
        // document.addEventListener("click", (event) => {
        //     this.compAni.singleshot();
        // });
        document.addEventListener("click", (event) => this.moveToPosition(event));
        document.addEventListener("keypress", (event) => this.handleKeyPress(event));
        // make sure the animation is run once to get a defined state of the objects.
        this.compAni.singleshot();
    }

    handleKeyPress(event) {
        // console.log("event", event);
        switch (event.key) {
            case " ": {
                // space bar pressed
                this.compAni.toggle();
            } break;
            case "ArrowDown": {
                // Do something for "down arrow" key press.
            } break;
            case "ArrowUp": {
                // Do something for "up arrow" key press.
            } break;
            case "ArrowLeft": {
                // Do something for "left arrow" key press.
            } break;
            case "ArrowRight": {
                // Do something for "right arrow" key press.
            } break;
            case "Enter": {
                // Do something for "enter" or "return" key press.
                this.startMoveOnPath();
            } break;
            case "Escape":
                // Do something for "esc" key press.
                console.log("pos:", this.compAni.group.position);
            break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
    }

    moveToPosition(event) {
        // console.log("this", this);
        // console.log("event", event);
        // const position_new = new paper.Point(event.clientX, event.clientY);

        // console.log("this.compAni.group.position", this.compAni.group.position);
        // console.log("position_new", position_new);

        // this does not work.
        // this.compAni.group.position = paper.Point(event.clientX, event.clientY);
        // this does work:
        // this.compAni.group.position.x = event.clientX;
        // this.compAni.group.position.y = event.clientY;
        // this.paperscope.view.draw();

        // convert absolute position to relative
        // this avoids a bug in older animatePaper.js:
        // see report at https://github.com/Eartz/animatePaper.js/issues/8

        const x_relative_number =  event.clientX - this.compAni.group.position.x;
        let x_relative = String(x_relative_number);
        if (x_relative_number >= 0) {
            x_relative = "+" + x_relative;
        }
        // console.log("x_relative", x_relative);

        animatePaper.animate(this.compAni.group, {
            properties: {
                position: {
                    // x: event.clientX,
                    x: x_relative,
                    y: event.clientY,
                }
            },
            settings: {
                duration: 500,
                easing: "swing"
            }
        });
    }

    startMoveOnPath() {
        // console.log("startMoveOnPath");
        // console.log("this", this);
        // console.log("event", event);
        animatePaper.animate(this.compAni.group, {
            properties: {
                moveOnPath: 1
            },
            settings: {
                targetPath: this.path0,
                duration: 10000,
                easing: "swing",
                complete: () => {
                    // Hack to allow animation to start again.
                    this.compAni.group.data._animatePaperVals.moveOnPath = 0;
                }
            }
        });
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
    var canvas = document.getElementById('myCanvas');
    myapp = new MainApp(canvas);
});
