import { promisify } from 'util';
import { exists as e, unlink as u } from 'fs';

const exists = promisify(e);
const unlink = promisify(u);

const unlinkIfExists = async (dir: string): Promise<void> => {
  try {
    if (await exists(dir)) {
      await unlink(dir);
    }
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.code !== 'EEXIST') throw Error(err);
  }
};

export default unlinkIfExists;
