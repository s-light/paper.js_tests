webpackJsonp([4],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.easing = {
    extendEasing: function (customEasings) {
        for (var i in customEasings) {
            if (customEasings.hasOwnProperty(i)) {
                exports.easing[i] = customEasings[i];
            }
        }
    },
    linear: function (p) {
        return p;
    },
    swing: function (p) {
        return 0.5 - Math.cos(p * Math.PI) / 2;
    },
    Sine: function (p) {
        return 1 - Math.cos(p * Math.PI / 2);
    },
    Circ: function (p) {
        return 1 - Math.sqrt(1 - p * p);
    },
    Elastic: function (p) {
        return p === 0 || p === 1 ? p :
            -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
    },
    Back: function (p) {
        return p * p * (3 * p - 2);
    },
    Bounce: function (p) {
        var pow2, bounce = 4;
        while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) { }
        return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
    }
};
var __tempEasing = ["Quad", "Cubic", "Quart", "Quint", "Expo"];
for (var i = 0, l = __tempEasing.length; i < l; i++) {
    exports.easing[__tempEasing[i]] = function (p) {
        return Math.pow(p, i + 2);
    };
}
__tempEasing = null;
for (var name in exports.easing) {
    if (exports.easing.hasOwnProperty(name)) {
        var easeIn = exports.easing[name];
        exports.easing["easeIn" + name] = easeIn;
        exports.easing["easeOut" + name] = function (p) {
            return 1 - easeIn(1 - p);
        };
        exports.easing["easeInOut" + name] = function (p) {
            return p < 0.5 ?
                easeIn(p * 2) / 2 :
                1 - easeIn(p * -2 + 2) / 2;
        };
    }
}

//# sourceMappingURL=easing.js.map


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var animation_1 = __webpack_require__(3);
var effects = __webpack_require__(8);
var easing_1 = __webpack_require__(0);
var _frameManager = __webpack_require__(4);
var prophooks_1 = __webpack_require__(6);
var paper = __webpack_require__(5);
exports.animate = function (item, animation) {
    var animations = [];
    var output;
    if (animation instanceof Array) {
        animations = animation;
    }
    else {
        animations.push(animation);
    }
    var index = 0;
    new animation_1.Animation(item, animations[index].properties, animations[index].settings, function _continue() {
        index++;
        if (typeof animations[index] !== "undefined") {
            new animation_1.Animation(item, animations[index].properties, animations[index].settings, _continue);
        }
    });
    return item;
};
exports.stop = function (item, goToEnd, forceEnd) {
    if (!!item.data._animatePaperAnims) {
        for (var i = 0, l = item.data._animatePaperAnims.length; i < l; i++) {
            if (!!item.data._animatePaperAnims[i]) {
                item.data._animatePaperAnims[i].stop(goToEnd, forceEnd);
            }
        }
    }
    return item;
};
exports.extendEasing = easing_1.easing.extendEasing;
exports.frameManager = _frameManager;
exports.fx = effects;
if (!paper.Item.prototype.animate) {
    paper.Item.prototype.animate = function (animation) {
        return exports.animate(this, animation);
    };
}
if (!paper.Item.prototype.stop) {
    paper.Item.prototype.stop = function (goToEnd, forceEnd) {
        return exports.stop(this, goToEnd, forceEnd);
    };
}
if (true) {
    module.exports = {
        animate: exports.animate,
        stop: exports.stop,
        frameManager: exports.frameManager,
        fx: exports.fx,
        extendEasing: exports.extendEasing,
        extendPropHooks: prophooks_1.extendPropHooks
    };
}

//# sourceMappingURL=export.js.map


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

exports.__esModule = true;
var paper = __webpack_require__(5);
var tween_1 = __webpack_require__(9);
var frameManager = __webpack_require__(4);
var easing_1 = __webpack_require__(0);
var Animation = (function () {
    function Animation(item, properties, settings, _continue) {
        var _this = this;
        this.stopped = false;
        this.startTime = new Date().getTime();
        this.settings = _initializeSettings(settings);
        this.item = item;
        this.itemForAnimations = this.settings.parentItem || this.item;
        this.repeat = this.settings.repeat || 0;
        if (typeof this.settings.repeat === "function") {
            var _repeatCallback = this.settings.repeat;
            this.repeatCallback = function () {
                if (!!_repeatCallback(item, _this)) {
                    return new Animation(item, properties, settings, _continue);
                }
                return null;
            };
        }
        else {
            if (this.repeat === true || this.repeat > 0) {
                this.repeatCallback = function (newRepeat) {
                    settings.repeat = newRepeat;
                    return new Animation(item, properties, settings, _continue);
                };
            }
        }
        this.tweens = [];
        this.ticker = null;
        this._continue = _continue;
        if (typeof this.itemForAnimations.data === "undefined") {
            this.itemForAnimations.data = {};
        }
        if (typeof this.itemForAnimations.data._animatePaperAnims === "undefined") {
            this.itemForAnimations.data._animatePaperAnims = [];
        }
        this._dataIndex = this.itemForAnimations.data._animatePaperAnims.length;
        this.itemForAnimations.data._animatePaperAnims[this._dataIndex] = this;
        for (var i in properties) {
            if (properties.hasOwnProperty(i)) {
                this.tweens.push(new tween_1.Tween(i, properties[i], this));
            }
        }
        if (this.settings.mode === "onFrame") {
            this.ticker = frameManager.add(this.itemForAnimations, "_animate" + this.startTime + (Math.floor(Math.random() * (1000 - 1)) + 1), function () {
                _this.tick();
            });
        }
    }
    Animation.prototype.tick = function () {
        var self = this;
        if (!!self.stopped)
            return false;
        var currentTime = new Date().getTime();
        if (self.startTime + self.settings.delay > currentTime) {
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
        }
        else {
            self.item.project.view.draw();
        }
        if (self.settings.mode === "timeout") {
        }
        if (percent < 1 && l) {
            return remaining;
        }
        else {
            for (var i = 0, l = self.tweens.length; i < l; i++) {
                self.tweens[i].run(1);
            }
            self.end();
            return false;
        }
    };
    Animation.prototype.stop = function (goToEnd, forceEnd) {
        if (goToEnd === void 0) { goToEnd = false; }
        if (forceEnd === void 0) { forceEnd = false; }
        var self = this;
        var i = 0;
        var l = goToEnd ? self.tweens.length : 0;
        if (!!self.stopped)
            return self;
        self.stopped = true;
        for (; i < l; i++) {
            self.tweens[i].run(1);
        }
        if (!!goToEnd) {
            if (!!self._continue)
                self._continue = null;
            self.end(forceEnd);
        }
    };
    Animation.prototype.end = function (forceEnd) {
        if (forceEnd === void 0) { forceEnd = false; }
        var self = this;
        if (self.settings.mode === "onFrame") {
            frameManager.remove(self.itemForAnimations, self.ticker);
        }
        if (typeof self.settings.complete !== "undefined") {
            self.settings.complete.call(self.item, this);
        }
        if (self.settings.mode === "timeout") {
        }
        if (typeof self._continue === "function") {
            self._continue.call(self.item);
        }
        self.itemForAnimations.data._animatePaperAnims[self._dataIndex] = null;
        if (!!forceEnd || typeof self.repeatCallback !== "function") {
            self = null;
        }
        else {
            var newRepeat = self.repeat;
            if (self.repeat !== true) {
                newRepeat = self.repeat - 1;
            }
            return self.repeatCallback(newRepeat);
        }
    };
    return Animation;
}());
exports.Animation = Animation;
;
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
    if (typeof settings.duration === "undefined") {
        settings.duration = defaults.duration;
    }
    else {
        settings.duration = Number(settings.duration);
        if (settings.duration < 0) {
            settings.duration = defaults.duration;
        }
    }
    if (typeof settings.delay === "undefined") {
        settings.delay = defaults.delay;
    }
    else {
        settings.delay = Number(settings.delay);
        if (settings.delay < 1) {
            settings.delay = defaults.delay;
        }
    }
    if (typeof settings.repeat === "undefined") {
        settings.repeat = defaults.repeat;
    }
    else if (typeof settings.repeat === "function") {
    }
    else {
        if (settings.repeat !== true) {
            settings.repeat = Number(settings.repeat);
            if (settings.repeat < 0) {
                settings.repeat = defaults.repeat;
            }
        }
    }
    if (typeof settings.easing === "undefined") {
        settings.easing = defaults.easing;
    }
    if (typeof settings.easing === "function") {
        settings.easingFunction = settings.easing;
    }
    else {
        if (typeof easing_1.easing[settings.easing] !== "undefined" && easing_1.easing.hasOwnProperty(settings.easing)) {
            settings.easingFunction = easing_1.easing[settings.easing];
        }
        else {
            settings.easing = defaults.easing;
            settings.easingFunction = easing_1.easing[defaults.easing];
        }
    }
    if (typeof settings.complete !== "function") {
        settings.complete = undefined;
    }
    if (typeof settings.step !== "function") {
        settings.step = undefined;
    }
    if (["onFrame", "timeout"].indexOf(settings.mode) === -1) {
        settings.mode = defaults.mode;
    }
    return settings;
}

//# sourceMappingURL=animation.js.map


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
function frameManagerHandler(ev) {
    var item = this;
    if (typeof item.data === "undefined") {
        item.data = {};
    }
    if (typeof item.data._customHandlers !== "undefined" &&
        item.data._customHandlersCount > 0) {
        for (var i in item.data._customHandlers) {
            if (item.data._customHandlers.hasOwnProperty(i)) {
                if (typeof item.data._customHandlers[i] === "function") {
                    item.data._customHandlers[i].call(item, ev);
                }
            }
        }
    }
}
exports.add = function (item, name, callback, parentItem) {
    if (typeof item.data._customHandlers === "undefined") {
        item.data._customHandlers = {};
        item.data._customHandlersCount = 0;
    }
    item.data._customHandlers[name] = callback;
    item.data._customHandlersCount += 1;
    if (item.data._customHandlersCount > 0) {
        if (typeof parentItem !== "undefined") {
            parentItem.onFrame = frameManagerHandler;
        }
        else {
            item.onFrame = frameManagerHandler;
        }
    }
    return name;
};
exports.remove = function (item, name) {
    if (typeof item.data._customHandlers !== "undefined") {
        item.data._customHandlers[name] = null;
        item.data._customHandlersCount -= 1;
        if (item.data._customHandlersCount <= 0) {
            item.data._customHandlersCount = 0;
        }
    }
};

//# sourceMappingURL=frameManager.js.map


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var paper = __webpack_require__(12);
if (typeof window !== "undefined" && typeof window.paper !== "undefined") {
    paper = window.paper;
}
module.exports = paper;

//# sourceMappingURL=getPaper.js.map


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var dirRegexp = /^([+\-])(.+)/;
exports._parseAbsoluteOrRelative = function (value) {
    var valueNumber = null;
    var valueDirection = "";
    valueNumber = Number(value);
    if (typeof value === "string") {
        var valueMatch = value.match(dirRegexp);
        valueDirection = valueMatch[1];
        valueNumber = Number(valueMatch[2]);
    }
    return { value: valueNumber, direction: valueDirection };
};
exports.__pointDiff = function (a, b, operator) {
    if (['+', '-'].indexOf(operator) === -1)
        return;
    if (typeof a === "undefined" || typeof b === "undefined")
        return;
    var ax, bx, ay, by;
    ax = a.x || 0;
    bx = b.x || 0;
    ay = a.y || 0;
    by = b.y || 0;
    if (operator === '+') {
        return a.add(b);
    }
    if (operator === '-') {
        return a.subtract(b);
    }
    throw new Error('Unknown operator');
};
exports._getColorType = function (color_obj) {
    var color_type;
    if (color_obj.type) {
        color_type = color_obj.type;
    }
    else if (typeof color_obj.red !== "undefined") {
        color_type = "rgb";
    }
    else if (typeof color_obj.lightness !== "undefined") {
        color_type = "hsl";
    }
    else if (typeof color_obj.brightness !== "undefined") {
        color_type = "hsb";
    }
    else if (typeof color_obj.gray !== "undefined") {
        color_type = "gray";
    }
    return color_type;
};
exports._getColorComponentNames = function (color_obj) {
    var color_component_names;
    if (color_obj._properties) {
        color_component_names = color_obj._properties;
    }
    else {
        var color_type = exports._getColorType(color_obj);
        switch (color_type) {
            case "gray":
                {
                    color_component_names = ["gray"];
                }
                break;
            case "rgb":
                {
                    color_component_names = ["red", "green", "blue"];
                }
                break;
            case "hsl":
                {
                    color_component_names = ["hue", "saturation", "lightness"];
                }
                break;
            case "hsb":
                {
                    color_component_names = ["hue", "brightness", "saturation"];
                }
                break;
            default:
        }
    }
    return color_component_names;
};
var __tweenPropHooks = {
    _default: {
        get: function (tween) {
            var output;
            if (tween.item[tween.prop] !== null) {
                output = tween.item[tween.prop];
            }
            return output;
        },
        set: function (tween, percent) {
            var toSet = {};
            if (percent === 1) {
                toSet[tween.prop] = tween.end;
            }
            else {
                toSet[tween.prop] = tween.now;
            }
            tween.item.set(toSet);
        }
    },
    scale: {
        get: function (tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.scale === "undefined") {
                tween.item.data._animatePaperVals.scale = 1;
            }
            var output = tween.item.data._animatePaperVals.scale;
            return output;
        },
        set: function (tween, percent) {
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
            }
            else {
                tween.item.scale(trueScaling);
            }
        }
    },
    rotate: {
        get: function (tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.rotate === "undefined") {
                tween.item.data._animatePaperVals.rotate = -0;
            }
            var output = tween.item.data._animatePaperVals.rotate;
            return output;
        },
        set: function (tween) {
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
            }
            else {
                tween.item.rotate(trueRotate);
            }
        }
    },
    translate: {
        get: function (tween) {
            if (!tween.item.data._animatePaperVals) {
                tween.item.data._animatePaperVals = {};
            }
            if (typeof tween.item.data._animatePaperVals.translate === "undefined") {
                tween.item.data._animatePaperVals.translate = new paper.Point(0, 0);
            }
            var output = tween.item.data._animatePaperVals.translate;
            return output;
        },
        set: function (tween) {
            var cur = tween.item.data._animatePaperVals.translate;
            var actual = exports.__pointDiff(tween.now, cur, "-");
            tween.item.data._animatePaperVals.translate = tween.now;
            tween.item.translate(actual);
        },
        ease: function (tween, eased) {
            var temp = exports.__pointDiff(tween.end, tween.start, "-");
            temp.x = temp.x * eased;
            temp.y = temp.y * eased;
            tween.now = exports.__pointDiff(temp, tween.start, "+");
            return tween.now;
        }
    },
    position: {
        get: function (tween) {
            return {
                x: tween.item.position.x,
                y: tween.item.position.y
            };
        },
        set: function (tween, percent) {
            if (percent === 1) {
                var _a = exports._parseAbsoluteOrRelative(tween.end.x || 0), endX = _a.value, dirX = _a.direction;
                var _b = exports._parseAbsoluteOrRelative(tween.end.y || 0), endY = _b.value, dirY = _b.direction;
                if (typeof tween.end.x !== "undefined") {
                    if (dirX === "+") {
                        tween.item.position.x = tween.start.x + endX;
                    }
                    else if (dirX === "-") {
                        tween.item.position.x = tween.start.x - endX;
                    }
                    else {
                        tween.item.position.x = tween.end.x;
                    }
                }
                if (typeof tween.end.y !== "undefined") {
                    if (dirY === "+") {
                        tween.item.position.y = tween.start.y + endY;
                    }
                    else if (dirY === "-") {
                        tween.item.position.y = tween.start.y - endY;
                    }
                    else {
                        tween.item.position.y = tween.end.y;
                    }
                }
            }
            else {
                tween.item.position.x += tween.now.x;
                tween.item.position.y += tween.now.y;
            }
        },
        ease: function (tween, eased) {
            if (typeof tween._easePositionCache === "undefined") {
                tween._easePositionCache = {
                    x: 0,
                    y: 0
                };
            }
            var _a = exports._parseAbsoluteOrRelative(tween.end.x || 0), endX = _a.value, dirX = _a.direction;
            var _b = exports._parseAbsoluteOrRelative(tween.end.y || 0), endY = _b.value, dirY = _b.direction;
            var _ease = function (val) {
                return ((val || 0) * eased);
            };
            if (typeof tween.end.x !== "undefined") {
                if (dirX === "+") {
                    tween.now.x = (_ease(endX) - tween._easePositionCache.x);
                    tween._easePositionCache.x += tween.now.x;
                }
                else if (dirX === "-") {
                    tween.now.x = _ease(endX) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                    tween.now.x = -tween.now.x;
                }
                else {
                    tween.now.x = ((endX - tween.start.x) * eased) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                }
            }
            else {
                tween.now.x = 0;
            }
            if (typeof tween.end.y !== "undefined") {
                if (dirY === "+") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
                else if (dirY === "-") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                    tween.now.y = -tween.now.y;
                }
                else {
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
        get: function (tween) {
            return {
                x: tween.item.x,
                y: tween.item.y
            };
        },
        set: function (tween, percent) {
            if (percent === 1) {
                var _a = exports._parseAbsoluteOrRelative(tween.end.x || 0), endX = _a.value, dirX = _a.direction;
                var _b = exports._parseAbsoluteOrRelative(tween.end.y || 0), endY = _b.value, dirY = _b.direction;
                if (typeof tween.end.x !== "undefined") {
                    if (dirX === "+") {
                        tween.item.x = tween.start.x + endX;
                    }
                    else if (dirX === "-") {
                        tween.item.x = tween.start.x - endX;
                    }
                    else {
                        tween.item.x = tween.end.x;
                    }
                }
                if (typeof tween.end.y !== "undefined") {
                    if (dirY === "+") {
                        tween.item.y = tween.start.y + endY;
                    }
                    else if (dirY === "-") {
                        tween.item.y = tween.start.y - endY;
                    }
                    else {
                        tween.item.y = tween.end.y;
                    }
                }
            }
            else {
                tween.item.x += tween.now.x;
                tween.item.y += tween.now.y;
            }
        },
        ease: function (tween, eased) {
            if (typeof tween._easePositionCache === "undefined") {
                tween._easePositionCache = {
                    x: 0,
                    y: 0
                };
            }
            var _a = exports._parseAbsoluteOrRelative(tween.end.x || 0), endX = _a.value, dirX = _a.direction;
            var _b = exports._parseAbsoluteOrRelative(tween.end.y || 0), endY = _b.value, dirY = _b.direction;
            var _ease = function (val) {
                return ((val || 0) * eased);
            };
            if (typeof tween.end.x !== "undefined") {
                if (dirX === "+") {
                    tween.now.x = (_ease(endX) - tween._easePositionCache.x);
                    tween._easePositionCache.x += tween.now.x;
                }
                else if (dirX === "-") {
                    tween.now.x = _ease(endX) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                    tween.now.x = -tween.now.x;
                }
                else {
                    tween.now.x = ((endX - tween.start.x) * eased) - tween._easePositionCache.x;
                    tween._easePositionCache.x += tween.now.x;
                }
            }
            else {
                tween.now.x = 0;
            }
            if (typeof tween.end.y !== "undefined") {
                if (dirY === "+") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                }
                else if (dirY === "-") {
                    tween.now.y = _ease(endY) - tween._easePositionCache.y;
                    tween._easePositionCache.y += tween.now.y;
                    tween.now.y = -tween.now.y;
                }
                else {
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
        get: function (tween) {
            var current_color = tween.item[tween.prop];
            var component_names = exports._getColorComponentNames(current_color);
            var result = {};
            for (var _i = 0, component_names_1 = component_names; _i < component_names_1.length; _i++) {
                var component_name = component_names_1[_i];
                result[component_name] = current_color[component_name];
            }
            return result;
        },
        set: function (tween, percent) {
            var component_names = exports._getColorComponentNames(tween.item[tween.prop]);
            var current_color = tween.item[tween.prop];
            var color_new = {};
            for (var _i = 0, component_names_2 = component_names; _i < component_names_2.length; _i++) {
                var component_name = component_names_2[_i];
                if (percent === 1) {
                    var _a = exports._parseAbsoluteOrRelative(tween.end[component_name] || 0), end = _a.value, dir = _a.direction;
                    if (typeof tween.end[component_name] !== "undefined") {
                        if (dir === "+") {
                            tween.now[component_name] = tween.start[component_name] + end;
                            tween._easeColorCache[component_name] = tween.start[component_name] + end;
                        }
                        else if (dir === "-") {
                            tween.now[component_name] = tween.start[component_name] - end;
                            tween._easeColorCache[component_name] = tween.start[component_name] - end;
                        }
                        else {
                            tween.now[component_name] = tween.end[component_name];
                            tween._easeColorCache[component_name] = tween.end[component_name];
                        }
                    }
                    else {
                        tween.now[component_name] = tween.start[component_name];
                    }
                    color_new[component_name] = tween.now[component_name];
                }
                else {
                    color_new[component_name] = current_color[component_name] + tween.now[component_name];
                }
            }
            tween.item[tween.prop] = color_new;
        },
        ease: function (tween, eased) {
            var component_names = exports._getColorComponentNames(tween.item[tween.prop]);
            var _ease = function (val) {
                return (val || 0) * eased;
            };
            for (var _i = 0, component_names_3 = component_names; _i < component_names_3.length; _i++) {
                var component_name = component_names_3[_i];
                var curProp = component_name;
                if (typeof tween._easeColorCache === "undefined") {
                    tween._easeColorCache = {};
                }
                if (typeof tween._easeColorCache[curProp] === "undefined") {
                    tween._easeColorCache[curProp] = 0;
                }
                var _a = exports._parseAbsoluteOrRelative(tween.end[curProp] || 0), end = _a.value, dir = _a.direction;
                if (typeof tween.end[curProp] !== "undefined") {
                    if (dir === "+") {
                        tween.now[curProp] = _ease(end) - tween._easeColorCache[curProp];
                        tween._easeColorCache[curProp] += tween.now[curProp];
                    }
                    else if (dir === "-") {
                        tween.now[curProp] = _ease(end) - tween._easeColorCache[curProp];
                        tween._easeColorCache[curProp] += tween.now[curProp];
                        tween.now[curProp] = -tween.now[curProp];
                    }
                    else {
                        tween.now[curProp] = (end - tween.start[curProp]) * eased - tween._easeColorCache[curProp];
                        tween._easeColorCache[curProp] += tween.now[curProp];
                    }
                }
                else {
                    tween.now[curProp] = 0;
                }
            }
            return tween.now;
        }
    }
};
var _colorProperties = ["fill", "stroke"];
for (var i = 0, l = _colorProperties.length; i < l; i++) {
    __tweenPropHooks[_colorProperties[i] + "Color"] = __tweenPropHooks.Color;
}
exports._tweenPropHooks = __tweenPropHooks;
exports._pointDiff = exports.__pointDiff;
exports.extendPropHooks = function (customHooks) {
    for (var i in customHooks) {
        if (customHooks.hasOwnProperty(i)) {
            __tweenPropHooks[i] = customHooks[i];
        }
    }
};
if (true) {
    module.exports = {
        _tweenPropHooks: __tweenPropHooks,
        __pointDiff: exports.__pointDiff,
        extendPropHooks: exports.extendPropHooks,
        _parseAbsoluteOrRelative: exports._parseAbsoluteOrRelative,
        _getColorType: exports._getColorType,
        _getColorComponentNames: exports._getColorComponentNames
    };
}

//# sourceMappingURL=prophooks.js.map


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var animation_1 = __webpack_require__(3);
var _animate = function (item, animation) {
    var animations = [];
    var output;
    if (animation instanceof Array) {
        animations = animation;
    }
    else {
        animations.push(animation);
    }
    var index = 0;
    new animation_1.Animation(item, animations[index].properties, animations[index].settings, function _continue() {
        index++;
        if (typeof animations[index] !== "undefined") {
            new animation_1.Animation(item, animations[index].properties, animations[index].settings, _continue);
        }
    });
    return item;
};
exports.grow = function (path, settings) {
    console.log("segmentGrow was buggy and has been removed, sorry :/");
    return path;
};
exports.shake = function (item, settings) {
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
};
exports.fadeIn = function (item, settings) {
    var duration = 500;
    var complete = undefined;
    var easing = "swing";
    if (typeof settings !== "undefined") {
        if (typeof settings.duration !== "undefined")
            duration = Number(settings.duration);
        if (typeof settings.complete === "function")
            complete = settings.complete;
        if (typeof settings.easing !== "undefined")
            easing = settings.easing;
    }
    _animate(item, {
        properties: {
            opacity: 1
        },
        settings: {
            duration: duration,
            easing: easing,
            complete: complete
        }
    });
};
exports.fadeOut = function (item, settings) {
    var duration = 500;
    var complete = undefined;
    var easing = "swing";
    if (typeof settings !== "undefined") {
        if (typeof settings.duration !== "undefined")
            duration = Number(settings.duration);
        if (typeof settings.complete === "function")
            complete = settings.complete;
        if (typeof settings.easing !== "undefined")
            easing = settings.easing;
    }
    _animate(item, {
        properties: {
            opacity: 0
        },
        settings: {
            duration: duration,
            easing: easing,
            complete: complete
        }
    });
};
exports.slideUp = function (item, settings) {
    var duration = 500;
    var complete = undefined;
    var distance = 50;
    var easing = "swing";
    if (typeof settings !== "undefined") {
        if (typeof settings.duration !== "undefined")
            duration = Number(settings.duration);
        if (typeof settings.complete === "function")
            complete = settings.complete;
        if (typeof settings.easing !== "undefined")
            easing = settings.easing;
        if (typeof settings.distance !== "undefined")
            distance = settings.distance;
    }
    _animate(item, {
        properties: {
            opacity: 1,
            position: {
                y: "-" + distance
            }
        },
        settings: {
            duration: duration,
            easing: easing,
            complete: complete
        }
    });
};
exports.slideDown = function (item, settings) {
    var duration = 500;
    var complete = undefined;
    var distance = 50;
    var easing = "swing";
    if (typeof settings !== "undefined") {
        if (typeof settings.duration !== "undefined")
            duration = Number(settings.duration);
        if (typeof settings.complete === "function")
            complete = settings.complete;
        if (typeof settings.easing !== "undefined")
            easing = settings.easing;
        if (typeof settings.distance !== "undefined")
            distance = settings.distance;
    }
    _animate(item, {
        properties: {
            opacity: 0,
            position: {
                y: "+" + distance
            }
        },
        settings: {
            duration: duration,
            easing: easing,
            complete: complete
        }
    });
};
exports.splash = function (item, settings) {
    var duration = 500;
    var complete = undefined;
    var easing = "swing";
    if (typeof settings !== "undefined") {
        if (typeof settings.duration !== "undefined")
            duration = Number(settings.duration);
        if (typeof settings.complete === "function")
            complete = settings.complete;
        if (typeof settings.easing !== "undefined")
            easing = settings.easing;
    }
    _animate(item, {
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
};
if (true) {
    module.exports = {
        grow: function (path, settings) {
            console.log("segmentGrow was buggy and has been removed, sorry :/");
            return path;
        },
        shake: exports.shake,
        fadeIn: exports.fadeIn,
        fadeOut: exports.fadeOut,
        slideUp: exports.slideUp,
        slideDown: exports.slideDown,
        splash: exports.splash
    };
}

//# sourceMappingURL=effects.js.map


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var prophooks_1 = __webpack_require__(6);
var easing_1 = __webpack_require__(0);
var Tween = (function () {
    function Tween(property, value, animation) {
        var self = this;
        self.A = animation;
        self.item = animation.item;
        self.prop = property;
        self.end = value;
        self.start = self.cur();
        if (typeof self.end === "string" && self.end.charAt(0) === "+") {
            self.end = self.start + parseFloat(self.end);
        }
        else if (typeof self.end === "string" && self.end.charAt(0) === "-") {
            self.end = self.start + parseFloat(self.end);
        }
        self.now = self.cur();
        self.direction = self.end > self.start ? "+" : "-";
    }
    Tween.prototype.cur = function () {
        var self = this;
        var hooks = prophooks_1._tweenPropHooks[self.prop];
        return hooks && hooks.get ? hooks.get(self) : prophooks_1._tweenPropHooks._default.get(self);
    };
    Tween.prototype.run = function (percent) {
        var self = this;
        var eased;
        var hooks = prophooks_1._tweenPropHooks[self.prop];
        var settings = self.A.settings;
        if (settings.duration) {
            var easingFunc = void 0;
            if (typeof settings.easing === "function") {
                easingFunc = settings.easing;
            }
            else {
                easingFunc = easing_1.easing[settings.easing];
            }
            self.pos = eased = easingFunc(percent, settings.duration * percent, 0, 1, self.duration);
        }
        else {
            self.pos = eased = percent;
        }
        if (hooks && hooks.ease) {
            hooks.ease(self, eased);
        }
        else {
            self.now = (self.end - self.start) * eased + self.start;
        }
        if (hooks && hooks.set) {
            hooks.set(self, percent);
        }
        else {
            prophooks_1._tweenPropHooks._default.set(self, percent);
        }
        return self;
    };
    return Tween;
}());
exports.Tween = Tween;
;

//# sourceMappingURL=tween.js.map


/***/ }),
/* 10 */,
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
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__showfps__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_paper__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_paper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_paper__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_paper_animate__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_paper_animate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_paper_animate__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_interactjs__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_interactjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_interactjs__);
// javascript!!!
// goal: extend with interactive.js multitouch gestures.











class MainApp {
    constructor(canvas_el) {
        this.canvas_el = canvas_el;

        this._initPaperJS();

        this._initInteract();
        // document.addEventListener("keypress", (event) => this.handleKeyPress(event));
    }

    _initPaperJS() {
        console.log("paperjs version:", __WEBPACK_IMPORTED_MODULE_1_paper___default.a.version);

        this.paperscope = __WEBPACK_IMPORTED_MODULE_1_paper___default.a.setup(this.canvas_el);
        // console.log("this.paperscope", this.paperscope);

        // set applyMatrix=false --> this means matrix can be read back...
        this.paperscope.settings.applyMatrix = false;
        // set this scope.project active:
        // all newly created paper Objects go into this project.
        this.paperscope.project.activate();

        this.paperscope.view.draw();

        this._drawThings();

        this.paperscope.view.onFrame = (event) => {
            this._onFrame(event);
        };
    }

    _onFrame(event) {
        // nothing to do here.
    }



    _drawThings() {
        // make some objects
        this.obj_list = [
            __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path.Rectangle({
                point: [20, 20],
                size: [150, 500],
                strokeColor: 'lime',
                fillColor: new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Color(1,1,1, 0.2),
                name:"rect1"
            }),
            __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path.Rectangle({
                point: [100, 20],
                size: [150, 150],
                strokeColor: 'red',
                fillColor: new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Color(1,1,1, 0.2),
                name:"rect2"
            }),
            // paper.Path.Circle({
            //     center: paper.view.center,
            //     radius: 170,
            //     strokeColor: 'blue',
            //     fillColor: new paper.Color(1,1,1, 0.2),
            //     name:"circle1"
            // }),
            __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path.Circle({
                center: __WEBPACK_IMPORTED_MODULE_1_paper___default.a.view.center.subtract(new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Point(300, 0)),
                radius: [200, 80],
                strokeColor: 'orange',
                fillColor: new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Color(1,1,1, 0.2),
                name:"circle2"
            }),
        ];
    }


    // with this we check / get the item we want to move..
    getItemAtPoint(x, y) {
        // console.log("getItemAtPoint!");
        // console.log("event", event);
        // console.log("event.point", event.point);
        // console.log("x", x, "y", y);
        // this is a finer way to test:
        //const event_point = event.point;
        const event_point = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Point(x, y);
        const hit_result = __WEBPACK_IMPORTED_MODULE_1_paper___default.a.project.hitTest(
            event_point,
            {
                fill: true,
                stroke: true,
                segments: true,
                tolerance: 5
            }
        );
        let hit_item = null;
        if (hit_result) {
            hit_item = hit_result.item;
        }
        // console.log("hit_item:", hit_item);
        return hit_item;
    }


    onDragHandler(event) {
        // console.group("onDragHandler:");

        // console.log("event.target", event.target);
        // console.log("event.target.name", event.target.name);
        // console.log("event.dx", event.dx, "event.dy", event.dy);

        // create new paper.js point
        const event_delta = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Point(event.dx, event.dy);
        // console.log("event_delta", event_delta);
        event.target.translate(event_delta);

        console.groupEnd();
    }

    onRotateHandler(event) {
        console.log("onRotateHandler!");
        // console.log("event", event);

        const event_delta = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Point(event.dx, event.dy);
        event.target.translate(event_delta);

        const event_deltaAngle = event.da;
        // console.log("event_deltaAngle", event_deltaAngle);
        event.target.rotate(event_deltaAngle);

    }

    onUpHandler(event) {
        console.log("onUpHandler:");
        console.log("event.target.name", event.target.name);
        // if (event.target.data.drag_active) {
        //     console.log("event", event);
        //     // event.target.data.drag_active = false;
        // }
    }


    log_event(event) {
      console.log(event.type, event.pageX, event.pageY, event.dx, event.dy);
    }


    _initInteract() {
            // interact(myCanvas_element)
            //     .on('click', listener)
            //     .on('tab', listener)
            //     .on('doubletap', listener)
            //     .on('hold', listener)
            //     .on('dragstart', listener)
            //     .on('dragmove', listener)
            //     .on('dragend', listener)
            //     .on(['resizemove', 'resizeend'], listener)
            //     .on({
            //         gesturestart: listener,
            //         gesturemove: listener,
            //         gestureend: listener
            //     })
            //     ;

            __WEBPACK_IMPORTED_MODULE_3_interactjs___default()(this.canvas_el)
            .draggable({
                enabled: true,
                manualStart: true,
                // enable inertial throwing
                // inertia: true,
                inertia: false,
                maxPerElement: 10,
                // onstart: onDownHandler,
                // call this function on every dragmove event
                onmove: this.onDragHandler,
                // call this function on every dragend event
                onend: this.onUpHandler
            })
            .gesturable({
                enabled: true,
                manualStart: true,
                maxPerElement: 10,
                // onstart: onDownHandler,
                // call this function on every gesturemove event
                onmove: this.onRotateHandler,
                // call this function on every gestureend event
                // onend: this.onUpHandler
            })
            .on('down', (event)=> {
                console.group("down handler");
                // console.log("event", event);
                // console.log("event.interactable", event.interactable);
                console.log("event.interaction.interacting()", event.interaction.interacting());

                const interaction = event.interaction;
                const hit_item = this.getItemAtPoint(event.clientX, event.clientY);
                // const hit_item = this.getItemAtPoint(event.x0, event.y0);
                if (hit_item) {
                    console.log("hit_item.name", hit_item.name);
                    // console.log("event.currentTarget", event.currentTarget);
                    // console.log("interaction.interacting()", interaction.interacting());

                    // https://github.com/taye/interact.js/issues/480#issuecomment-275708556
                    if (interaction.interacting()) {

                        // stop dragging
                        interaction.end();

                        // start gesture
                        interaction.start(
                            { name: 'gesture' },
                            event.interactable,
                            // event.currentTarget
                            hit_item
                         );
                    } else {
                        // first pointer goes down, start a drag
                        interaction.start(
                            { name: 'drag' },
                            event.interactable,
                            // event.currentTarget
                            hit_item
                         );
                    }
                }

                console.groupEnd();
            })
            .rectChecker(function (element) {
                // https://hacks.mozilla.org/2014/11/interact-js-for-drag-and-drop-resizing-and-multi-touch-gestures/
                // console.log("rectChecker");
                // console.log("element", element);
                // console.log("element instanceof paper.Path", element instanceof paper.Path);
                // return a suitable object for interact.js
                let result_rect = null;
                // check for paper js thing
                if (element.bounds) {
                    result_rect = {
                      left  : element.bounds.left,
                      top   : element.bounds.top,
                      right : element.bounds.right,
                      bottom: element.bounds.bottom
                    };
                } else {
                    // echeck for html element
                    if (element.getClientRects) {
                        result_rect = element.getClientRects()[0];
                    }
                }
                return result_rect;
            })
            ;

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


/***/ })
],[22]);
//# sourceMappingURL=multitouch.js.map