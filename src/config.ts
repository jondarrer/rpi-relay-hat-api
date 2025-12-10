import dotenv from 'dotenv';

import { integer, json, optional, boolean } from './env-asserts';
import type { IChannelConfig } from './types';

const envFilePath = process.env.ENV_FILE_PATH;

dotenv.config({ path: envFilePath });

export const channels = json<IChannelConfig[]>('RELAY_HAT_CHANNELS');

export const port = optional(integer, 'PORT', 3000);

export const useMockGpio = optional(boolean, 'USE_MOCK_GPIO', false);
