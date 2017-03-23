
class MainApp {
    constructor(canvas_el) {
        this.canvas_el = canvas_el;

        this._initPaperJS();
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
        // set this scope.project active:
        // all newly created paper Objects go into this project.
        this.paperscope.project.activate();

        this.rect0 = new paper.Path.Rectangle({
            point: [0, 0],
            size: [150, 150],
            strokeColor: 'lime',
            fillColor: new paper.Color(1,1,1, 0.2),
            name:"rect0"
        });

        this.paperscope.view.draw();
    }

    _initAnimations() {
        // this.canvas_el.addEventListener("click", (event) => {
        //     this.moveToPosition(event);
        // });
        document.addEventListener("click", (event) => this.moveToPosition(event));
        document.addEventListener("keypress", (event) => this.handleKeyPress(event));

        this.breath_loop = false;

        // this.rect0.onClick = function(event) {
        //     console.log("this", this);
        //     console.log("event", event);
        //     // var event_delta = new paper.Point(event.dx, event.dy);
        //     this.animate({
        //
        //     });
        //
        //
        // };

    }

    handleKeyPress(event) {
        // console.log("event", event);
        switch (event.key) {
            case " ": {
                // space bar pressed
                this.toggleBreath();
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

    moveToPosition(event) {
        // console.log("this", this);
        // console.log("event", event);
        // const position_new = new paper.Point(event.clientX, event.clientY);

        // console.log("this.rect0.position", this.rect0.position);
        // console.log("position_new", position_new);

        // this.rect0.position.x = event.clientX;
        // this.rect0.position.y = event.clientY;
        // this.paperscope.view.draw();

        // convert absolute position to relative
        // this avoids a bug in older animatePaper.js:
        // see report at https://github.com/Eartz/animatePaper.js/issues/8

        const x_relative_number =  event.clientX - this.rect0.position.x;
        let x_relative = String(x_relative_number);
        if (x_relative_number >= 0) {
            x_relative = "+" + x_relative;
        }
        // console.log("x_relative", x_relative);

        this.rect0.animate({
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

    toggleBreath() {
        if (this.breath_loop) {
            this.breath_loop = false;
        } else {
            this.breath_loop = true;
            // start animation
            this.breath();
        }
        console.log("breath_loop:", this.breath_loop);
    }

    breath() {
        // console.log("this", this);
        // console.log("event", event);

        this.rect0.animate([
            {
                properties: {
                    scale: 1.2,
                },
                settings: {
                    duration: 800,
                    easing: "swing"
                }
            },
            {
                properties: {
                    scale: 1,
                },
                settings: {
                    duration: 800,
                    easing: "swing",
                    complete: () => {
                        console.log('complete !');
                        if (this.breath_loop) {
                            this.breath();
                        }
                    }
                }
            }
        ]);
    }

}


// https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
// The DOMContentLoaded event is fired when the initial HTML document has been
// completely loaded and parsed, without waiting for stylesheets, images,
// and subframes to finish loading.
// A very different event 'load' should be used only to detect a fully-loaded page.
// It is an incredibly popular mistake to use load where DOMContentLoaded
// would be much more appropriate, so be cautious.

window.addEventListener("load", function(event) {
    var canvas = document.getElementById('myCanvas');
    const myapp = new MainApp(canvas);
});
