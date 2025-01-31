import { HttpStartup } from "../src";
import * as http from "http";

test("http with config", async () => {
  const server = new HttpStartup({}).listen() as http.Server;
  expect(server).not.toBeUndefined();
  expect(server.listening).toBeTruthy();

  server.close();
});
