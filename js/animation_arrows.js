
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

        this._loadArrowsTest();

        this.paperscope.view.onFrame = (event) => {
            this._onFrame(event);
        };
    }

    handleKeyPress(event) {
        // console.log("event", event);
        switch (event.key) {
            case " ": {
                // space bar pressed
            } break;
            case "Enter": {
                // Do something for "enter" or "return" key press.
            } break;
            case "Escape":
                // Do something for "esc" key press.
                console.log("this:", this);
            break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
    }



    _onFrame(event) {
        if (this.group_arrows) {
            const offset = Math.sin(event.count / 30) * 150;
            this.group_arrows.position.x = this.group_arrows_position_x + offset;
            // force recalculating of fillColor/gradient
            this.group_arrows.strokeColor = this.color_arrows;
            // this.group_arrows_parent.strokeColor = this.color_arrows;
            // this.group_arrows.children[0].strokeColor = this.color_arrows;
        }
    }

    // tests
    _loadArrowsTest() {
        // import path to move on..
        this.group_arrows_parent = new paper.Group();

        this.group_arrows_svg = new paper.Group();
        this.group_arrows_svg.importSVG(
            "./svg/arrows_test.svg",
            {
                expandShapes: true,
                insert: true,
                onLoad: (item) => {
                    console.log("svg loaded _loadArrowsTest");
                    console.log("this.group_arrows_svg", this.group_arrows_svg);
                    console.log("item", item);
                    this.group_arrows_parent = item.children.layer1;

                    // this.group_arrows_parent =
                    //     this.group_arrows_svg.children.svg2.children.layer1;

                    this.group_arrows_parent.parent.clipped = false;
                    this._initArrowsTest();
                },
                onError: (message) => {
                    console.error(message);
                }
            }
        );
        // this.group_arrows_svg.position.x = this.paperscope.view.bounds.center.x;
        this.group_arrows_svg.position.x = 100;
        this.group_arrows_svg.position.y = 100;
    }

    _initArrowsTest() {
        this._initArrowsTest_ColorGradient();
        this._initArrowsTest_Animation();
    }

    _initArrowsTest_ColorGradient() {

        const step5_layer = this.group_arrows_parent;
        const group_arrows = step5_layer.children.arrows;
        group_arrows.applyMatrix = true;

        // const global_leftCenter = group_arrows.localToGlobal(
        const global_leftCenter = group_arrows.localToParent(
            group_arrows.bounds.leftCenter
        );
        // const global_rightCenter = group_arrows.pareToGlobal(
        const global_rightCenter = group_arrows.localToParent(
            group_arrows.bounds.rightCenter
        );
        // create a new array withouth links/references
        const group_arrows_leftCenter = [
            global_leftCenter.x,
            global_leftCenter.y
        ];
        const group_arrows_rightCenter = [
            global_rightCenter.x,
            global_rightCenter.y
        ];
        console.log("group_arrows.bounds.leftCenter", group_arrows.bounds.leftCenter);
        console.log("group_arrows.bounds.rightCenter", group_arrows.bounds.rightCenter);
        console.log("global_leftCenter", global_leftCenter);
        console.log("global_rightCenter", global_rightCenter);
        console.log("group_arrows_leftCenter", group_arrows_leftCenter);
        console.log("group_arrows_rightCenter", group_arrows_rightCenter);


        // test coloring
        const gradient_test = new paper.Gradient([
            [new paper.Color(1, 0, 1, 1), 0.0],
            [new paper.Color(1, 0, 0, 1), 0.05],
            [new paper.Color(0, 1, 0, 1), 0.06],
            [new paper.Color(1, 1, 0, 1), 0.49],
            [new paper.Color(0, 0, 1, 1), 0.5],
            [new paper.Color(1, 1, 0, 1), 0.51],
            [new paper.Color(1, 0, 0, 1), 0.94],
            [new paper.Color(0, 1, 0, 1), 0.95],
            [new paper.Color(0, 1, 1, 1), 1.0],
        ]);

        const color_arrows = {
            gradient: gradient_test,
            // gradient: gradient_arrows,
            origin: group_arrows_leftCenter,
            destination: group_arrows_rightCenter,
            // origin: group_arrows.bounds.leftCenter,
            // destination: group_arrows.bounds.rightCenter,
        };

        // group_arrows.strokeColor = [0, 1, 1];
        // group_arrows.strokeColor = color_arrows;

        this.color_arrows = color_arrows;
        group_arrows.strokeColor = this.color_arrows;

        // debug helper
        // this.gradient_arrows = gradient_arrows;
        this.group_arrows = group_arrows;
        this.arrow_sc = group_arrows.strokeColor;
    }

    _initArrowsTest_Animation() {

        const step5_layer = this.group_arrows_parent;
        const group_arrows = step5_layer.children.arrows;

        this.group_arrows_position_x = group_arrows.position.x;

        const arrow_row_single = group_arrows.children[0];

        // this calculates the offset between the arrows.
        // but can be a little imprecisem (rounding errors..)
        const group_width = group_arrows.bounds.width;
        const arrow_count = arrow_row_single.children.length;
        const arrow_width = arrow_row_single.children[0].bounds.width;
        const arrow_width_all = arrow_width * arrow_count;
        const arrow_space_all = group_width-arrow_width_all;
        const arrow_space = arrow_space_all / arrow_count;
        const arrow_offset = arrow_space + arrow_width;

        console.log("arrow_offset", arrow_offset);

        this.animation_arrows_loop = new MultiAnimation({
            group: step5_layer,
            animationsConfig: new Map([
                [
                    "arrows",
                    [
                        {
                            properties:{
                                position: {
                                    x: "+" + arrow_offset.toString(),
                                },
                                // strokeColorRepaint: 0,
                            },
                            settings:{
                                duration: 500,
                                easing: "linear",
                                repaintColor: this.color_arrows,
                            }
                        },
                        {
                            properties:{
                                position: {
                                    x: "-" + arrow_offset.toString(),
                                },
                                // strokeColorRepaint: 1,
                            },
                            settings:{
                                duration: 1500,
                                easing: "linear",
                                repaintColor: this.color_arrows,
                            }
                        },
                    ],
                ]
            ]),
            loop: true,
        });

        console.log("_initArrowsTest_Animation done.");
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
