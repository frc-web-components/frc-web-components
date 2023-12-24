import React from "react";
import { createComponent } from "@lit/react";
import Field3dWc, {
  Field3dObject as Field3dObjectWc,
} from "@frc-web-components/fwc/components/field3d";

export const Field3d = createComponent({
  tagName: "frc-field3d",
  elementClass: Field3dWc,
  react: React,
});

export const Field3dObject = createComponent({
  tagName: "frc-field3d-object",
  elementClass: Field3dObjectWc,
  react: React,
});

export default Field3d;
