// generate some graphical elements:
var path_rrect = new Path.RoundRectangle(
    new Rectangle(new Point(5,5), view.size - 10),
    new Size(20, 20)
);
path_rrect.strokeColor = 'yellow';
var circle_in_center = new Path.Circle({
	center: view.center,
	radius: 30,
	strokeColor: 'lime'
});


// pan-movement
var toolPan = new Tool();
toolPan.onMouseDrag = function(event) {
    var offset = event.downPoint - event.point;
    view.center += offset;
};

// helper to reset view.
view.onDoubleClick = function(event) {
    view.center = view.size/2;
};
