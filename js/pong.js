// simple pong game in paper.js

// class concept based on
// https://groups.google.com/forum/#!topic/paperjs/Urf_V3kBSBo
var Player = Base.extend({
    initialize: function Player(position, rotation) {
        Base.call(this);

        this.position = position || view.bounds.center;
        this.rotation = rotation || 0;

        this.gate = new Path([1, 0], [1, 400]);
        this.gate.strokeColor = new Color(0, 1, 1);
        this.gate.strokeWidth = 2;

        this.paddle = new Path.Rectangle(0,0, 30, this.gate.bounds.height/3);
        this.paddle.fillColor = 'yellow';
        this.paddle.bounds.center = this.gate.bounds.center;
        // this.paddle.data.move_limmits = this.gate.bounds;

        var gate = this.gate;
        this.paddle.onMouseDrag = function(event) {
            var offset = event.downPoint - event.point;
            // paddle.bounds.center.y += offset.x;
            // console.log("this", this);
            // console.log("event.item", event.item);
            // console.log("event.downPoint", event.downPoint);
            // console.log("event", event);
            // console.log("event.point", event.point);
            // console.log("offset", offset);
            // console.log("this.position", this.position);
            // console.log("this.parent", this.parent);
            // console.log("gate.bounds", gate.bounds);
            // var new_position = new Point(0, this.position.y + event.delta.y);
            var new_position_y = this.position.y + event.delta.y;
            // console.log("new_position", new_position_y);
            // console.log("gate.contains(new_position)", gate.contains(new_position));
            // if (gate.contains(new_position)) {
            // console.log("this.data", this.data);
            // if (
            //     this.data.move_limmits.top <
            //     new_position_y >
            //     this.data.move_limmits.bottom
            // ) {
            // console.log("gate.bounds.top < new_position_y < gate.bounds.bottom", gate.bounds.top < new_position_y < gate.bounds.bottom);
            // console.log("(gate.bounds.top < new_position_y)", (gate.bounds.top < new_position_y));
            // console.log("(new_position < gate.bounds.bottom)", (new_position_y < gate.bounds.bottom));
            var min = gate.bounds.top + (this.bounds.height/2);
            var max = gate.bounds.bottom - (this.bounds.height/2);
            // console.log("min", min);
            // console.log("max", max);
            if (
                // min < new_position_y < max
                (min < new_position_y) &&
                (new_position_y < max)
            ) {
                this.position.y = new_position_y;
            }

        };


        this.name_display = new PointText({
            point: (
                this.paddle.bounds.rightCenter + new Point(10, 0)
            ),
            fillColor: 'white',
            content: 'player name..'
        });

        this.score = new PointText({
            point: (
                this.paddle.bounds.rightCenter +
                new Point(10, this.name_display.bounds.height)
            ),
            fillColor: 'white',
            content: 'score'
        });

        this.group = new Group(
            this.gate,
            this.paddle,
            this.name_display,
            this.score
        );

        this.group.position = this.position;

        console.log("New Player ready.");
        return this;
    },

    foo: function(){
         // custom function here
    }
});


function setup() {
    console.log("initialize background...");
    // Set the background layer, adding a partially opaque rectangle.
    project.activeLayer.name = "bglayer";
    // project.activeLayer.opacity = 0.35;
    var bgRect = new Shape.Rectangle(view.bounds);
    bgRect.strokeColor = 'Black';
    bgRect.fillColor = {
        gradient: {
            stops: [[new Color(0, 0, 0.3), 0.0], ['black', 0.5]],
            radial: true
        },
        origin: 0,
        destination: bgRect.bounds.rightCenter
    };
    bgRect.strokeWidth = 0;
    bgRect.name = "bgRect";

    // Create the drawing layer
    var drawingLayer = new Layer();
    drawingLayer.name = "drawingLayer";
    drawingLayer.activate();
    console.clear();
}

setup();

// generate some graphical elements:
var ball = new Path.Circle({
	center: view.center,
	radius: 30,
	fillColor: 'lime'
});

// real application
var player1 = new Player(new Point(150,250), 0);
var player2 = new Player();



// helper to reset view.
view.onDoubleClick = function(event) {
};
