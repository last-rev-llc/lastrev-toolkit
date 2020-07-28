/* eslint-disable no-console */
require('./helpers/loadEnv');

// eslint-disable-next-line import/first
import build from './prefetch';

build()
  .then(() => console.log('Successfully wrote content files'))
  .catch((err) => {
    console.log('Unable to write content files:', err);
  });
