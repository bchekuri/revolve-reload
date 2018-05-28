'use strict'

var path = require("path");

module.exports = {
    entry: "./public/options.js",
    output: {
        path: path.join(__dirname, './bundle/js'),
        filename: "options.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src/client/js")
                ],
                loader: "file",
            }
        ]
    }
};