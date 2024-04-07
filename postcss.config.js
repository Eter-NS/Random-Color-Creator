import cssNanoPlugin from 'cssnano';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    postcssPresetEnv({
      stage: 3,
    }),
    autoprefixer(),
    cssNanoPlugin({
      preset: 'default',
    }),
  ],
};
