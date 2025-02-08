import 'flexlayout-react/style/dark.css';
import Titlebar from './titlebar/Titlebar';
import {
  Action,
  Actions,
  Layout as FlexLayout,
  Model,
  TabNode,
} from 'flexlayout-react';
import Editor from './tools/editor/Editor';
import Settings from './tools/Settings';
import { appLayoutJson } from './app-layout';
import DashboardLayout from './DashboardLayout';
import { setEditing } from '@store/slices/appSlice';
import { useAppDispatch } from '@store/app/hooks';

const model = Model.fromJson(appLayoutJson);

function App() {
  const dispatch = useAppDispatch();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        alignItems: 'stretch',
        padding: '3px',
        boxSizing: 'border-box',
        background: 'black',
      }}
    >
      <Titlebar />
      <div
        style={{
          position: 'relative',
          flex: '1',
        }}
      >
        <FlexLayout
          model={model}
          factory={(node: TabNode) => {
            const component = node.getComponent();

            if (component === 'dashboard') {
              return <DashboardLayout />;
            }

            if (component === 'editor') {
              return <Editor />;
            }

            if (component === 'settings') {
              return <Settings />;
            }
          }}
          onModelChange={(model, action: Action) => {
            const tabNode = action.data?.tabNode;
            if (action.type === Actions.SELECT_TAB && tabNode === 'editorTab') {
              const visible = !model.getNodeById('editorTab')?.isVisible();
              dispatch(setEditing(visible));
            } else if (
              action.type === Actions.SELECT_TAB &&
              tabNode === 'settingsTab'
            ) {
              const visible = !model.getNodeById('settingsTab')?.isVisible();
              dispatch(setEditing(visible));
            }
            return action;
          }}
        />
      </div>
    </div>
  );
}

export default App;
