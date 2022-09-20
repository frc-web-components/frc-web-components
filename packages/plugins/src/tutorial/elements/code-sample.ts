/* eslint-disable import/extensions */
import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import escape from 'lodash.escape';
import unescape from 'lodash.unescape';
import hljs from 'highlight.js';
import { WebbitConfig } from '@webbitjs/webbit';

export const codeSampleConfig: Partial<WebbitConfig> = {
  properties: {
    title: { type: 'String' },
    description: { type: 'String' },
    code: {
      type: 'String',
      input: { type: 'Textarea' },
      property: 'innerHTML',
      attribute: false,
    },
  },
};

@customElement('fwc-code-sample')
export default class CodeSample extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: 10px;
      box-sizing: border-box;
      font-size: 13px;
      width: 100%;
      box-sizing: border-box;
    }

    main {
      border: 1px solid #e0e0e0;
    }

    pre {
      margin: 30px 0 0;
      display: block;
    }

    header {
      margin: 20px 0;
    }

    h3 {
      font-weight: normal;
      font-size: 25px;
      margin-bottom: 0px;
    }

    h4 {
      font-weight: normal;
      font-size: 17px;
    }

    .preview {
      padding: 40px 20px 10px;
    }

    code.html {
      padding: 20px;
    }

    .hljs-tag {
      line-break: anywhere;
    }
  `;

  @property({ type: String }) title = '';
  @property({ type: String }) description = '';

  getCode(): string {
    const htmlContent: string = escape(this.innerHTML);
    const lines = htmlContent.split('\n');
    const firstCodeLine = lines.findIndex((value) => value.length > 0);

    if (firstCodeLine < 0) {
      return htmlContent;
    }

    let whiteSpaceToRemove = '';
    const whiteSpaceCharacters = lines[firstCodeLine].search(/\S/);
    for (let i = 0; i < whiteSpaceCharacters; i += 1) {
      whiteSpaceToRemove += ' ';
    }

    const newHtml = lines
      .map((line) => line.replace(whiteSpaceToRemove, ''))
      .map((line) => {
        let transformedLine = line;
        const escapedArrays = [
          ...transformedLine.matchAll(
            /(=&quot;\[)(&amp;quot;.*?&amp;quot;)(\]&quot;)/g
          ),
        ];
        escapedArrays.forEach((match) => {
          const [original, start, middle, end] = match;
          const newStart = unescape(start).replace('"', "'");
          const newMiddle = unescape(middle);
          const newEnd = unescape(end).replace('"', "'");
          const newString = newStart + newMiddle + newEnd;
          transformedLine = transformedLine.replace(original, newString);
        });
        return transformedLine;
      })
      .map((line) => line.replace('=&quot;&quot;', ''))
      .join('\n');

    return newHtml;
  }

  firstUpdated(): void {
    const codeElement = this.renderRoot.querySelector('pre code');
    if (codeElement) {
      codeElement.innerHTML = this.getCode();
      hljs.highlightBlock(codeElement as HTMLElement);
    }
  }

  render(): TemplateResult {
    return html`
      <header>
        <h3>${this.title}</h3>
        <h4>${this.description}</h4>
      </header>
      <main>
        <div class="preview">
          <slot></slot>
        </div>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.9.1/styles/default.min.css"
        />
        <pre><code class="html"></code></pre>
      </main>
    `;
  }
}
