webpackJsonp([2],[
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
/* 17 */
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
    }

    _initPaperJS() {
        console.log("paperjs version:", __WEBPACK_IMPORTED_MODULE_1_paper___default.a.version);

        this.paperscope = __WEBPACK_IMPORTED_MODULE_1_paper___default.a.setup(this.canvas_el);
        // console.log("this.paperscope", this.paperscope);

        // set applyMatrix=false --> this means matrix can be read back...
        // this.paperscope.settings.applyMatrix = false;
        // set this scope.project active:
        // all newly created paper Objects go into this project.
        this.paperscope.project.activate();

        this.paperscope.view.draw();

        this._loadCircleTest();

        this.paperscope.view.onFrame = (event) => {
            this._onFrame(event);
        };
    }

    _onFrame(event) {
        const offset = Math.sin(event.count / 30) * 75;
        this.group_dots.position.x = this.group_dots_mycenter.x + offset;
        // force recalculating of fillColor/gradient
        //group_dotsContainer.fillColor = group_dots_color;
        this.group_dots.strokeColor = this.group_dots_color;
    }

    // tests

    _loadCircleTest() {

        this.group_dots_mycenter = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Point([500, 300]);

        var background = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path.Star({
            center: this.group_dots_mycenter,
            points: 14,
            radius1: 150,
            radius2: 430,
            strokeColor: 'blue',
            strokeWidth: 14,
        });

        var circle_0 = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path.Circle({
            center: [100, 300],
            radius: 50,
            fillColor: 'orange',
            strokeWidth: 14,
        });

        var circle_1 = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path.Circle({
            center: [300, 300],
            radius: 50,
            fillColor: 'orange',
            strokeWidth: 14,
        });

        var circle_2 = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path.Circle({
            center: [500, 300],
            radius: 50,
            fillColor: 'orange',
            strokeWidth: 14,
        });

        var circle_3 = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path.Circle({
            center: [700, 300],
            radius: 50,
            fillColor: 'orange',
            strokeWidth: 14,
        });

        var circle_4 = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path.Circle({
            center: [900, 300],
            radius: 50,
            fillColor: 'orange',
            strokeWidth: 14,
        });


        this.group_dots = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Group([
            circle_0,
            circle_1,
            circle_2,
            circle_3,
            circle_4,
        ]);



        var group_dots_leftCenter = this.group_dots.localToGlobal(
            this.group_dots.bounds.leftCenter
        );

        var group_dots_rightCenter = this.group_dots.localToGlobal(
            this.group_dots.bounds.rightCenter
        );

        console.log("group_dots_leftCenter", group_dots_leftCenter);
        console.log("group_dots_rightCenter", group_dots_rightCenter);

        var container_helper = new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Path.Rectangle({
            topLeft: [50, 100],
            bottomRight: [950, 200],
            fillColor: [0.4, 0, 1.0, 0.5],
            strokeWidth: 14,
        });

        //console.log("group_dots", group_dots.bounds);
        //console.log("group_dotsContainer", group_dotsContainer.bounds);
        //console.log("group_dotsContainer_leftCenter", group_dotsContainer_leftCenter);
        //console.log("group_dotsContainer_rightCenter", group_dotsContainer_rightCenter);

        var myGradientStops = {
                stops: [
                    [new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Color(1, 0, 0, 0), 0.0],
                    [new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Color(1, 0, 0, 0.1), 0.05],
                    [new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Color(1, 0, 0, 1), 0.15],
                    [new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Color(1, 1, 0, 1), 0.4],
                    [new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Color(0, 1, 0, 1), 0.85],
                    [new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Color(0, 1, 0, 0.1), 0.95],
                    [new __WEBPACK_IMPORTED_MODULE_1_paper___default.a.Color(0, 1, 0, 0), 1.0],
                ]
        };


        this.group_dots_color = {
            gradient: myGradientStops,
            origin: group_dots_leftCenter,
            destination: group_dots_rightCenter,
        };

        container_helper.strokeColor = this.group_dots_color;
        this.group_dots.strokeColor = this.group_dots_color;
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
],[17]);
//# sourceMappingURL=animation_circles.js.map