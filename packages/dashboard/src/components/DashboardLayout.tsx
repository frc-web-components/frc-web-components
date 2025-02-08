import 'flexlayout-react/style/dark.css';
import {
  BorderNode,
  ITabSetRenderValues,
  Layout as FlexLayout,
  Model,
  TabSetNode,
  Action,
} from 'flexlayout-react';
import { useRef } from 'react';
import Tab from './tab/Tab';
import { useAppDispatch, useAppSelector } from '@store/app/hooks';
import AddIcon from '@mui/icons-material/Add';
import { setFlexLayout } from '@store/slices/layoutSlice';
import { selectFlexLayout } from '@store/selectors/layoutSelectors';
import { selectEditing } from '@store/slices/appSlice';

function DashboardLayout() {
  const layoutRef = useRef<FlexLayout>();
  const layoutJson = useAppSelector(selectFlexLayout);
  const isEditing = useAppSelector(selectEditing);
  const dispatch = useAppDispatch();

  return (
    <FlexLayout
      ref={layoutRef as any}
      model={Model.fromJson(layoutJson)}
      factory={(node) => <Tab tabId={node.getId()} />}
      onModelChange={(model, action: Action) => {
        dispatch(setFlexLayout(model.toJson() as any));
        return action;
      }}
      onRenderTabSet={(
        tabSetNode: TabSetNode | BorderNode,
        renderValues: ITabSetRenderValues,
      ) => {
        if (!isEditing) {
          return;
        }
        renderValues.stickyButtons.push(
          <AddIcon
            onClick={() => {
              layoutRef!.current!.addTabToTabSet(tabSetNode.getId(), {
                component: 'components',
                name: 'Unnamed Tab',
              });
            }}
            fontSize="small"
            style={{
              cursor: 'pointer',
            }}
          />,
        );
      }}
    />
  );
}

export default DashboardLayout;
