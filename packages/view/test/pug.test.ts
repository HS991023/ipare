import { TestStartup } from "@ipare/testing";
import "../src";

test("pug", async () => {
  const res = await new TestStartup()
    .useView({
      dir: "test/views",
    })
    .use(async (ctx) => {
      await ctx.view("pug/test", {
        name: "test pug",
      });
    })
    .run();

  expect(res.getHeader("content-type")).toBe("text/html");
  expect(res.status).toBe(200);
  expect(res.body).toBe("<p>test pug</p>");
});
