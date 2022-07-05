import "reflect-metadata";
import { createInject, parseInject } from "@sfajs/inject";
import { Dict, HttpContext, isClass, isUndefined } from "@sfajs/core";
import { GlobalPipeItem, LambdaPipe, PipeItem } from ".";
import { getReqHandler, PipeReqType } from "../pipe-req-type";
import { PipeReqRecord } from "../pipe-req-record";
import { GLOBAL_PIPE_BAG, PIPE_RECORDS_METADATA } from "../constant";
import { GlobalPipeType } from "../global-pipe-type";
import { plainToClass } from "class-transformer";

async function execPipes(
  ctx: HttpContext,
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number | undefined,
  value: any,
  propertyType: any,
  pipes: PipeItem[]
) {
  const globalPipes = ctx.bag<GlobalPipeItem[]>(GLOBAL_PIPE_BAG) ?? [];
  const beforeGlobalPipes = globalPipes
    .filter((p) => p.type == GlobalPipeType.before)
    .map((item) => item.pipe);
  const afterGlobalPipes = globalPipes
    .filter((p) => p.type == GlobalPipeType.after)
    .map((item) => item.pipe);

  for (let pipe of [...beforeGlobalPipes, ...pipes, ...afterGlobalPipes]) {
    if (isClass(pipe)) {
      pipe = await parseInject(ctx, pipe);
    } else if (typeof pipe == "function") {
      pipe = new LambdaPipe(pipe);
    }

    if (pipe.transform) {
      value = await pipe.transform({
        value,
        ctx,
        propertyType,
        target,
        propertyKey,
        parameterIndex,
        pipes,
      });
    }
  }
  return value;
}

function setPipeRecord(
  type: PipeReqType,
  pipes: PipeItem[],
  target: any,
  propertyKey: string | symbol,
  parameterIndex?: number,
  property?: string
) {
  const records: PipeReqRecord[] =
    Reflect.getMetadata(PIPE_RECORDS_METADATA, target) ?? [];
  records.push({
    type: type,
    pipes: pipes,
    propertyKey: propertyKey,
    parameterIndex: parameterIndex,
    property: property,
  });
  Reflect.defineMetadata(PIPE_RECORDS_METADATA, records, target);
}

function getPropertyType(
  target: any,
  propertyKey: string | symbol,
  parameterIndex?: number
): any {
  if (!isUndefined(parameterIndex)) {
    const types = Reflect.getMetadata("design:paramtypes", target) ?? [];
    return types[parameterIndex];
  } else {
    return Reflect.getMetadata("design:type", target, propertyKey);
  }
}

function getObjectFromDict(cls: any, dict: Dict) {
  if (isClass(cls)) {
    return plainToClass(cls, dict);
  } else {
    return dict;
  }
}

export function createDecorator(type: PipeReqType, args: any[]) {
  const handler = getReqHandler(type);

  if (typeof args[0] == "string") {
    // property params
    const pipes = args.slice(1, args.length);
    return function (
      target: any,
      propertyKey: string | symbol,
      parameterIndex?: number
    ) {
      setPipeRecord(type, pipes, target, propertyKey, parameterIndex, args[0]);
      const propertyType = getPropertyType(target, propertyKey, parameterIndex);
      createInject(
        async (ctx) => {
          const property = args[0];
          const dict = handler(ctx);
          const val = getObjectFromDict(propertyType, dict)
            ? dict[property]
            : undefined;
          return await execPipes(
            ctx,
            target,
            propertyKey,
            parameterIndex,
            val,
            propertyType,
            pipes
          );
        },
        target,
        propertyKey,
        parameterIndex
      );
    };
  } else if (typeof args[1] == "string" || typeof args[2] == "number") {
    const target = typeof args[2] == "number" ? args[0].prototype : args[0];
    setPipeRecord(type, [], target, args[1], args[2]);
    const propertyType = getPropertyType(target, args[1], args[2]);
    createInject(
      async (ctx) =>
        await execPipes(
          ctx,
          target,
          args[1],
          args[2],
          getObjectFromDict(propertyType, handler(ctx)),
          propertyType,
          []
        ),
      args[0],
      args[1],
      args[2]
    );
  } else {
    const pipes = args;
    return function (
      target: any,
      propertyKey: string | symbol,
      parameterIndex?: number
    ) {
      setPipeRecord(type, pipes, target, propertyKey, parameterIndex, args[0]);
      const propertyType = getPropertyType(target, propertyKey, parameterIndex);
      createInject(
        async (ctx) =>
          await execPipes(
            ctx,
            target,
            propertyKey,
            parameterIndex,
            getObjectFromDict(propertyType, handler(ctx)),
            propertyType,
            pipes
          ),
        target,
        propertyKey,
        parameterIndex
      );
    };
  }
}
