import { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../app/createAppSlice';

interface ContextMenuElement {
  type: 'ELEMENT' | 'TAB';
  position: { left: number; top: number };
  elementId?: string;
}

export interface AppSliceState {
  editing: boolean;
  contextMenuElement?: ContextMenuElement;
}

const initialState: AppSliceState = {
  editing: true,
};

export const appSlice = createAppSlice({
  name: 'app',
  initialState,
  reducers: (create) => ({
    toggleEditing: create.reducer((state) => {
      state.editing = !state.editing;
    }),
    setEditing: create.reducer((state, action: PayloadAction<boolean>) => {
      state.editing = action.payload;
    }),
    setContextMenuElement: create.reducer(
      (state, action: PayloadAction<ContextMenuElement | undefined>) => {
        state.contextMenuElement = action.payload;
      },
    ),
  }),
  selectors: {
    selectEditing: (state) => state.editing,
    selectContextMenuElement: (state) => state.contextMenuElement,
  },
});

export const { toggleEditing, setContextMenuElement, setEditing } =
  appSlice.actions;
export const {
  selectEditing,
  selectContextMenuElement: selectContextMenuElement,
} = appSlice.selectors;
