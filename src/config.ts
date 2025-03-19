import dotenv from 'dotenv';

import { integer, json } from './env-asserts';
import type { IChannelConfig } from './types';

const envFilePath = process.env.ENV_FILE_PATH;

dotenv.config({ path: envFilePath });

export const channels = json<IChannelConfig[]>('RELAY_HAT_CHANNELS');

export const port = integer('PORT');
