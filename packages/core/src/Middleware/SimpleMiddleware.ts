import Middleware from ".";
import HttpContext from "../HttpContext";

export type SimpleMdType = (
  ctx: HttpContext,
  next: () => Promise<void>
) => Promise<void>;

class SimpleMiddleware extends Middleware {
  constructor(
    private readonly builder: (
      ctx: HttpContext,
      next: () => Promise<void>
    ) => Promise<void>
  ) {
    super();
  }

  async invoke(): Promise<void> {
    await this.builder(this.ctx, this.next.bind(this));
  }
}

export default SimpleMiddleware;
