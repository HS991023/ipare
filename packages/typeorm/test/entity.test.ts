import { TestStartup } from "@ipare/testing";
import { parseInject } from "@ipare/inject";
import "../src";
import { TypeormConnection } from "../src";
import { OPTIONS_IDENTITY } from "../src/constant";

it("default entities should endswith *.js", async () => {
  delete process.env.TS_JEST;
  const res = await new TestStartup()
    .useTypeorm({
      type: "sqlite",
      database: "test/sqlite.db",
      synchronize: true,
    })
    .use(async (ctx) => {
      const connection = await parseInject<TypeormConnection>(
        ctx,
        OPTIONS_IDENTITY
      );
      if (!connection) throw new Error();

      const entity: string = (connection.options.entities as any)[0];
      expect(entity.endsWith("*.js")).toBeTruthy();
    })
    .run();

  expect(res.status).toBe(404);
});

it("test entities should endswith *.ts", async () => {
  process.env.TS_JEST = "1";
  const res = await new TestStartup()
    .useTypeorm({
      type: "sqlite",
      database: "test/sqlite.db",
      synchronize: true,
    })
    .use(async (ctx) => {
      const connection = await parseInject<TypeormConnection>(
        ctx,
        OPTIONS_IDENTITY
      );
      if (!connection) throw new Error();

      const entity: string = (connection.options.entities as any)[0];
      expect(entity.endsWith("*.ts")).toBeTruthy();
    })
    .run();

  expect(res.status).toBe(404);
});
