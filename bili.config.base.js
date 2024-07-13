const config = {
  plugins: {
    typescript2: {
      tsconfigOverride: {
        include: ["src"],
        exclude: ["**/*.test.ts"]
      }
    }
  },
  input: "src/index.ts",
  output: {
    format: ["umd", "umd-min", "esm"],
    moduleName: "ADNotations",
    sourceMap: false,
    fileName: (context, defaultFileName) => {
      switch (context.format) {
        case "umd":
          return context.minify ? "ad-notations.min.js" : "ad-notations.umd.js"
        case "esm":
          return "ad-notations.esm.js"
        default:
          return defaultFileName
      }
    }
  }
}

export default config
