import 'wired-elements';

export default {
  'wired-button': {
    properties: {
      elevation: { type: 'Number', defaultValue: 1 },
      disabled: { type: 'Boolean', reflect: true },
    },
    demos: [
      { html: `<wired-button>Hello there</wired-button>` }
    ],
  },
  'wired-card': {
    properties: {
      elevation: { type: 'Number', defaultValue: 1 },
      fill: { type: 'String', input: { type: 'ColorPicker' } }
    },
    slots: [{ name: '' }],
    demos: [
      {
        html: `
          <wired-card>
            <h4>Card Header</h4>
            <p>Some text</p>
          </wired-card>
        `
      }
    ],
  },
  'wired-checkbox': {
    properties: {
      checked: { type: 'Boolean', changeEvent: 'change', primary: true },
      disabled: { type: 'Boolean', reflect: true },
    },
    demos: [
      { html: `<wired-checkbox>Checkbox</wired-checkbox>` }
    ]
  },
  'wired-combo': {
    properties: {
      disabled: { type: 'Boolean', reflect: true },
      selected: { type: 'String', changeEvent: 'selected', primary: true },
    },
    slots: [
      { name: '', allowedChildren: ['wired-item'] },
    ],
    demos: [
      {
        html: `
          <wired-combo selected="two">
            <wired-item value="one">Number One</wired-item>
            <wired-item value="two">Number Two</wired-item>
            <wired-item value="three">Number Three</wired-item>
          </wired-combo>
        `
      }
    ]
  },
  'wired-item': {
    properties: {
      value: { type: 'String', primary: true },
    },
    dashboard: {
      topLevel: false,
    },
    demos: [
      { html: `<wired-item value="item">Some Item</wired-item>` }
    ],
  },
  'wired-dialog': {
    properties: {
      elevation: { type: 'Number', defaultValue: 5 },
      open: { type: 'Boolean', reflect: true, primary: true },
    },
    demos: [
      {
        html: `
          <wired-dialog>
            <p>
              Dialog content here
            </p>
            <div style="text-align: right; padding: 30px 16px 16px;">
              <wired-button id="closeDialog">Close dialog</wired-button>
            </div>
          </wired-dialog>
        `
      }
    ]
  },
  'wired-divider': {
    properties: {
      elevation: { type: 'Number', defaultValue: 1 },
    }
  },
  'wired-fab': {
    properties: {
      disabled: { type: 'Boolean', reflect: true },
    },
    demos: [
      {
        html: `
          <wired-fab>
            <span class="iconify" data-icon="mdi:heart"></span>
          </wired-fab>
        `
      }
    ]
  },
  'wired-icon-button': {
    properties: {
      disabled: { type: 'Boolean', reflect: true },
    },
    demos: [
      {
        html: `
          <wired-icon-button>
            <span class="iconify" data-icon="mdi:heart"></span>
          </wired-icon-button>
        `
      }
    ]
  },
  'wired-image': {
    properties: {
      src: { type: 'String', primary: true },
      elevation: { type: 'Number', defaultValue: 1 },
    },
    demos: [
      { html: `<wired-image src="https://www.gstatic.com/webp/gallery/1.sm.jpg"></wired-image>` }
    ]
  },
  'wired-input': {
    properties: {
      placeholder: { type: 'String' },
      disabled: { type: 'Boolean', reflect: true },
      type: { type: 'String' },
      value: { type: 'String', changeEvent: 'change', primary: true },
    },
    demos: [
      { html: `<wired-input type="text"></wired-input>` }
    ]
  },
  'wired-link': {
    properties: {
      elevation: { type: 'Number', defaultValue: 1 },
      href: { type: 'String', primary: true },
      target: {
        type: 'String',
        input: {
          type: 'StringDropdown',
          allowCustomValues: false,
          getOptions() {
            return ['_blank', '_self', '_parent', '_top', 'framename'];
          },
        }
      },
    },
    demos: [
      { html: `<wired-link href="https://docs.wpilib.org/en/stable/" target="_blank">WPILib Docs</wired-link>` }
    ]
  },
  'wired-listbox': {
    properties: {
      horizontal: { type: 'Boolean' },
      selected: { type: 'String', primary: true, changeEvent: 'selected' },
    },
    demos: [
      {
        html: `
          <wired-listbox id="combo" selected="two">
            <wired-item value="one">Number One</wired-item>
            <wired-item value="two">Number Two</wired-item>
            <wired-item value="three">Number Three</wired-item>
          </wired-listbox>
        `
      }
    ]
  },
  'wired-progress': {
    properties: {
      value: { type: 'Number', primary: true },
      min: { type: 'Number' },
      max: { type: 'Number', defaultValue: 100 },
      percentage: { type: 'Boolean' },
    }
  },
  // 'wired-progress-ring': {
  //   properties: {
  //     value: { type: 'Number', primary: true },
  //     min: { type: 'Number' },
  //     max: { type: 'Number', defaultValue: 100 },
  //     hideLabel: { type: 'Boolean' },
  //     showLabelAsPercent: { type: 'Boolean' },
  //     precision: { type: 'Number' },
  //   }
  // },
  'wired-radio-group': {
    properties: {
      selected: { type: 'String', primary: true, changeEvent: 'selected' }
    },
    slots: [{ name: '', allowedChildren: ['wired-radio'] }],
    demos: [
      {
        html: `
          <wired-radio-group selected="two">
            <wired-radio name="one">One</wired-radio>
            <wired-radio name="two">Two</wired-radio>
            <wired-radio name="three">Three</wired-radio>
            <wired-radio name="four">Four</wired-radio>
          </wired-radio-group>
        `
      }
    ]
  },
  'wired-radio': {
    properties: {
      name: { type: 'String' },
      disabled: { type: 'Boolean', reflect: true },
      checked: { type: 'Boolean', primary: true, changeEvent: 'change' },
      text: { type: 'String' }
    },
    dashboard: {
      topLevel: false,
    },
    demos: [
      {
        html: `<wired-radio name="radio">Radio Button</wired-radio>`
      }
    ]
  },
  'wired-search-input': {
    properties: {
      placeholder: { type: 'String' },
      disabled: { type: 'Boolean', reflect: true },
      value: { type: 'String', primary: true, changeEvent: 'change' },
    }
  },
  'wired-slider': {
    properties: {
      value: { type: 'Number', defaultValue: 50, primary: true, changeEvent: 'change' },
      min: { type: 'Number' },
      max: { type: 'Number', defaultValue: 100 },
    },
  },
  'wired-spinner': {
    properties: {
      spinning: { type: 'Boolean', primary: true },
      duration: { type: 'Number', defaultValue: 1500 },
    }
  },
  'wired-tabs': {
    properties: {
      selected: { type: 'String', primary: true }
    },
    demos: [
      {
        html: `
          <wired-tabs selected="Two">
            <wired-tab name="One">
              <h4>Card 1</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </wired-tab>
            <wired-tab name="Two">
              <h4>Card 2</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </wired-tab>
            <wired-tab name="Three">
              <h4>Card 3</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </wired-tab>
          </wired-tabs>
        `
      }
    ]
  },
  'wired-tab': {
    properties: {
      name: { type: 'String' },
      label: { type: 'String' },
    },
    demos: [{ html: `<wired-tab name="Tab">` }]
  },
  'wired-textarea': {
    properties: {
      rows: { type: 'Number' },
      maxrows: { type: 'Number' },
      value: { type: 'String', input: { type: 'Textarea' }, primary: true, changeEvent: 'change' },
      disabled: { type: 'Boolean', reflect: true },
      placeholder: { type: 'String' },
    }
  },
  'wired-toggle': {
    properties: {
      checked: { type: 'Boolean', primary: true, changeEvent: 'change' },
      disabled: { type: 'Boolean', reflect: true },
    }
  },
  'wired-video': {
    properties: {
      src: { type: 'String', primary: true },
      autoplay: { type: 'Boolean' },
      loop: { type: 'Boolean' },
      muted: { type: 'Boolean' },
      playsinline: { type: 'Boolean' },
    },
    demos: [
      { html: `<wired-video src="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"></wired-video>` }
    ]
  }
};