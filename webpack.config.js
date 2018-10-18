//  build options

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const PurifyCSSPlugin = require("purifycss-webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

////////////////////
const isProd = process.env.NODE_ENV === "production" ? true : false; // true or false
console.log("Starting " + (isProd ? "production" : "development") + " build");
/////////////////

module.exports = {
  devtool: "cheap-module-eval-source-map",

  //  the entry file
  entry: {
    app: ["./src/app.js"],
    demo: ["./src/js/demo.js"],
    contact: ["./src/js/contact.js"],
    fontawesome: "font-awesome/scss/font-awesome.scss",
    bootstrap: "./src/scss/main.scss"
  },

  //  the destination file/folder
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js"
  },

  resolve: {
    extensions: [".js", ".jsx"]
  },

  module: {
    loaders: [
      {
        test: /.jsx?$/, // Match both .js and .jsx
        loaders: ["react-hot", "babel-loader"],
        include: path.join(__dirname, "src")
      },
      { test: /\.html$/, loader: "html" }
    ],
    rules: [
      {
        test: /\.(html)$/,
        use: ["html-loader"]
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: "style-loader" // inject CSS to page
          },
          {
            loader: "css-loader" // translates CSS into CommonJS modules
          },
          {
            loader: "postcss-loader", // Run post css actions
            options: {
              plugins: function() {
                // post css plugins, can be exported to postcss.config.js
                return [require("precss"), require("autoprefixer")];
              }
            }
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      },
      {
        test: /.jsx?$/, // Match both .js and .jsx
        exclude: /node_modules/,
        loader: ["babel-loader"]
        // isProd ?  'eval-cheap-module-source-map' : 'source-map',
      },

      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          "file-loader?name=img/[name].[ext]", // use "file-loader" and them images as they are named and their extension to the set output path
          //"file-loader?name=[name].[ext]&outputPath=img/&publicPath=img/", // use "file-loader" and them images as they are named and their extension to the set custom output path
          "image-webpack-loader" //  Minify PNG, JPEG, GIF, SVG images with image min
        ]
      },
      // font-awesome
      {
        test: /font-awesome\.config\.js/,
        use: [{ loader: "style-loader" }, { loader: "font-awesome-loader" }]
      },
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      {
        test: /\.(woff2?)$/,
        loader: "url-loader?limit=10000&name=fonts/[name].[ext]"
      },

      {
        test: /\.(ttf|eot)$/,
        loader: "file-loader?name=fonts/[name].[ext]"
      },

      // // Bootstrap 3
      // {
      //   test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
      //   loader: "imports-loader?jQuery=jquery"
      // }

      // Bootstrap 4
      {
        test: /bootstrap\/dist\/js\/umd\//,
        use: "imports-loader?jQuery=jquery"
      }
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true, //  Enable gzip compression for everything served
    stats: "errors-only", //  This option lets you precisely control what bundle information gets displayed
    hot: true //  a feature to inject updated modules into the active runtime
    //open: true                //  open a new window
  },

  plugins: [
    new HtmlWebpackPlugin({
      // Generate a index.html
      title: "index",
      // minify: {
      //     collapseWhitespace: true,    // minify html
      //         removeComments: true,
      //         collapseWhitespace: true,
      //         removeRedundantAttributes: true,
      //         useShortDoctype: true,
      //         removeEmptyAttributes: true,
      //         removeStyleLinkTypeAttributes: true,
      //         keepClosingSlash: true,
      //         minifyJS: true,
      //         minifyCSS: true,
      //         minifyURLs: true
      // },

      /*
            devtool: "eval-cheap-module-source-map" offers SourceMaps that only maps lines (no column mappings) and are much faster
            devtool: "source-map" cannot cache SourceMaps for modules and need to regenerate complete SourceMap for the chunk. It’s something for production.
            */
      //https://webpack.github.io/docs/build-performance.html#sourcemaps
      devtool: isProd ? "eval-source-map" : "source-map",
      hash: true, // append a unique webpack compilation hash to all included scripts and CSS files. This is useful for cache busting and chnages on each build.
      //cache: true,
      excludeChunks: ["contact", "demo"], // do not include "contact.js" in the html
      // filename: "./../index.html",  // set the creation file in the root folder
      template: "./src/index.html" // Load a custom template (ejs by default see the FAQ for details)
    }),

    new HtmlWebpackPlugin({
      // Generate a contact page dyanmically
      title: "Contact Page",
      hash: true,
      chunks: ["contact"], // only include "contact.js" in the html
      filename: "contact.html",
      template: "./src/contact.html" // Load a custom template (ejs by default see the FAQ for details)
    }),

    new HtmlWebpackPlugin({
      // Generate a contact page dyanmically
      title: "Demo Page",
      hash: true,
      chunks: ["demo"], // only include "demo.js" in the html
      filename: "demo.html",
      template: "./src/demo.html" // Load a custom template (ejs by default see the FAQ for details)
    }),

    new ExtractTextPlugin({
      //  It moves all the required *.css modules in entry chunks into a separate CSS file. So your styles are no longer inlined into the JS bundle, but in a separate CSS file (styles.css)
      filename: "/css/[name].css",
      disable: !isProd,
      allChunks: true
    }),

    new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement (HMR) exchanges, adds, or removes modules while an application is running, without a full reload
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      tether: "tether",
      Tether: "tether",
      "window.Tether": "tether",
      Popper: ["popper.js", "default"],
      "window.Tether": "tether",
      Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      Button: "exports-loader?Button!bootstrap/js/dist/button",
      Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      Util: "exports-loader?Util!bootstrap/js/dist/util"
    }),
    new webpack.NamedModulesPlugin(), //  This plugin will cause the relative path of the module to be displayed when HMR is enabled

    // Make sure this is after ExtractTextPlugin!
    // new PurifyCSSPlugin({
    //   // Give paths to parse for rules. These should be absolute!
    //   // path to the html file, and only related css to this html file will be included
    //   paths: glob.sync(path.join(__dirname, "./src/*.html"))
    // }),

    new BundleAnalyzerPlugin({
      // Can be `server`, `static` or `disabled`.
      // In `server` mode analyzer will start HTTP server to show bundle report.
      // In `static` mode single HTML file with bundle report will be generated.
      // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
      analyzerMode: isProd ? "disabled" : "server",
      // Host that will be used in `server` mode to start HTTP server.
      analyzerHost: "127.0.0.1",
      // Port that will be used in `server` mode to start HTTP server.
      analyzerPort: 8888,
      // Path to bundle report file that will be generated in `static` mode.
      // Relative to bundles output directory.
      reportFilename: "report.html",
      // Module sizes to show in report by default.
      // Should be one of `stat`, `parsed` or `gzip`.
      // See "Definitions" section for more information.
      defaultSizes: "parsed",
      // Automatically open report in default browser
      openAnalyzer: isProd ? false : true,
      // If `true`, Webpack Stats JSON file will be generated in bundles output directory
      generateStatsFile: isProd ? false : true,
      // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
      // Relative to bundles output directory.
      statsFilename: "stats.json",
      // Options for `stats.toJson()` method.
      // For example you can exclude sources of your modules from stats file with `source: false` option.
      // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
      statsOptions: null,
      // Log level. Can be 'info', 'warn', 'error' or 'silent'.
      logLevel: "info"
    })
  ]
};
