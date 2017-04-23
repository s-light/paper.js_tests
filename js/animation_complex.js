
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

        this.paperscope.view.draw();
    }

    _initAnimations() {
        document.addEventListener("click", (event) => {
            this.compAni.singleshot();
        });
        document.addEventListener("keypress", (event) => this.handleKeyPress(event));

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
            } break;
            case "Escape":
                // Do something for "esc" key press.
            break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
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
