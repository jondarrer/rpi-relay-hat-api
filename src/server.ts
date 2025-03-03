import express, { Request, Response } from 'express';

import { WaveshareRelayHat } from './waveshare-relay-hat';
import { IGpio, MockGpio, ChannelId } from './types';

const app = express();
const PORT = process.env.PORT || 3000;
let Gpio;
if (process.platform === "linux") {
  Gpio = require("pigpio").Gpio;
} else {
  Gpio = MockGpio;
}
const relayHat = new WaveshareRelayHat(Gpio);

app.get('/', (req: Request, res: Response) => {
  const result = Object.entries(relayHat._pins).map<{id: string, pin: number, state: number}>(([id, pin]) => ({
    id,
    pin: pin.gpio,
    state: pin.digitalRead()
  }))
  res.json(result);
});

app.get('/:id', (req: Request, res: Response) => {
  const result = Object.entries(relayHat._pins).filter(([id]) => id === req.params.id).map<{id: string, pin: number, state: number}>(([id, pin]) => ({
    id,
    pin: pin.gpio,
    state: pin.digitalRead()
  }))
  res.json(result);
});

app.post('/:id/on', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidChannel(id)) {
    return res.send(`Unsupported channel ${id}`);
  }
  
  const result = relayHat.turnOn(id);
  res.send({ id: result.id, pin: result.pin.gpio, state: result.pin.digitalRead() });
});

app.post('/:id/off', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidChannel(id)) {
    return res.status(400).send(`Unsupported channel ${id}`);
  }
  
  const result = relayHat.turnOff(id);
  res.send({ id: result.id, pin: result.pin.gpio, state: result.pin.digitalRead() });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const isValidChannel = (id: string): id is ChannelId => ['CH1', 'CH2', 'CH3'].includes(id);