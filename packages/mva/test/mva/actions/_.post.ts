import { Action } from "@sfajs/router";

export default class extends Action {
  async invoke(): Promise<void> {
    this.ok({
      method: "POST",
    });
    return;
  }
}
