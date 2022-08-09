import "../src";
import { TestStartup } from "@ipare/testing";
import { parseInject } from "@ipare/inject";
import { mongoose } from "../src";
import { OPTIONS_IDENTITY } from "../src/constant";

test("connected connection should be destroy", async () => {
  const res = await new TestStartup()
    .use(async (ctx, next) => {
      mongoose.Mongoose.prototype.createConnection = async () => {
        ctx.setHeader("connect", "1");
        return {
          destroy: () => {
            ctx.setHeader("destroy", "1");
          },
          readyState: mongoose.ConnectionStates.connected,
        } as any;
      };
      await next();
    })
    .useMongoose("mongodb://test")
    .use(async (ctx) => {
      const client = await parseInject<mongoose.Connection>(
        ctx,
        OPTIONS_IDENTITY
      );
      if (!client) throw new Error();
    })
    .run();

  expect(res.getHeader("connect")).toBe("1");
  expect(res.getHeader("destroy")).toBe("1");
});

it("disconnected connection should not be destroy", async () => {
  const res = await new TestStartup()
    .use(async (ctx, next) => {
      mongoose.Mongoose.prototype.createConnection = async () => {
        ctx.setHeader("connect", "1");
        return {
          destroy: () => {
            ctx.setHeader("destroy", "1");
          },
          readyState: mongoose.ConnectionStates.disconnected,
        } as any;
      };
      await next();
    })
    .useMongoose("mongodb://test")
    .use(async (ctx) => {
      const client = await parseInject<mongoose.Connection>(
        ctx,
        OPTIONS_IDENTITY
      );
      if (!client) throw new Error();
    })
    .run();

  expect(res.getHeader("connect")).toBe("1");
  expect(res.getHeader("destroy")).toBeUndefined();
});
