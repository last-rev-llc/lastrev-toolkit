/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import jsonWrite from 'json-write';
import { createWriteStream } from 'fs';

export default (filename: string, content: unknown): void => {
  const writer = jsonWrite();
  writer.pipe(createWriteStream(filename));
  writer.write(content);
  writer.end();
};
