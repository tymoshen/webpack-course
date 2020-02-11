const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    };

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ];
    }

    return config;
};

const cssLoaders = ext => {
    let loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: isDev, reloadAll: true }
        },
        "css-loader"
    ];

    if (ext) {
        loaders.push(`${ext}-loader`);
    }

    return loaders;
};

const babelOptions = preset => {
    let opts = {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-class-properties"]
    };

    if (preset) {
        opts.presets.push(preset);
    }

    return opts;
};

const plugins = () => {
    let base = [
        new HTMLWebpackPlugin({
            template: "./template.html",
            minify: { collapseWhitespace: isProd }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve("src/assets/images", "favicon.png"),
                to: path.resolve(__dirname, "dist")
            }
        ]),
        new MiniCssExtractPlugin({ filename: assetName("css") })
    ];

    if (isProd) {
        base.push(new BundleAnalyzerPlugin());
    }

    return base;
};

const assetName = ext =>
    isProd ? `[name].[contenthash].${ext}` : `[name].${ext}`;

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main: ["@babel/polyfill", "./main.jsx"],
        analytics: "Analytics/analytics.ts"
    },
    output: {
        filename: assetName("js"),
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        alias: {
            Modules: path.resolve(__dirname, "src/modules"),
            Analytics: path.resolve(__dirname, "src/analytics"),
            Styles: path.resolve(__dirname, "src/styles"),
            Images: path.resolve(__dirname, "src/assets/images"),
            Data: path.resolve(__dirname, "src/assets/data")
        }
    },
    optimization: optimization(),
    devServer: { port: 4200, hot: isDev },
    devtool: isDev ? "source-map" : "",
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: babelOptions()
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: babelOptions("@babel/preset-typescript")
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: babelOptions("@babel/preset-react")
                }
            },
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders("less")
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders("sass")
            },
            {
                test: /\.(svg|jpg|png|gif)$/,
                loader: "file-loader"
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ["file-loader"]
            }
        ]
    }
};
