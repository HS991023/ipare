import { TestStartup } from "@ipare/testing";
import "../src";

test("ejs", async () => {
  const res = await new TestStartup()
    .useView({
      dir: "test/views",
    })
    .use(async (ctx) => {
      await ctx.view("ejs/index.ejs", {
        name: "test ejs",
      });
    })
    .run();

  expect(res.getHeader("content-type")).toBe("text/html");
  expect(res.status).toBe(200);
  expect(res.body).toBe("<p>test ejs</p>");
});

test("ejs index", async () => {
  const res = await new TestStartup()
    .useView({
      dir: "test/views/ejs",
    })
    .use(async (ctx) => {
      await ctx.view("", {
        name: "test ejs",
      });
    })
    .run();

  expect(res.getHeader("content-type")).toBe("text/html");
  expect(res.status).toBe(200);
  expect(res.body).toBe("<p>test ejs</p>");
});
