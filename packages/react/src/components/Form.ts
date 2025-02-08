import React from 'react';
import { createComponent } from '@lit/react';
import { CheckboxGroup as CheckboxGroupWc } from '@frc-web-components/fwc/components/form-elements';

export const CheckboxGroup = createComponent({
  tagName: 'frc-checkbox-group',
  elementClass: CheckboxGroupWc,
  react: React,
  events: {
    onchange: 'change',
  },
});

export default CheckboxGroup;
