import { HttpStartup } from "../../src";
import request from "supertest";

test("json body explicit type", async () => {
  const server = new HttpStartup()
    .use(async (ctx) => {
      ctx.res.setHeader("content-type", "application/json");
      ctx.res.setHeader(
        "content-length",
        Buffer.byteLength(
          JSON.stringify({
            content: "BODY",
          })
        ).toString()
      );
      ctx.ok({
        content: "BODY",
      });
    })
    .listen();
  const res = await request(server).get("").type("json");
  server.close();

  expect(res.status).toBe(200);
  expect(res.headers["content-type"]).toBe("application/json");
  expect(res.body).toEqual({
    content: "BODY",
  });
});

test("return json", async () => {
  const server = new HttpStartup()
    .use(async (ctx) => {
      ctx.ok({
        content: "BODY",
      });
    })
    .listen();
  const res = await request(server).get("");
  server.close();

  expect(res.status).toBe(200);
  expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
  expect(res.body).toEqual({
    content: "BODY",
  });
});
