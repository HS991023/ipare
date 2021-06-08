import { HttpMethod } from "../../src/index";
import Request from "../../src/Request";
import { SimpleStartup } from "../../src";

test("request method lower case", async function () {
  const startup = new SimpleStartup(
    new Request().setMethod(HttpMethod.post.toLowerCase())
  );

  expect(startup.ctx.req.method).toBe("POST");
});

test("request method upper case", async function () {
  const startup = new SimpleStartup(
    new Request().setMethod(HttpMethod.post.toUpperCase())
  );

  expect(startup.ctx.req.method).toBe("POST");
});

test("http methods", async function () {
  expect(HttpMethod.post.toUpperCase()).toBe("POST");
  expect(HttpMethod.get.toUpperCase()).toBe("GET");
  expect(HttpMethod.any.toUpperCase()).toBe("ANY");
  expect(HttpMethod.delete.toUpperCase()).toBe("DELETE");
  expect(HttpMethod.patch.toUpperCase()).toBe("PATCH");
  expect(HttpMethod.connect.toUpperCase()).toBe("CONNECT");
  expect(HttpMethod.head.toUpperCase()).toBe("HEAD");
  expect(HttpMethod.options.toUpperCase()).toBe("OPTIONS");
  expect(HttpMethod.put.toUpperCase()).toBe("PUT");
});

test("custom methods", async function () {
  HttpMethod.custom.push("CUSTOM1");
  HttpMethod.custom.push("CUSTOM2");

  expect(HttpMethod.matched("CUSTOM1")).toBe("CUSTOM1");
  expect(HttpMethod.matched("Custom1")).toBe("CUSTOM1");
  expect(HttpMethod.matched("custom1")).toBe("CUSTOM1");
  expect(HttpMethod.matched("CUSTOM1")).not.toBe("CUSTOM");

  expect(HttpMethod.matched("CUSTOM2")).toBe("CUSTOM2");
  expect(HttpMethod.matched("Custom2")).toBe("CUSTOM2");
  expect(HttpMethod.matched("custom2")).toBe("CUSTOM2");
  expect(HttpMethod.matched("CUSTOM2")).not.toBe("CUSTOM");

  expect(HttpMethod.matched("CUSTOM")).toBe(undefined);
  expect(HttpMethod.matched("Custom")).toBe(undefined);
  expect(HttpMethod.matched("custom")).toBe(undefined);
});

test("equal", async function () {
  expect(HttpMethod.equal("post", "POST")).toBeTruthy();
  expect(HttpMethod.equal("post", "Post")).toBeTruthy();
  expect(HttpMethod.equal("Post", "post")).toBeTruthy();
  expect(HttpMethod.equal("POST", "post")).toBeTruthy();
  expect(HttpMethod.equal("POST", "post1")).toBeFalsy();
  expect(HttpMethod.equal("POST", "GET")).toBeFalsy();
});
