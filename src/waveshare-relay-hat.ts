import { IGpioConstructor, IGpio, ChannelId } from './types';

enum EState {
  ON = 'ON',
  OFF = 'OFF',
}
interface IOperationResult {
  id: ChannelId,
  pin: IGpio,
  state: EState
}

/**
 * https://www.waveshare.com/wiki/RPi_Relay_Board
 */
class WaveshareRelayHat {
  _pins: {CH1: IGpio, CH2: IGpio, CH3: IGpio};

  constructor(Gpio: IGpioConstructor) {
    this._pins = {
      CH1: new Gpio(26, { mode: Gpio.OUTPUT }),
      CH2: new Gpio(20, { mode: Gpio.OUTPUT }),
      CH3: new Gpio(21, { mode: Gpio.OUTPUT }),
    };
  }

  /**
   * @param id 
   */
  turnOn = (id: ChannelId): IOperationResult => {
    const pin = this._pins[id];

    if (pin) { 
      pin.digitalWrite(1);
      console.debug(`Relay ${id} is now 'ON'`);
    } else {
      throw new Error(`Invalid relay specified: ${id}`);
    }

    return { id, pin, state: EState.ON };
  }

  /**
   * @param id 
   */
  turnOff = (id: ChannelId): IOperationResult => {
    const pin = this._pins[id];

    if (pin) { 
      pin.digitalWrite(0);
      console.debug(`Relay ${id} is now 'OFF'`);
    } else {
      throw new Error(`Invalid relay specified: ${id}`);
    }

    return { id, pin, state: EState.OFF };
  }
}

export { WaveshareRelayHat };