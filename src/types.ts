interface IGpioConstructor {
  /**
   * Returns a new Gpio object for accessing a GPIO
   * @param gpio An unsigned integer specifying the GPIO number
   * @param options (optional)
   */
  new (gpio: number, options: { mode: number }): IGpio;
  readonly OUTPUT: number;
}

interface IGpio {
  gpio: number;
  /**
   * Sets the GPIO level to 0 or 1. If PWM or servo pulses are active on the GPIO they are switched off.
   * @param level 0 or 1
   */
  digitalWrite(level: Level): void;

  /**
   * Returns the GPIO level, 0 or 1.
   */
  digitalRead(): Level;
}

interface IChannelConfig {
  channelId: string;
  pinNo: number;
  mode: EMode;
  name?: string;
}

type ChannelId = 'CH1' | 'CH2' | 'CH3' | 'CH4' | 'CH5' | 'CH6' | 'CH7' | 'CH8' | 'CH9';

type Level = 0 | 1;

enum EMode {
  OUTPUT = 1,
}

class MockGpio implements IGpio {
  static OUTPUT = 1; // Simulating pigpio's OUTPUT constant
  level: Level = 0;

  constructor(
    public gpio: number,
    options: { mode: number }
  ) {
    console.log(`MockGpio initialized on pin ${this.gpio} with mode ${options.mode}`);
    this.level = this.digitalRead();
  }

  digitalWrite(level: Level) {
    this.level = level;
    console.log(`MockGpio: Setting pin ${this.gpio} to ${this.level}`);
  }

  digitalRead(): Level {
    return this.level;
  }
}

export { IGpioConstructor, IGpio, MockGpio, ChannelId, Level, IChannelConfig, EMode };
