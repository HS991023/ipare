import { Response } from "../../src";

test(`response`, async () => {
  const res = new Response(201, "", {
    h: 1,
  });

  expect(res.status).toBe(201);
  expect(res.getHeader("h")).toBe("1");
  expect(res.body).toEqual("");
});
