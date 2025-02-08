import { Preferences } from '@frc-web-components/react';
import { booleanProp, createComponent, stringProp } from './fromProps';
import {
  useComponent,
  useParentSourceTree,
} from '../context-providers/ComponentContext';
import { SourceTree } from '@store/selectors/sourceSelectors';

type IPreferences = {
  [property: string]: IPreferences | string | number | boolean;
};

function getPreferencesFromTree(tree?: SourceTree): IPreferences {
  if (!tree) {
    return {};
  }

  const preferences: IPreferences = {};

  Object.entries(tree.childrenSources).forEach(([key, tree]) => {
    if (tree.children.length === 0) {
      preferences[key] = tree.value as any;
    } else {
      preferences[key] = getPreferencesFromTree(tree);
    }
  });

  return preferences;
}

export const preferences = createComponent(
  {
    dashboard: {
      name: 'Preferences',
      description: '',
      defaultSize: { width: 200, height: 200 },
      minSize: { width: 100, height: 100 },
    },
    defaultSource: {
      key: '/Preferences',
      provider: 'NT',
    },
    acceptedSourceTypes: ['RobotPreferences'],
    properties: {
      search: stringProp(),
      hideTitle: booleanProp(),
    },
  },
  ({ setProperty, ...props }) => {
    const tree = useParentSourceTree();
    const preferences = getPreferencesFromTree(tree);

    const {
      setSourceValue,
      component: { source },
    } = useComponent();

    return (
      <Preferences
        {...props}
        preferences={preferences}
        onchange={(ev: any) => {
          const { property, value } = ev.detail;
          if (tree && source) {
            const key = [tree.key, property].join('/');
            setSourceValue(value, {
              type: 'source',
              source: {
                provider: source.provider,
                key,
              },
            });
          }
        }}
        onsearch={(ev: any) => {
          setProperty('search', ev.detail.search);
        }}
      />
    );
  },
);
