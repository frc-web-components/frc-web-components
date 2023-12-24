import hotkeys from 'hotkeys-js';
import { throttle } from './utils';

function isHotKeyArea(ev: KeyboardEvent): boolean {
  const path: HTMLElement[] = (ev as any).path ?? ev.composedPath?.() ?? [];
  const isInDrawer = path.find((part) => part?.matches?.('dashboard-drawer'));
  const isInElementTree = path.find((part) =>
    part?.matches?.('dashboard-element-tree')
  );

  if (isInElementTree) {
    return true;
  }

  return !isInDrawer;
}

export function onRemoveKeyPress(
  callback: () => unknown,
  filter = isHotKeyArea
): void {
  let calls = 0;

  const { throttledCallback, reset, setTime } = throttle(
    (ev: KeyboardEvent) => {
      if (!filter(ev)) {
        return;
      }

      if (calls === 1) {
        setTime(100);
      }
      callback();
      calls += 1;
    },
    500
  );
  hotkeys(
    'backspace,del,delete',
    { keyup: false, keydown: true },
    throttledCallback
  );
  hotkeys('backspace,del,delete', { keyup: true, keydown: false }, () => {
    setTime(500);
    reset();
    calls = 0;
  });
}
