const path = require("path");

module.exports = {
    entry: "./src/index.js", //entry point for webpack
    output: {
        filename: "bundle.js", //outputfile
        path: path.resolve(__dirname, "dist"),
    },
    mode: "development",
};