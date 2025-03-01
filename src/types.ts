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
  digitalWrite(level: number): void;
}

class MockGpio implements IGpio {
  static OUTPUT = 1; // Simulating pigpio's OUTPUT constant

  constructor(public gpio: number, options: { mode: number }) {
    console.log(`MockGpio initialized on pin ${this.gpio} with mode ${options.mode}`);
  }

  digitalWrite(level: number) {
    console.log(`MockGpio: Setting pin ${this.gpio} to ${level}`);
  }
}

type ChannelId = 'CH1' | 'CH2' | 'CH3';

export { IGpioConstructor, IGpio, MockGpio, ChannelId };