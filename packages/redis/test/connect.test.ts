import "../src";
import { TestStartup } from "@ipare/testing";
import { parseInject } from "@ipare/inject";
import { RedisConnection } from "../src";
import { OPTIONS_IDENTITY } from "../src/constant";
import RedisClient from "@redis/client/dist/lib/client";

test("connect failed", async () => {
  const res = await new TestStartup()
    .use(async (ctx, next) => {
      RedisClient.prototype.connect = async () => {
        ctx.setHeader("connect", "1");
      };
      RedisClient.prototype.disconnect = async () => {
        ctx.setHeader("disconnect", "1");
      };
      await next();
    })
    .useRedis({
      url: "redis://test",
    })
    .use(async (ctx) => {
      const connection = await parseInject<RedisConnection>(
        ctx,
        OPTIONS_IDENTITY
      );
      if (!connection) throw new Error();

      Object.defineProperty(connection, "isOpen", {
        get: () => true,
      });
    })
    .run();

  expect(res.getHeader("connect")).toBe("1");
  expect(res.getHeader("disconnect")).toBe("1");
});
