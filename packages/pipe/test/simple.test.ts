import { TestStartup } from "@ipare/testing";
import "@ipare/inject";
import "../src";
import { expectBody, getTestRequest, TestMiddleware } from "./TestMiddleware";

function runTest(isConstructor: boolean) {
  test("simple test", async () => {
    const startup = new TestStartup().setRequest(getTestRequest()).useInject();
    if (isConstructor) {
      startup.add(TestMiddleware);
    } else {
      startup.add(new TestMiddleware());
    }

    const res = await startup.run();
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expectBody);
  });
}

runTest(false);
runTest(true);
