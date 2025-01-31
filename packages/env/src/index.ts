import { Startup } from "@ipare/core";
import { EnvOptions } from "./options";
import { useEnv } from "./use-env";
import { useVersion } from "./use-version";

declare module "@ipare/core" {
  interface Startup {
    useEnv(mode: string): this;
    useEnv(options?: EnvOptions): this;
    useVersion(header?: string, cwd?: string): this;
  }
}

Startup.prototype.useEnv = function (options?: EnvOptions | string): Startup {
  return useEnv(this, options);
};

Startup.prototype.useVersion = function (
  header = "version",
  cwd = process.cwd()
): Startup {
  return useVersion(this, header, cwd);
};

export { EnvOptions, ModeConfigOptions, DotenvConfigOptions } from "./options";
export { cliConfigHook } from "./cli-config";
export { getVersion } from "./use-version";
