// show fps with help from
// https://github.com/mrdoob/stats.js

import Stats from 'stats.js';

export default class ShowFPS {
    constructor() {
        // ******************************************
        // display some stats
        // https://github.com/mrdoob/stats.js
        this.stats = new Stats();
        // 0: fps, 1: ms, 2: mb, 3+: custom
        this.stats.showPanel(0);
        this.stats.dom.style.left = 'auto';
        this.stats.dom.style.right = 0;
        document.body.appendChild( this.stats.dom );

        requestAnimationFrame( () => {this.animate();} );
    }

    animate() {
        // this.stats.begin();
        // // monitored code goes here
        // this.stats.end();
        this.stats.update();
        requestAnimationFrame( () => {this.animate();} );
    }
}

// Only executed our code once the DOM is ready.
window.addEventListener("load", function(event) {
    const myShowFPS = new ShowFPS();
});
