// test for simple slider

var Slider = Base.extend({
    initialize: function Slider(position, rotation, size) {
        Base.call(this);

        this.position = position || view.bounds.center;
        this.rotation = rotation || 0;
        this.size = size || 400;

        this.track = new Path([1, 0], [1, this.size]);
        this.track.strokeColor = new Color(0, 1, 1);
        this.track.strokeWidth = 2;

        this.knob = new Path.Rectangle(0,0, 30, 60);
        this.knob.fillColor = 'orange';
        this.knob.bounds.center = this.track.bounds.center;
        // this.knob.data.move_limmits = this.track.bounds;

        this.group = new Group(
            this.track,
            this.knob
        );
        this.group.pivot = this.track.bounds.center;
        this.group.position = this.position;
        this.group.rotation = this.rotation;

        // setup knob moving
        var track = this.track;
        var knob = this.knob;
        // var knob = this.group.children[1];
        // this.knob.onMouseDrag = function(event) {
        this.knob.onMouseDrag = function(event) {
            knob.position = track.getNearestPoint(event.point);
        };

        console.log("New Slider ready.");
        return this;
    },
    foo: function(){
         // custom function here
    }
});



var mySlider1 = new Slider(new Point(150,250), 0, 400);
var mySlider2 = new Slider(new Point(900,400), 0, 500);
var mySlider3 = new Slider(new Point(500,700), 45, 500);
