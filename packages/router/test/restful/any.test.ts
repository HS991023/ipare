import "../../src";
import { Request, HttpMethod } from "@ipare/core";
import { TestStartup } from "@ipare/testing";
import "../global";

const methods = ["test", "aaa", "NO"];

methods.forEach((method) => {
  test(`${method} -> any restful test`, async () => {
    const result = await new TestStartup()
      .setRequest(new Request().setPath("/restful").setMethod(method))
      .useTestRouter()
      .run();

    expect(result.status).toBe(200);
    expect(!!result.body.method).toBe(true);
    expect(result.body.method).toBe(HttpMethod.any);
  });
});
