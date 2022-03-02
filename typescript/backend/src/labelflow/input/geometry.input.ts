import { InputType, PickType } from "@nestjs/graphql";
import { Geometry } from "../../model/models";

@InputType()
export class GeometryInput extends PickType(
  Geometry,
  ["type", "coordinates"] as const,
  InputType
) {}
