import { promises as fsPromises, existsSync } from 'fs';

const { mkdir } = fsPromises;

const mkdirIfNotExists = async (dir: string): Promise<void> => {
  try {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.code !== 'EEXIST') throw Error(err);
  }
};

export default mkdirIfNotExists;
