const path = require("path");

module.exports = {
    target: "node",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'lib.js',
        library: "js_container",
        libraryTarget: 'commonjs2'
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader"
            }
        ]
    }
}