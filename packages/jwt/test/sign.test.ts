import { createjwtService } from "./utils";

test(`sign`, async function () {
  const jwtService = createjwtService({ secret: "secret" });
  const token = await jwtService.sign(
    {},
    {
      secret: "secret",
    }
  );

  const jwt =
    jwtService.decode(token, {
      complete: true,
      json: true,
    }) ?? {};
  expect(Object.keys(await jwtService.verify(token))).toEqual(["iat"]);
  expect(Object.keys(jwt)).toEqual(["header", "payload", "signature"]);
  expect(Object.keys(jwt["payload"])).toEqual(["iat"]);
});

test(`secretOrKeyProvider`, async function () {
  const jwtService = createjwtService({
    secretOrKeyProvider: () => "secret",
  });
  const token = await jwtService.sign(
    {},
    {
      secret: "secret",
    }
  );

  const jwt =
    jwtService.decode(token, {
      complete: true,
      json: true,
    }) ?? {};
  expect(Object.keys(await jwtService.verify(token))).toEqual(["iat"]);
  expect(Object.keys(jwt)).toEqual(["header", "payload", "signature"]);
  expect(Object.keys(jwt["payload"])).toEqual(["iat"]);
});

test(`sign error`, async () => {
  let error = false;
  try {
    const jwtService = createjwtService({
      secret: "secret",
    });
    await jwtService.sign([1, 2]);
  } catch {
    error = true;
  }
  expect(error).toBeTruthy();
});
