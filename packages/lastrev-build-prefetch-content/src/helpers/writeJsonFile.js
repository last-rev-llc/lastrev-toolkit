import jsonWrite from 'json-write';
import { createWriteStream } from 'fs';

export default (filename, content) => {
  const writer = jsonWrite();
  writer.pipe(createWriteStream(filename));
  writer.write(content);
  writer.end();
};
