import React, { ReactNode } from 'react';
import { ComponentProperty, ComponentConfig } from '@/dashboard';
import { createComponent as createReactComponent } from '@lit/react';

type BaseProp<T> = {
  defaultValue: T;
  tooltip: string;
};
// Define a mapping from your string literals to TypeScript types
type TypeMappings = {
  Number: number;
  String: string;
  Boolean: boolean;
  Object: Record<string, unknown>;
  'Number[]': number[];
  'String[]': string[];
  'Boolean[]': boolean[];
  'Object[]': Record<string, unknown>[];
  // add other type mappings as needed
};

// A helper type that will convert your props structure into a TypeScript type
export type FromProps<T extends Record<string, ComponentProperty>> = {
  [P in keyof T]: T[P] extends { type: infer U }
    ? U extends keyof TypeMappings
      ? TypeMappings[U]
      : never
    : never;
} & {
  setProperty: (property: string, value: unknown) => unknown;
  children: ReactNode;
};

export function createComponent<P extends Record<string, ComponentProperty>>(
  {
    dashboard,
    children,
    defaultSource,
    primaryProperty,
    properties,
    acceptedSourceTypes,
  }: {
    dashboard: ComponentConfig['dashboard'];
    children?: ComponentConfig['children'];
    defaultSource?: ComponentConfig['defaultSource'];
    primaryProperty?: string;
    properties: P;
    acceptedSourceTypes?: string[];
  },
  component: React.ComponentType<FromProps<P>>,
): ComponentConfig {
  return {
    dashboard,
    children,
    defaultSource,
    primaryProperty,
    properties,
    acceptedSourceTypes,
    component,
  };
}

export function createWebComponent<P extends Record<string, ComponentProperty>>(
  {
    dashboard,
    children,
    defaultSource,
    primaryProperty,
    properties,
    acceptedSourceTypes,
  }: {
    dashboard: ComponentConfig['dashboard'];
    children?: ComponentConfig['children'];
    defaultSource?: ComponentConfig['defaultSource'];
    primaryProperty?: string;
    properties: P;
    acceptedSourceTypes?: string[];
  },
  tagName: string,
  component: CustomElementConstructor,
): ComponentConfig {
  const ReactComponent = createReactComponent({
    tagName,
    elementClass: component,
    react: React,
  });
  return {
    dashboard,
    children,
    defaultSource,
    primaryProperty,
    properties,
    acceptedSourceTypes,
    component: (props) => {
      return <ReactComponent {...props} />;
    },
  };
}

export function numberProp(
  prop?: Partial<BaseProp<number>> & {
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
  },
): BaseProp<number> & {
  type: 'Number';
  input: {
    type: 'Number';
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
  };
} {
  return {
    type: 'Number',
    defaultValue: prop?.defaultValue ?? 0,
    tooltip: prop?.tooltip ?? '',
    input: {
      type: 'Number',
      min: prop?.min,
      max: prop?.max,
      step: prop?.step,
      precision: prop?.precision,
    },
  };
}

export function stringProp(
  prop?: Partial<BaseProp<string>>,
): BaseProp<string> & {
  type: 'String';
} {
  return {
    type: 'String',
    defaultValue: prop?.defaultValue ?? '',
    tooltip: prop?.tooltip ?? '',
  };
}

export function stringDropdownProp(
  prop?: Partial<BaseProp<string>> & {
    options?: string[] | ((propValues: Record<string, any>) => string[]);
    allowCustomValues?: boolean;
  },
): BaseProp<string> & {
  type: 'String';
  input: {
    type: 'StringDropdown';
    options: string[] | ((propValues: Record<string, any>) => string[]);
    allowCustomValues: boolean;
  };
} {
  return {
    type: 'String',
    defaultValue: prop?.defaultValue ?? '',
    tooltip: prop?.tooltip ?? '',
    input: {
      type: 'StringDropdown',
      options: prop?.options ?? [],
      allowCustomValues: prop?.allowCustomValues ?? false,
    },
  };
}

export function colorProp(
  prop?: Partial<BaseProp<string>>,
): BaseProp<string> & {
  type: 'String';
  input: {
    type: 'Color';
  };
} {
  return {
    type: 'String',
    defaultValue: prop?.defaultValue ?? '',
    tooltip: prop?.tooltip ?? '',
    input: {
      type: 'Color',
    },
  };
}

export function markdownProp(
  prop?: Partial<BaseProp<string>>,
): BaseProp<string> & {
  type: 'String';
  input: {
    type: 'Markdown';
  };
} {
  return {
    type: 'String',
    defaultValue: prop?.defaultValue ?? '',
    tooltip: prop?.tooltip ?? '',
    input: {
      type: 'Markdown',
    },
  };
}

export function booleanProp(
  prop?: Partial<BaseProp<boolean>>,
): BaseProp<boolean> & {
  type: 'Boolean';
} {
  return {
    type: 'Boolean',
    tooltip: prop?.tooltip ?? '',
    defaultValue: prop?.defaultValue ?? false,
  };
}

export function numberArrayProp(prop?: Partial<BaseProp<number[]>>): BaseProp<
  number[]
> & {
  type: 'Number[]';
} {
  return {
    type: 'Number[]',
    defaultValue: prop?.defaultValue ?? [],
    tooltip: prop?.tooltip ?? '',
  };
}

export function stringArrayProp(prop?: Partial<BaseProp<string[]>>): BaseProp<
  string[]
> & {
  type: 'String[]';
} {
  return {
    type: 'String[]',
    defaultValue: prop?.defaultValue ?? [],
    tooltip: prop?.tooltip ?? '',
  };
}
