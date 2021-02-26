/* eslint-disable no-console */
require('./helpers/loadEnv');

// eslint-disable-next-line import/first
import build from './prefetch';

const beginTime = Date.now();

build()
  .then(() => console.log(`Prefetch Finished. Total Time: ${(Date.now() - beginTime) / 1000}s`))
  .catch((err) => {
    console.log(`Prefetch Failed: ${err}.`);
    console.log(`Total Time: ${(Date.now() - beginTime) / 1000}s`);
  });
