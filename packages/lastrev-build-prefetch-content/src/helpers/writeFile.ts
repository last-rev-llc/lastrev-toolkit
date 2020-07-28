import { promisify } from 'util';
import { writeFile as w } from 'fs';

const writeFile = promisify(w);

export default writeFile;
