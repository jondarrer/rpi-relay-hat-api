import express, { Request, Response } from 'express';

import { useMockGpio, channels } from './config';
import { WaveshareRelayHat } from './waveshare-relay-hat';
import { MockGpio, type ChannelId } from './types';
import { systemInfo } from './system-info';

const app = express();
let Gpio;
if (useMockGpio) {
  Gpio = MockGpio;
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Gpio = require('pigpio').Gpio;
}
const relayHat = new WaveshareRelayHat({
  Gpio,
  channels,
});

/**
 * Gets the name of the relay channel by its id
 * @param channelId
 * @returns
 */
const getChannelName = (channelId: string): string | undefined =>
  channels.find((channel) => channel.channelId === channelId)?.name;

/**
 * Gets the current state for all relay channels
 */
app.get('/', (req: Request, res: Response) => {
  const result = relayHat.getAll().map<{ id: string; pin: number; state: number }>(({ id, channel }) => ({
    id,
    pin: channel.gpio,
    state: channel.digitalRead(),
    name: getChannelName(id),
  }));
  res.json(result);
});

/**
 * Provides details of the system
 */
app.get('/sys-info', (req: Request, res: Response) => {
  const sysInfo = systemInfo();
  console.debug(new Date(), sysInfo);
  res.json(sysInfo);
});

/**
 * Gets the state for an individual relay channel
 */
app.get('/:id', (req: Request, res: Response) => {
  try {
    const { id, channel, state } = relayHat.get(req.params.id as ChannelId);
    return res.json({ id, pin: channel.gpio, state, name: getChannelName(id) });
  } catch {
    console.error(new Date(), new Error(`Unable to find relay ${req.params.id}`));
    return res.json({ error: `Unable to find relay ${req.params.id}` });
  }
});

/**
 * Turns a relay channel on
 */
app.post('/:id/on', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidChannel(id)) {
    return res.send(`Unsupported channel ${id}`);
  }

  const result = relayHat.turnOn(id);
  res.send({
    id: result.id,
    pin: result.channel.gpio,
    state: result.channel.digitalRead(),
    name: getChannelName(id),
  });
});

/**
 * Turns a relay channel off
 */
app.post('/:id/off', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidChannel(id)) {
    return res.status(400).send(`Unsupported channel ${id}`);
  }

  const result = relayHat.turnOff(id);
  res.send({
    id: result.id,
    pin: result.channel.gpio,
    state: result.channel.digitalRead(),
    name: getChannelName(id),
  });
});

/**
 * Toggles a relay channel on and off, inverting its previous state
 */
app.post('/:id/toggle', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidChannel(id)) {
    return res.status(400).send(`Unsupported channel ${id}`);
  }

  const result = relayHat.toggleOnOff(id);
  res.send({
    id: result.id,
    pin: result.channel.gpio,
    state: result.channel.digitalRead(),
    name: getChannelName(id),
  });
});

export const server = app;

const isValidChannel = (id: string): id is ChannelId =>
  ['CH1', 'CH2', 'CH3', 'CH4', 'CH5', 'CH6', 'CH7', 'CH8', 'CH9'].includes(id);
