const { it, mock } = require('node:test');
const assert = require('node:assert/strict');

import { IGpioConstructor } from './types';
import { EMode, WaveshareRelayHat } from './waveshare-relay-hat';

it('configures no channels', async () => {
  // Arrange
  const MockGpio = mock.fn();

  // Act
  new WaveshareRelayHat({ Gpio: MockGpio, channels: [] });

  // Assert
  assert.strictEqual(MockGpio.mock.calls.length, 0);
});

it('configures 3 channels correctly', async () => {
  // Arrange
  const MockGpio = mock.fn();

  // Act
  new WaveshareRelayHat({
    Gpio: MockGpio,
    channels: [
      { channelId: 'CH1', pinNo: 26, mode: EMode.OUTPUT },
      { channelId: 'CH2', pinNo: 20, mode: EMode.OUTPUT },
      { channelId: 'CH3', pinNo: 21, mode: EMode.OUTPUT },
    ],
  });

  // Assert
  assert.strictEqual(MockGpio.mock.calls.length, 3);
  assert.deepEqual(MockGpio.mock.calls[0].arguments, [26, { mode: EMode.OUTPUT }]);
  assert.deepEqual(MockGpio.mock.calls[1].arguments, [20, { mode: EMode.OUTPUT }]);
  assert.deepEqual(MockGpio.mock.calls[2].arguments, [21, { mode: EMode.OUTPUT }]);
});
