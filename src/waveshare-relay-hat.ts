import { IGpioConstructor, IGpio, ChannelId, Level } from './types';

enum EState {
  ON = 'ON',
  OFF = 'OFF',
}

export enum EMode {
  OUTPUT = 1,
}

interface IOperationResult {
  id: ChannelId;
  channel: IGpio;
  state: EState;
}

export interface IChannelConfig {
  channelId: string;
  pinNo: number;
  mode: EMode;
  name?: string;
}

interface IConstructorParams {
  Gpio: IGpioConstructor;
  channels: IChannelConfig[];
}

/**
 * https://www.waveshare.com/wiki/RPi_Relay_Board
 */
class WaveshareRelayHat {
  // _pins: {CH1: IGpio, CH2: IGpio, CH3: IGpio};
  _channels: Record<string, IGpio>;

  constructor({ Gpio, channels }: IConstructorParams) {
    this._channels = channels.reduce<Record<string, IGpio>>((prev, { channelId, pinNo, mode }) => {
      prev[channelId] = new Gpio(pinNo, { mode });
      return prev;
    }, {});
  }

  /**
   * @param id
   */
  turnOn = (id: ChannelId): IOperationResult => {
    const channel = this._channels[id];

    if (channel) {
      channel.digitalWrite(1);
      console.debug(`Relay ${id} is now 'ON'`);
    } else {
      throw new Error(`Invalid relay specified: ${id}`);
    }

    return { id, channel, state: EState.ON };
  };

  /**
   * @param id
   */
  turnOff = (id: ChannelId): IOperationResult => {
    const channel = this._channels[id];

    if (channel) {
      channel.digitalWrite(0);
      console.debug(`Relay ${id} is now 'OFF'`);
    } else {
      throw new Error(`Invalid relay specified: ${id}`);
    }

    return { id, channel, state: EState.OFF };
  };

  /**
   * @param id
   */
  toggleOnOff = (id: ChannelId): IOperationResult => {
    const channel = this._channels[id];
    let targetState;

    if (channel) {
      const currentState = channel.digitalRead();
      targetState = currentState === 0 ? 1 : 0;
      channel.digitalWrite(targetState as Level);
      console.debug(`Relay ${id} is now '${targetState === 0 ? 'OFF' : 'ON'}'`);
    } else {
      throw new Error(`Invalid relay specified: ${id}`);
    }

    return { id, channel, state: targetState === 0 ? EState.OFF : EState.ON };
  };
}

export { WaveshareRelayHat };
