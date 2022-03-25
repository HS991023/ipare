import {
  HeadersDict,
  NumericalHeadersDict,
  ReadonlyHeadersDict,
  StatusCodes,
} from "@sfajs/header";
import ResultHandler from "./ResultHandler";

export default class SfaResponse extends ResultHandler {
  #headers: HeadersDict = {};

  constructor(
    public status: StatusCodes = StatusCodes.NOT_FOUND,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public body: any = undefined,
    headers?: NumericalHeadersDict
  ) {
    super(() => this);
    if (headers) this.setHeaders(headers);
  }

  get isSuccess(): boolean {
    return this.status >= 200 && this.status < 300;
  }

  get headers(): ReadonlyHeadersDict {
    return this.#headers;
  }

  setBody(body: unknown): this {
    this.body = body;
    return this;
  }

  setStatus(status: StatusCodes): this {
    this.status = status;
    return this;
  }
}
