const path = require("path");
module.exports = {
    entry: {
        icons:'./src/js/icons.js'
    },
    output: {
        path: path.resolve(__dirname,'dist/js'),
        filename: "[name].bundle.js"
    },
    mode:"production",
    module: {
        rules: [
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 19999
                        }
                    }
                ]
            },
            {
                test:/\.js$/,
                use:{
                    loader:"babel-loader",
                    options:{
                        presets:[
                            "env"
                        ]
                    }
                },
                exclude:path.resolve(__dirname,"node_modules"),
                include:path.resolve(__dirname,"src")
            }
        ]
    }
};