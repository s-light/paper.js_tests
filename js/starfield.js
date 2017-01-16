// starfield example based on
// http://paperjs.org/tutorials/animation/creating-animations/#moving-multiple-items

// The amount of circles we want to make:
var count = 300;

// Create a symbol, which we will use to place instances of later:
var path = new Path.Circle({
	center: [0, 0],
	radius: 8,
	fillColor: 'white',
	strokeColor: 'white'
});
//
// // The amount of circles we want to make:
// var count = 200;
//
// // Create a symbol, which we will use to place instances of later:
// var path = new Path.Circle({
// 	center: [0, 0],
// 	radius: 8,
// 	fillColor: 'blue',
// 	strokeColor: 'lime'
// });

var symbol = new Symbol(path);

// Place the instances of the symbol:
for (var i = 0; i < count; i++) {
    // The center position is a random point in the view:
	var center = Point.random() * view.size;
	var placedSymbol = symbol.place(center);
	var scale_factor = (i+1) / count;
	placedSymbol.orig_scale_factor = scale_factor;
	placedSymbol.scale(scale_factor);
}

view.onClick = function(event) {
    //console.log("onClick");
    console.clear();
    test(event);
};

function update_scale(item, center_distance) {
    // console.log("i", i);
    var center_distance_factor = (1 * center_distance) / view.center.length;
    center_distance_factor *= 1.9;
    // console.log("center_distance_factor", center_distance_factor);
    // center_distance_factor += 1;
    // console.log("center_distance_factor", center_distance_factor);
    // console.log("item.orig_scale_factor", item.orig_scale_factor);
    var new_scale_factor = item.orig_scale_factor * center_distance_factor;
    // console.log("new_scale_factor", new_scale_factor);

    // console.log("item.scaling", item.scaling);
    // console.log("(new Point(1.0,1.0) / item.scaling)", (new Point(1.0,1.0) / item.scaling));
    // console.log("(1.0 / item.scaling.x)", (1.0 / item.scaling.x));
    // reset scale + apply new scale.
    // var reset_scale = (new Point(1.0,1.0) / item.scaling);
    var reset_scale = (1.0 / item.scaling.x);
    // console.log("reset_scale", reset_scale);

    var new_scale = reset_scale * new_scale_factor;
    // console.log("new_scale", new_scale);
    item.scale(new_scale);
    // console.log("item.scaling", item.scaling);
}

// The onFrame function is called up to 60 times a second:
function onFrame(event) {
// function test(event) {
	// Run through the active layer's children list and change
	// the position of the placed symbols:
	for (var i = 0; i < count; i++) {
		var item = project.activeLayer.children[i];

        // move from center to outside
		// larger circles move faster than smaller circles:
        // var move_offset = item.bounds.width / 5;

        var vector = item.position - view.center;

        var move_offset = item.bounds.width / 5;


        // add 1 so that this cant be 0.
        move_offset += 1;

        var center_distance_factor = (1 * vector.length) / view.center.length;
        center_distance_factor *= 13.9;
        move_offset *= center_distance_factor;
        move_offset += 1;

        vector.length += move_offset;
        var new_position = vector + view.center;
        item.position = new_position;
        update_scale(item, vector.length);


        // if outside of visible area than reset to center..
        if (!item.isInside(view.bounds)) {
            var vector_new = item.position - view.center;
            // direct to center resets angle. so we have to use a minimal offset.
            vector_new.length = 1;
            var reset_position = vector_new + view.center;
            item.position = reset_position;
            update_scale(item, vector_new.length);
        }

	}
}
