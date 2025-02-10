import 'flexlayout-react/style/dark.css';
import {
  Actions,
  IJsonTabNode,
  Layout,
  Model,
  TabNode,
  TabSetNode,
} from 'flexlayout-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Properties from './properties/Properties';
import ComponentPicker from '../ComponentPicker';
import { editorLayoutJson as defaultLayoutJson } from './editor-layout';
import { useAppSelector } from '@store/app/hooks';
import { makeSelectSelectedComponent } from '@store/selectors/layoutSelectors';
import { useComponentConfigs } from '@/dashboard';
import { selectEditing } from '@store/slices/appSlice';
import Sources from './sources/Sources';

function Editor() {
  const layoutRef = useRef<Layout>();
  const selectSelectedComponent = useMemo(makeSelectSelectedComponent, []);
  const selectedComponent = useAppSelector(selectSelectedComponent);
  const [components] = useComponentConfigs();
  const [layoutJson] = useState(defaultLayoutJson);
  const modelRef = useRef<Model>();
  const editing = useAppSelector(selectEditing);

  useEffect(() => {
    modelRef.current = Model.fromJson(layoutJson);
  }, [layoutJson]);

  useEffect(() => {
    const model = modelRef.current!;
    let propertiesTabName = 'Properties';
    if (selectedComponent && components) {
      propertiesTabName =
        components[selectedComponent.type].dashboard.name ?? 'Properties';
    }
    const node = model.getNodeById('mainProperties') as TabNode;
    if (!node) {
      return;
    }
    const propertiesTabSet = node.getParent() as TabSetNode;
    if (node.getType?.() === 'tab') {
      node
        .getModel()
        .doAction(Actions.renameTab(node.getId(), propertiesTabName));
    }

    const children = selectedComponent
      ? (components[selectedComponent.type].children ?? [])
      : [];
    const tabData = children.map((child) => {
      return {
        type: child.type,
        componentConfig: components[child.type],
        name: child.propertyTabName ?? components[child.type].dashboard.name,
        id: `${child.type}Properties`,
      };
    });

    if (selectedComponent && components) {
      tabData.forEach((data) => {
        const tabJson: IJsonTabNode = {
          type: 'tab',
          enableClose: false,
          enableDrag: false,
          enableFloat: false,
          enableRename: false,
          component: 'childProperties',
          config: {
            componentConfig: data.componentConfig,
            configType: data.type,
          },
          id: data.id,
          name: data.name,
        };
        const node = model.getNodeById(data.id) as TabNode;

        if (!node) {
          layoutRef.current?.addTabToTabSet(propertiesTabSet.getId(), tabJson);
          model.doAction(Actions.selectTab('mainProperties'));
        }
      });
    }

    propertiesTabSet.getChildren().forEach((childTab) => {
      const id = childTab.getId();
      const childPropertyTab = tabData.find((data) => data.id === id);
      if (id === 'mainProperties' || childPropertyTab) {
        return;
      }
      model.doAction(Actions.deleteTab(childTab.getId()));
    });
  }, [selectedComponent]);

  const factory = (node: TabNode) => {
    const component = node.getComponent();
    const config = node.getConfig();

    if (component === 'sources') {
      return <Sources />;
    }

    if (component === 'properties') {
      return <Properties />;
    }

    if (component === 'childProperties') {
      return (
        <Properties
          childComponentConfig={config.componentConfig}
          configType={config.configType}
        />
      );
    }

    if (component === 'componentList') {
      return <ComponentPicker />;
    }
  };

  if (!editing) {
    return <></>;
  }

  return (
    <Layout
      ref={layoutRef as any}
      model={modelRef.current ?? Model.fromJson(layoutJson)}
      factory={factory}
    />
  );
}

export default Editor;
