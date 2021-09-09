import Response from "../../src/Response";

test(`response`, async function () {
  const res = new Response(201, "", {
    h: 1,
  });

  expect(res.status).toBe(201);
  expect(res.getHeader("h")).toBe("1");
  expect(res.body).toEqual("");
});
