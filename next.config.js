const withSass = require('@zeit/next-sass');

module.exports = withSass({
  exportTrailingSlash: true,
  cssModules: true,
  exportPathMap: function() {
    return {
      "/": { page: "/" }
    };
  },
});
