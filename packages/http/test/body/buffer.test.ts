import { HttpStartup } from "../../src";
import request from "supertest";

test("buffer body explicit type", async () => {
  const server = new HttpStartup()
    .use(async (ctx) => {
      ctx.res.setHeader("content-type", "application/octet-stream");
      ctx.res.setHeader("content-length", Buffer.byteLength("BODY").toString());
      ctx.ok(Buffer.from("BODY", "utf-8"));
    })
    .listen();
  const res = await request(server).get("");
  server.close();

  expect(res.status).toBe(200);
  expect(res.headers["content-type"]).toBe("application/octet-stream");
  expect(res.body).toEqual(Buffer.from("BODY", "utf-8"));
});

test("buffer body", async () => {
  const server = new HttpStartup()
    .use(async (ctx) => {
      ctx.ok(Buffer.from("BODY", "utf-8"));
    })
    .listen();
  const res = await request(server).get("");
  server.close();

  expect(res.status).toBe(200);
  expect(res.headers["content-type"]).toBe("application/octet-stream");
  expect(res.body).toEqual(Buffer.from("BODY", "utf-8"));
});
