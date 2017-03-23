
class MultiAnimations {
    constructor({ group, animationsConfig, loop=false } = {}) {
        console.log("create MultiAnimation");
        this._ready = false;
        this._active = false;

        this._group = new paper.Group();
        this._animationsElementsSet = false;
        this._animationsElements = new Map();
        this._animationsConfigSet = false;
        this._animationsConfig = new Map();


        if (group) {
            this.group = group;
        }
        if (animationsConfig) {
            this.animationsConfig = animationsConfig;
        }
        if (group && animationsConfig) {
            this.mapConfigs2Elements();
        }

        // set loop to true to repeat forever
        // set to integer to repeate n times
        this.loop = loop;
    }


    get group() {
        return this._group;
    }
    set group(group) {
        console.log("group", group);
        if (group instanceof paper.Group) {
            this._group = group;
            this._parseGroupChilds();
        } else {
            console.error("error: given object is not an paper.Group type!");
        }
    }

    get animationsConfig() {
        return this._animationsConfig;
    }
    set animationsConfig(animationsConfig) {
        console.log("animationsConfig", animationsConfig);
        if (animationsConfig instanceof Map) {
            this._animationsConfig = animationsConfig;
            this._animationsConfigSet = true;
            this.mapConfigs2Elements();
        } else {
            console.error("error: given object is not an Map type!");
        }
    }

    _parseGroupChilds() {
        // console.log("_parseGroupChilds");
        try {
            // first clear Map.
            this._animationsElements.clear();
            // add new elements
            for (const el of this.group.children) {
                // console.log(" '" + el.name + "'");
                if (!this._animationsElements.has(el.name)) {
                    el.data._playcount = 0;
                    el.data._animationConfigs = {};
                    this._animationsElements.set(el.name, el);
                } else {
                    console.error(
                        "element '" + el.name +
                        "' allready in list. please make sure every id/name is unique."
                    );
                }
            }
            console.log(
                "Group contains the following animatable elements: [" +
                [...(this._animationsElements.keys())].join(", ") +
                "]"
            );
            this._animationsElementsSet = true;
        } catch (e) {
            console.error("parsing of group childs failed!", e);
        }
    }

    mapConfigs2Elements() {
        // we need to map the _animations configurations to the elements:
        for (const [elName, el] of this._animationsElements.entries()) {
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
        for (const [elName, el] of this._animationsElements.entries()) {
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
        for (const el of this._animationsElements) {
            el.stop(goToEnd);
        }
    }

    _animateEl(elName) {
        const el = this._animationsElements.get(elName);
        const animationConfigs = el.data._animationConfigs;
        if (animationConfigs) {
            // console.log("animationConfigs", animationConfigs);
            // _animationConfigs must be an array.
            // we override the complete function in the last element.
            animationConfigs[animationConfigs.length - 1]
                .settings.complete = () => this._complete(elName);
            // start animation
            el.animate(animationConfigs);
        }
    }

    _complete(elName) {
        // console.log("complete", elName);
        const el = this._animationsElements.get(elName);
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


class MultiAnimationSVG extends MultiAnimations {
    constructor(
        {
            filenameSVG,
            filenameConfig,
            animationsConfig,
            loop=false
        } = {}
    ) {
        console.log("create MultiAnimationSVG");

        super({
            animationsConfig: animationsConfig,
            loop:loop
        });

        this.filenameSVG = filenameSVG;
        this.filenameConfig = filenameConfig;

        this.groupSVG = new paper.Group();

        if (this.filenameSVG) {
            this.loadSVG(this.filenameSVG);
        }
        // this is now handled insind of loadSVG
        // if (this._animationsConfig === undefined) {
        //     this.loadConfig();
        // } else {
        //     this._ready = true;
        // }
    }

    loadSVG(filename) {
        // console.log("loadSVG");
        this.filenameSVG = filename;
        this.groupSVG.importSVG(
            this.filenameSVG,
            {
                expandShapes: true,
                insert: true,
                // onLoad: (item) => onSVGload(item),
                onLoad: (item) => {
                    // console.log("svg loaded", item.name);
                    // console.log("item", item);
                    // console.log("get path", item.children.layer1.children.myloop);
                    // in inkscape you have to name one layer 'animation'
                    // we look for this child!
                    const animation_layer = item.children.animation;
                    if (animation_layer) {
                        // console.log("animation_layer", animation_layer);
                        // first clear list
                        // console.log("this", this);
                        // console.log("animation_layer", animation_layer);
                        // console.log("animation_layer.children", animation_layer.children);
                        // console.log("this._group", this._group);

                        this._group.removeChildren();
                        // with this parsing we link the children from of the
                        // svg 'animation' layer to our internal simple _group
                        // for (const el of animation_layer.children) {
                        //     console.log(" '" + el.name + "'");
                        //     // add to internal _group
                        //     // this._group.addChild(el);
                        // }
                        this._group.addChildren(animation_layer.children);
                        // console.log("this._group", this._group);
                        this._parseGroupChilds();

                        if (this._animationsConfigSet) {
                            // update mapping
                            this.mapConfigs2Elements();
                            this._ready = true;
                        } else {
                            this.loadConfig();
                        }
                        // console.log("this._animationsElements", this._animationsElements);
                        // console.log("this._animationsElements array", [...this._animationsElements]);
                        // console.log("this._animationsElements json", JSON.stringify([...this._animationsElements]));
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

    loadConfig(filename=undefined) {
        // format of JSON file:
        // Map compatible
        // [ [ "el1", {} ], [ "el2", {} ], [ "el3", {} ] ]
        // console.log("loadConfig");
        if (filename) {
            this.filenameConfig = filename;
        } else {
            this.filenameConfig = this.filenameSVG.replace(/\.svg/i, ".json");
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
        const load_httpRequest = new XMLHttpRequest();
        // load_httpRequest.onreadystatechange  = () => {
        load_httpRequest.addEventListener("load", (event) => {
            try {
                if (event.target.status === 200) {
                    // console.log("event.target.response", event.target.response);
                    let respJSON;
                    try {
                        respJSON = JSON.parse(event.target.response);
                        // console.log("respJSON", respJSON);
                    } catch (e) {
                        console.error("Error while parsing JSON:", e);
                    }
                    let respMap;
                    try {
                        respMap = new Map(respJSON);
                        // console.log("this._animationsConfig", this._animationsConfig);
                    } catch (e) {
                        console.error("Error while converting response JSON to Map:", e);
                    }
                    this._animationsConfig = respMap;
                    console.log(
                        "Successfully loaded animations config from '" +
                        this.filenameConfig + "' :",
                        this._animationsConfig
                    );

                    this.mapConfigs2Elements();

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
        //     this.filenameConfig + "?" + (new Date()).getTime()
        // );
        load_httpRequest.open('GET', this.filenameConfig);
        // Cache-Control: no-cache
        load_httpRequest.setRequestHeader('Cache-Control', 'no-cache');
        load_httpRequest.send();
    }
}


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
                duration: 6000,
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
