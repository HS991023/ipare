import { HttpContext } from "../context";
import { Middleware, MiddlewareConstructor } from "./middleware";

const MIDDLEWARE_HOOK_BAG = "@ipare/core/middlewareHooksBag";

export type MdHook<T extends Middleware | MiddlewareConstructor | Error = any> =
  (
    ctx: HttpContext,
    md: T,
    error?: Error
  ) =>
    | void
    | Promise<void | boolean>
    | Middleware
    | undefined
    | Promise<Middleware | undefined>
    | boolean
    | Promise<boolean>;

export enum HookType {
  BeforeInvoke,
  AfterInvoke,
  BeforeNext,
  Constructor,
  Exception,
}

export interface HookItem {
  hook: MdHook;
  type: HookType;
}

export class HookMiddleware extends Middleware {
  constructor(mh: MdHook, type: HookType) {
    super();
    this.#mh = mh;
    this.#type = type;
  }

  #mh: MdHook;
  #type: HookType;

  async invoke(): Promise<void> {
    const hooks = this.ctx.bag<HookItem[]>(MIDDLEWARE_HOOK_BAG) ?? [];
    hooks.push({ hook: this.#mh, type: this.#type });
    this.ctx.bag(MIDDLEWARE_HOOK_BAG, hooks);
    await this.next();
  }
}

export async function execHooks(
  ctx: HttpContext,
  middleware: Middleware,
  type: HookType.Exception,
  exception: Error
): Promise<boolean>;
export async function execHooks(
  ctx: HttpContext,
  middleware: MiddlewareConstructor,
  type: HookType.Constructor
): Promise<Middleware>;
export async function execHooks(
  ctx: HttpContext,
  middleware: Middleware,
  type: HookType.BeforeInvoke | HookType.BeforeNext
): Promise<boolean | void>;
export async function execHooks(
  ctx: HttpContext,
  middleware: Middleware,
  type: HookType.AfterInvoke
): Promise<void>;
export async function execHooks(
  ctx: HttpContext,
  middleware: Middleware | MiddlewareConstructor,
  type: HookType,
  error?: Error
): Promise<Middleware | void | boolean> {
  if (type == HookType.Constructor) {
    return await execConstructorHooks(ctx, middleware as MiddlewareConstructor);
  } else if (type == HookType.Exception) {
    return await execExceptionHooks(
      ctx,
      middleware as Middleware,
      error as Error
    );
  }

  const hooks = ctx.bag<HookItem[]>(MIDDLEWARE_HOOK_BAG) ?? [];
  for (const hookItem of hooks.filter((h) => h.type == type)) {
    const hookResult = await hookItem.hook(ctx, middleware);
    if (typeof hookResult == "boolean" && !hookResult) {
      return false;
    }
  }
}

async function execExceptionHooks(
  ctx: HttpContext,
  middleware: Middleware,
  error: Error
): Promise<boolean> {
  const hooks = ctx.bag<HookItem[]>(MIDDLEWARE_HOOK_BAG) ?? [];
  let result = false;
  for (const hookItem of hooks.filter((h) => h.type == HookType.Exception)) {
    result = (await hookItem.hook(ctx, middleware, error)) as boolean;
    if (result) break;
  }
  return result;
}

async function execConstructorHooks(
  ctx: HttpContext,
  middleware: MiddlewareConstructor
): Promise<Middleware | undefined> {
  const hooks = ctx.bag<HookItem[]>(MIDDLEWARE_HOOK_BAG) ?? [];
  let result: Middleware | undefined;
  for (const hookItem of hooks.filter((h) => h.type == HookType.Constructor)) {
    if (!(middleware instanceof Middleware)) {
      result = (await hookItem.hook(ctx, middleware)) as Middleware;
      if (result) break;
    }
  }
  if (!result) result = new middleware();
  return result;
}
