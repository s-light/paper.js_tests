// bounce ball from border

// class concept based on
// https://groups.google.com/forum/#!topic/paperjs/Urf_V3kBSBo
var Ball = Base.extend({
    initialize: function Ball(position, vector) {
        Base.call(this);

        this.position = position || view.center;
        this.vector = vector || new Point({
            // angle: Math.floor(Math.random()*360),
            angle: 0,
            length: 2
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

        console.log("New Ball ready.");
        return this;
    },
    check_and_bounce_at_obstacle: function(item){

        if (this.ball_graphics.intersects(item)) {
            console.log("ball intersects:");
            console.log("this.vector.angle:", this.vector.angle);
            // console.log("ball intersects:", item);
            // TODO get segment we intersected with.
            // var intersections = this.ball_graphics.getIntersections(item);
            // // console.log("intersections:", intersections);
            // if (intersections.length > 0) {
            //     // calculate bounce off angle
            //     // we only use the first intersection.
            //     // var isec = intersections[0];
            //     for (var i = 0; i < intersections.length; i++) {
            //         var isec = intersections[i];
            //         console.log("i:", i);
            //         // console.log(
            //         //     "isec.tangent:\n",
            //         //     "  angle", isec.tangent.angle, "\n",
            //         //     "  length", isec.tangent.length, "\n"
            //         // );
            //         // console.log(
            //         //     "isec.normal:\n",
            //         //     "  angle", isec.normal.angle, "\n",
            //         //     "  length", isec.normal.length, "\n"
            //         // );
            //         console.log("isec.segment:", isec.segment);
            //         console.log("isec.segment.point.angle:", isec.segment.point.angle);
            //         console.log("isec.tangent.angle:", isec.tangent.angle);
            //         console.log("isec.normal.angle:", isec.normal.angle);
            //     }
            //     // var isec = intersections[0];
            //     // isec.t
            //     this.vector.angle += -180;
            // } else {
            //     // fallback to simple bounce off
            //     this.vector.angle += -180;
            // }
            // var nearestpoint = this.ball_graphics.getNearestPoint(item);
            var nearestpoint = item.getNearestPoint(this.ball_graphics.position);
            var vector_nearest = nearestpoint - this.ball_graphics.position;
            // draw a line between this two points:
            this.hit_helper.removeSegments();
            this.hit_helper.addSegments([
                this.ball_graphics.position,
                nearestpoint
            ]);
            this.hit_helper2.position = nearestpoint;
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
            console.log("nearestpoint:", nearestpoint);
            console.log("vector_nearest.angle:", vector_nearest.angle);
            console.log("vector_nearest.length:", vector_nearest.length);
            // this.vector.angle
            // console.log("isec.normal.angle:", isec.normal.angle);
            // fallback to simple bounce off
            this.vector.angle += -180;
            // move_active = false;
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
	9,
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
    console.log("toggle moving.");
    move_active = !move_active;
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
