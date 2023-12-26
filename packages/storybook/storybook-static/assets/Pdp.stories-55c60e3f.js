import{s as w,i as f,k as C,X as l}from"./property-293dc01c-d6840d48.js";import"./number-bar.es-90879e86.js";import"./voltage-view.es-85b26098.js";import"./bar.es-670b6bbb.js";import"./axis.es-6aacbeb0.js";import"./transform-bc2573b1-2dde8094.js";import{x as c}from"./lit-element-37c36932.js";import{o as S}from"./style-map-4c049cd0.js";import"./state-6b86eede-5fd1e84e.js";import"./query-b33b5ea2-b51c1579.js";var V=Object.defineProperty,P=Object.getOwnPropertyDescriptor,g=(e,t,r,a)=>{for(var o=a>1?void 0:a?P(t,r):t,m=e.length-1,d;m>=0;m--)(d=e[m])&&(o=(a?d(t,r,o):d(o))||o);return a&&o&&V(t,r,o),o};function s(e,t){const r=[];for(let a=e;a<t;a+=1)r.push(a);return r}class n extends C{constructor(){super(...arguments),this.voltage=0,this.totalCurrent=0,this.channels=Array(16).fill(0)}renderChannel(t){return l`
      <frc-number-bar
        class="channel"
        part="channel"
        value=${this.channels[t]??0}
        min="0"
        max="40"
        center="0"
        precision="2"
        ?hide-text="${!1}"
        num-tick-marks="0"
        unit="A"
      ></frc-number-bar>
    `}render(){return l`
      <div part="channels">
        ${s(0,8).map(t=>l`
            <label part="channel-label">
              <slot name="${`channel-label${t}`}">Ch. ${t}</slot>
            </label>
          `)}
        ${s(0,8).map(t=>l` ${this.renderChannel(t)} `)}
        ${s(8,16).map(t=>l`
            <label part="channel-label">
              <slot name="${`channel-label${t}`}">Ch. ${t}</slot>
            </label>
          `)}
        ${s(8,16).map(t=>l` ${this.renderChannel(t)} `)}
      </div>
      <div part="voltage-and-total-current">
        <label part="voltage-label">
          <slot name="voltage-label">Voltage</slot>
        </label>
        <label part="total-current-label">
          <slot name="total-current">Total Current</slot>
        </label>
        <frc-voltage-view
          class="voltage"
          part="voltage"
          value="${this.voltage}"
          min="0"
          max="15"
          center="0"
          precision="2"
          ?hide-text="${!1}"
          num-tick-marks="0"
        ></frc-voltage-view>
        <frc-number-bar
          class="total-current"
          part="total-current"
          value="${this.totalCurrent}"
          min="0"
          max="500"
          center="0"
          precision="2"
          ?hide-text="${!1}"
          num-tick-marks="0"
          unit="A"
        ></frc-number-bar>
      </div>
    `}}n.styles=w`
    :host {
      display: inline-block;
      width: 350px;
      margin: 5px;
      color: var(--frc-label-text-color, black);
      font-family: sans-serif;
      font-size: 16px;
    }

    [part='channels'] {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: min-content 1fr min-content 1fr;
      grid-template-rows: auto auto auto auto auto auto auto auto;
      width: 100%;
      height: auto;
      align-items: center;
      gap: 3px;
    }

    .channel,
    .voltage,
    .total-current {
      width: auto;
    }

    [part='channel-label'] {
      padding-left: 5px;
      text-align: right;
      white-space: nowrap;
    }

    [part='voltage-and-total-current'] {
      margin-top: 5px;
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: min-content auto;
      grid-template-rows: auto auto;
      column-gap: 10px;
      width: 100%;
      height: auto;
      align-items: center;
      gap: 3px;
    }

    [part='voltage-and-total-current'] {
      white-space: nowrap;
    }
  `;g([f({type:Number})],n.prototype,"voltage",2);g([f({type:Number,attribute:"total-current"})],n.prototype,"totalCurrent",2);g([f({type:Array})],n.prototype,"channels",2);customElements.get("frc-pdp")||customElements.define("frc-pdp",n);const k={voltage:0,totalCurrent:0,channels:Array(16).fill(0),theme:"light","background-color":"#fff","--frc-label-text-color":"black","--frc-axis-text-color":"black","--frc-bar-background":"#ddd","--frc-bar-foreground":"lightblue","--frc-bar-color":"black","--frc-voltage-view-foreground-color":"#ffbd2f"},B={title:"FRC/PDP",tags:["autodocs"],component:"frc-pdp",args:k,argTypes:{voltage:{table:{category:"Properties",defaultValue:{summary:0}},control:{type:"number",min:0,max:15}},totalCurrent:{table:{category:"Properties",defaultValue:{summary:0}},control:{type:"number",min:0,max:500}},channels:{control:"object",table:{category:"Properties",defaultValue:{summary:Array(16).fill(0)}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-label-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-bar-background":{table:{category:"Styles",defaultValue:{summary:"#ddd"}}},"--frc-bar-foreground":{control:"color",table:{category:"Styles",defaultValue:{summary:"lightblue"}}},"--frc-bar-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-axis-text-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-voltage-view-foreground-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"#ffbd2f"}}}},decorators:[(e,t)=>{const a=t.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",o=t.args["background-color"];return c` <div
        style=${S({padding:"20px 10px",marginBottom:"5px",background:t.args.theme==="custom"?o:a})}
      >
        ${e()}
      </div>`}]};function A(e){return e.theme==="custom"?c`
      <style>
        .custom {
          --frc-label-text-color: ${e["--frc-label-text-color"]};
          --frc-bar-background: ${e["--frc-bar-background"]};
          --frc-bar-foreground: ${e["--frc-bar-foreground"]};
          --frc-bar-color: ${e["--frc-bar-color"]};
          --frc-axis-text-color: ${e["--frc-axis-text-color"]};
          --frc-voltage-view-foreground-color: ${e["--frc-voltage-view-foreground-color"]};
        }
      </style>
    `:e.theme==="dark"?c`
      <style>
        .dark {
          --frc-label-text-color: white;
          --frc-bar-background: #444;
          --frc-bar-foreground: steelblue;
          --frc-bar-color: white;
          --frc-axis-text-color: white;
          --frc-voltage-view-foreground-color: #ffbd2f;
        }
      </style>
    `:c`
    <style>
      .light {
        --frc-label-text-color: black;
        --frc-bar-background: #ddd;
        --frc-bar-foreground: lightblue;
        --frc-bar-color: black;
        --frc-axis-text-color: black;
        --frc-voltage-view-foreground-color: #dd9b0d;
      }
    </style>
  `}function $(e={}){return{args:{...k,...e},render:r=>c`
      ${A(r)}
      <frc-pdp
        class=${r.theme}
        voltage=${r.voltage}
        total-current=${r.totalCurrent}
        channels=${JSON.stringify(r.channels)}
      ></frc-pdp>
    `}}const u=$({theme:"light"}),i=$({theme:"dark"});var b,p,h;u.parameters={...u.parameters,docs:{...(b=u.parameters)==null?void 0:b.docs,source:{originalSource:`createPdpStory({
  theme: 'light'
})`,...(h=(p=u.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var y,v,x;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`createPdpStory({
  theme: 'dark'
})`,...(x=(v=i.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};const F=["LightTheme","DarkTheme"];export{i as DarkTheme,u as LightTheme,F as __namedExportsOrder,B as default};
