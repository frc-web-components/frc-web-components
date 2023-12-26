import"./number-bar.es-90879e86.js";import{x as t}from"./lit-element-37c36932.js";import{o as T}from"./if-defined-04ae3851.js";import{o as v}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";import"./bar.es-670b6bbb.js";import"./state-6b86eede-5fd1e84e.js";import"./query-b33b5ea2-b51c1579.js";import"./axis.es-6aacbeb0.js";import"./transform-bc2573b1-2dde8094.js";const V={value:0,min:-1,max:1,center:0,precision:2,hideText:!1,numTickMarks:3,unit:"",theme:"light","background-color":"#fff","--frc-bar-background":"#ddd","--frc-bar-foreground":"lightblue","--frc-bar-color":"black","--frc-axis-text-color":"black"},F={title:"FRC/Number Bar",tags:["autodocs"],component:"frc-number-bar",args:V,argTypes:{value:{table:{category:"Properties",defaultValue:{summary:0}}},min:{table:{category:"Properties",defaultValue:{summary:-1}}},max:{table:{category:"Properties",defaultValue:{summary:1}}},center:{table:{category:"Properties",defaultValue:{summary:0}}},precision:{table:{category:"Properties",defaultValue:{summary:2}}},hideText:{table:{category:"Properties",defaultValue:{summary:!1}}},numTickMarks:{table:{category:"Properties",defaultValue:{summary:3}}},unit:{table:{category:"Properties",defaultValue:{summary:""}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-bar-background":{table:{category:"Styles",defaultValue:{summary:"#ddd"}}},"--frc-bar-foreground":{control:"color",table:{category:"Styles",defaultValue:{summary:"lightblue"}}},"--frc-bar-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-axis-text-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}}},decorators:[(r,a)=>{const $=a.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",S=a.args["background-color"];return t` <div
        style=${v({minHeight:"50px",padding:"20px 10px",marginBottom:"5px",background:a.args.theme==="custom"?S:$})}
      >
        ${r()}
      </div>`}]};function P(r){return r.theme==="custom"?t`
      <style>
        .custom {
          --frc-bar-background: ${r["--frc-bar-background"]};
          --frc-bar-foreground: ${r["--frc-bar-foreground"]};
          --frc-bar-color: ${r["--frc-bar-color"]};
          --frc-axis-text-color: ${r["--frc-axis-text-color"]};
        }
      </style>
    `:r.theme==="dark"?t`
      <style>
        .dark {
          --frc-bar-background: #444;
          --frc-bar-foreground: steelblue;
          --frc-bar-color: white;
          --frc-axis-text-color: white;
        }
      </style>
    `:t`
    <style>
      .light {
        --frc-bar-background: #ddd;
        --frc-bar-foreground: lightblue;
        --frc-bar-color: black;
        --frc-axis-text-color: black;
      }
    </style>
  `}function m(r={}){return{args:{...V,...r},render:e=>t`
      ${P(e)}
      <frc-number-bar
        class=${e.theme}
        value=${e.value}
        min=${e.min}
        max=${e.max}
        center=${e.center}
        precision=${e.precision}
        ?hide-text=${e.hideText}
        num-tick-marks=${e.numTickMarks}
        unit=${T(e.unit||void 0)}
      ></frc-number-bar>
    `}}const o=m({theme:"light"}),c=m({theme:"dark"}),l=m({theme:"custom","--frc-bar-foreground":"#dd9b0d",value:3.5,min:0,max:5,unit:"V"}),u=m({unit:"g",value:-.5});var s,n,i;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`createNumberBarStory({
  theme: 'light'
})`,...(i=(n=o.parameters)==null?void 0:n.docs)==null?void 0:i.source}}};var d,f,b;c.parameters={...c.parameters,docs:{...(d=c.parameters)==null?void 0:d.docs,source:{originalSource:`createNumberBarStory({
  theme: 'dark'
})`,...(b=(f=c.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var g,y,p;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`createNumberBarStory({
  theme: 'custom',
  '--frc-bar-foreground': '#dd9b0d',
  value: 3.5,
  min: 0,
  max: 5,
  unit: 'V'
})`,...(p=(y=l.parameters)==null?void 0:y.docs)==null?void 0:p.source}}};var h,k,x;u.parameters={...u.parameters,docs:{...(h=u.parameters)==null?void 0:h.docs,source:{originalSource:`createNumberBarStory({
  unit: 'g',
  value: -0.5
})`,...(x=(k=u.parameters)==null?void 0:k.docs)==null?void 0:x.source}}};const H=["LightTheme","DarkTheme","VoltageView","Accelerometer"];export{u as Accelerometer,c as DarkTheme,o as LightTheme,l as VoltageView,H as __namedExportsOrder,F as default};
