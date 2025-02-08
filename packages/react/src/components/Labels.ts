import React from 'react';
import { createComponent } from '@lit/react';
import {
  Label as LabelWc,
  NumberLabel as NumberLabelWc,
} from '@frc-web-components/fwc/components/label';

export const Label = createComponent({
  tagName: 'frc-label',
  elementClass: LabelWc,
  react: React,
});

export const NumberLabel = createComponent({
  tagName: 'frc-number-label',
  elementClass: NumberLabelWc,
  react: React,
});
