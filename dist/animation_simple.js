webpackJsonp([1],{

/***/ 13:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 14:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 6:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_stats_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_stats_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_stats_js__);
// show fps with help from
// https://github.com/mrdoob/stats.js



class ShowFPS {
    constructor() {
        // ******************************************
        // display some stats
        // https://github.com/mrdoob/stats.js
        this.stats = new __WEBPACK_IMPORTED_MODULE_0_stats_js___default.a();
        // 0: fps, 1: ms, 2: mb, 3+: custom
        this.stats.showPanel(0);
        this.stats.dom.style.left = 'auto';
        this.stats.dom.style.right = 0;
        document.body.appendChild( this.stats.dom );

        requestAnimationFrame( () => {this.animate();} );
    }

    animate() {
        // this.stats.begin();
        // // monitored code goes here
        // this.stats.end();
        this.stats.update();
        requestAnimationFrame( () => {this.animate();} );
    }
}
/* unused harmony export default */


// Only executed our code once the DOM is ready.
window.addEventListener("load", function(event) {
    const myShowFPS = new ShowFPS();
});


/***/ }),

/***/ 8:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__showfps__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_paper__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_paper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_paper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_paper_animate__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_paper_animate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_paper_animate__);








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
        this.paperscope = __WEBPACK_IMPORTED_MODULE_1_paper___default.a.setup(this.canvas_el);
        // console.log("this.paperscope", this.paperscope);

        // set applyMatrix=false --> this means matrix can be read back...
        this.paperscope.settings.applyMatrix = false;
        // set this scope.project active:
        // all newly created paper Objects go into this project.
        this.paperscope.project.activate();

        this.rect0 = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path.Rectangle({
            point: [0, 0],
            size: [200, 150],
            strokeColor: 'lime',
            fillColor: new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Color(1,1,1, 0.2),
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
            case "p": {
                this.moveToAbsoluteNegativePosition();
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

        __WEBPACK_IMPORTED_MODULE_2_paper_animate___default.a.animate(this.rect0, {
            properties: {
                position: {
                    x: event.clientX,
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

        __WEBPACK_IMPORTED_MODULE_2_paper_animate___default.a.animate(this.rect0, [
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

    moveToAbsoluteNegativePosition() {
        __WEBPACK_IMPORTED_MODULE_2_paper_animate___default.a.animate(this.rect0, [
            {
                properties: {
                    position: {
                        x: 300,
                        y: 300,
                    },
                },
                settings: {
                    duration: 500,
                    easing: "swing",
                },
            },
            {
                properties: {
                    position: {
                        // this is an absolute position!!
                        x: -100,
                        // x: this.rect0.bounds.width * -1,
                    },
                },
                settings: {
                    duration: 500,
                    easing: "swing",
                },
            },
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


/***/ })

},[8]);
//# sourceMappingURL=animation_simple.js.map