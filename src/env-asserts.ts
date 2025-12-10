export class ConfigurationError extends Error {
  constructor(message: string) {
    super(`Failed to gather configuration. ${message}`);
  }
}

export class MissingEnvironmentVariableError extends ConfigurationError {
  constructor(public variableName: string) {
    super(`Missing environment variable: ${variableName}`);
  }
}

export class InvalidIntegerError extends ConfigurationError {
  constructor(
    public variableName: string,
    public value: string
  ) {
    super(`Environment variable ${variableName} is not a valid integer: ${value}`);
  }
}

export class InvalidBooleanError extends ConfigurationError {
  constructor(
    public variableName: string,
    public value: string
  ) {
    super(`Environment variable ${variableName} is not a valid boolean: ${value}`);
  }
}

export const string = (variableName: string): string => {
  const value = process.env[variableName];
  if (typeof value !== 'string') {
    throw new MissingEnvironmentVariableError(variableName);
  }
  return value;
};

export const integer = (variableName: string): number => {
  const value = string(variableName);
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue) || parsedValue.toString() !== value) {
    throw new InvalidIntegerError(variableName, value);
  }
  return parsedValue;
};

export const boolean = (variableName: string): boolean => {
  const value = string(variableName);
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      throw new InvalidBooleanError(variableName, value);
  }
};

export const json = <T>(variableName: string): T => {
  const value = string(variableName);
  const parsedValue = JSON.parse(value);
  return parsedValue as T;
};

export const optional = <T>(fn: (variableName: string) => T, variableName: string, defaultValue: T): T => {
  if (process.env[variableName] !== undefined) {
    return fn(variableName);
  }

  return defaultValue;
};
