/* eslint-disable no-console */
require('./helpers/loadEnv');
// eslint-disable-next-line import/first
import realFs from 'fs';
import gracefulFs from 'graceful-fs';
import build from './prefetch';

// Fixes windows EMFILE issues
gracefulFs.gracefulify(realFs);

const beginTime = Date.now();

build()
  .then(() => console.log(`Prefetch Finished. Total Time: ${(Date.now() - beginTime) / 1000}s`))
  .catch((err) => {
    console.log(`Prefetch Failed: ${err.message}.`, err.stack || '');
    console.log(`Total Time: ${(Date.now() - beginTime) / 1000}s`);
  });
