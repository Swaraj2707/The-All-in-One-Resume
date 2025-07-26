const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  resolve: {
    alias: {
      "pdfjs-dist": path.resolve(__dirname, "node_modules/pdfjs-dist/legacy/build"),
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js"),
          to: "pdf.worker.min.js",
        },
      ],
    }),
  ],
};
