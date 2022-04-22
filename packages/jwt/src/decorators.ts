import { Inject, parseInject } from "@sfajs/inject";
import "reflect-metadata";
import { JwtService } from "./jwt.service";

export const JwtToken = Inject((ctx) => ctx.jwtToken);
export const JwtObject = Inject(async (ctx) => {
  const jwtService = await parseInject(ctx, JwtService);
  return jwtService.decode(ctx.jwtToken, {
    complete: true,
    json: true,
  });
});
export const JwtPayload = Inject(async (ctx) => {
  const jwtService = await parseInject(ctx, JwtService);
  return jwtService.decode(ctx.jwtToken, {
    complete: false,
    json: true,
  });
});
