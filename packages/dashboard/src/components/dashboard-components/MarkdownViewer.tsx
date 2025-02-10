import MDEditor from '@uiw/react-md-editor';
import styles from './MarkdownViewer.module.scss';
import { createComponent, markdownProp } from './fromProps';
import { getAssetUrl } from '../../main';
import { ntMarkdownComponent } from '../tools/editor/properties/MarkdownEditor';

export const markdownViewer = createComponent(
  {
    dashboard: {
      name: 'Markdown Viewer',
      description: '',
      defaultSize: { width: 200, height: 50 },
      minSize: { width: 50, height: 50 },
    },
    primaryProperty: 'markdown',
    acceptedSourceTypes: ['String'],
    properties: {
      markdown: markdownProp({ defaultValue: '## Hello there' }),
    },
  },
  ({ markdown }) => {
    return (
      <div className={`${styles['markdown-viewer']}`} data-color-mode="dark">
        <MDEditor.Markdown
          source={markdown}
          style={{ background: 'none' }}
          components={{
            img: ({ src, ...props }) => {
              const srcUpdated = !src?.startsWith('/') ? src : getAssetUrl(src);
              return <img {...props} src={srcUpdated} />;
            },
            ['nt' as any]: ntMarkdownComponent,
          }}
        />
      </div>
    );
  },
);
