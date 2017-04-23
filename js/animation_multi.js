// animation_multi

import paper from 'paper';
import animatePaper from 'paper-animate';




export class MultiAnimation {
    constructor({ group, animationsConfig, loop=false, complete } = {}) {
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

        this.complete = complete;
    }

    get active() {
        return this._active;
    }

    get group() {
        return this._group;
    }
    set group(group) {
        // console.log("group", group);
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
        // console.log("animationsConfig", animationsConfig);
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
                    const el_data = {};
                    el_data.playcount = 0;
                    el_data.animationConfigs = {};
                    el_data.done = true;
                    el_data.element = el;
                    this._animationsElements.set(el.name, el_data);
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
            console.error("parsing of group childs failed!\n", e);
        }
    }

    mapConfigs2Elements() {
        // we need to map the _animations configurations to the elements:
        for (const [elName, el_data] of this._animationsElements.entries()) {
            // console.log("elName", elName, "el", el);
            if (this._animationsConfig.has(elName)) {
                el_data.animationConfigs = this._animationsConfig.get(elName);
            } else {
                el_data.animationConfigs = null;
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

    singleshot(options) {
        // TODO: handle complete callback more user-friendly
        // currently if you do not specify a an options object the currently set
        // function will be used.
        // make it possible to override this temporarily.

        // start animation one time
        if (!this._active) {
            this.start(options);
            this._active = false;
        }
    }

    start(options) {
        if (options) {
            if (options.complete) {
                this.complete = options.complete;
            }
        }
        // start animation
        this._active = true;
        for (const [elName, el_data] of this._animationsElements.entries()) {
            el_data.playcount = 0;
            this._animateEl(elName);
        }
    }

    end() {
        // end animation (if loop is active run current animation till end)
        this._active = false;
    }

    stop(goToEnd=true) {
        // immediately stop animation
        this._active = false;
        for (const [elName, el_data] of this._animationsElements.entries()) {
            animatePaper.stop(el_data.element, goToEnd);
        }
    }

    _animateEl(elName) {
        const el_data = this._animationsElements.get(elName);
        const animationConfigs = el_data.animationConfigs;
        if (animationConfigs) {
            // console.log("animationConfigs", animationConfigs);
            // _animationConfigs must be an array.
            this._elAnimationConfigAddComplete(elName, animationConfigs);

            el_data.done = false;
            // start animation
            // el.animate(animationConfigs);
            // use animatePaper module directly.
            // with the current ES6 style Modules / Imports aniamtePaper can't extend the paper items.
            animatePaper.animate(el_data.element, animationConfigs);
        }
    }

    _elAnimationConfigAddComplete(elName, animationConfigs) {
        // console.log("animationConfigs", animationConfigs);

        // check if last element is has ma_fake_propertie
        const last_config = animationConfigs[animationConfigs.length - 1];
        if (last_config.properties) {
            const prop = last_config.properties;
            if (prop.ma_fake_propertie_for_complete_step === undefined) {
                const complete_step = {
                    properties: {
                        ma_fake_propertie_for_complete_step: 1,
                    },
                    settings: {
                        duration: 1,
                        complete: () => this._complete(elName),
                    }
                };
                animationConfigs.push(complete_step);
            }
        }

    }

    _complete(elName) {
        // console.log("complete", elName);
        const el_data = this._animationsElements.get(elName);
        if (el_data) {
            // console.log("el", el);
            // we add 1 to playcount if the animation completed.
            el_data.playcount += 1;

            // console.log("_complete on " + elName + " called.", "this._active", this._active);
            // check if animation is active
            if (this._active) {
                // console.log("this.loop", this.loop);
                if (typeof this.loop === "number") {
                    // console.log("loop n times - check playcount");
                    if (el_data.playcount < this.loop) {
                        // console.log("--> restart");
                        // restart animation
                        this._animateEl(elName);
                    } else {
                        // console.log("--> playcount reached");
                        this._active = false;
                        el_data.done = true;
                    }
                } else if (typeof this.loop === "boolean") {
                    // console.log("loop inifinity - check state");
                    if (this.loop) {
                        // console.log("--> loop is active");
                        // infinity loop
                        this._animateEl(elName);
                    } else {
                        // console.log("--> loop is off");
                        this._active = false;
                        el_data.done = true;
                    }
                } else {
                    // console.log("--> no known loop value = end");
                    this._active = false;
                    el_data.done = true;
                }
            } else {
                el_data.done = true;
            }
        }
        this._checkAllForComplete();
    }

    _checkAllForComplete() {
        // console.log("_checkAllForComplete");
        let all_complete = true;
        for (const [elName, el_data] of this._animationsElements.entries()) {
            // this checks if the element is animatable
            const animationConfigs = el_data.animationConfigs;
            if (animationConfigs) {
                // console.log(elName, el);
                // console.log(elName, el_data.done);
                // console.log(
                //     el,
                //     el_data._animatePaperAnims
                // );
                // check if this el animations are not completed.
                if (el_data.done === false) {
                    all_complete = false;
                }
            }
        }
        if (all_complete) {
            // console.log("all complete - run 'complete' callback.");
            if (typeof this.complete === 'function') {
                this.complete();
            } else {
                // console.log("this.complete", this.complete);
            }
        }

    }

}


export class MultiAnimationSVG extends MultiAnimation {
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
