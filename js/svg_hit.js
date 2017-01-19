// load svg, moveable by mouseDrag. Hit test with different shaped regions

// import svg
// based on example:
// https://groups.google.com/d/msg/paperjs/dWG2FBlrr7Y/iR8XPl3hEAAJ
// related: use FileReader
// https://groups.google.com/d/msg/paperjs/no6gegoLFmo/HwKUbyg-UpIJ
var svg_import = new Group();
project.importSVG(
    "svg/Colibri__single_lineart.svg",
    {
        expandShapes: true,
        onLoad: function (item) {
            // Do something with item
            // console.log(item);
            console.log("svg loaded.");
            item.name = "The Imported SVG things..";
            svg_import.addChild(item);
            svg_import.strokeColor = new Color(0, 1, 0, 0.8);
            svg_import.strokeWidth = 2;
            svg_import.strokeCap = 'round';
            svg_import.strokeJoin = 'round';

            // svg_import.data.origStrokeColor = svg_import.strokeColor;
            svg_import.shadowColor = svg_import.strokeColor;
            svg_import.shadowBlur = 5;
            svg_import.shadowOffset = new Point(0, 0);

            // fill with transparent white :-)
            // that helps so we can hitTest against the fill...
            // svg_import.fillColor = new Color(1, 1, 1, 0.001);
            
            // anchor.position = group.position;
            anchor.position = svg_import.position;
        },
        onError: function (message) {
            console.error(message);
        }
    }
);


// make a helper circle
var anchor = Path.Circle({
    center: view.center,
    radius: 10,
    strokeColor: 'cyan'
});

var group = new Group(
    svg_import,
    anchor
);
group.position = view.center;
group.data.drag_active = false;

// var collision_object = Path.RoundRectangle(
//     new Rectangle(
//         view.center,
//         view.bounds.bottomRight - (view.size/3)
//     ),
//     50
// );
var collision_object = Path.Rectangle(
    new Rectangle(
        view.center,
        view.bounds.bottomRight
    )
);
collision_object.strokeColor = new Color(0.1, 0.1, 0.1);
collision_object.fillColor =  new Color(0.1, 0.1, 0.1);
collision_object.moveBelow(group);



// this way you have to hit the lines to be able to drag..
// http://paperjs.org/reference/group/#onmousedrag
// group.onMouseDrag = function(event) {
//     group.position += event.delta;
// };


function onMouseDown(event) {
    // this is a finer way to test:
    var hit_result = group.hitTest(
        event.point,
        {
            fill: true,
            stroke: true,
            segments: true,
            tolerance: 50
        }
    );
    if (hit_result) {
        group.data.drag_active = true;
    }
}

// that is the global handller.
function onMouseDrag(event) {
    // so we have to first check if the event is inside of our group bounds:
    // if (group.contains(event.point)) {
    //     group.position += event.delta;
    // }

    if (group.data.drag_active) {
        group.position += event.delta;
        // if (group.isInside(view.bounds)) {
        //     group.position += event.delta;
        // }
        if (group.intersects(collision_object)) {
        // if (svg_import.children[0].intersects(collision_object)) {
            svg_import.fillColor = new Color(1, 0, 0, 0.5);
        } else {
            // group.fillColor = null;
            svg_import.fillColor = new Color(0.4, 0.7, 1, 0.4);
        }
    }
}

function onMouseUp(event) {
    group.data.drag_active = false;
}

function onKeyDown(event) {
	if(event.key == 'b') {
        // toggle show boundingbox
        group.selected = !group.selected;
	}
	// if(event.key == 's') {
    //     // toggle strokeColor overwrite
    //     if (svg_import.strokeColor == svg_import.data.origStrokeColor) {
    //         svg_import.strokeColor = new Color(0.5, 1, 0);
    //     } else {
    //         svg_import.strokeColor = svg_import.data.origStrokeColor;
    //     }
	// }
	// if(event.key == 'g') {
    //     // toggle strokeColor overwrite
    //     if (group.hasShadow()) {
    //         group.shadowColor = null;
    //     } else {
    //         // group.shadowColor = new Color(0, 0, 1);
    //         // group.shadowColor = new Color(0.5, 1, 0);
    //         // group.shadowColor = new Color(0.4, 0.7, 1);
    //         group.shadowColor = svg_import.strokeColor;
    //         group.shadowBlur = 5;
    //         group.shadowOffset = new Point(0, 0);
    //     }
	// }
	if(event.key == '-') {
        svg_import.shadowBlur -= 2.5;
	}
	if(event.key == '+') {
        svg_import.shadowBlur += 2.5;
	}
    if (event.modifiers.shift) {
    	if(event.key == '-') {
            group.strokeWidth -= 1;
    	}
    	if(event.key == '+') {
            group.strokeWidth += 1;
    	}
    }
}


function onResize(event) {
    collision_object.bounds = new Rectangle(
        view.center,
        view.bounds.bottomRight
    );
}


// for (var i = 0; i < yesGroup.children.length; i++) {
//     for (var j = 0; j < noGroup.children.length; j++) {
//         showIntersections(noGroup.children[j], yesGroup.children[i]);
//     }
// }
// function showIntersections(path1, path2) {
//     var intersections = path1.getIntersections(path2);
//     for (var i = 0; i < intersections.length; i++) {
//         new Path.Circle({
//             center: intersections[i].point,
//             radius: 5,
//             fillColor: '#009dec'
//         }).removeOnMove();
//     }
// }
