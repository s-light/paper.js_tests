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
            // check that mouse is inside group
            // this does not feel nice in the usage..
            // TODO find some other 'boundingbox' that fits 'smooth handling'
            if (this.parent.contains(event.point)) {
                var new_position_y = this.position.y + event.delta.y;
                var min = gate.bounds.top + (this.bounds.height/2);
                var max = gate.bounds.bottom - (this.bounds.height/2);
                // console.log("min", min);
                // console.log("max", max);
                // bound paddle to gate length
                if (
                    (min < new_position_y) &&
                    (new_position_y < max)
                ) {
                    this.position.y = new_position_y;
                }
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

var Ball = Base.extend({
    initialize: function Ball(position, vector) {
        Base.call(this);

        this.position = position || view.center;
        this.vector = vector || new Point({
            // angle: Math.floor(Math.random()*360),
            angle: 0,
            length: 2
        });
        console.log("this.vector.angle", this.vector.angle);
        console.log("this.vector.length", this.vector.length);

        this.ball_graphics = new Path.Circle({
        	center: this.position,
        	radius: 30,
        	fillColor: 'lime'
        });

        console.log("New Ball ready.");
        return this;
    },
    check_and_bounce_at_obstacle: function(item){

        if (this.ball_graphics.intersects(item)) {
            console.log("ball intersects:");
            console.log("this.vector.angle:", this.vector.angle);
            // console.log("ball intersects:", item);
            // TODO get segment we intersected with.
            var intersections = this.ball_graphics.getIntersections(item);
            // console.log("intersections:", intersections);
            if (intersections.length > 0) {
                // calculate bounce off angle
                // we only use the first intersection.
                // var isec = intersections[0];
                for (var i = 0; i < intersections.length; i++) {
                    var isec = intersections[i];
                    console.log("i:", i);
                    // console.log(
                    //     "isec.tangent:\n",
                    //     "  angle", isec.tangent.angle, "\n",
                    //     "  length", isec.tangent.length, "\n"
                    // );
                    // console.log(
                    //     "isec.normal:\n",
                    //     "  angle", isec.normal.angle, "\n",
                    //     "  length", isec.normal.length, "\n"
                    // );
                    console.log("isec.segment:", isec.segment);
                    console.log("isec.segment.point.angle:", isec.segment.point.angle);
                    console.log("isec.tangent.angle:", isec.tangent.angle);
                    console.log("isec.normal.angle:", isec.normal.angle);
                }
                // var isec = intersections[0];
                // isec.t
                this.vector.angle += -180;
            } else {
                // fallback to simple bounce off
                this.vector.angle += -180;
            }
        }

        // bounce ball from all things it hits..
        // console.log("this.ball_graphics", this.ball_graphics);
        // console.log("project.activeLayer.children.length", project.activeLayer.children.length);
        // for (var i = 0; i < project.activeLayer.children.length; i++) {
        //     var item = project.activeLayer.children[i];
        //     // only test other icons (not yourself!)
        //     if (
        //         (item._id !== this.ball_graphics._id) &&
        //         (item._type)
        //     ) {
        //         // console.log("item", item);
        //         if (this.ball_graphics.intersects(item)) {
        //             console.log("ball intersects:", item);
        //             this.vector.angle += -180;
        //         }
        //     }
        // }
    },
    move: function(){
        // console.log("this.ball.position", this.ball.position);
        // console.log("this.vector", this.vector);
        this.ball_graphics.position += this.vector;
        // this.bounce_at_obstacle();
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

// real application

var game_area = new Path.Rectangle(view.bounds);
game_area.strokeColor = null;
game_area.fillColor = null;
game_area.name = "game_area";

var ball1 = new Ball();

// var player1 = new Player(new Point(150,250), 0);
// var player2 = new Player();

// function onFrame() {
// view.onClick = function(event) {
view.onFrame = function(event) {
    //console.log("click");
    ball1.move();
    ball1.check_and_bounce_at_obstacle(game_area);

};


// helper to reset view.
view.onDoubleClick = function(event) {
};

// global tool
// here to activate 'mouse' mode for sketch.paperjs.org
function onMouseMove(event) {
    // nothing to do.
}
