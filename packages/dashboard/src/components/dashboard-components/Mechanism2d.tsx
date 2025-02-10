import { Mechanism2d } from '@frc-web-components/react';
import { Mechanism2dLine, Mechanism2dRoot } from '@frc-web-components/fwc';
import { colorProp, createComponent, numberArrayProp } from './fromProps';
import { useParentSourceTree } from '../context-providers/ComponentContext';
import { SourceTree } from '@store/selectors/sourceSelectors';

export function getMechanism2dLines(tree: SourceTree): Mechanism2dLine[] {
  const lineSources = Object.values(tree.childrenSources).filter(
    (lineSource) =>
      lineSource.children.length > 0 &&
      lineSource.childrenSources['.type']?.value === 'line',
  );
  const lines: Mechanism2dLine[] = lineSources.map((lineSource) => {
    const lineChildren = lineSource.childrenSources;
    const line: Mechanism2dLine = {
      angle: (lineChildren.angle?.value as number) ?? 0,
      color: (lineChildren.color?.value as string) ?? '#ffffff',
      length: (lineChildren.length?.value as number) ?? 1,
      weight: (lineChildren.weight?.value as number) ?? 1,
      children: getMechanism2dLines(lineSource),
    };
    return line;
  });
  return lines;
}

const getMechanism2dRoots = (tree?: SourceTree): Mechanism2dRoot[] => {
  if (!tree) {
    return [];
  }

  const rootsSources = Object.values(tree.childrenSources).filter((child) => {
    return child.children.length > 0;
  });

  return rootsSources.map((rootSource) => {
    const root: Mechanism2dRoot = {
      x: (rootSource.childrenSources?.x.value as number) ?? 0,
      y: (rootSource.childrenSources?.y.value as number) ?? 0,
      children: getMechanism2dLines(rootSource),
    };
    return root;
  });
};

export const mechanism2d = createComponent(
  {
    dashboard: {
      name: 'Mechanism2d',
      description: '',
      defaultSize: { width: 100, height: 100 },
      minSize: { width: 50, height: 50 },
    },
    acceptedSourceTypes: ['Mechanism2d'],
    properties: {
      backgroundColor: colorProp({ defaultValue: '#000020' }),
      dims: numberArrayProp({ defaultValue: [3, 3] }),
    },
  },
  (props) => {
    const tree = useParentSourceTree();
    const roots = getMechanism2dRoots(tree);
    return <Mechanism2d {...(props as any)} roots={roots} />;
  },
);
