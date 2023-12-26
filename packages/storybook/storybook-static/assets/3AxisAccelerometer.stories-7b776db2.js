import{s as T,i as o,k as V,X as p}from"./property-293dc01c-d6840d48.js";import"./accelerometer.es-5712c4e9.js";import"./bar.es-670b6bbb.js";import"./axis.es-6aacbeb0.js";import"./number-bar.es-90879e86.js";import"./transform-bc2573b1-2dde8094.js";import{x as s}from"./lit-element-37c36932.js";import{o as S}from"./style-map-4c049cd0.js";import"./state-6b86eede-5fd1e84e.js";import"./query-b33b5ea2-b51c1579.js";var w=Object.defineProperty,A=Object.getOwnPropertyDescriptor,c=(r,t,e,i)=>{for(var l=i>1?void 0:i?A(t,e):t,n=r.length-1,d;n>=0;n--)(d=r[n])&&(l=(i?d(t,e,l):d(l))||l);return i&&l&&w(t,e,l),l};class a extends V{constructor(){super(...arguments),this.x=0,this.y=0,this.z=0,this.min=-1,this.max=1,this.center=0,this.precision=2,this.hideText=!1,this.numTickMarks=3,this.unit="g"}renderAccelerometer(t,e){return p`
      <div part="accelerometer">
        <label part="label">${t}</label>
        <frc-accelerometer
          part="${t}"
          value="${this[t]||0}"
          min="${this.min}"
          max="${this.max}"
          center="${this.center}"
          precision="${this.precision}"
          ?hide-text="${this.hideText}"
          num-tick-marks="${e}"
          unit="${this.unit}"
        ></frc-accelerometer>
      </div>
    `}render(){return p`
      ${this.renderAccelerometer("x",0)} ${this.renderAccelerometer("y",0)}
      ${this.renderAccelerometer("z",this.numTickMarks)}
    `}}a.styles=T`
    :host {
      display: inline-flex;
      flex-direction: column;
      height: auto;
      font-family: sans-serif;
      width: 300px;
    }

    [part='accelerometer'] {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
    }

    [part='accelerometer']:last-child {
      margin-bottom: 0;
    }

    [part='accelerometer'] label {
      width: 10px;
      padding-top: 2px;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--frc-3-axis-accelerometer-label-color, #000);
    }

    frc-accelerometer {
      width: 100%;
      flex: 1;
    }

    :host(:not([num-tick-marks='0'])) frc-accelerometer::part(bar) {
      width: calc(100% - 40px);
      margin: 0 20px;
    }

    :host([num-tick-marks='0']) frc-accelerometer::part(bar) {
      width: 100%;
      margin: 0;
    }
  `;c([o({type:Number})],a.prototype,"x",2);c([o({type:Number})],a.prototype,"y",2);c([o({type:Number})],a.prototype,"z",2);c([o({type:Number})],a.prototype,"min",2);c([o({type:Number})],a.prototype,"max",2);c([o({type:Number})],a.prototype,"center",2);c([o({type:Number})],a.prototype,"precision",2);c([o({type:Boolean,attribute:"hide-text"})],a.prototype,"hideText",2);c([o({type:Number,attribute:"num-tick-marks"})],a.prototype,"numTickMarks",2);c([o({type:String})],a.prototype,"unit",2);customElements.get("frc-3-axis-accelerometer")||customElements.define("frc-3-axis-accelerometer",a);const k={x:0,y:0,z:0,min:-1,max:1,center:0,precision:2,hideText:!1,numTickMarks:3,unit:"g",theme:"light","background-color":"white","--frc-bar-background":"#ddd","--frc-bar-foreground":"lightblue","--frc-bar-color":"black","--frc-axis-text-color":"black","--frc-3-axis-accelerometer-label-color":"black"},L={title:"FRC/3-Axis Accelerometer",tags:["autodocs"],component:"frc-3-axis-accelerometer",args:k,argTypes:{x:{table:{category:"Properties",defaultValue:{summary:0}}},y:{table:{category:"Properties",defaultValue:{summary:0}}},z:{table:{category:"Properties",defaultValue:{summary:0}}},min:{table:{category:"Properties",defaultValue:{summary:-1}}},max:{table:{category:"Properties",defaultValue:{summary:1}}},center:{table:{category:"Properties",defaultValue:{summary:0}}},precision:{table:{category:"Properties",defaultValue:{summary:2}}},hideText:{table:{category:"Properties",defaultValue:{summary:!1}}},numTickMarks:{table:{category:"Properties",defaultValue:{summary:3}}},unit:{table:{category:"Properties",defaultValue:{summary:""}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"white"}},"--frc-bar-background":{table:{category:"Styles",defaultValue:{summary:"#ddd"}}},"--frc-bar-foreground":{control:"color",table:{category:"Styles",defaultValue:{summary:"lightblue"}}},"--frc-bar-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-axis-text-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-3-axis-accelerometer-label-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}}},decorators:[(r,t)=>{const i=t.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",l=t.args["background-color"];return s` <div
        style=${S({padding:"20px 10px",marginBottom:"5px",background:t.args.theme==="custom"?l:i})}
      >
        ${r()}
      </div>`}]};function P(r){return r.theme==="custom"?s`
      <style>
        .custom {
          --frc-bar-background: ${r["--frc-bar-background"]};
          --frc-bar-foreground: ${r["--frc-bar-foreground"]};
          --frc-bar-color: ${r["--frc-bar-color"]};
          --frc-axis-text-color: ${r["--frc-axis-text-color"]};
          --frc-3-axis-accelerometer-label-color: ${r["--frc-3-axis-accelerometer-label-color"]};
        }
      </style>
    `:r.theme==="dark"?s`
      <style>
        .dark {
          --frc-bar-background: #444;
          --frc-bar-foreground: steelblue;
          --frc-bar-color: white;
          --frc-axis-text-color: white;
          --frc-3-axis-accelerometer-label-color: white;
        }
      </style>
    `:s`
    <style>
      .light {
        --frc-bar-background: #ddd;
        --frc-bar-foreground: lightblue;
        --frc-bar-color: black;
        --frc-axis-text-color: black;
        --frc-3-axis-accelerometer-label-color: black;
      }
    </style>
  `}function $(r={}){return{args:{...k,...r},render:e=>s`
      ${P(e)}
      <frc-3-axis-accelerometer
        class=${e.theme}
        x=${e.x}
        y=${e.y}
        z=${e.z}
        min=${e.min}
        max=${e.max}
        center=${e.center}
        precision=${e.precision}
        ?hide-text=${e.hideText}
        num-tick-marks=${e.numTickMarks}
        unit=${e.unit}
      ></frc-3-axis-accelerometer>
    `}}const m=$({theme:"light"}),u=$({theme:"dark"});var f,b,y;m.parameters={...m.parameters,docs:{...(f=m.parameters)==null?void 0:f.docs,source:{originalSource:`createAccelerometerStory({
  theme: 'light'
})`,...(y=(b=m.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var h,x,g;u.parameters={...u.parameters,docs:{...(h=u.parameters)==null?void 0:h.docs,source:{originalSource:`createAccelerometerStory({
  theme: 'dark'
})`,...(g=(x=u.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};const X=["LightTheme","DarkTheme"];export{u as DarkTheme,m as LightTheme,X as __namedExportsOrder,L as default};
