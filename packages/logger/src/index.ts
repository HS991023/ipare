import { HttpContext, Startup } from "@ipare/core";
import { InjectDisposable, parseInject } from "@ipare/inject";
import winston from "winston";
import Transport from "winston-transport";
import { FileTransportOptions } from "winston/lib/winston/transports";
import { OPTIONS_IDENTITY } from "./constant";
import { Options } from "./options";

declare module "@ipare/core" {
  interface Startup {
    useLogger(options?: Options): this;
    useConsoleLogger(options?: Omit<Options, "transports">): this;
    useFileLogger(
      options: Omit<Options, "transports"> & {
        fileTransportOptions: FileTransportOptions;
      }
    ): this;
  }

  interface HttpContext {
    getLogger(identity?: string): Promise<winston.Logger>;
  }
}

Startup.prototype.useLogger = function (options?: Options): Startup {
  const injectKey = OPTIONS_IDENTITY + (options?.identity ?? "");
  return this.useInject().inject(
    injectKey,
    () => {
      const logger = winston.createLogger(options) as InjectDisposable &
        winston.Logger;

      logger.dispose = async () => {
        if (!logger.destroyed) {
          logger.destroy();
        }
      };

      return logger;
    },
    options?.injectType
  );
};

HttpContext.prototype.getLogger = async function (
  identity?: string
): Promise<winston.Logger> {
  const injectKey = OPTIONS_IDENTITY + (identity ?? "");
  return (await parseInject(this, injectKey)) as winston.Logger;
};

Startup.prototype.useConsoleLogger = function (options: Options = {}): Startup {
  options.transports = new winston.transports.Console();
  return this.useLogger(options);
};

Startup.prototype.useFileLogger = function (
  options: Options & { fileTransportOptions: FileTransportOptions }
): Startup {
  options.transports = new winston.transports.File(
    options.fileTransportOptions
  );
  return this.useLogger(options);
};

export { winston, Transport };
export { Logger } from "./decorators";
export { Options } from "./options";
