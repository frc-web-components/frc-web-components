import React from 'react';
import { createComponent } from '@lit/react';
import EncoderWc from '@frc-web-components/fwc/components/encoder';

export const Encoder = createComponent({
  tagName: 'frc-encoder',
  elementClass: EncoderWc,
  react: React,
});

export default Encoder;
