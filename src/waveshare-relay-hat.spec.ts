const { describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');

import { beforeEach } from 'node:test';
import { EMode, MockGpio } from './types';
import { EState, IOperationResult, WaveshareRelayHat } from './waveshare-relay-hat';

describe('constructor', () => {
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
});

describe('get, getAll, turnOn, turnOff, toggleOnOff', () => {
  let relayHat: WaveshareRelayHat;

  beforeEach(() => {
    relayHat = new WaveshareRelayHat({
      Gpio: MockGpio,
      channels: [
        { channelId: 'CH1', pinNo: 26, mode: EMode.OUTPUT },
        { channelId: 'CH2', pinNo: 20, mode: EMode.OUTPUT },
      ],
    });
  });

  it('gets an existing relay', () => {
    // Act
    const relay = relayHat.get('CH1');

    // Assert
    assert.ok(relay);
    assert.equal(relay.id, 'CH1');
    assert.equal(relay.channel.gpio, 26);
    assert.equal(relay.state, EState.OFF);
  });

  it('throws an error for a relay that cannot be found', () => {
    // Act & Assert
    assert.throws(() => relayHat.get('CH3'), new Error(`Invalid relay specified: CH3`));
  });

  it('gets all existing relays', () => {
    // Act
    const relays = relayHat.getAll();

    // Assert
    assert.ok(relays);
    assert.equal(relays.length, 2);
    assert.equal(relays[0].id, 'CH1');
    assert.equal(relays[0].channel.gpio, 26);
    assert.equal(relays[0].state, EState.OFF);
    assert.equal(relays[1].id, 'CH2');
    assert.equal(relays[1].channel.gpio, 20);
    assert.equal(relays[1].state, EState.OFF);
  });

  it('turns on an existing relay', () => {
    // Act
    const relay = relayHat.turnOn('CH1');

    // Assert
    assert.ok(relay);
    assert.equal(relay.id, 'CH1');
    assert.equal(relay.channel.gpio, 26);
    assert.equal(relay.state, EState.ON);
  });

  it('throws an error for a relay that cannot be turned on', () => {
    // Act & Assert
    assert.throws(() => relayHat.turnOn('CH3'), new Error(`Invalid relay specified: CH3`));
  });

  it('turns off an existing relay', () => {
    // Act
    const relay = relayHat.turnOff('CH1');

    // Assert
    assert.ok(relay);
    assert.equal(relay.id, 'CH1');
    assert.equal(relay.channel.gpio, 26);
    assert.equal(relay.state, EState.OFF);
  });

  it('throws an error for a relay that cannot be turned off', () => {
    // Act & Assert
    assert.throws(() => relayHat.turnOff('CH3'), new Error(`Invalid relay specified: CH3`));
  });

  it('toggles on and off an existing relay', () => {
    // Act
    let relay: IOperationResult;

    // Act & Assert
    relay = relayHat.toggleOnOff('CH1');
    assert.ok(relay);
    assert.equal(relay.id, 'CH1');
    assert.equal(relay.channel.gpio, 26);
    assert.equal(relay.state, EState.ON);
    relay = relayHat.toggleOnOff('CH1');
    assert.ok(relay);
    assert.equal(relay.id, 'CH1');
    assert.equal(relay.channel.gpio, 26);
    assert.equal(relay.state, EState.OFF);
    relay = relayHat.toggleOnOff('CH1');
    assert.ok(relay);
    assert.equal(relay.id, 'CH1');
    assert.equal(relay.channel.gpio, 26);
    assert.equal(relay.state, EState.ON);
  });

  it('throws an error for a relay that cannot be toggled on and off', () => {
    // Act & Assert
    assert.throws(() => relayHat.toggleOnOff('CH3'), new Error(`Invalid relay specified: CH3`));
  });
});
