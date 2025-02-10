import { Icon } from '@frc-web-components/react';
import { iconset } from '@frc-web-components/fwc';
import {
  colorProp,
  createComponent,
  stringDropdownProp,
  stringProp,
} from './fromProps';

export const icon = createComponent(
  {
    dashboard: {
      name: 'Icon',
      description: '',
      defaultSize: { width: 24, height: 24 },
      minSize: { width: 10, height: 10 },
    },
    properties: {
      color: colorProp({ defaultValue: 'gray' }),
      icon: stringDropdownProp({
        defaultValue: Object.keys(iconset)[0],
        options: ['Custom'].concat(Object.keys(iconset)),
      }),
      svgPath: stringProp({
        // isDisabled({ icon }: { icon: string }): boolean {
        //   return icon !== "Custom";
        // },
      }),
      viewBox: stringProp({
        defaultValue: '0 0 24 24',
        // isDisabled({ icon }: { icon: string }): boolean {
        //   return icon !== "Custom";
        // },
      }),
    },
  },
  (props) => {
    return <Icon {...props} />;
  },
);
