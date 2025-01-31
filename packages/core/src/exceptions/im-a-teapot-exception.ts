import { StatusCodes } from "http-status-codes";
import { Dict } from "../utils/types";
import { HttpException } from "./http-exception";

export class ImATeapotException extends HttpException {
  constructor(error?: string | Dict) {
    super(StatusCodes.IM_A_TEAPOT, error);
  }
}
