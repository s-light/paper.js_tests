# paper.js_tests
random tests with paper.js
(http://paperjs.org/)

this project uses [yarnpackage-manager](https://yarnpkg.com/) and the [webpack](https://webpack.js.org/) bundling system.

clone or download this repository.  
then install dependencies with [yarn](https://yarnpkg.com/):  
`paper.js-examples$ yarn`

after this you can build the script bundle with  
`./node_modules/webpack/bin/webpack.js --progress`  
or  
`./node_modules/webpack/bin/webpack.js --progress --watch`  
for automatically rebuilds on file changes.


eventually it is better to use some sort of webserver to view the examples:  
for example [python2 SimpleHTTPServer](https://docs.python.org/2/library/simplehttpserver.html)  
`tuio.js-examples$ python2 -m SimpleHTTPServer 8000`  
or [python3 http.server](https://docs.python.org/3.6/library/http.server.html)  
`tuio.js-examples$ python3 -m http.server 8000`   

then go to http://localhost:8000  
there you will get a basic directory listing. search for the example you want to try.  

---
the different examples & tests require/use one ore more of these other projects:
- [paper.js](http://paperjs.org/)
- [animatePaper.js](http://eartz.github.io/animatePaper.js/)
- [interactjs](http://interactjs.io/)
- [stats.js](https://github.com/mrdoob/stats.js)

some of the examples are development-tests for the libraries.
so they only work with linked dependencies to the current github master repository versions.
