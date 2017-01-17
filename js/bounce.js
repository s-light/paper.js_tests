// bounce ball from border

// class concept based on
// https://groups.google.com/forum/#!topic/paperjs/Urf_V3kBSBo
var Ball = Base.extend({
    initialize: function Ball(position, vector) {
        Base.call(this);

        this.position = position || view.center;
        this.vector = vector || new Point({
            // angle: Math.floor(Math.random()*360),
            // angle: 70,
            angle: -16,
            length: 29
            // attention! the move-size must be smaller than the circle radius.
            // otherwise the bounce check does not work..
        });
        // console.log("this.vector.angle", this.vector.angle);
        // console.log("this.vector.length", this.vector.length);

        this.ball_graphics = new Path.Circle({
        	center: this.position,
        	radius: 30,
        	fillColor: 'lime'
        });

        this.hit_helper = new Path({
        	strokeColor: 'red'
        });
        this.hit_helper.addSegments([
            this.ball_graphics.position,
            this.ball_graphics.position + (this.vector.clone().length = 30)
        ]);
        this.hit_helper2 = Path.Circle({
        	center: this.position,
        	radius: 5,
        	strokeColor: 'cyan'
        });
        this.hit_helper3 = Path.Circle({
        	center: this.position,
        	radius: 3,
        	strokeColor: 'blue'
        });

        var min = Math.min(
            this.ball_graphics.bounds.width,
            this.ball_graphics.bounds.height
        );
        var max = Math.max(
            this.ball_graphics.bounds.width,
            this.ball_graphics.bounds.height
        );
        this.min_distance = (min/2) + 1;
        this.bounce_distance = (max/2) + this.vector.length;
        console.log("Math.min(this.ball_graphics.bounds.width, this.ball_graphics.bounds.height):", Math.min(this.ball_graphics.bounds.width, this.ball_graphics.bounds.height));
        console.log("this.min_distance:", this.min_distance);
        console.log("this.bounce_distance:", this.bounce_distance);
        this.nearestpoint_last = new Point();
        // this.flag_check_allowed = true;

        console.log("New Ball ready.");
        return this;
    },
    check_and_bounce_at_obstacle: function(item){
        // if (this.ball_graphics.intersects(item)) {
        var nearestpoint = item.getNearestPoint(this.ball_graphics.position);
        var nearest_vector = nearestpoint - this.ball_graphics.position;
        // check if we are near item..
        if (nearest_vector.length < this.bounce_distance) {
            console.log("--- near ---");
            // wait for intersection to clear before the next check.
            // this helps to prevent 'locking' on the wronge side of a check bound..
            // if (this.flag_check_allowed) {
            // check if we really have left the last intersection..
            var nearest_old_vector = this.nearestpoint_last - this.ball_graphics.position;
            console.log("nearest_old_vector.length:", nearest_old_vector.length);
            if (nearest_old_vector.length > this.min_distance) {
                console.log("check:");

                this.nearestpoint_last = nearestpoint;

                console.log("nearest_vector.length:", nearest_vector.length);

                // var np_ball = this.ball_graphics.getNearestPoint(nearestpoint);
                // var help_vector = nearestpoint - np_ball;
                // console.log("help_vector.length:", help_vector.length);
                // console.log("help_vector.angle:", help_vector.angle);
                // this.hit_helper3.position = np_ball;

                // helper / debug
                // draw a line between this two points:
                this.hit_helper.removeSegments();
                this.hit_helper.addSegments([
                    this.ball_graphics.position,
                    nearestpoint
                ]);
                this.hit_helper2.position = nearestpoint;

                var vector_angle = round_precision(this.vector.angle, 2);
                console.log("vector_angle:", vector_angle);
                // var vector_angle_normalized = vector_angle-180;
                // console.log("vector_angle_normalized:", vector_angle_normalized);

                var nearest_vector_angle = round_precision(nearest_vector.angle, 2);
                console.log("nearest_vector_angle:  ", nearest_vector_angle);

                // var angle_delta_in = nearest_vector_angle - vector_angle_normalized;
                var angle_delta_in = nearest_vector_angle - vector_angle;
                console.log("angle_delta_in:", angle_delta_in);

                var angle_delta_out = angle_delta_in * -1;
                console.log("angle_delta_out:", angle_delta_out);

                var angle_diff = nearest_vector_angle - angle_delta_out;
                // var angle_diff = nearest_vector_angle - angle_delta_in;
                console.log("angle_diff:", angle_diff);

                // var angle_out = vector_angle + angle_diff;
                var angle_out = angle_diff - 180;
                if (angle_diff < 0) {
                     angle_out = 180 + angle_diff;
                }
                console.log("angle_out:", angle_out);
                this.flag_check_allowed = false;

                this.vector.angle = angle_out;
                // this.vector.angle += -180;
                // move_active = false;
            }
        } else {
            // this.flag_check_allowed = true;
        }

    },
    move: function(){
        // console.log("this.ball.position", this.ball.position);
        // console.log("this.vector", this.vector);
        this.ball_graphics.position += this.vector;
        // this.bounce_at_obstacle();
    },
    moveback: function(){
        // console.log("this.ball.position", this.ball.position);
        // console.log("this.vector", this.vector);
        this.ball_graphics.position -= this.vector;
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
    bgRect.guide = true;

    // Create the drawing layer
    var drawingLayer = new Layer();
    drawingLayer.name = "drawingLayer";
    drawingLayer.activate();
    console.clear();
}

setup();

// real application


// var game_area = new Path.Rectangle(view.bounds);
var small_length = Math.min((view.bounds.height),(view.bounds.width));
// margin 5%
var margin = small_length/20;
// var game_area = new Path.Rectangle(
//     margin,
//     margin,
//     (view.bounds.width-(margin*2)),
//     (view.bounds.height-(margin*2))
// );
var game_area = new Path.RegularPolygon(
	view.center,
	8,
	(small_length/2)-(margin*2)
);
game_area.strokeColor = 'white';
game_area.fillColor = null;
game_area.name = "game_area";

var ball1 = new Ball();

// function onFrame() {
// view.onClick = function(event) {
view.onFrame = function(event) {
    //console.log("click");
	if (move_active) {
		ball1.move();
		ball1.check_and_bounce_at_obstacle(game_area);
	}
};

var move_active = true;
view.onClick = function(event) {
    if (event.modifiers.shift) {
        console.log("toggle moving.");
        move_active = !move_active;
    } else {
        if (event.modifiers.control) {
            console.log("move back!.");
            ball1.moveback();
            ball1.check_and_bounce_at_obstacle(game_area);
        } else {
            console.log("move!");
            ball1.move();
            ball1.check_and_bounce_at_obstacle(game_area);
        }
    }
};

// helper to reset view.
view.onDoubleClick = function(event) {
};

// global tool
// here to activate 'mouse' mode for sketch.paperjs.org
// function onMouseMove(event) {
//     // nothing to do.
// }

var line = new Path({
    strokeColor: 'red'
});
line.addSegments([
    new Point(0,0),
    new Point(200,40)
]);
var circle = Path.Circle({
    center: view.center,
    radius: 10,
    strokeColor: 'cyan'
});

// function onMouseMove(event) {
view.onMouseMove = function(event) {
    // Get the nearest point from the mouse position
    // to the star shaped path:
    var nearestPoint = game_area.getNearestPoint(event.point);
    line.removeSegments();
    line.addSegments([
        event.point,
        nearestPoint
    ]);
    // Move the red circle to the nearest point:
    circle.position = nearestPoint;
};


function round_precision(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}
