// simple pong game in paper.js

// class concept based on
// https://groups.google.com/forum/#!topic/paperjs/Urf_V3kBSBo
var Player = Base.extend({
    initialize: function Player(position, rotation, size) {
        Base.call(this);

        this.position = position || view.bounds.center;
        this.rotation = rotation || 0;
        this.size = size || 400;

        this.gate = new Path([0, 0], [0, this.size]);
        this.gate.strokeColor = new Color(0, 1, 1);
        this.gate.strokeWidth = 2;

        this.paddle = new Path.Rectangle(0,0, 30, this.gate.bounds.height/3);
        this.paddle.fillColor = 'yellow';
        this.paddle.bounds.center = this.gate.bounds.center;
        // this.paddle.data.move_limmits = this.gate.bounds;

        var track_margin = this.paddle.bounds.height/2;
        this.track = new Path([
            new Point(0, this.gate.bounds.top + track_margin),
            new Point(0, this.gate.bounds.bottom - track_margin)
        ]);
        this.track.strokeColor = null;
        this.track.fillColor = null;

        this.name_label = new PointText({
            point: (
                this.paddle.bounds.rightCenter + new Point(10, 0)
            ),
            fillColor: 'white',
            content: 'player name..'
        });

        this.score = 0;
        this.score_label = new PointText({
            point: (
                this.paddle.bounds.rightCenter +
                new Point(10, this.name_label.bounds.height)
            ),
            fillColor: 'white',
            content: this.score
        });

        this.group = new Group(
            this.track,
            this.gate,
            this.paddle,
            this.name_label,
            this.score_label
        );
        this.group.pivot = this.gate.bounds.center;
        this.group.position = this.position;
        this.group.rotation = this.rotation;

        // setup paddle moving
        var track = this.track;
        var paddle = this.paddle;
        // var paddle = this.group.children[1];
        // this.paddle.onMouseDrag = function(event) {
        this.paddle.onMouseDrag = function(event) {
            paddle.position = track.getNearestPoint(event.point);
        };

        console.log("New Player ready.");
        return this;
    },

    scored: function(){
        console.log("player scored..");
        this.score += 1;
        this.score_label.content = this.score;
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
            // angle: 70,
            angle: -16,
            length: 10
        });
        // console.log("this.vector.angle", this.vector.angle);
        // console.log("this.vector.length", this.vector.length);

        this.ball_graphics = new Path.Circle({
        	center: this.position,
        	radius: 30,
        	fillColor: 'lime'
        });
        // this.ball_graphics.fillColor.hue = Math.random() * 360;

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
        result_hit = false;
        // if (this.ball_graphics.intersects(item)) {
        var nearestpoint = item.getNearestPoint(this.ball_graphics.position);
        var nearest_vector = nearestpoint - this.ball_graphics.position;
        // check if we are near item..
        if (nearest_vector.length < this.bounce_distance) {
            // console.log("--- near ---");
            // wait for intersection to clear before the next check.
            // this helps to prevent 'locking' on the wronge side of a check bound..
            // if (this.flag_check_allowed) {
            // check if we really have left the last intersection..
            var nearest_old_vector = this.nearestpoint_last - this.ball_graphics.position;
            // console.log("nearest_old_vector.length:", nearest_old_vector.length);
            if (nearest_old_vector.length > this.min_distance) {
                // console.log("check:");
                result_hit = true;

                this.nearestpoint_last = nearestpoint;

                // helper / debug
                // draw a line between this two points:
                this.hit_helper.removeSegments();
                this.hit_helper.addSegments([
                    this.ball_graphics.position,
                    nearestpoint
                ]);
                this.hit_helper2.position = nearestpoint;

                var vector_angle = round_precision(this.vector.angle, 2);
                var nearest_vector_angle = round_precision(nearest_vector.angle, 2);
                var angle_delta_in = nearest_vector_angle - vector_angle;
                var angle_delta_out = angle_delta_in * -1;
                var angle_diff = nearest_vector_angle - angle_delta_out;
                var angle_out = angle_diff - 180;
                if (angle_diff < 0) {
                     angle_out = 180 + angle_diff;
                }

                this.flag_check_allowed = false;

                this.vector.angle = angle_out;
                // this.vector.angle += -180;
                // move_active = false;
            }
        } else {
            // this.flag_check_allowed = true;
        }
        return result_hit;
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
    },
    remove: function(){
        this.ball_graphics.remove();
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

// application
function make_game_area() {
    // var game_area = new Path.Rectangle(view.bounds);
    var small_length = Math.min((view.bounds.height),(view.bounds.width));
    // margin 5%
    var margin = small_length/20;
    var game_area = new Path.Rectangle(
        margin,
        margin,
        (view.bounds.width-(margin*2)),
        (view.bounds.height-(margin*2))
    );
    // var game_area = new Path.RegularPolygon(
    // 	view.center,
    // 	8,
    // 	(small_length/2)-(margin*2)
    // );
    game_area.strokeColor = 'white';
    game_area.fillColor = null;
    game_area.name = "game_area";
    return game_area;
}

var game_area = make_game_area();

var balls = [
    new Ball()
];

// new Player(position, rotation, size)
var players = [
    new Player(new Point(150,250), 0, 400),
    new Player(new Point(900,400), 0, 500),
    new Player(new Point(500,700), 45, 500),
];

function balls_move() {
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        ball.move();
    }
}

function balls_moveback() {
    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        ball.moveback();
    }
}

function game_items_bouncing() {
    for (var ball_index = 0; ball_index < balls.length; ball_index++) {
        var ball = balls[ball_index];
        ball.check_and_bounce_at_obstacle(game_area);
        for (var item_index = 0; item_index < players.length; item_index++) {
            var player = players[item_index];
            ball.check_and_bounce_at_obstacle(player.paddle);
            if (ball.check_and_bounce_at_obstacle(player.gate)) {
                player.scored();
            }
        }
    }
}


// var move_active = true;
var move_active = false;

view.onFrame = function(event) {
    //console.log("click");
    if (move_active) {
		balls_move();
        game_items_bouncing();
	}

};



view.onClick = function(event) {
    if (event.modifiers.shift) {
        console.log("toggle moving.");
        move_active = !move_active;
    }
    if (event.modifiers.control) {
        console.log("move!");
        balls_move();
        game_items_bouncing();
    }
    if (event.modifiers.control && event.modifiers.shift) {
        console.log("move back!.");
        balls_moveback();
        game_items_bouncing();
    }
    if (event.modifiers.control && event.modifiers.alt) {
        console.log("reset first ball.");
        balls[0].remove();
        balls[0] = new Ball();
    }
};


// global tool
// here to activate 'mouse' mode for sketch.paperjs.org
function onMouseMove(event) {
    // nothing to do.
}



function round_precision(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}
