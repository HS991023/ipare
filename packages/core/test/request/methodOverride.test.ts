import { HttpMethod } from "../../src/index";
import Request from "../../src/Request";
import { SimpleStartup } from "../../src";

test("method override", async function () {
  const req = new Request()
    .setMethod(HttpMethod.patch.toUpperCase())
    .setHeader("X-HTTP-Method-Override", "POST");
  expect(req.method).toBe(HttpMethod.post);
  expect(req.method).not.toBe(HttpMethod.patch);
});

test("method override upper case", async function () {
  const req = new Request()
    .setMethod(HttpMethod.patch.toUpperCase())
    .setHeader("X-HTTP-METHOD-OVERRIDE", "POST");
  expect(req.method).toBe(HttpMethod.post);
  expect(req.method).not.toBe(HttpMethod.patch);
});

test(`method override request`, async function () {
  const result = await new SimpleStartup(
    new Request().setMethod(HttpMethod.patch.toUpperCase())
  )
    .use(async (ctx) => {
      ctx.res.status = 200;
      ctx.res.body = {
        method: HttpMethod.get,
      };
    })
    .run();

  expect(result.status).toBe(200);
  expect((result.body as Record<string, unknown>).method).toBe(HttpMethod.get);
});
