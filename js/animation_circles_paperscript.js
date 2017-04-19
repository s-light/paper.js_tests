
// this sketch online:
// http://sketch.paperjs.org/#S/tVZtb9owEP4rVr40bFFIgKhr0D4hrV82aWon7QNByDgGMoIdOaZbVfHf58sLsWkCqbaiqpLPz91zvrfci8Xwnlqh9bijkmwtxyI8hjPhLOcpdVO+sSMrwxkVv3L0REWecBZGloMKmVtJBtOIRewJC7R/xlmGPqOXYyEqju5G8EO2jLnMl/tnQpmkQkEY/Y2+84RJex54noPGnrdoDK0w2YEei2sollv3UWJhv0QMqV9pKESdHE6Jy4AjD5E/qQQCx8kh95Uk8AzRKESTcS3KpeA7OuMpVxw3q/RAb4ybn0kst5XVY+M3SQRJ6dLTvZ4VsnO/5379asOJEJ28WidpWjsgaPwWfr8H//gd+Uc9+IN35B/34L99R/5JD/67/81fetB0QuXDPQjsecVe1adjHH3zODKPY/MIjIua8ZxzmdK1nNU93sjVKCE4/cHvU77CqV0a1K5X0OoKddKOtKmimRfJZvsP9jX1msCcda0vgYHXegEWOvV1LtOAdqNVDmcSJ4yK5ZamWTMioYIeKJGYbZoikjz7qrwoushBflNEKy4l3z8AAZQY3I6aW62i5p47cRAou+qf5waLa+U1HHY91XxeFWtQ6laZ1a81dU/itxnpzFUboq/Nzvy1QvRv4D20spI+qjRBF1ZJK6OrRCr6jQR+c8h0kRjbL5ICfwNIyyl1F6GuX4KDPugS61/B+hp2cgHqmdBPl8yesLXDd/3Qg6JKdehCVWXrzFsS0G1ivqlSEZ6npTLGVQoTFra3d4WJaS4ThiXsPh1t7NT+nHexq+0RxsAqHVU6WuNcxb7eqAzctGXjIpesrQ+MwLMQZ1+EWgVt+qSeM6iDB6Hl63VOpTLwDQZRnrAS4xLVnxIN1QdsgD6g22B6rjLq1vED0Am86asxnfE8AYfcP0q7c7NTtx8rlsrEcIjWXBCKBFWfAXJIVbbYRmGakTesS6HWaJs6J3R7xM68NfPVHnqldYyYWq1XguJduYxa4Xxx/As=

console.log("paperjs version:", paper.version);

var my_this = {};

my_this.group_dots_mycenter = new Point([500, 300]);

var background = new Path.Star({
    center: my_this.group_dots_mycenter,
    points: 14,
    radius1: 150,
    radius2: 430,
    strokeColor: 'blue',
    strokeWidth: 14,
});

var circle_0 = new Path.Circle({
    center: [100, 300],
    radius: 50,
    fillColor: 'orange',
    strokeWidth: 14,
});

var circle_1 = new Path.Circle({
    center: [300, 300],
    radius: 50,
    fillColor: 'orange',
    strokeWidth: 14,
});

var circle_2 = new Path.Circle({
    center: [500, 300],
    radius: 50,
    fillColor: 'orange',
    strokeWidth: 14,
});

var circle_3 = new Path.Circle({
    center: [700, 300],
    radius: 50,
    fillColor: 'orange',
    strokeWidth: 14,
});

var circle_4 = new Path.Circle({
    center: [900, 300],
    radius: 50,
    fillColor: 'orange',
    strokeWidth: 14,
});


my_this.group_dots = new Group([
    circle_0,
    circle_1,
    circle_2,
    circle_3,
    circle_4,
]);



var group_dots_leftCenter = my_this.group_dots.localToGlobal(
    my_this.group_dots.bounds.leftCenter
);

var group_dots_rightCenter = my_this.group_dots.localToGlobal(
    my_this.group_dots.bounds.rightCenter
);

console.log("group_dots_leftCenter", group_dots_leftCenter);
console.log("group_dots_rightCenter", group_dots_rightCenter);

var container_helper = new Path.Rectangle({
    topLeft: [50, 100],
    bottomRight: [950, 200],
    fillColor: [0.4, 0, 1.0, 0.5],
    strokeWidth: 14,
});

//console.log("group_dots", group_dots.bounds);
//console.log("group_dotsContainer", group_dotsContainer.bounds);
//console.log("group_dotsContainer_leftCenter", group_dotsContainer_leftCenter);
//console.log("group_dotsContainer_rightCenter", group_dotsContainer_rightCenter);

var myGradientStops = {
        stops: [
            [new Color(1, 0, 0, 0), 0.0],
            [new Color(1, 0, 0, 0.1), 0.05],
            [new Color(1, 0, 0, 1), 0.15],
            [new Color(1, 1, 0, 1), 0.4],
            [new Color(0, 1, 0, 1), 0.85],
            [new Color(0, 1, 0, 0.1), 0.95],
            [new Color(0, 1, 0, 0), 1.0],
        ]
};


my_this.group_dots_color = {
    gradient: myGradientStops,
    origin: group_dots_leftCenter,
    destination: group_dots_rightCenter,
};

container_helper.strokeColor = my_this.group_dots_color;
my_this.group_dots.strokeColor = my_this.group_dots_color;

function onFrame(event) {
    var offset = Math.sin(event.count / 30) * 75;
    my_this.group_dots.position.x = my_this.group_dots_mycenter.x + offset;
    // force recalculating of fillColor/gradient
    //group_dotsContainer.fillColor = group_dots_color;
    my_this.group_dots.strokeColor = my_this.group_dots_color;
}
