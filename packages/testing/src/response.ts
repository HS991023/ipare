import "@ipare/core";
import { isFunction, isNumber, Response } from "@ipare/core";

declare module "@ipare/core" {
  interface Response {
    expect(status: number): this;
    expect(status: number, body: any): this;
    expect(checker: (res: Response) => void): this;
    expect(body: any): this;
  }
}

Response.prototype.expect = function (...args: any[]) {
  const arg0 = args[0];
  const arg1 = args[1];
  if (isFunction(arg0)) {
    arg0(this);
  } else if (isNumber(arg0)) {
    expect(this.status).toBe(arg0);
    if (args.length >= 2) {
      expect(this.body).toEqual(arg1);
    }
  } else {
    expect(this.body).toEqual(arg0);
  }
  return this;
};
