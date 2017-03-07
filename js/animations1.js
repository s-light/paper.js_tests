
class MainApp {
    constructor(canvas_el) {
        this.canvas_el = canvas_el;

        this._initPaperJS();
        this._initAnimations();

    }

    _initPaperJS() {
        this.paperscope = paper.setup(this.canvas_el);
        // console.log("this.paperscope", this.paperscope);

        this.paperscope.project.activate();

        this.rect0 = new paper.Path.Rectangle({
            point: [0, 0],
            size: [150, 150],
            strokeColor: 'lime',
            fillColor: new paper.Color(1,1,1, 0.2),
            name:"rect0"
        });

        this.paperscope.view.draw();
    }

    _initAnimations() {
        // this.canvas_el.addEventListener("click", (event) => {
        //     this.moveToPosition(event);
        // });
        this.canvas_el.addEventListener("click", (event) => this.moveToPosition(event));

        // this.rect0.onClick = function(event) {
        //     console.log("this", this);
        //     console.log("event", event);
        //     // var event_delta = new paper.Point(event.dx, event.dy);
        //     this.animate({
        //
        //     });
        //
        //
        // };

    }

    moveToPosition(event) {
        // console.log("this", this);
        // console.log("event", event);
        const position_new = new paper.Point(event.clientX, event.clientY);

        console.log("this.rect0.position", this.rect0.position);
        console.log("position_new", position_new);

        // this.rect0.position.x = event.clientX;
        // this.rect0.position.y = event.clientY;
        // this.paperscope.view.draw();

        this.rect0.animate({
            properties: {
                // position: {
                //     // x: position_new.x,
                //     // y: position_new.y,
                //     x: event.clientX,
                //     y: event.clientY,
                // }
                positionQ: position_new
            },
            settings: {
                duration: 500,
                easing: "swing"
            }
        });
    }
}



window.addEventListener("load", function(event) {
    var canvas = document.getElementById('myCanvas');
    const myapp = new MainApp(canvas);
});
