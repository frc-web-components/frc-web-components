import { CustomCellEditorProps } from 'ag-grid-react';
import { memo, useMemo } from 'react';
import MDEditor, { ICommand, divider, getCommands } from '@uiw/react-md-editor';
import { PropertyData } from './Properties';
import { getAssetUrl } from '@/main';
import { selectSourceValue } from '@store/selectors/sourceSelectors';
import { useAppSelector } from '@store/app/hooks';

interface NTProps {
  source?: string;
  defaultValue?: string;
  additionalProps?: any[];
}

export function NT({
  source: sourceString,
  defaultValue,
  additionalProps,
}: NTProps) {
  const source = useMemo(() => {
    if (!sourceString) {
      return undefined;
    }
    if (sourceString.includes(':')) {
      const [key, provider] = sourceString.split(':');
      return { key, provider };
    }
    return { provider: 'NT', key: sourceString };
  }, [sourceString]);

  const value = useAppSelector((state) =>
    selectSourceValue(state, source?.provider, source?.key),
  );

  return (
    <span {...additionalProps}>
      {typeof value !== 'undefined'
        ? JSON.stringify(value)
        : (defaultValue ?? '')}
    </span>
  );
}

export const ntMarkdownComponent = ({
  source,
  default: defaultValue,
  children,
  ...props
}: any) => {
  return (
    <>
      <NT source={source} defaultValue={defaultValue} additionalProps={props} />
      {children}
    </>
  );
};

export default memo((props: CustomCellEditorProps<PropertyData>) => {
  const { value, onValueChange, stopEditing } = props;

  const title3: ICommand = {
    name: 'title3',
    keyCommand: 'title3',
    buttonProps: { 'aria-label': 'Insert title3' },
    icon: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 1,6 L 4,9 L 11,2"
            stroke="white"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span style={{}}>Finish Editing</span>
      </div>
    ),
    execute: () => {
      stopEditing();
    },
  };

  return (
    <div className="container" data-color-mode="dark" style={{ width: '100%' }}>
      <MDEditor
        value={value}
        onChange={(value) => {
          onValueChange(value ?? '');
        }}
        commands={[title3, divider, ...getCommands()]}
        fullscreen
        previewOptions={{
          components: {
            img: ({ src, ...props }) => {
              const srcUpdated = !src?.startsWith('/') ? src : getAssetUrl(src);
              return <img {...props} src={srcUpdated} />;
            },
            ['nt' as any]: ntMarkdownComponent,
          },
        }}
      />
    </div>
  );
});
