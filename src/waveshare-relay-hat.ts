import type { IGpioConstructor, IGpio, IChannelConfig, ChannelId, Level } from './types';

export enum EState {
  ON = 'ON',
  OFF = 'OFF',
}

export interface IOperationResult {
  id: ChannelId;
  channel: IGpio;
  state: EState;
}

interface IConstructorParams {
  Gpio: IGpioConstructor;
  channels: IChannelConfig[];
}

/**
 * https://www.waveshare.com/wiki/RPi_Relay_Board
 */
class WaveshareRelayHat {
  _channels: Record<string, IGpio>;

  constructor({ Gpio, channels }: IConstructorParams) {
    this._channels = channels.reduce<Record<string, IGpio>>((prev, { channelId, pinNo, mode }) => {
      prev[channelId] = new Gpio(pinNo, { mode });
      return prev;
    }, {});
  }

  /**
   * Gets a single relay channel
   * @param id
   * @throws Errors if the relay cannot be found
   */
  get = (id: ChannelId): IOperationResult => {
    const channel = this._channels[id];
    let state: Level;

    if (channel) {
      state = channel.digitalRead();
    } else {
      throw new Error(`Invalid relay specified: ${id}`);
    }

    return { id, channel, state: state === 0 ? EState.OFF : EState.ON };
  };

  /**
   * Gets all available relay channels
   */
  getAll = (): IOperationResult[] =>
    Object.entries(this._channels).map<{ id: ChannelId; channel: IGpio; state: EState }>(([id, channel]) => ({
      id: id as ChannelId,
      channel,
      state: channel.digitalRead() === 0 ? EState.OFF : EState.ON,
    }));

  /**
   * Turns on a single relay channel
   * @param id
   * @throws Errors if the relay cannot be found
   */
  turnOn = (id: ChannelId): IOperationResult => {
    const channel = this._channels[id];

    if (channel) {
      channel.digitalWrite(1);
      console.debug(new Date(), `Relay ${id} is now 'ON'`);
    } else {
      throw new Error(`Invalid relay specified: ${id}`);
    }

    return { id, channel, state: EState.ON };
  };

  /**
   * Turns off a single relay channel
   * @param id
   * @throws Errors if the relay cannot be found
   */
  turnOff = (id: ChannelId): IOperationResult => {
    const channel = this._channels[id];

    if (channel) {
      channel.digitalWrite(0);
      console.debug(new Date(), `Relay ${id} is now 'OFF'`);
    } else {
      throw new Error(`Invalid relay specified: ${id}`);
    }

    return { id, channel, state: EState.OFF };
  };

  /**
   * Toggles on and off a single relay channel, inverting its previous state
   * @param id
   * @throws Errors if the relay cannot be found
   */
  toggleOnOff = (id: ChannelId): IOperationResult => {
    const channel = this._channels[id];
    let targetState;

    if (channel) {
      const currentState = channel.digitalRead();
      targetState = currentState === 0 ? 1 : 0;
      channel.digitalWrite(targetState as Level);
      console.debug(new Date(), `Relay ${id} is now '${targetState === 0 ? 'OFF' : 'ON'}'`);
    } else {
      throw new Error(`Invalid relay specified: ${id}`);
    }

    return { id, channel, state: targetState === 0 ? EState.OFF : EState.ON };
  };
}

export { WaveshareRelayHat };
