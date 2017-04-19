
class MainApp {
    constructor(canvas_el) {
        this.canvas_el = canvas_el;

        this._initPaperJS();
    }

    _initPaperJS() {
        console.log("paperjs version:", paper.version);

        this.paperscope = paper.setup(this.canvas_el);
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

        this.group_dots_mycenter = new paper.Point([500, 300]);

        var background = new paper.Path.Star({
            center: this.group_dots_mycenter,
            points: 14,
            radius1: 150,
            radius2: 430,
            strokeColor: 'blue',
            strokeWidth: 14,
        });

        var circle_0 = new paper.Path.Circle({
            center: [100, 300],
            radius: 50,
            fillColor: 'orange',
            strokeWidth: 14,
        });

        var circle_1 = new paper.Path.Circle({
            center: [300, 300],
            radius: 50,
            fillColor: 'orange',
            strokeWidth: 14,
        });

        var circle_2 = new paper.Path.Circle({
            center: [500, 300],
            radius: 50,
            fillColor: 'orange',
            strokeWidth: 14,
        });

        var circle_3 = new paper.Path.Circle({
            center: [700, 300],
            radius: 50,
            fillColor: 'orange',
            strokeWidth: 14,
        });

        var circle_4 = new paper.Path.Circle({
            center: [900, 300],
            radius: 50,
            fillColor: 'orange',
            strokeWidth: 14,
        });


        this.group_dots = new paper.Group([
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

        var container_helper = new paper.Path.Rectangle({
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
                    [new paper.Color(1, 0, 0, 0), 0.0],
                    [new paper.Color(1, 0, 0, 0.1), 0.05],
                    [new paper.Color(1, 0, 0, 1), 0.15],
                    [new paper.Color(1, 1, 0, 1), 0.4],
                    [new paper.Color(0, 1, 0, 1), 0.85],
                    [new paper.Color(0, 1, 0, 0.1), 0.95],
                    [new paper.Color(0, 1, 0, 0), 1.0],
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
