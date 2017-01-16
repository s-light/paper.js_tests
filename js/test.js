// // generate some graphical elements:
// var path_rrect = new Path.RoundRectangle(
//     new Rectangle(new Point(5,5), view.size - 10),
//     new Size(20, 20)
// );
// path_rrect.strokeColor = 'yellow';
// var circle_in_center = new Path.Circle({
// 	center: view.center,
// 	radius: 30,
// 	strokeColor: 'lime'
// });
//
//
// // pan-movement
// var toolPan = new Tool();
// toolPan.onMouseDrag = function(event) {
//     var offset = event.downPoint - event.point;
//     view.center += offset;
// };
//
// // helper to reset view.
// view.onDoubleClick = function(event) {
//     view.center = view.size/2;
// };


// https://github.com/paperjs/paper.js/blob/develop/examples/Animated/Space.html
// The amount of symbol we want to place;
    var count = 150;

    // Create a symbol, which we will use to place instances of later:
    var path = new Path.Circle({
        center: new Point(0, 0),
        radius: 5,
        fillColor: 'white',
        strokeColor: 'black'
    });

    var symbol = new SymbolDefinition(path);

    // Place the instances of the symbol:
    for (var i = 0; i < count; i++) {
        // The center position is a random point in the view:
        var center = Point.random() * view.size;
        var placed = symbol.place(center);
        var scale = (i + 1) / count;
        placed.scale(scale);
        placed.data.vector = new Point({
            angle: Math.random() * 360,
            length : scale * Math.random() / 0.2
        });
    }

    var vector = new Point({
        angle: 45,
        length: 0
    });

    var mouseVector = vector.clone();

    function onMouseMove(event) {
        mouseVector = view.center - event.point;
    }

    // The onFrame function is called up to 60 times a second:
    function onFrame(event) {
        vector = vector + (mouseVector - vector) / 30;

        // Run through the active layer's children list and change
        // the position of the placed symbols:
        for (var i = 0; i < count; i++) {
            var item = project.activeLayer.children[i];
            var size = item.bounds.size;
            var length = vector.length / 2 * size.width / 2;
            item.position += vector.normalize(length) + item.data.vector;
            keepInView(item);
        }
    }

    function keepInView(item) {
        var position = item.position;
        var itemBounds = item.bounds;
        var bounds = view.bounds;
        if (itemBounds.left > bounds.width) {
            position.x = -item.bounds.width;
        }

        if (position.x < -itemBounds.width) {
            position.x = bounds.width + itemBounds.width;
        }

        if (itemBounds.top > view.size.height) {
            position.y = -itemBounds.height;
        }

        if (position.y < -itemBounds.height) {
            position.y = bounds.height  + itemBounds.height / 2;
        }
}
