export type HeaderValueType = string | string[];
export type NumericalHeaderValueType =
  | HeaderValueType
  | number
  | (number | string)[];

export default abstract class HeadersHandler {
  constructor(headersFinder: () => NodeJS.Dict<HeaderValueType>) {
    this.#headersFinder = headersFinder;
  }

  #headersFinder;

  get #headers(): NodeJS.Dict<HeaderValueType> {
    return this.#headersFinder();
  }

  setHeaders(headers: NodeJS.Dict<NumericalHeaderValueType>): this {
    for (const key in headers) {
      const value = headers[key];
      if (value != undefined) {
        this.setHeader(key, value);
      }
    }
    return this;
  }

  setHeader(key: string, value: NumericalHeaderValueType): this {
    if (value == undefined) return this;

    if (Array.isArray(value)) {
      this.#headers[key] = value.map((item) =>
        typeof item == "string" ? item : String(item)
      );
    } else if (typeof value != "string") {
      this.#headers[key] = String(value);
    } else {
      this.#headers[key] = value;
    }
    return this;
  }

  appendHeader(key: string, value: NumericalHeaderValueType): this {
    const prev = this.getHeader(key) as NumericalHeaderValueType;
    if (prev) {
      value = (Array.isArray(prev) ? prev : [prev]).concat(value);
    }
    return this.setHeader(key, value);
  }

  hasHeader(key: string): string | false {
    for (const item of Object.keys(this.#headers)) {
      if (item.toUpperCase() == key.toUpperCase()) {
        return item;
      }
    }
    return false;
  }

  removeHeader(key: string): this {
    const existKey = this.hasHeader(key);
    if (existKey) {
      delete this.#headers[existKey];
    }
    return this;
  }

  getHeader(key: string): HeaderValueType | undefined {
    const existKey = this.hasHeader(key);
    if (existKey) {
      return this.#headers[existKey];
    }
  }
}
