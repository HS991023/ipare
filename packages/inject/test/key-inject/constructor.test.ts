import { Middleware } from "@ipare/core";
import { TestStartup } from "@ipare/testing";
import "../../src";
import { Inject, InjectType } from "../../src";

class TestService1 {}
class TestService2 {
  @Inject
  readonly service1!: TestService1;
}

@Inject
class TestMiddleware extends Middleware {
  constructor(
    @Inject("KEY1") readonly key1: string,
    @Inject("KEY2") private key2: any,
    @Inject("KEY3") private readonly key3: number, // number to bool
    @Inject("KEY4") private readonly key4: any,
    @Inject("KEY_OBJECT") private readonly service1: any,
    @Inject("KEY_OBJECT") private readonly service2: TestService2
  ) {
    super();
  }

  async invoke(): Promise<void> {
    this.ok({
      key1: this.key1,
      key2: this.key2,
      key3: this.key3,
      key4: this.key4,
      service1: this.service1?.service1?.constructor?.name,
      service2: this.service2?.service1?.constructor?.name,
    });
  }
}

test(`inject key`, async function () {
  const res = await new TestStartup()
    .useInject()
    .inject("KEY1", 1)
    .inject("KEY2", "2")
    .inject("KEY3", true)
    .inject("KEY_OBJECT", TestService2, InjectType.Transient)
    .add(TestMiddleware)
    .run();

  expect(res.body).toEqual({
    key1: 1,
    key2: "2",
    key3: true,
    key4: undefined,
    service1: TestService1.name,
    service2: TestService1.name,
  });
  expect(res.status).toBe(200);
});

test(`inject key empty`, async function () {
  const res = await new TestStartup().useInject().add(TestMiddleware).run();

  expect(res.body).toEqual({
    key1: undefined,
    key2: undefined,
    key3: undefined,
    key4: undefined,
    service1: undefined,
    service2: TestService1.name,
  });
  expect(res.status).toBe(200);
});
