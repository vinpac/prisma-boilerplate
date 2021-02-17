const path = require('path')
const tsConfig = require(path.resolve('tsconfig.json'))
const tsConfigPaths = require('tsconfig-paths')

const paths = tsConfig.compilerOptions.paths

tsConfigPaths.register({
  baseUrl: tsConfig.compilerOptions.outDir,
  paths: Object.keys(paths).reduce(
    (agg, key) => ({
      ...agg,
      [key]: paths[key].map((p) =>
        p.replace(
          tsConfig.compilerOptions.baseUrl,
          tsConfig.compilerOptions.outDir,
        ),
      ),
    }),
    {},
  ),
})
