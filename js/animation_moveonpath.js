
class MainApp {
    constructor(canvas_el) {
        this.canvas_el = canvas_el;

        this._initPaperJS();
        this._addCustomAnimations();
        this._initAnimations();

        // var square = new paper.Path.Rectangle(new paper.Point(175, 175), new paper.Size(150,150));
        // square.strokeColor = 'green';
        // square.animate({
        //     properties: {
        //         position: {
        //             x: "+500",
        //             // x: 500,
        //             y: 150     // absolute position. At the end, `y` will be : 150
        //         },
        //         strokeColor: {
        //             hue: "+100",
        //             brightness: "+0.4"
        //         }
        //     },
        //     settings: {
        //         duration:1500,
        //         easing:"linear"
        //     }
        // });

    }

    _initPaperJS() {
        this.paperscope = paper.setup(this.canvas_el);
        // console.log("this.paperscope", this.paperscope);

        // set applyMatrix=false --> this means matrix can be read back...
        this.paperscope.settings.applyMatrix = false;
        // activate this scope.project:
        this.paperscope.project.activate();
        // insertItems into project default:true
        // this.paperscope.settings.insertItems = true;

        // this.rect0 = new paper.Path.Rectangle({
        //     point: [50, 150],
        //     size: [50, 50]
        // });
        // arrow pointing to 0° (thats 3o'clock)
        this.rect0 = new paper.Path([
            [0, 0],
            [20, 0],
            [50, 10],
            [20, 20],
            [0, 20]
        ]);
        this.rect0.closed = true;
        this.rect0.strokeColor = 'lime';
        this.rect0.fillColor = new paper.Color(1,1,1, 0.2);
        this.rect0.name = "rect0";


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

        const tempImporter = new paper.Group();
        tempImporter.importSVG(
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
                    this.path0 = item.children.layer1.children.myloop;
                    this.path0.strokeColor = 'yellow';
                    this.path0.name = 'path0';
                    this.path0.position = new paper.Point(300, 300);
                    console.log("apply matrix to path:", this.path0.matrix.apply());
                },
                onError: (message) => {console.error(message);}
            }
        );



        this.paperscope.view.draw();
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
        document.addEventListener("keypress", (event) => this.handleKeyPress(event));
    }

    handleKeyPress(event) {
        // console.log("event", event);
        switch (event.key) {
            case " ": {
                // space bar pressed
                this.startMoveOnPath();
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
            } break;
            case "Escape":
                // Do something for "esc" key press.
            break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
    }

    startMoveOnPath() {
        // console.log("startMoveOnPath");
        // console.log("this", this);
        // console.log("event", event);
        this.rect0.animate({
            properties: {
                moveOnPath: 1
            },
            settings: {
                targetPath: this.path0,
                duration: 6000,
                easing: "swing",
                complete: () => {
                    // Hack to allow animation to start again.
                    this.rect0.data._animatePaperVals.moveOnPath = 0;
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

var myapp;

window.addEventListener("load", function(event) {
    var canvas = document.getElementById('myCanvas');
    // const myapp = new MainApp(canvas);
    myapp = new MainApp(canvas);
});
