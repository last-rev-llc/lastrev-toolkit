import { promisify } from 'util';
import { exists as e, mkdir as m } from 'fs';

const exists = promisify(e);
const mkdir = promisify(m);

const mkdirIfNotExists = async (dir: string): Promise<void> => {
  try {
    if (!(await exists(dir))) {
      await mkdir(dir, { recursive: true });
    }
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.code !== 'EEXIST') throw Error(err);
  }
};

export default mkdirIfNotExists;
