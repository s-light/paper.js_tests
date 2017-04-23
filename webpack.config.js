var webpack = require('webpack');
var path = require('path');

module.exports = function(env) {
    return {
        devtool: "source-map",
        // externals: {
        //     osc: 'osc'
        // },
        entry: {
            animation_simple: './js/animation_simple.js',
        },
        output: {
            filename: '[name].js',
            // filename: '[name].[chunkhash].js',
            path: path.resolve(__dirname, 'dist')
        },
        // based on:
        // https://webpack.js.org/guides/code-splitting-libraries/#manifest-file
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module) {
                   // this assumes your vendor imports exist in the node_modules directory
                   return module.context && module.context.indexOf('node_modules') !== -1;
                }
            }),
            // CommonChunksPlugin will now extract all the
            // common modules from vendor and main bundles
            // But since there are no more common modules between them we end
            // up with just the runtime code included in the manifest file
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest'
            })
        ]
    };
};
