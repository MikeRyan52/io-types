module.exports = function(config) {
  config.set({
    // ... normal karma configuration
    basePath: './',
    frameworks: ['mocha', 'sinon-chai'],
    browsers: ['Chrome'],
    files: [
      // all files ending in "_test"
      'lib/*.spec.ts',
      'lib/**/*.spec.ts'
      // each file acts as entry point for the webpack configuration
    ],

    preprocessors: {
      // add webpack as preprocessor
      'lib/*.spec.ts': ['webpack'],
      'lib/**/*.spec.ts': ['webpack']
    },

    webpack: {
      resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
      },
      module: {
        loaders: [
          // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
          { test: /\.tsx?$/, loader: 'babel?presets[]=es2015!ts-loader?ignoreDiagnostics[]=2300&ignoreDiagnostics[]=2661&ignoreDiagnostics[]=2375' }
        ]
      }
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      noInfo: true
    }

  });
};
