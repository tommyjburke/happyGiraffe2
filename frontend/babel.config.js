// module.exports = function (api) {
//    api.cache(true)

//    const presets = ['@babel/preset-env']

//    return {
//       presets,
//    }
// }

// babel.config.js
// module.exports = {
//    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow'],
//    plugins: ['babel-plugin-styled-components', '@babel/plugin-proposal-class-properties'],
// }

module.exports = {
   presets: [
      '@babel/preset-react',
      [
         '@babel/preset-env',
         {
            targets: { esmodules: false, node: 'current' },
         },
      ],
      //   '@babel/preset-flow',
   ],
   plugins: [
      ['@babel/plugin-transform-modules-commonjs'],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties'],
   ],
}
