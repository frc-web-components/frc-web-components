import MenuItem from '@mui/material/MenuItem';
import { useAppDispatch, useAppSelector } from '@store/app/hooks';
import { Divider, ListItemIcon, ListItemText } from '@mui/material';
import { NestedMenuItem } from 'mui-nested-menu';
import { ComponentConfig, useComponentConfigs } from '@/dashboard';
import { selectComponent } from '@store/selectors/layoutSelectors';
import { selectSourceMetadata } from '@store/selectors/sourceSelectors';
import { getComponentsWithDisplayType } from '../Tab';
import { useMemo } from 'react';
import Check from '@mui/icons-material/Check';
import {
  removeComponent,
  updateComponentType,
} from '@store/slices/layoutSlice';

interface Props {
  onClose: () => unknown;
  open: boolean;
  componentId: string;
}

export default function ElementMenu({ onClose, open, componentId }: Props) {
  const dispatch = useAppDispatch();
  const selectedComponent = useAppSelector((state) =>
    selectComponent(state, componentId),
  );
  const [components] = useComponentConfigs();
  const metadata = useAppSelector((state) =>
    selectSourceMetadata(
      state,
      selectedComponent?.source?.provider,
      selectedComponent?.source?.key,
    ),
  );

  const componentsWithDisplayType = useMemo(() => {
    return getComponentsWithDisplayType(
      metadata?.displayType ?? '',
      components,
    );
  }, [components, metadata]);

  // selectedComponent.type;

  const showAs = (type: string, config: ComponentConfig) => {
    onClose();
    const { properties } = config;
    const props: Record<string, { value: unknown }> = {};
    Object.entries(properties).forEach(([name, prop]) => {
      props[name] = {
        value: prop.defaultValue,
      };
    });
    dispatch(
      updateComponentType({
        componentId,
        properties: props,
        type,
        name: config.dashboard.name,
      }),
    );
  };

  const remove = () => {
    onClose();
    dispatch(removeComponent({ componentId }));
  };

  return [
    <MenuItem disabled>{selectedComponent?.name}</MenuItem>,
    <Divider />,
    <MenuItem onClick={remove}>Remove</MenuItem>,
    componentsWithDisplayType.length > 1 && (
      <NestedMenuItem label="Show As..." parentMenuOpen={open}>
        {componentsWithDisplayType.map((component) => (
          <MenuItem
            disabled={component.type === selectedComponent?.type}
            onClick={() => showAs(component.type, component.config)}
            key={component.type}
          >
            {component.type === selectedComponent?.type ? (
              <>
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
                {component.config.dashboard.name}
              </>
            ) : (
              <ListItemText inset>
                {component.config.dashboard.name}
              </ListItemText>
            )}
          </MenuItem>
        ))}
      </NestedMenuItem>
    ),
  ];
}
