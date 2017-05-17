// this is paperscript

// set applyMatrix=false --> this means matrix can be read back...
paper.settings.applyMatrix = false;

var svg_shadowtest = new Group();

svg_shadowtest.importSVG(
    "svg/shadowtest_transformmatrix.svg",
    {
        expandShapes: true,
        insert: true,
        onLoad: function (item) {
            // Do something with item
            console.log("svg loaded", item);
            item.name = "svg_shadowtest";
            item.scale(3);
            var img = item.children.plane.children.g28.children.image30;
            img.applyMatrix = true;
            img.translate([+10, +50]);
            img.translate([-10, -50]);
            console.log("svg_shadowtest", svg_shadowtest);
        },
        onError: function (message) {
            console.error(message);
        }
    }
);
svg_shadowtest.position = paper.view.bounds.center;

window.sht = svg_shadowtest;
