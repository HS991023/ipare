import { Middleware, ReadonlyDict, Request } from "@ipare/core";
import { TestStartup } from "@ipare/testing";
import "../../src";
import { createInject, Inject } from "../../src";

const Headers = Inject((ctx) => ctx.req.headers);
const Body1 = Inject((ctx) => ctx.req.body);
const Body2 = (
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number
) => createInject((ctx) => ctx.req.body, target, propertyKey, parameterIndex);
const Host = Inject((ctx) => ctx.req.getHeader("host"));

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @Headers private readonly headers: ReadonlyDict,
    @Body1 private readonly body1: any,
    @Body2 readonly body2: any,
    @Host readonly host: string
  ) {
    super();
  }

  async invoke(): Promise<void> {
    this.ok({
      headers: this.headers,
      body1: this.body1,
      body2: this.body2,
      host: this.host,
    });
  }
}

test(`custom inject`, async function () {
  const res = await new TestStartup()
    .setRequest(
      new Request().setHeader("h1", "1").setHeader("host", "ipare").setBody({
        b: 2,
      })
    )
    .useInject()
    .add(TestMiddleware)
    .run();

  expect(res.body).toEqual({
    headers: {
      h1: "1",
      host: "ipare",
    },
    body1: {
      b: 2,
    },
    body2: {
      b: 2,
    },
    host: "ipare",
  });
  expect(res.status).toBe(200);
});
