import React from 'react';
import { createComponent } from '@lit/react';
import BooleanBoxWc from '@frc-web-components/fwc/components/boolean-box';

export const BooleanBox = createComponent({
  tagName: 'frc-boolean-box',
  elementClass: BooleanBoxWc,
  react: React,
});

export default BooleanBox;
