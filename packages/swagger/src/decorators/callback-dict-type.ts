import { isUndefined } from "@ipare/core";
import { OperationObject, ParameterObject, SchemaObject } from "openapi3-ts";

export function isOperationObject(
  dict: ParameterObject | OperationObject | SchemaObject
): dict is OperationObject {
  return !isUndefined(dict.parameters);
}

export function isParameterObject(
  dict: ParameterObject | OperationObject | SchemaObject
): dict is ParameterObject {
  return !isUndefined(dict.in);
}

export function isSchemaObject(
  dict: ParameterObject | OperationObject | SchemaObject
): dict is SchemaObject {
  return !isParameterObject(dict) && !isOperationObject(dict);
}
