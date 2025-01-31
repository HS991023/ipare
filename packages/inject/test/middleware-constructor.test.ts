import { Middleware } from "@ipare/core";
import { Service2 } from "./services";
import "../src";
import { Inject } from "../src";
import { TestStartup } from "@ipare/testing";

@Inject
class TestMiddleware extends Middleware {
  constructor(
    private readonly service: Service2,
    @Inject("KEY_INJ") private readonly num: number,
    private readonly str: string
  ) {
    super();
  }

  async invoke(): Promise<void> {
    this.ok({
      md: `md.${this.service?.invoke()}`,
      num: this.num,
      str: this.str,
    });
  }
}

test(`middleware constructor`, async () => {
  const res = await new TestStartup().useInject().add(TestMiddleware).run();

  expect(res.body).toEqual({
    md: "md.service2.service1",
    num: undefined,
    str: undefined,
  });
  expect(res.status).toBe(200);
});

test(`function middleware constructor`, async () => {
  const res = await new TestStartup()
    .useInject()
    .inject("KEY_INJ", 3)
    .add((ctx) => {
      ctx.setHeader("h", "1");
      return TestMiddleware;
    })
    .run();

  expect(res.body).toEqual({
    md: "md.service2.service1",
    num: 3,
    str: undefined,
  });
  expect(res.status).toBe(200);
  expect(res.getHeader("h")).toBe("1");
});

test(`async function middleware constructor`, async () => {
  const res = await new TestStartup()
    .useInject()
    .add(async (ctx) => {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 200);
      });
      ctx.setHeader("h", "1");
      return TestMiddleware;
    })
    .run();

  expect(res.body).toEqual({
    md: "md.service2.service1",
    num: undefined,
    str: undefined,
  });
  expect(res.status).toBe(200);
  expect(res.getHeader("h")).toBe("1");
});
