import "@ipare/core";
import {
  Startup,
  ObjectConstructor,
  HttpContext,
  isFunction,
} from "@ipare/core";
import { HookType } from "@ipare/core/dist/middlewares";
import { USED, MAP_BAG, SINGLETON_BAG } from "./constant";
import { KeyTargetType, InjectMap } from "./interfaces";
import {
  getTransientInstances,
  isInjectClass,
  parseInject,
  tryParseInject,
} from "./inject-parser";
import { InjectType } from "./inject-type";
import { InjectDisposable } from "./interfaces/inject-disposable";

declare module "@ipare/core" {
  interface Startup {
    useInject(): this;

    inject<T extends KeyTargetType>(key: string, target: T): this;
    inject<T extends KeyTargetType>(
      key: string,
      target: (ctx: HttpContext) => T | Promise<T>,
      type?: InjectType
    ): this;
    inject<TTarget extends object>(
      key: string,
      target: ObjectConstructor<TTarget>,
      type?: InjectType
    ): this;

    inject<TAnestor extends object, TTarget extends TAnestor>(
      anestor: ObjectConstructor<TAnestor>,
      target: TTarget
    ): this;
    inject<TAnestor extends object>(
      target: ObjectConstructor<TAnestor>,
      type?: InjectType
    ): this;
    inject<TAnestor extends object, TTarget extends TAnestor>(
      anestor: ObjectConstructor<TAnestor>,
      target: (ctx: HttpContext) => TTarget | Promise<TTarget>,
      type?: InjectType
    ): this;
    inject<TAnestor extends object, TTarget extends TAnestor>(
      anestor: ObjectConstructor<TAnestor>,
      target: ObjectConstructor<TTarget>,
      type?: InjectType
    ): this;
  }
}

Startup.prototype.useInject = function (): Startup {
  if (this[USED]) {
    return this;
  }
  this[USED] = true;

  const singletons = [];
  return this.use(async (ctx, next) => {
    ctx.bag(SINGLETON_BAG, singletons);
    await next();
  })
    .hook(HookType.Constructor, async (ctx, mh) => {
      if (isInjectClass(mh)) {
        return await parseInject(ctx, mh);
      }
    })
    .hook(async (ctx, mh) => {
      await parseInject(ctx, mh);
    });
};

Startup.prototype.inject = function (...args: any[]): Startup {
  let anestor: ObjectConstructor | string;
  let target: ObjectConstructor | any | ((ctx: HttpContext) => any);
  let type: InjectType | undefined;
  if (typeof args[0] == "string") {
    anestor = args[0];
    target = args[1];
    type = args[2];
  } else if (args[1] == undefined) {
    anestor = args[0];
    target = args[0];
  } else {
    if (typeof args[1] == typeof InjectType.Singleton) {
      anestor = args[0];
      target = args[0];
      type = args[1];
    } else {
      anestor = args[0];
      target = args[1];
      type = args[2];
    }
  }

  this.use(async (ctx, next) => {
    const injectType = type ?? InjectType.Scoped;
    const injectMaps = ctx.bag<InjectMap[]>(MAP_BAG) ?? [];
    injectMaps.push({
      anestor,
      target,
      type: injectType,
    });
    ctx.bag(MAP_BAG, injectMaps);

    try {
      await next();
    } finally {
      await dispose(ctx, injectType, anestor);
    }
  });
  return this;
};

async function dispose<T extends object = any>(
  ctx: HttpContext,
  injectType: InjectType,
  target: ObjectConstructor<T> | string
) {
  async function disposeObject<T extends InjectDisposable = any>(instance?: T) {
    if (!instance) return;
    if (!instance.dispose || !isFunction(instance.dispose)) return;

    await instance.dispose();
  }

  if (injectType == InjectType.Scoped) {
    const instance = tryParseInject(ctx, target) as InjectDisposable;
    await disposeObject(instance);
  } else if (injectType == InjectType.Transient) {
    const instances = getTransientInstances(ctx, target) as InjectDisposable[];
    for (const instance of instances) {
      await disposeObject(instance);
    }
  }
}

export { Inject, createInject } from "./decorators";
export {
  parseInject,
  tryParseInject,
  getTransientInstances,
} from "./inject-parser";
export { InjectType } from "./inject-type";
export { InjectDisposable } from "./interfaces";
