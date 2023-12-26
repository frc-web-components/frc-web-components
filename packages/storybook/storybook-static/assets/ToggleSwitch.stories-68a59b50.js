import{s as b,i as k,k as x,X as v}from"./property-293dc01c-d6840d48.js";import{x as c}from"./lit-element-37c36932.js";import{o as S}from"./style-map-4c049cd0.js";var $=Object.defineProperty,T=Object.getOwnPropertyDescriptor,P=(s,e,r,o)=>{for(var t=o>1?void 0:o?T(e,r):e,a=s.length-1,g;a>=0;a--)(g=s[a])&&(t=(o?g(e,r,t):g(t))||t);return o&&t&&$(e,r,t),t};class n extends x{constructor(){super(...arguments),this.toggled=!1}firstUpdated(){new ResizeObserver(()=>this.resized()).observe(this)}resized(){const e=this.getBoundingClientRect(),{width:r,height:o}=e,t=this.renderRoot.querySelector("[part=switch]");t&&(t.style.borderRadius=`${r}px`,t.style.setProperty("--circle-width",`${o*.8}px`),t.style.setProperty("--circle-height",`${o*.8}px`),t.style.setProperty("--circle-left",`${r/2-o*.8}px`),t.style.setProperty("--circle-top",`${o*.1}px`),t.style.setProperty("--circle-translate-x",`${r-o}px`))}onClick(){this.toggled=!this.toggled;const e=new CustomEvent("toggle",{detail:{toggled:this.toggled},bubbles:!0,composed:!0});this.dispatchEvent(e)}render(){return v`
      <label class="switch" @click="${this.onClick}">
        <input type="checkbox" .checked="${this.toggled}" disabled />
        <span part="switch">
          <span part="knob"></span>
        </span>
      </label>
    `}}n.styles=b`
    :host {
      display: inline-block;
      width: 60px;
      height: 34px;
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 100%;
      height: 100%;
      margin-bottom: 0;
    }
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    [part='switch'] {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--frc-toggle-switch-color, #ccc);
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }
    [part='knob'] {
      position: absolute;
      display: inline-block;
      content: '';
      height: var(--circle-height);
      width: var(--circle-width);
      left: var(--circle-top);
      top: var(--circle-top);
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
      border-radius: 50%;
    }
    input:checked + [part='switch'] {
      background-color: #2196f3;
    }
    input:focus + [part='switch'] {
      box-shadow: 0 0 1px #2196f3;
    }
    input:checked + [part='switch'] [part='knob'] {
      transform: translateX(var(--circle-translate-x));
    }
  `;P([k({type:Boolean})],n.prototype,"toggled",2);customElements.get("frc-toggle-switch")||customElements.define("frc-toggle-switch",n);const y={toggled:!1,theme:"light","background-color":"#fff","--frc-toggle-switch-color":"#ccc"},R={title:"FRC/Toggle Switch",tags:["autodocs"],component:"frc-toggle-switch",args:y,argTypes:{toggled:{table:{category:"Properties",defaultValue:{summary:!1}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-toggle-switch-color":{table:{category:"Styles",defaultValue:{summary:"#ccc"}}}},decorators:[(s,e)=>{const o=e.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",t=e.args["background-color"];return c` <div
        style=${S({padding:"20px 10px",marginBottom:"5px",background:e.args.theme==="custom"?t:o})}
      >
        ${s()}
      </div>`}]};function C(s){return s.theme==="custom"?c`
      <style>
        .custom {
          --frc-toggle-switch-color: ${s["--frc-toggle-switch-color"]};
        }
      </style>
    `:s.theme==="dark"?c`
      <style>
        .dark {
          --frc-toggle-switch-color: #999;
        }
      </style>
    `:c`
    <style>
      .light {
        --frc-toggle-switch-color: #ccc;
      }
    </style>
  `}function w(s={}){return{args:{...y,...s},render:r=>c`
      ${C(r)}
      <frc-toggle-switch
        class=${r.theme}
        ?toggled=${r.toggled}
      ></frc-toggle-switch>
    `}}const i=w({theme:"light"}),l=w({theme:"dark"});var h,d,p;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`createToggleSwitchStory({
  theme: 'light'
})`,...(p=(d=i.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var u,m,f;l.parameters={...l.parameters,docs:{...(u=l.parameters)==null?void 0:u.docs,source:{originalSource:`createToggleSwitchStory({
  theme: 'dark'
})`,...(f=(m=l.parameters)==null?void 0:m.docs)==null?void 0:f.source}}};const V=["LightTheme","DarkTheme"];export{l as DarkTheme,i as LightTheme,V as __namedExportsOrder,R as default};
