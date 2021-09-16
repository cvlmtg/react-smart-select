import livereload from 'rollup-plugin-livereload';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { babel } from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
  input:  'demo/app.js',
  output: {
    file:   'public/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    replace({
      preventAssignment: true,
      values:            {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    }),
    babel({
      babelHelpers: 'bundled',
      presets:      [
        '@babel/preset-react'
      ]
    }),
    commonjs(),
    serve({
      contentBase: [ 'public' ],
      openPage:    '/index.html',
      host:        'localhost',
      port:        3000,
      open:        true
    }),
    livereload({ watch: 'dist' })
  ]
};
