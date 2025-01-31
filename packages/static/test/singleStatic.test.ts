import { Request } from "@ipare/core";
import { TestStartup } from "@ipare/testing";
import "../src";
import { FILE_BAG } from "../src/constant";

test("match", async () => {
  {
    const result = await new TestStartup()
      .setRequest(new Request().setMethod("get").setPath("ind"))
      .use(async (ctx, next) => {
        await next();
        expect(ctx.bag<string>(FILE_BAG)).not.toBeUndefined();
      })
      .useStatic({
        file: "test/static/index.html",
        reqPath: "ind",
        encoding: "utf-8",
      })
      .run();
    expect(result.status).toBe(200);
    expect(result.body).toBe("TEST");
  }
  {
    const result = await new TestStartup()
      .setRequest(new Request().setMethod("get").setPath("/ind/"))
      .useStatic({
        file: "test/static/index.html",
        reqPath: "/ind/",
        encoding: "utf-8",
      })
      .run();
    expect(result.status).toBe(200);
    expect(result.body).toBe("TEST");
  }
  {
    const result = await new TestStartup()
      .setRequest(new Request().setMethod("get").setPath("ind"))
      .useStatic({
        file: "test/static/index.html",
        reqPath: "/ind/",
        encoding: "utf-8",
      })
      .run();
    expect(result.status).toBe(200);
    expect(result.body).toBe("TEST");
  }
});

test("not found path", async () => {
  const result = await new TestStartup()
    .setRequest(new Request().setMethod("get").setPath("ind1"))
    .use(async (ctx, next) => {
      await next();
      expect(ctx.bag<string>(FILE_BAG)).toBeUndefined();
    })
    .useStatic({
      file: "test/static/index.html",
      reqPath: "ind",
      encoding: "utf-8",
    })
    .run();
  expect(result.status).toBe(404);
});

test("not found file", async () => {
  const result = await new TestStartup()
    .setRequest(new Request().setMethod("get").setPath("ind"))
    .useStatic({
      file: "test/static/index1.html",
      reqPath: "ind",
      encoding: "utf-8",
    })
    .run();
  expect(result.status).toBe(404);
});

test("found dir instead of file", async () => {
  const result = await new TestStartup()
    .setRequest(new Request().setMethod("get").setPath("sta"))
    .useStatic({
      file: "test/static",
      reqPath: "sta",
      encoding: "utf-8",
    })
    .run();
  expect(result.status).toBe(404);
});

test("empty req path", async () => {
  {
    const result = await new TestStartup()
      .setRequest(new Request().setMethod("get").setPath(""))
      .useStatic({
        file: "test/static/index.html",
        reqPath: "",
      })
      .run();
    expect(result.status).toBe(200);
  }

  {
    const result = await new TestStartup()
      .setRequest(new Request().setMethod("get").setPath("/"))
      .useStatic({
        file: "test/static/index.html",
        reqPath: "",
      })
      .run();
    expect(result.status).toBe(200);
  }

  {
    const result = await new TestStartup()
      .setRequest(new Request().setMethod("get").setPath("ind"))
      .useStatic({
        file: "test/static/index.html",
        reqPath: "",
      })
      .run();
    expect(result.status).toBe(404);
  }
});
