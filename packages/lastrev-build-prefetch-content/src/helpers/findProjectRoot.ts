import { existsSync } from 'fs';
import { join, resolve } from 'path';

// Simple version of `find-project-root`
// https://github.com/kirstein/find-project-root/blob/master/index.js

const MARKERS = ['.git', '.hg', 'package.json'];

const markerExists = (directory) => MARKERS.some((mark) => existsSync(join(directory, mark)));

const findProjectRoot = (directory = process.cwd()): string => {
  while (!markerExists(directory)) {
    const parentDirectory = resolve(directory, '..');
    if (parentDirectory === directory) {
      break;
    }
    // eslint-disable-next-line no-param-reassign
    directory = parentDirectory;
  }

  return directory;
};

export default findProjectRoot;
