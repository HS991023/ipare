import { HttpContext } from "@ipare/core";
import { CUSTOM_METADATA } from "../constant";
import { InjectType } from "../inject-type";
import { InjectCustom } from "../interfaces";
import { getProptotype } from "./inject.decorator";

export function createInject<T = any>(
  handler: (parent: any) => T | Promise<T>,
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number | undefined,
  type: InjectType.Singleton
): void;
export function createInject<T = any>(
  handler: (ctx: HttpContext, parent: any) => T | Promise<T>,
  target: any,
  propertyKey: string | symbol,
  parameterIndex?: number,
  type?: InjectType
): void;
export function createInject<T = any>(
  handler: (parent: any, ctx?: any) => T | Promise<T>,
  target: any,
  propertyKey: string | symbol,
  parameterIndex?: number,
  type?: InjectType
): void {
  target = getProptotype(target);
  const args =
    (Reflect.getMetadata(CUSTOM_METADATA, target) as InjectCustom[]) ?? [];
  args.push({
    property: propertyKey,
    parameterIndex: parameterIndex,
    handler: handler,
    type: type,
  });
  Reflect.defineMetadata(CUSTOM_METADATA, args, target);
}
