import{s as x,i as s,k as q,X as l}from"./property-293dc01c-d6840d48.js";import{o as h}from"./when-b4f6626a-8a775126.js";import"./icon.es-4c9e8042.js";import{x as n}from"./lit-element-37c36932.js";import{o as $}from"./style-map-4c049cd0.js";var A=Object.defineProperty,Z=Object.getOwnPropertyDescriptor,c=(r,e,t,i)=>{for(var o=i>1?void 0:i?Z(e,t):e,m=r.length-1,u;m>=0;m--)(u=r[m])&&(o=(i?u(e,t,o):u(o))||o);return i&&o&&A(e,t,o),o};const S="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z",N="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z",P="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z";class a extends q{constructor(){super(...arguments),this.errors=[],this.warnings=[],this.infos=[],this.level="info",this.hideTitle=!1}render(){return l`
      <div class="alerts-container">
        ${h(!this.hideTitle,()=>l` <header>Alerts</header> `)}
        <div class="alerts-list">
          ${this.errors.map(e=>l`
              <div class="alert">
                <div class="icon">
                  <frc-icon
                    color="red"
                    svg-path=${N}
                    view-box="0 -960 960 960"
                  ></frc-icon>
                </div>
                <label>${e}</label>
              </div>
            `)}
          ${h(this.level!=="error",()=>l`
              ${this.warnings.map(e=>l`
                  <div class="alert">
                    <div class="icon">
                      <frc-icon
                        color="yellow"
                        svg-path=${S}
                        view-box="0 -960 960 960"
                      ></frc-icon>
                    </div>
                    <label>${e}</label>
                  </div>
                `)}
            `)}
          ${h(this.level==="info",()=>l`
              ${this.infos.map(e=>l`
                  <div class="alert">
                    <div class="icon">
                      <frc-icon
                        color="green"
                        svg-path=${P}
                        view-box="0 -960 960 960"
                      ></frc-icon>
                    </div>
                    <label>${e}</label>
                  </div>
                `)}
            `)}
        </div>
      </div>
    `}}a.styles=x`
    :host {
      font-family: sans-serif;
      display: inline-block;
      width: 300px;
      height: auto;
      box-sizing: border-box;
      color: var(--frc-network-alerts-text-color, black);
    }

    .alerts-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }

    header {
      background: var(--frc-network-alerts-header-color, lightblue);
      padding: 10px 0;
      text-align: center;
      font-weight: bold;
    }

    .alerts-list {
      padding: 8px 5px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 9px;
      flex: 1;
      overflow-y: auto;
    }

    .alert {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .icon {
      width: 24px;
      height: 24px;
    }

    .alert label {
      flex: 1;
    }

    .icon frc-icon {
      width: 100%;
      height: 100%;
    }
  `;c([s({type:Array})],a.prototype,"errors",2);c([s({type:Array})],a.prototype,"warnings",2);c([s({type:Array})],a.prototype,"infos",2);c([s({type:String})],a.prototype,"level",2);c([s({type:Boolean,attribute:"hide-title"})],a.prototype,"hideTitle",2);customElements.get("frc-network-alerts")||customElements.define("frc-network-alerts",a);const k={errors:[],warnings:[],infos:[],level:"info",hideTitle:!1,theme:"light","background-color":"#fff","--frc-network-alerts-text-color":"black","--frc-network-alerts-header-color":"lightblue"},X={title:"FRC/Network Alerts",tags:["autodocs"],component:"frc-network-alerts",args:k,argTypes:{errors:{control:"object",table:{category:"Properties",defaultValue:{summary:[]}}},warnings:{control:"object",table:{category:"Properties",defaultValue:{summary:[]}}},infos:{control:"object",table:{category:"Properties",defaultValue:{summary:[]}}},level:{control:"radio",options:["info","warning","error"],table:{category:"Properties",defaultValue:"info"}},hideTitle:{table:{category:"Properties",defaultValue:{summary:!1}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-network-alerts-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-network-alerts-header-color":{table:{category:"Styles",defaultValue:{summary:"lightblue"}}}},decorators:[(r,e)=>{const i=e.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",o=e.args["background-color"];return n` <div
        style=${$({padding:"20px 10px",marginBottom:"5px",background:e.args.theme==="custom"?o:i})}
      >
        ${r()}
      </div>`}]};function F(r){return r.theme==="custom"?n`
      <style>
        .custom {
          --frc-network-alerts-text-color: ${r["--frc-network-alerts-text-color"]};
          --frc-network-alerts-header-color: ${r["--frc-network-alerts-header-color"]};
        }
      </style>
    `:r.theme==="dark"?n`
      <style>
        .dark {
          --frc-network-alerts-text-color: white;
          --frc-network-alerts-header-color: steelblue;
        }
      </style>
    `:n`
    <style>
      .light {
        --frc-network-alerts-text-color: black;
        --frc-network-alerts-header-color: lightblue;
      }
    </style>
  `}function T(r={}){return{args:{...k,...r},render:t=>n`
      ${F(t)}
      <frc-network-alerts
        class=${t.theme}
        errors=${JSON.stringify(t.errors)}
        warnings=${JSON.stringify(t.warnings)}
        infos=${JSON.stringify(t.infos)}
        level=${t.level}
        ?hide-title=${t.hideTitle}
      ></frc-network-alerts>
    `}}const d=T({theme:"light",errors:["Failed to initialize navX, odometry will likely be nonfunctional.","Pressure sensor not connected, unable to move hood."],warnings:["No override controller.","Failed to read MAC, using default robot instead."],infos:["Tuning mode active, expect decreased network performance."]}),f=T({theme:"dark",errors:["Failed to initialize navX, odometry will likely be nonfunctional.","Pressure sensor not connected, unable to move hood."],warnings:["No override controller.","Failed to read MAC, using default robot instead."],infos:["Tuning mode active, expect decreased network performance."]});var g,p,y;d.parameters={...d.parameters,docs:{...(g=d.parameters)==null?void 0:g.docs,source:{originalSource:`createNetworkAlertsStory({
  theme: 'light',
  errors: ['Failed to initialize navX, odometry will likely be nonfunctional.', 'Pressure sensor not connected, unable to move hood.'],
  warnings: ['No override controller.', 'Failed to read MAC, using default robot instead.'],
  infos: ['Tuning mode active, expect decreased network performance.']
})`,...(y=(p=d.parameters)==null?void 0:p.docs)==null?void 0:y.source}}};var v,b,w;f.parameters={...f.parameters,docs:{...(v=f.parameters)==null?void 0:v.docs,source:{originalSource:`createNetworkAlertsStory({
  theme: 'dark',
  errors: ['Failed to initialize navX, odometry will likely be nonfunctional.', 'Pressure sensor not connected, unable to move hood.'],
  warnings: ['No override controller.', 'Failed to read MAC, using default robot instead.'],
  infos: ['Tuning mode active, expect decreased network performance.']
})`,...(w=(b=f.parameters)==null?void 0:b.docs)==null?void 0:w.source}}};const j=["LightTheme","DarkTheme"];export{f as DarkTheme,d as LightTheme,j as __namedExportsOrder,X as default};
