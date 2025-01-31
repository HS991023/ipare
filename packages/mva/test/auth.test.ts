import { Request } from "@ipare/core";
import { TestStartup } from "@ipare/testing";
import "../src";
import { runMva } from "./global";
import { AutFilter } from "./mva/auth.middleware";

test("auth access", async function () {
  await runMva(async () => {
    const res = await new TestStartup()
      .setRequest(
        new Request()
          .setPath("user/test1@hal.wang")
          .setMethod("GET")
          .setHeader("password", "test1password")
      )
      .useGlobalFilter(AutFilter)
      .useMva()
      .run();

    expect(res.status).toBe(200);
    expect(res.body).toBe("<p>email: test1@hal.wang</p>");
    expect(res.getHeader("content-type")).toBe("text/html");
  });
});

test("auth failed", async function () {
  await runMva(async () => {
    const res = await new TestStartup()
      .setRequest(
        new Request()
          .setPath("user/test1@hal.wang")
          .setMethod("GET")
          .setHeader("password", "test2password")
      )
      .useGlobalFilter(AutFilter)
      .useMva()
      .run();

    expect(res.body).toEqual({
      message: "error email or password",
      status: 403,
    });
    expect(res.status).toBe(403);
  });
});
