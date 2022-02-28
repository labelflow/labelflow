export type LoggerFn = (message?: string, payload?: unknown) => void;

export enum LogLevel {
  Error = "Error",
  Warning = "Warning",
  Info = "Info",
  Debug = "Debug",
}

export enum LoggerFnKey {
  error = "error",
  warn = "warn",
  info = "info",
  debug = "debug",
}

export const LOG_LEVEL_FUNCTIONS: Record<LogLevel, keyof typeof LoggerFnKey> = {
  Error: "error",
  Warning: "warn",
  Info: "info",
  Debug: "debug",
};

export type Logger = Record<LoggerFnKey, LoggerFn>;

export const CONSOLE_LOGGER: Logger = {
  /* eslint-disable no-console */
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
  /* eslint-enable no-console */
};
