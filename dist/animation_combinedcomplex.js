webpackJsonp([1],[
/* 0 */
/***/ (function(module, exports) {

/**
 *  Easing. Based on easing equations from Robert Penner (http://www.robertpenner.com/easing) and
 *  implementation of these equations in https://github.com/jquery/jquery-ui/blob/master/ui/effect.js
 *  
 *  @class easing
 *  @static
 */
var easing = {
    linear: function(p) {
        return p;
    },
    swing: function(p) {
        return 0.5 - Math.cos(p * Math.PI) / 2;
    },
    Sine: function(p) {
        return 1 - Math.cos(p * Math.PI / 2);
    },
    Circ: function(p) {
        return 1 - Math.sqrt(1 - p * p);
    },
    Elastic: function(p) {
        return p === 0 || p === 1 ? p :
            -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
    },
    Back: function(p) {
        return p * p * (3 * p - 2);
    },
    Bounce: function(p) {
        var pow2,
            bounce = 4;

        while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
        return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
    }
};
var __tempEasing = ["Quad", "Cubic", "Quart", "Quint", "Expo"];
for (var i = 0, l = __tempEasing.length; i < l; i++) {
    easing[__tempEasing[i]] = function(p) {
        return Math.pow(p, i + 2);
    };
}
__tempEasing = null;
for (var name in easing) {
    if (easing.hasOwnProperty(name)) {
        var easeIn = easing[name];

        easing["easeIn" + name] = easeIn;
        easing["easeOut" + name] = function(p) {
            return 1 - easeIn(1 - p);
        };
        easing["easeInOut" + name] = function(p) {
            return p < 0.5 ?
                easeIn(p * 2) / 2 :
                1 - easeIn(p * -2 + 2) / 2;
        };
    }
}

module.exports = easing;
module.exports.extendEasing = function(customEasings) {
    for (var i in customEasings) {
        if (customEasings.hasOwnProperty(i)) {
            easing[i] = customEasings[i];
        }
    }
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var Animation = __webpack_require__(3);
var effects = __webpack_require__(8);
var frameManager = __webpack_require__(4);
var paper = __webpack_require__(5);
/**
 *  The main animation interface.
 *  It can take a single option object or an array of option objects
 *  if you want to chain animations without falling into Callback Hell.
 *
 *  @method animate
 *  @chainable
 *  @for animatePaper
 */
exports.animate = function(item, animation) {
    var animations = [];
    var output;

    if (animation instanceof Array) {
        animations = animation;
    } else {
        animations.push(animation);
    }
    var index = 0; // current index in the animations
    new Animation(item, animations[index].properties, animations[index].settings, function _continue() {
        index++;
        if (typeof animations[index] !== "undefined") {
            new Animation(item, animations[index].properties, animations[index].settings, _continue);
        }
    });
    return item;
};
/**
 *  Stops all animations on the item. If `goToEnd` is `true`,
 *  the animated properties will be set to their final values.
 *  
 *  @method stop
 *  @chainable
 *  @for animatePaper
 */
exports.stop = function(item, goToEnd, forceEnd) {
    if (!!item.data._animatePaperAnims) {
        for (var i = 0, l = item.data._animatePaperAnims.length; i < l; i++) {
            if (!!item.data._animatePaperAnims[i]) {
                item.data._animatePaperAnims[i].stop(goToEnd, forceEnd);
            }
        }
    }
    return item;
};
/**
 *  Use this method to extend the private {{#crossLink "easing"}}{{/crossLink}} collection.
 *
 *  The `customEasings` object should like this :
 *  ````
 *      {
 *          "easingName": function(p) { easing algorithm }
 *      }
 *  ````
 *  When used, easing functions are passed the following arguments :
 *   * `percent`
 *   * `percent * duration`
 *
 *  Easing functions are obviously expected to return the eased percent.
 *
 *  @method extendEasing
 *  @for animatePaper
 *  @param {Object} customEasings A collection of easing functions
 */
exports.extendEasing = __webpack_require__(0).extendEasing;
/**
 *  Use this method to extend {{#crossLink "_tweenPropHooks"}}{{/crossLink}}.
 *
 *  The `customHooks` object should like this :
 *  ````
 *      {
 *          "propertyName": {
 *              set: function() {},
 *              get: function() {},
 *              ease: function() {}
 *          }
 *      }
 *  ````
 *  Each hook can contain a `get`, `set` and `ease` functions. When these functions are used, they are passed only
 *  one argument : the {{#crossLink "Tween"}}{{/crossLink}} object, exept for the `ease()` function which gets the eased percent
 *  as second parameter.
 *
 *   * The `get()` function must return the current value of the `Tween.item`'s property.
 *   * The `set()` function must set the value of the `Tween.item`'s property with `Tween.now` (which will
 *   most likely be the result of `get()` or `ease()`)
 *   * The `ease()` function must return the eased value. The second parameter is the eased percent.
 *
 *
 *  @method extendPropHooks
 *  @for animatePaper
 *  @param {Object} customHooks A collection of objects
 */
exports.extendPropHooks = __webpack_require__(6).extendPropHooks;

exports.frameManager = frameManager;
exports.fx = effects;

// Extends paper.Item prototype
if (!paper.Item.prototype.animate) {
    paper.Item.prototype.animate = function(animation) {
        return exports.animate(this, animation);
    };
}
if (!paper.Item.prototype.stop) {
    paper.Item.prototype.stop = function(goToEnd, forceEnd) {
        return exports.stop(this, goToEnd, forceEnd);
    };
}
module.exports = exports;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_stats_js__ = __webpack_require__(11);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var paper = __webpack_require__(5);
var Tween = __webpack_require__(9);
var frameManager = __webpack_require__(4);
var easing = __webpack_require__(0);


/**
 *  Animation class. Default settings are :
 *
 *  ````
 *      var defaults = {
 *           duration: 400,
 *           easing: "linear",
 *           complete: undefined,
 *           step: undefined,
 *           delay: 0,
 *           repeat: 0
 *      };
 *  ````
 *  @class Animation
 *  @constructor
 *  @param {Object} item a paper.js Item instance, which will be animated.
 *  @param {Object} properties properties to animate
 *  @param {Object} settings
 *  @param {Number} settings.duration Duration of the animation, in ms
 *  @param {Number} settings.delay delay before running the animation, in ms
 *  @param {String} settings.easing
 *  @param {Function} settings.complete Called when the animation is over, in `.end()`. The item is passed as this, the animation as 1st argument
 *  @param {Function} settings.step Called on each `.tick()`
 *  @param {Mixed} settings.repeat function or true or an integer. The animation will repeat as long as function returns `true`, `true` or `repeat` > 0, decrementing by 1 each time.
 */
function Animation(item, properties, settings, _continue) {
        var self = this;

        /**
         *  True if the animation is stopped
         *  @property {Bool} stopped
         */
        self.stopped = false;
        /**
         *  Time when the Animation is created
         *  @property {Timestamp} startTime
         *  @readonly
         */
        self.startTime = new Date().getTime();
        /**
         *  Settings, after being normalized in {{#crossLink "_initializeSettings"}}{{/crossLink}}
         *  @property {Object} settings
         */
        self.settings = _initializeSettings(settings);
        /**
         *  The animated `paper.Item`
         *  @property {Object} item
         *  @readonly
         */
        self.item = item;
        /**
         *  If provided, use parentItem to use .data and .onFrame. If not, use self.item;
         *  @property {Object} itemForAnimations
         *  @readonly
         */
        self.itemForAnimations = self.settings.parentItem || self.item;

        /**
         * Repeat parameter.
         * If Function, the animation is repeated as long as the function returns `true`.
         * If `true`, the animation is repeated until `.end(true)` is called.
         * If `repeat` is an integer, the animation is repeated until `repeat` is <= 0.
         * Default `0`  
         * @property {Mixed} repeat
         */
        self.repeat = self.settings.repeat || 0;
        if (typeof self.settings.repeat === "function") {
            var _repeatCallback = self.settings.repeat;
            self.repeatCallback = function() {
                if (!!_repeatCallback(item, self)) {
                    return new Animation(item, properties, settings, _continue);
                }
                return null;
            };
        } else {
            if (self.repeat === true || self.repeat > 0) {
                self.repeatCallback = function(newRepeat) {
                    settings.repeat = newRepeat;
                    // used for the repeat feature
                    return new Animation(item, properties, settings, _continue);
                };
            }
        }



        /**
         *  {{#crossLink "Tween"}}{{/crossLink}}s used by the Animation.
         *  @property {Array} tweens
         */
        self.tweens = [];
        /**
         *  If the Animation is in `onFrame` mode :
         *  Identifier of the {{#crossLink "frameMamanger"}}{{/crossLink}} callback called on every tick.
         *  @property {String} ticker
         *  @readonly
         */
        self.ticker = null;
        /**
         *  Callback used when queueing animations.
         *  @property {Function} _continue
         *  @readonly
         *  @private
         */
        self._continue = _continue;

        // store the reference to the animation in the item's data
        if (typeof self.itemForAnimations.data === "undefined") {
            self.itemForAnimations.data = {};
        }
        if (typeof self.itemForAnimations.data._animatePaperAnims === "undefined") {
            self.itemForAnimations.data._animatePaperAnims = [];
        }
        /**
         *  Index of the animation in the item's queue.
         *  @property {Number} _dataIndex
         *  @readonly
         *  @private
         */
        self._dataIndex = self.itemForAnimations.data._animatePaperAnims.length;
        self.itemForAnimations.data._animatePaperAnims[self._dataIndex] = self;

        for (var i in properties) {
            if (properties.hasOwnProperty(i)) {
                self.tweens.push(new Tween(i, properties[i], self));
            }
        }

        if (self.settings.mode === "onFrame") {
            self.ticker = frameManager.add(self.itemForAnimations, "_animate" + self.startTime + (Math.floor(Math.random() * (1000 - 1)) + 1), function() {
                self.tick();
            });
        }
    }
    /**
     *  Called on each step of the animation.
     *
     *  @method tick
     */
Animation.prototype.tick = function() {
    var self = this;
    if (!!self.stopped) return false;
    var currentTime = new Date().getTime();
    if( self.startTime + self.settings.delay > currentTime ){
        return false;
    }
    var remaining = Math.max(0, self.startTime + self.settings.delay + self.settings.duration - currentTime);
    var temp = remaining / self.settings.duration || 0;
    var percent = 1 - temp;

    for (var i = 0, l = self.tweens.length; i < l; i++) {
        self.tweens[i].run(percent);
    }
    if (typeof self.settings.step !== "undefined") {
        self.settings.step.call(self.item, {
            percent: percent,
            remaining: remaining
        });
    }
    if (typeof self.settings.parentItem !== "undefined") {
        self.settings.parentItem.project.view.draw();
    } else {
        self.item.project.view.draw();
    }

    // if the Animation is in timeout mode, we must force a View update
    if (self.settings.mode === "timeout") {
        //
    }
    if (percent < 1 && l) {
        return remaining;
    } else {
        self.end();
        return false;
    }
};
/**
 *  Interrupts the animation. If `goToEnd` is true, all the properties are set to their final value.
 *  @method stop
 *  @param {Bool} goToEnd
 *  @param {Bool} forceEnd to prevent loops
 */
Animation.prototype.stop = function(goToEnd, forceEnd) {
    var self = this;
    var i = 0;
    var l = goToEnd ? self.tweens.length : 0;
    if (!!self.stopped) return self;
    self.stopped = true;
    for (; i < l; i++) {
        self.tweens[i].run(1);
    }
    if (!!goToEnd) {
        // stop further animation
        if (!!self._continue) self._continue = null;
        self.end(forceEnd);
    }
};
/**
 *  Called when the animations ends, naturally or using `.stop(true)`.
 *  @method end
 */
Animation.prototype.end = function(forceEnd) {
    var self = this;
    if (self.settings.mode === "onFrame") {
        frameManager.remove(self.itemForAnimations, self.ticker);
    }
    if (typeof self.settings.complete !== "undefined") {
        self.settings.complete.call(self.item, this);
    }

    // if the Animation is in timeout mode, we must force a View update
    if (self.settings.mode === "timeout") {
        //
    }
    if (typeof self._continue === "function") {
        self._continue.call(self.item);
    }
    // remove all references to the animation
    self.itemForAnimations.data._animatePaperAnims[self._dataIndex] = null;
    if (!!forceEnd || typeof self.repeatCallback !== "function") {
        self = null;
    } else {
        // repeat
        var newRepeat = self.repeat;
        if (self.repeat !== true) {
            newRepeat = self.repeat - 1;
        }
        return self.repeatCallback(newRepeat);
    }
};

/**
 *  Normalizes existing values from an Animation settings argument
 *  and provides default values if needed.
 *
 *  @method _initializeSettings
 *  @param {mixed} settings a `settings` object or undefined
 *  @private
 */
function _initializeSettings(settings) {
    var defaults = {
        duration: 400,
        delay: 0,
        repeat: 0,
        easing: "linear",
        complete: undefined,
        step: undefined,
        mode: "onFrame"
    };
    if (typeof settings === "undefined") {
        settings = {};
    }

    // .duration must exist, and be a positive Number
    if (typeof settings.duration === "undefined") {
        settings.duration = defaults.duration;
    } else {
        settings.duration = Number(settings.duration);
        if (settings.duration < 1) {
            settings.duration = defaults.duration;
        }
    }
    // .delay must exist, and be a positive Number
    if (typeof settings.delay === "undefined") {
        settings.delay = defaults.delay;
    } else {
        settings.delay = Number(settings.delay);
        if (settings.delay < 1) {
            settings.delay = defaults.delay;
        }
    }

    // .repeat must exist, and be a positive Number or true
    if (typeof settings.repeat === "undefined") {
        settings.repeat = defaults.repeat;
    }
    else if (typeof settings.repeat === "function") {
        // ok
    } else {
        if (settings.repeat !== true) {
            settings.repeat = Number(settings.repeat);
            if (settings.repeat < 0) {
                settings.repeat = defaults.repeat;
            }
        }
    }

    // .easing must be defined in `easing`
    if (typeof settings.easing === "undefined") {
        settings.easing = defaults.easing;
    }
    if (typeof easing[settings.easing] !== "undefined" && easing.hasOwnProperty(settings.easing)) {
        settings.easingFunction = easing[settings.easing];
    } else {
        settings.easing = defaults.easing;
        settings.easingFunction = easing[defaults.easing];
    }


    // callbacks must be functions
    if (typeof settings.complete !== "function") {
        settings.complete = undefined;
    }
    if (typeof settings.step !== "function") {
        settings.step = undefined;
    }

    // .mode must be either "onFrame" or "timeout"
    if (["onFrame", "timeout"].indexOf(settings.mode) === -1) {
        settings.mode = defaults.mode;
    }

    return settings;
}

module.exports = Animation;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 *  This is the only function called in a objects `onFrame` handler.
 *  If the objects has callbacks in it's `data._customHandlers` property,
 *  each of these is called.
 *
 *  @private
 *  @method frameManagerHandler
 *  @param {Object} ev The event object
 *  @for frameManager
 */
function frameManagerHandler(ev) {
        var item = this;
        if (typeof item.data === "undefined") {
            item.data = {};
        }
        if (typeof item.data._customHandlers !== "undefined" &&
            item.data._customHandlersCount > 0
        ) {
            // parcourir les handlers et les declencher
            for (var i in item.data._customHandlers) {
                if (item.data._customHandlers.hasOwnProperty(i)) {
                    if (typeof item.data._customHandlers[i] === "function") {
                        item.data._customHandlers[i].call(item, ev);
                    }
                }
            }
        }
    }
    /**
     *  The `frameManager` is used to bind and unbind multiple callbacks to an object's
     *  `onFrame`. If an object has at least one handler, it's `onFrame` handler will be
     *  {{#crossLink "frameManager/frameManagerHandler:method"}}{{/crossLink}}.
     *
     *  @class frameManager
     *  @static
     */
module.exports = {
    /**
     * Add a callback to a paper.js Item's `onFrame` event.
     * The Item itself will be the `thisValue` and the event object `ev` will be the first argument
     * 
     * @param {Object} item paper.js Item
     * @param {String} name An identifier for this callback
     * @param {Function} callback
     * @param {Object} parentItem If provided, the callback will be called on parentItem.onFrame event instead of item.onFrame
     * @example
     *      animatePaper.frameManager.add(circle,"goUp",function(ev) {
     *          // Animation logic
     *      });
     * @method add
     */
    add: function(item, name, callback, parentItem) {
        if (typeof item.data._customHandlers === "undefined") {
            item.data._customHandlers = {};
            item.data._customHandlersCount = 0;
        }
        item.data._customHandlers[name] = callback;
        item.data._customHandlersCount += 1;
        if (item.data._customHandlersCount > 0) {
            if (typeof parentItem !== "undefined") {
                parentItem.onFrame = frameManagerHandler;
            } else {
                item.onFrame = frameManagerHandler;
            }
        }

        return name;
    },
    /**
     * Remove a callback from an item's `onFrame` handler.
     * 
     * @param {Object} item paper.js Item object
     * @param {String} name The identifier of the callback you want to remove
     * @method remove
     */
    remove: function(item, name) {
        if (typeof item.data._customHandlers !== "undefined") {
            item.data._customHandlers[name] = null;
            item.data._customHandlersCount -= 1;
            if (item.data._customHandlersCount <= 0) {
                item.data._customHandlersCount = 0;

            }
        }
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var paper = __webpack_require__(12);

if (typeof window.paper !== "undefined") {
    paper = window.paper;
}
module.exports = paper;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dirRegexp = /^([+\-])(.+)/;
/**
 *  check if value is relative or absolute
 *  @private
 *  @method _parseAbsoluteOrRelative
 *  @param {Number} | {String} value to check
 *  @return {Object} `{value: Number, dir: String}`
 *  @for Tween
 */
function _parseAbsoluteOrRelative(value) {
    let valueNumber = null;
    let valueDirection = "";

    // handle absolute values
    valueNumber = Number(value);

    // check for relative values
    if (typeof value === "string") {
        const valueMatch = value.match(dirRegexp);
        valueDirection = valueMatch[1];
        valueNumber = Number(valueMatch[2]);
    }

    return {value: valueNumber, direction: valueDirection};
}

/**
 *  Performs an operation on two paper.Point() objects.
 *  Returns the result of : ` a operator b`.
 *  @private
 *  @method _pointDiff
 *  @param {Object} a a `paper.Point` object
 *  @param {Object} b a `paper.Point` object
 *  @param {String} operator either `+` or `-`
 *  @return {Object} `{x: (a.x operator b.x), y: (a.y operator b.y)}`
 *  @for Tween
 */
function _pointDiff(a, b, operator) {
    if (['+', '-'].indexOf(operator) === -1) return;
    if (typeof a === "undefined" || typeof b === "undefined") return;


    var ax, bx, ay, by;
    ax = a.x || 0;
    bx = b.x || 0;
    ay = a.y || 0;
    by = b.y || 0;
    if( operator === '+' ){
        return a.add(b);
    }
    if( operator === '-' ){
        return a.subtract(b);
    }
    throw new Error('Unknown operator');
}

/**
 *  find color type of an 'color_obj'.
 *  Returns string 'hsl'|'hsb'|'rgb'|'gray'.
 *  @private
 *  @method _getColorType
 *  @param {Object} color_obj color_obj `paper.Color` object or compatible raw object
 *  @return {String} `color type as string`
 *  @for _tweenPropHooks.Color
 */
function _getColorType(color_obj) {
    let color_type;
    // if the color_obj is created with paper.Color it has an 'type' propertie.
    if (color_obj.type) {
        color_type = color_obj.type;
    // if color_obj is a 'raw' object we search for an propertie name
    } else if (typeof (color_obj.red !== "undefined")) {
        color_type = "rgb";
    } else if (typeof (color_obj.lightness !== "undefined")) {
        color_type = "hsl";
    } else if (typeof (color_obj.brightness !== "undefined")) {
        color_type = "hsb";
    } else if (typeof (color_obj.gray !== "undefined")) {
            color_type = "gray";
    }
    return color_type;
}

/**
 *  find color type of an 'color_obj'.
 *  Returns string 'hsl'|'hsb'|'rgb'|'gray'.
 *  @private
 *  @method _getColorComponentNames
 *  @param {Object} color_obj color_obj `paper.Color` object or compatible raw object
 *  @return {Array} `color component labels`
 *  @for _tweenPropHooks.Color
 */
function _getColorComponentNames(color_obj) {
    let color_component_names;
    if (color_obj._properties) {
        color_component_names = color_obj._properties;
    } else {
        const color_type = _getColorType(color_obj);
        switch (color_type) {
            case "gray": {
                color_component_names = [ "gray"];
            } break;
            case "rgb": {
                color_component_names = [ "red", "green", "blue" ];
            } break;
            case "hsl": {
                color_component_names = [ "hue", "saturation", "lightness" ];
            } break;
            case "hsb": {
                color_component_names = [ "hue", "brightness", "saturation" ];
            } break;
            default:
            // console.error("Color Type not supported.");
        }
    }
    // TODO alpha handling
    return color_component_names;
}


// inspired by https://github.com/jquery/jquery/blob/10399ddcf8a239acc27bdec9231b996b178224d3/src/effects/Tween.js
/**
 *  Helpers to get, set and ease properties that behave differently from "normal" properties. e.g. `scale`.
 *  @class _tweenPropHooks
 *  @private
 *  @static
 */
var _tweenPropHooks = {
    _default: {
        get: function(tween) {
            var output;
            if (tween.item[tween.prop] !== null) {
                output = tween.item[tween.prop];
            }

            return output;
        },
        set: function(tween) {

            var toSet = {};
            toSet[tween.prop] = tween.now;
            tween.item.set(toSet);
        }
    },
    scale: {
        get: function(tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.scale === "undefined") {
                tween.item.data._animatePaperVals.scale = 1;
            }
            var output = tween.item.data._animatePaperVals.scale;
            return output;
        },
        set: function(tween) {

            var curScaling = tween.item.data._animatePaperVals.scale;
            var trueScaling = tween.now / curScaling;

            tween.item.data._animatePaperVals.scale = tween.now;
            var center = false;
            if (typeof tween.A.settings.center !== "undefined") {
                center = tween.A.settings.center;
            }
            if (typeof tween.A.settings.scaleCenter !== "undefined") {
                center = tween.A.settings.scaleCenter;
            }
            if (center !== false) {
                tween.item.scale(trueScaling, center);
            } else {
                tween.item.scale(trueScaling);
            }
        }
    },
    rotate: {
        get: function(tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.rotate === "undefined") {
                tween.item.data._animatePaperVals.rotate = -0;
            }
            var output = tween.item.data._animatePaperVals.rotate;
            return output;
        },
        set: function(tween) {
            var curRotate = tween.item.data._animatePaperVals.rotate;
            var trueRotate = tween.now - curRotate;

            tween.item.data._animatePaperVals.rotate = tween.now;

            var center = false;
            if (typeof tween.A.settings.center !== "undefined") {
                center = tween.A.settings.center;
            }
            if (typeof tween.A.settings.rotateCenter !== "undefined") {
                center = tween.A.settings.rotateCenter;
            }
            if (center !== false) {
                tween.item.rotate(trueRotate, center);
            } else {
                tween.item.rotate(trueRotate);
            }
        }
    },
    translate: {
        get: function(tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.translate === "undefined") {
                tween.item.data._animatePaperVals.translate = new paper.Point(0, 0);
            }
            var output = tween.item.data._animatePaperVals.translate;

            return output;
        },
        set: function(tween) {
            var cur = tween.item.data._animatePaperVals.translate;
            var actual = _pointDiff(tween.now, cur, "-");


            tween.item.data._animatePaperVals.translate = tween.now;

            tween.item.translate(actual);
        },
        ease: function(tween, eased) {

            var temp = _pointDiff(tween.end, tween.start, "-");
            temp.x = temp.x * eased;
            temp.y = temp.y * eased;

            tween.now = _pointDiff(temp, tween.start, "+");

            return tween.now;
        }
    },
    position: {
        get: function(tween) {
            return {
                x: tween.item.position.x,
                y: tween.item.position.y
            };
        },
        set: function(tween) {

            tween.item.position.x += tween.now.x;
            tween.item.position.y += tween.now.y;

        },
        ease: function(tween, eased) {
            // used to store value progess
            if(typeof tween._easePositionCache === "undefined") {
                tween._easePositionCache = {
                    x: 0,
                    y: 0
                };
            }

            // If the values are strings and start with + or -,
            // the values are relative to the current pos
            const {value:endX, direction:dirX} = _parseAbsoluteOrRelative(tween.end.x || 0);
            const {value:endY, direction:dirY} = _parseAbsoluteOrRelative(tween.end.y || 0);

            var _ease = function(val) {
                return ((val || 0) * eased);
            };

            if(typeof tween.end.x !== "undefined") {
                if(dirX==="+") {
                    tween.now.x = (_ease(endX) - tween._easePositionCache.x);
                    tween._easePositionCache.x += tween.now.x;
                }
                else if(dirX==="-") {
                    tween.now.x = _ease(endX) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                    tween.now.x = - tween.now.x;
                }
                else {
                    // absolute, not relative
                    tween.now.x = ((endX - tween.start.x) * eased) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                }
            }
            else {
                tween.now.x = 0;
            }
            if(typeof tween.end.y !== "undefined") {
                if(dirY==="+") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
                else if(dirY==="-") {

                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                    tween.now.y = - tween.now.y;
                }
                else {
                    // absolute, not relative
                    tween.now.y = ((endY - tween.start.y) * eased) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
            }
            else {
                tween.now.y = 0;
            }

            return tween.now;
        }
    },
    pointPosition: {
        get: function(tween) {
            return {
                x: tween.item.x,
                y: tween.item.y
            };
        },
        set: function(tween) {
            tween.item.x += tween.now.x;
            tween.item.y += tween.now.y;
        },
        ease: function(tween, eased) {
            // used to store value progess
            if(typeof tween._easePositionCache === "undefined") {
                tween._easePositionCache = {
                    x: 0,
                    y: 0
                };
            }

            // If the values are strings and start with + or -,
            // the values are relative to the current pos
            const {value:endX, direction:dirX} = _parseAbsoluteOrRelative(tween.end.x || 0);
            const {value:endY, direction:dirY} = _parseAbsoluteOrRelative(tween.end.y || 0);

            var _ease = function(val) {
                return ((val || 0) * eased);
            };

            if(typeof tween.end.x !== "undefined") {
                if(dirX==="+") {
                    tween.now.x = (_ease(endX) - tween._easePositionCache.x);
                    tween._easePositionCache.x += tween.now.x;
                }
                else if(dirX==="-") {
                    tween.now.x = _ease(endX) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                    tween.now.x = - tween.now.x;
                }
                else {
                    // absolute, not relative
                    tween.now.x = ((endX - tween.start.x) * eased) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                }
            }
            else {
                tween.now.x = 0;
            }
            if(typeof tween.end.y !== "undefined") {
                if(dirY==="+") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
                else if(dirY==="-") {

                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                    tween.now.y = - tween.now.y;
                }
                else {
                    // absolute, not relative
                    tween.now.y = ((endY - tween.start.y) * eased) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
            }
            else {
                tween.now.y = 0;
            }

            return tween.now;
        }
    },
    Color: {
            get: function(tween) {
                // 'should' work but does not:
                // return tween.item[tween.prop];
                // this creates a unlinked copy of only the color component values.
                // this seems to be nessesecary to avoid a bug/problem in
                // paper.js Color class in combinaiton with Groups
                const current_color = tween.item[tween.prop];
                const component_names = _getColorComponentNames(current_color);
                const result = {};
                for (const component_name of component_names) {
                    result[component_name] = current_color[component_name];
                }
                // console.log("result", result);
                return result;
            },
            set: function(tween) {
                // this creates a unlinked copy of only the color component values first.
                // this seems to be nessesecary to avoid a bug in
                // paper.js Color class in combinaiton with Groups and setting single properties
                const component_names = _getColorComponentNames(tween.item[tween.prop]);

                const current_color = tween.item[tween.prop];
                const color_new = {};

                // console.log("tween.now", tween.now);
                for (const component_name of component_names) {
                    color_new[component_name] = (
                        current_color[component_name] +
                        tween.now[component_name]
                    );
                }
                // console.log("color_new", color_new);
                tween.item[tween.prop] = color_new;
            },
            ease: function(tween, eased) {
                // const color_type = _getColorType(tween.End);
                const component_names = _getColorComponentNames(tween.item[tween.prop]);
                // const props = _getColorComponentNames(tween.item[tween.prop]);

                var _ease = function(val) {
                    return (val || 0) * eased;
                };
                for (const component_name of component_names) {
                    var curProp = component_name;
                    if (typeof tween._easeColorCache === "undefined") {
                        tween._easeColorCache = {};
                    }
                    if (typeof tween._easeColorCache[curProp] === "undefined") {
                        tween._easeColorCache[curProp] = 0;
                    }

                    // If the values are strings and start with + or -,
                    // the values are relative to the current pos
                    const {value:end, direction:dir} = _parseAbsoluteOrRelative(tween.end[curProp] || 0);

                    if (typeof tween.end[curProp] !== "undefined") {
                        if (dir === "+") {
                            tween.now[curProp] = _ease(end) - tween._easeColorCache[curProp];
                            tween._easeColorCache[curProp] += tween.now[curProp];
                        } else if (dir === "-") {
                            tween.now[curProp] = _ease(end) - tween._easeColorCache[curProp];
                            tween._easeColorCache[curProp] += tween.now[curProp];
                            tween.now[curProp] = -tween.now[curProp];
                        } else {
                            tween.now[curProp] = (end - tween.start[curProp]) * eased - tween._easeColorCache[curProp];
                            tween._easeColorCache[curProp] += tween.now[curProp];
                        }
                    } else {
                        tween.now[curProp] = 0;
                    }
                }
                return tween.now;
            }
        }
};
var _colorProperties = [ "fill", "stroke" ];
for (var i = 0, l = _colorProperties.length; i < l; i++) {
    _tweenPropHooks[_colorProperties[i] + "Color"] = _tweenPropHooks.Color;
}
module.exports = {
    _tweenPropHooks: _tweenPropHooks,
    _pointDiff: _pointDiff,
    extendPropHooks: function(customHooks) {
        for (var i in customHooks) {
            if (customHooks.hasOwnProperty(i)) {
                _tweenPropHooks[i] = customHooks[i];
            }
        }
    }
};


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var Animation = __webpack_require__(3);
var _animate = function(item, animation) {
    var animations = [];
    var output;

    if (animation instanceof Array) {
        animations = animation;
    } else {
        animations.push(animation);
    }
    var index = 0; // current index in the animations
    new Animation(item, animations[index].properties, animations[index].settings, function _continue() {
        index++;
        if (typeof animations[index] !== "undefined") {
            new Animation(item, animations[index].properties, animations[index].settings, _continue);
        }
    });
    return item;
};
/**
 * Effects : A facade for easy to use animations.
 * 
 * @class fx
 * @static
 */
module.exports = {
    /**
     * Grow a path
     *
     * @method grow
     * @deprecated
     * @param {Object} path a paper.js `Path` object
     */
    grow: function(path, settings) {
        console.log("segmentGrow was buggy and has been removed, sorry :/");
        return path;
    },
    /**
     * Shake an item
     *
     * @method shake
     * @param {Object} item a paper.js `Item` object
     * @param {Object} settings
     * @param {Number} settings.nb Number of shakes. Default : 2
     * @param {Number} settings.movement Length of each shake? Default : 40
     * @param {Function} settings.complete complete callback
     */
    shake: function(item, settings) {
            var nbOfShakes = Math.floor(settings ? settings.nb || 2 : 2) * 2;
            var length = Math.floor(settings ? settings.movement || 40 : 40);
            var animations = [];
            for (var first = true; nbOfShakes > 0; nbOfShakes--) {
                var direction = nbOfShakes % 2 ? "+" : "-";
                var movement = length;
                var callback = null;
                if (nbOfShakes === 1 && !!settings && typeof settings.complete !== "undefined") {
                    callback = settings.complete;
                }
                if (first || nbOfShakes === 1) {
                    movement = movement / 2;
                    first = false;
                }
                animations.push({
                    properties: {
                        position: {
                            x: direction + movement
                        }
                    },
                    settings: {
                        duration: 100,
                        easing: "swing",
                        complete: callback
                    }
                });
            }
            _animate(item, animations);
        },
    /**
     * Increase the opacity to 1
     *
     * @method fadeIn
     * @param {Object} item a paper.js `Item` object
     * @param {Object} settings
     * @param {Number} settings.duration Duration of the animation. Default : 500
     * @param {String} settings.easing Name of the easing function. Default : swing
     * @param {Function} settings.complete complete callback
     */
    fadeIn: function(item, settings) {
        var duration = 500;
        var complete = undefined;
        var easing = "swing";
        if(typeof settings !== "undefined") {
            if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
            if(typeof settings.complete === "function") complete = settings.complete;
            if(typeof settings.easing !== "undefined") easing = settings.easing;
        }
        _animate(item,{
            properties: {
                opacity: 1
            },
            settings: {
                duration: duration,
                easing: easing,
                complete: complete
            }
        });
    },
    /**
     * Decrease the opacity to 0
     *
     * @method fadeOut
     * @param {Object} item a paper.js `Item` object
     * @param {Object} settings
     * @param {Number} settings.duration Duration of the animation. Default : 500
     * @param {String} settings.easing Name of the easing function. Default : swing
     * @param {Function} settings.complete complete callback
     */
    fadeOut: function(item, settings) {
        var duration = 500;
        var complete = undefined;
        var easing = "swing";
        if(typeof settings !== "undefined") {
            if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
            if(typeof settings.complete === "function") complete = settings.complete;
            if(typeof settings.easing !== "undefined") easing = settings.easing;
        }
        _animate(item,{
            properties: {
                opacity: 0
            },
            settings: {
                duration: duration,
                easing: easing,
                complete: complete
            }
        });
    },
    /**
     * Increase the opacity to 1 and go upward
     *
     * @method slideUp
     * @param {Object} item a paper.js `Item` object
     * @param {Object} settings
     * @param {Number} settings.duration Duration of the animation. Default : 500
     * @param {String} settings.easing Name of the easing function. Default : swing
     * @param {Number} setting.distance Distance to move upward. Default : 50
     * @param {Function} settings.complete complete callback
     */
    slideUp: function(item, settings) {
        var duration = 500;
        var complete = undefined;
        var distance = 50;
        var easing = "swing";
        if(typeof settings !== "undefined") {
            if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
            if(typeof settings.complete === "function") complete = settings.complete;
            if(typeof settings.easing !== "undefined") easing = settings.easing;
            if(typeof settings.distance !== "undefined") distance = settings.distance;
        }
        _animate(item,{
            properties: {
                opacity: 1,
                position: {
                    y: "-"+distance
                }
            },
            settings: {
                duration: duration,
                easing: easing,
                complete: complete
            }
        });
    },
    /**
     * Decrease the opacity to 0 and go downward
     *
     * @method slideDown
     * @param {Object} item a paper.js `Item` object
     * @param {Object} settings
     * @param {Number} settings.duration Duration of the animation. Default : 500
     * @param {String} settings.easing Name of the easing function. Default : swing
     * @param {Number} setting.distance Distance to move downward. Default : 50
     * @param {Function} settings.complete complete callback
     */
    slideDown: function(item, settings) {
        var duration = 500;
        var complete = undefined;
        var distance = 50;
        var easing = "swing";
        if(typeof settings !== "undefined") {
            if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
            if(typeof settings.complete === "function") complete = settings.complete;
            if(typeof settings.easing !== "undefined") easing = settings.easing;
            if(typeof settings.distance !== "undefined") distance = settings.distance;
        }
        _animate(item,{
            properties: {
                opacity: 0,
                position: {
                    y: "+"+distance
                }
            },
            settings: {
                duration: duration,
                easing: easing,
                complete: complete
            }
        });
    },
    /**
     * Increase the opacity to 1, rotates 360deg and scales by 3.
     *
     * @method splash
     * @param {Object} item a paper.js `Item` object
     * @param {Object} settings
     * @param {Number} settings.duration Duration of the animation. Default : 500
     * @param {String} settings.easing Name of the easing function. Default : swing
     * @param {Function} settings.complete complete callback
     */
    splash: function(item, settings) {
        var duration = 500;
        var complete = undefined;
        var easing = "swing";
        if(typeof settings !== "undefined") {
            if(typeof settings.duration !== "undefined") duration = Number(settings.duration);
            if(typeof settings.complete === "function") complete = settings.complete;
            if(typeof settings.easing !== "undefined") easing = settings.easing;
        }
        _animate(item,{
            properties: {
                opacity: 1,
                scale: 3,
                rotate: 360
            },
            settings: {
                duration: duration,
                easing: easing,
                complete: complete
            }
        });
    },
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var _tweenPropHooks = __webpack_require__(6)._tweenPropHooks;
var easing = __webpack_require__(0);
/**
 *  Tween class. TODO : figure out a way to add support for extra arguments to pass to the Tweens (like for rotate() )
 *  
 *  @class Tween
 *  @constructor
 *  @param {String} Property name
 *  @param {mixed} Final value
 *  @param {Object} animation
 */
function Tween(property, value, animation) {
        var self = this;
        
        /**
         *  Reference to the {{#crossLink "Animation"}}{{/crossLink}}
         *  @property {Object} A
         *  @readonly
         */
        self.A = animation;
        /**
         *  Animated `paper.Item` object
         *  @property {Object} item
         *  @readonly
         */
        self.item = animation.item;
        /**
         *  Name of the animated property
         *  @property {String} prop
         *  @readonly
         */
        self.prop = property;
        /**
         *  The value the property will have when the animation is over.
         *  @property {mixed} end
         *  @readonly
         */
        self.end = value;
        /**
         *  Value of the property when the animation starts. Set using {{#crossLink "Tween/cur:method"}}{{/crossLink}}
         *  @property {mixed} start
         *  @readonly
         */
        self.start = self.cur();
        if (typeof self.end === "string" && self.end.charAt(0) === "+") {
            self.end = self.start + parseFloat(self.end);
        } else if (typeof self.end === "string" && self.end.charAt(0) === "-") {
            self.end = self.start + parseFloat(self.end);
        }
        /**
         *  Current value of the property. Set using {{#crossLink "Tween/cur:method"}}{{/crossLink}}
         *  @property {mixed} now
         */
        self.now = self.cur();
        /**
         *  If the value of the property increases, `direction` will be `'+'`, if it decreases : `'-'`.
         *  @property {String} direction
         *  @readonly
         */
        self.direction = self.end > self.start ? "+" : "-";  
        

    }
    /**
     *  Get the current value of the animated property. Uses {{#crossLink "_tweenPropHooks"}}{{/crossLink}} if
     *  available.
     *  @method cur
     *  @return {mixed} Current value
     */
Tween.prototype.cur = function() {
    var self = this;
    
    // should we use a special way to get the current value ? if not just use item[prop]
    var hooks = _tweenPropHooks[self.prop];

    return hooks && hooks.get ? hooks.get(self) : _tweenPropHooks._default.get(self);
};
/**
 *  Called on each {{#crossLink "Animation/tick:method"}}{{/crossLink}}. Set the value of the property
 *  to the eased value. Uses {{#crossLink "_tweenPropHooks"}}{{/crossLink}} if available.
 *  It takes the percentage of the animation duration as argument.
 *  @method run
 *  @param {Number} percent 
 *  @return {Object} self
 *  @chainable
 */
Tween.prototype.run = function(percent) {
    var self = this;
    var eased;
    var hooks = _tweenPropHooks[self.prop];

    var settings = self.A.settings;
    if (settings.duration) {
        self.pos = eased = easing[settings.easing](percent, settings.duration * percent, 0, 1, self.duration);
    } else {
        self.pos = eased = percent;
    }
    // refresh current value
    if (hooks && hooks.ease) {
        hooks.ease(self, eased);
    } else {
        self.now = (self.end - self.start) * eased + self.start;
    }

    if (hooks && hooks.set) {
        hooks.set(self);
    } else {
        _tweenPropHooks._default.set(self);
    }

    return self;
};

module.exports = Tween;

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_paper__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_paper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_paper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_paper_animate__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_paper_animate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_paper_animate__);
// animation_multi







class MultiAnimation {
    constructor({ group, animationsConfig, loop=false, complete } = {}) {
        console.log("create MultiAnimation");
        this._ready = false;
        this._active = false;

        this._group = new __WEBPACK_IMPORTED_MODULE_0_paper___default.a.Group();
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
        if (group instanceof __WEBPACK_IMPORTED_MODULE_0_paper___default.a.Group) {
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
            __WEBPACK_IMPORTED_MODULE_1_paper_animate___default.a.stop(el_data.element, goToEnd);
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
            __WEBPACK_IMPORTED_MODULE_1_paper_animate___default.a.animate(el_data.element, animationConfigs);
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
/* harmony export (immutable) */ __webpack_exports__["b"] = MultiAnimation;



class MultiAnimationSVG extends MultiAnimation {
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

        this.groupSVG = new __WEBPACK_IMPORTED_MODULE_0_paper___default.a.Group();

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
/* harmony export (immutable) */ __webpack_exports__["a"] = MultiAnimationSVG;



/***/ }),
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 14 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__showfps__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_paper__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_paper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_paper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_paper_animate__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_paper_animate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_paper_animate__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__animation_multi__ = __webpack_require__(10);









class MainApp {
    constructor(canvas_el) {
        this.canvas_el = canvas_el;

        this._initPaperJS();


        this.compAni = new __WEBPACK_IMPORTED_MODULE_3__animation_multi__["a" /* MultiAnimationSVG */]({
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
        this.paperscope = __WEBPACK_IMPORTED_MODULE_1_paper___default.a.setup(this.canvas_el);
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
        this.graphic_starloop = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Group();
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
                    this.path0.position = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Point(500, 300);
                    console.log("apply matrix to path:", this.path0.matrix.apply());
                },
                onError: (message) => {console.error(message);}
            }
        );
        // this.graphic_starloop.position = [500, 100];

    }

    _addCustomAnimations() {
        __WEBPACK_IMPORTED_MODULE_2_paper_animate___default.a.extendPropHooks({
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
                    if (tween.A.settings.targetPath instanceof __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path) {
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

        __WEBPACK_IMPORTED_MODULE_2_paper_animate___default.a.animate(this.compAni.group, {
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
        __WEBPACK_IMPORTED_MODULE_2_paper_animate___default.a.animate(this.compAni.group, {
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


/***/ })
],[18]);
//# sourceMappingURL=animation_combinedcomplex.js.map