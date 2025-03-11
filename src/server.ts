import express, { Request, Response } from 'express';

import { port, channels } from './config';
import { WaveshareRelayHat } from './waveshare-relay-hat';
import { MockGpio, type ChannelId } from './types';

const app = express();
const PORT = port || 3000;
let Gpio;
if (process.platform === 'linux') {
  Gpio = require('pigpio').Gpio;
} else {
  Gpio = MockGpio;
}
const relayHat = new WaveshareRelayHat({
  Gpio,
  channels,
});

const getChannelName = (channelId: string): string | undefined =>
  channels.find((channel) => channel.channelId === channelId)?.name;

app.get('/', (req: Request, res: Response) => {
  const result = Object.entries(relayHat._channels).map<{ id: string; pin: number; state: number }>(
    ([id, channel]) => ({
      id,
      pin: channel.gpio,
      state: channel.digitalRead(),
      name: getChannelName(id),
    })
  );
  res.json(result);
});

app.get('/:id', (req: Request, res: Response) => {
  const result = Object.entries(relayHat._channels)
    .map<{ id: string; pin: number; state: number }>(([id, channel]) => ({
      id,
      pin: channel.gpio,
      state: channel.digitalRead(),
      name: getChannelName(id),
    }))
    .filter(({ id }) => id === req.params.id);
  res.json(result);
});

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const isValidChannel = (id: string): id is ChannelId =>
  ['CH1', 'CH2', 'CH3', 'CH4', 'CH5', 'CH6', 'CH7', 'CH8', 'CH9'].includes(id);
