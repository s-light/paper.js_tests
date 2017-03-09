
class MultiAnimation {
    constructor({ filename, animations, loop=false } = {}) {
        console.log("create MultiAnimation");
        this._ready = false;
        this._active = false;

        this.filename = filename;
        this._animationsConfig = animations;

        this.group = new paper.Group();
        this._animation_elements = new Map();

        // set loop to true to repeat forever
        // set to integer to repeate n times
        this.loop = loop;

        if (this.filename) {
            this.loadSVG(this.filename);
        }
        // this is now handled insind of loadSVG
        // if (this._animationsConfig === undefined) {
        //     this.loadAnimations();
        // } else {
        //     this._ready = true;
        // }
    }

    loadSVG(filename) {
        // console.log("loadSVG");
        this.filename = filename;
        this.group.importSVG(
            this.filename,
            {
                expandShapes: true,
                insert: true,
                // onLoad: (item) => onSVGload(item),
                onLoad: (item) => {
                    // console.log("svg loaded", item.name);
                    // console.log("get path", item.children.layer1.children.myloop);
                    // in inkscape you have to name one layer 'animation'
                    // we look for this child!
                    const animation_layer = item.children.animation;
                    if (animation_layer) {
                        // console.log("animation_layer", animation_layer);
                        for (const el of animation_layer.children) {
                            // console.log(" '" + el.name + "'");
                            if (this._animation_elements.get(el.name) === undefined) {
                                el.data._playcount = 0;
                                el.data._animationConfigs = {};
                                this._animation_elements.set(el.name, el);
                            } else {
                                console.error(
                                    "element '" + el.name +
                                    "' allready in list. please make sure every id is unique."
                                );
                            }
                        }
                        console.log(
                            "SVG-File '" + this.filename + "' " +
                            "contains the following animatable elements: [" +
                            [...(this._animation_elements.keys())].join(", ") +
                            "]"
                        );
                        if (this._animationsConfig === undefined) {
                            this.loadAnimations();
                        } else {
                            this._ready = true;
                        }
                        // console.log("this._animation_elements", this._animation_elements);
                        // console.log("this._animation_elements array", [...this._animation_elements]);
                        // console.log("this._animation_elements json", JSON.stringify([...this._animation_elements]));
                    } else {
                        console.error(
                            "Parsing of SVG-File Failed!\n" +
                            "no layer 'animation' found.\n" +
                            "please make sure that one layer in hase the id 'animation' " +
                            "and move needed objects to this.\n" +
                            "in inkscape you can do this in the XML editor (Ctrl+Shift+X)"
                        );
                    }
                },
                onError: (message) => {
                    console.error(message);
                }
            }
        );
    }

    loadAnimations(filename=undefined) {
        // format of JSON file:
        // Map compatible
        // [ [ "el1", {} ], [ "el2", {} ], [ "el3", {} ] ]
        console.log("loadAnimations");
        if (filename) {
            this.animationsFilename = filename;
        } else {
            this.animationsFilename = this.filename.replace(/\.svg/i, ".json");
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
        const load_httpRequest = new XMLHttpRequest();
        // load_httpRequest.onreadystatechange  = () => {
        load_httpRequest.addEventListener("load", (event) => {
            try {
                if (event.target.status === 200) {
                    // console.log("event.target.response", event.target.response);
                    let respJSON = null;
                    try {
                        respJSON = JSON.parse(event.target.response);
                        // console.log("respJSON", respJSON);
                    } catch (e) {
                        console.error("Error while parsing JSON:", e);
                    }
                    try {
                        this._animationsConfig = new Map(respJSON);
                        // console.log("this._animationsConfig", this._animationsConfig);
                    } catch (e) {
                        console.error("Error while converting response JSON to Map:", e);
                    }
                    console.log(
                        "Successfully loaded animations config from '" +
                        this.animationsFilename + "' :",
                        this._animationsConfig
                    );
                    // now we need to map the _animations configurations to the elements:
                    for (const [elName, el] of this._animation_elements.entries()) {
                        // console.log("elName", elName, "el", el);
                        if (this._animationsConfig.has(elName)) {
                            el.data._animationConfigs = this._animationsConfig.get(elName);
                        } else {
                            el.data._animationConfigs = null;
                            console.info("missing animation configuration for element '" +
                                elName +
                                "'. this Element will not animate."
                            );
                        }
                    }

                    // now all preparations are done.
                    this._ready = true;

                } else {
                    console.error('There was a problem with the request.');
                }
            } catch( e ) {
                console.error('Caught Exception:', e);
            }
        });
        // hardcore no - cache
        // load_httpRequest.open(
        //     'GET',
        //     this.animationsFilename + "?" + (new Date()).getTime()
        // );
        load_httpRequest.open('GET', this.animationsFilename);
        // Cache-Control: no-cache
        load_httpRequest.setRequestHeader('Cache-Control', 'no-cache');
        load_httpRequest.send();
    }

    toggle() {
        // start animation
        if (this._active) {
            this.end();
        } else {
            this.start();
        }
    }

    singleshot() {
        // start animation one time
        if (!this._active) {
            this.start();
            this._active = false;
        }
    }

    start() {
        // start animation
        this._active = true;
        for (const [elName, el] of this._animation_elements.entries()) {
            el.data._playcount = 0;
            this._animateEl(elName);
        }
    }

    end() {
        // end animation (if loop is active run current animation till end)
        this._active = false;
    }

    stop(goToEnd=false) {
        // immediately stop animation
        this._active = false;
        for (const el of this._animation_elements) {
            el.stop(goToEnd);
        }
    }

    _animateEl(elName) {
        const el = this._animation_elements.get(elName);
        const animationConfigs = el.data._animationConfigs;
        if (animationConfigs) {
            // _animationConfigs must be an array.
            // we override the complete function in the last element.
            animationConfigs[animationConfigs.length - 1]
                .settings.complete = () => this._complete(elName);
            // console.log("animationConfigs", animationConfigs);
            // start animation
            el.animate(animationConfigs);
        }
    }

    _complete(elName) {
        // console.log("complete", elName);
        const el = this._animation_elements.get(elName);
        if (el) {
            // console.log("el", el);
            // we add 1 to playcount if the animation completed.
            el.data._playcount += 1;

            // check if animation is active
            if (this._active) {
                // console.log("this.loop", this.loop);
                if (typeof this.loop === "number") {
                    // console.log("loop n times - check playcount");
                    if (el.data._playcount < this.loop) {
                        // restart animation
                        this._animateEl(elName);
                    } else {
                        // console.log("--> playcount reached.");
                        this._active = false;
                    }
                } else if (typeof this.loop === "boolean") {
                    // console.log("loop inifinity - check state");
                    if (this.loop) {
                        // console.log("--> loop is active.");
                        // infinity loop
                        this._animateEl(elName);
                    } else {
                        // console.log("--> loop is off.");
                        this._active = false;
                    }
                } else {
                    this._active = false;
                }
            }
        }
    }

}

var test = {};

class MainApp {
    constructor(canvas_el) {
        this.canvas_el = canvas_el;

        this._initPaperJS();

        this.compAni = new MultiAnimation({
            // filename:"./svg/button_complex.svg"
            filename:"./svg/button_simple.svg"
            // filename:"./svg/Colibri__single_lineart.svg"
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

window.addEventListener("load", function(event) {
    var canvas = document.getElementById('myCanvas');
    const myapp = new MainApp(canvas);
});
