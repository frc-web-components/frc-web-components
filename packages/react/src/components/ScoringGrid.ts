import React from 'react';
import { createComponent } from '@lit/react';
import ScoringGridWc from '@frc-web-components/fwc/components/scoring-grid';

export const ScoringGrid = createComponent({
  tagName: 'frc-scoring-grid',
  elementClass: ScoringGridWc,
  react: React,
  events: {
    onselect: 'select',
  },
});

export default ScoringGrid;
