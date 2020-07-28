import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { PROJECT_ROOT } from '../constants';

dotenv.config({ path: resolve(PROJECT_ROOT, './.env') });
