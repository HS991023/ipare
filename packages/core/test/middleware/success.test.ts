import { Middleware } from "../../src/index";
import { SimpleStartup } from "../../src";

test("middleware success", async function () {
  const stepResult: Record<string, number> = {
    step: 0,
  };

  const res = await new SimpleStartup()
    .use(() => new Mdw1(stepResult))
    .use(() => new Mdw2(stepResult))
    .use(() => new Mdw3(stepResult))
    .use(() => new Mdw4(stepResult))
    .run();

  expect(res.status).toBe(200);
  expect(stepResult.step).toBe(111);
  expect(res.body).toBe("middleware-success");
});

class Mdw1 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async invoke(): Promise<void> {
    this.stepResult.step += 1;
    await this.next();
  }
}

class Mdw2 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async invoke(): Promise<void> {
    this.stepResult.step += 10;
    await this.next();
  }
}

class Mdw3 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async invoke(): Promise<void> {
    this.stepResult.step += 100;
    this.ok("middleware-success");
  }
}

class Mdw4 extends Middleware {
  constructor(private stepResult: Record<string, number>) {
    super();
  }

  async invoke(): Promise<void> {
    this.stepResult.step += 1000;
    await this.next();
  }
}
