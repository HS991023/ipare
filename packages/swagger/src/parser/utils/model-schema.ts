import { ObjectConstructor } from "@ipare/core";
import { PipeReqRecord } from "@ipare/pipe";
import { ComponentsObject, OpenApiBuilder, SchemaObject } from "openapi3-ts";
import {
  getCallbacks,
  PipeSchemaCallback,
} from "../../decorators/callback.decorator";

function createModelSchema(
  builder: OpenApiBuilder,
  modelCls: ObjectConstructor,
  pipeRecord: PipeReqRecord
) {
  const callbacks = getCallbacks(modelCls.prototype);
  let schema = getExistSchema(builder, modelCls.name);
  if (!schema) {
    schema = {
      type: "object",
    };
    builder.addSchema(modelCls.name, schema);
  }
  for (const cb of callbacks) {
    (cb.callback as PipeSchemaCallback)({
      pipeRecord,
      schema,
      builder,
    });
  }
}

function getExistSchema(builder: OpenApiBuilder, name: string) {
  const components = builder.getSpec().components as ComponentsObject;
  const schemas = components.schemas as Record<string, SchemaObject>;
  return schemas[name] as SchemaObject;
}

export function ensureModelSchema(
  builder: OpenApiBuilder,
  modelCls: ObjectConstructor,
  pipeRecord: PipeReqRecord
) {
  const schema = getExistSchema(builder, modelCls.name);
  if (!schema) {
    createModelSchema(builder, modelCls, pipeRecord);
  }
  return schema;
}
