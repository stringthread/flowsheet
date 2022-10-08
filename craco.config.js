module.exports = {
  babel: {
    presets: [['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }]],
    plugins: ['@emotion/babel-plugin'],
  },
  jest: {
    configure: {
      silent: false,
      verbose: false,
    },
  },
};
