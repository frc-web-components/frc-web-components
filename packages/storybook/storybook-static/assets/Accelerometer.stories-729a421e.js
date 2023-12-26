import"./accelerometer.es-5712c4e9.js";import{x as t}from"./lit-element-37c36932.js";import{o as g}from"./if-defined-04ae3851.js";import{o as h}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";import"./number-bar.es-90879e86.js";import"./bar.es-670b6bbb.js";import"./state-6b86eede-5fd1e84e.js";import"./query-b33b5ea2-b51c1579.js";import"./axis.es-6aacbeb0.js";import"./transform-bc2573b1-2dde8094.js";const d={value:0,min:-1,max:1,center:0,precision:2,hideText:!1,numTickMarks:3,unit:"g",theme:"light","background-color":"#fff","--frc-bar-background":"#ddd","--frc-bar-foreground":"lightblue","--frc-bar-color":"black","--frc-axis-text-color":"black"},M={title:"FRC/Accelerometer",tags:["autodocs"],component:"frc-accelerometer",args:d,argTypes:{value:{table:{category:"Properties",defaultValue:{summary:0}}},min:{table:{category:"Properties",defaultValue:{summary:-1}}},max:{table:{category:"Properties",defaultValue:{summary:1}}},center:{table:{category:"Properties",defaultValue:{summary:0}}},precision:{table:{category:"Properties",defaultValue:{summary:2}}},hideText:{table:{category:"Properties",defaultValue:{summary:!1}}},numTickMarks:{table:{category:"Properties",defaultValue:{summary:3}}},unit:{table:{category:"Properties",defaultValue:{summary:"g"}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-bar-background":{table:{category:"Styles",defaultValue:{summary:"#ddd"}}},"--frc-bar-foreground":{control:"color",table:{category:"Styles",defaultValue:{summary:"lightblue"}}},"--frc-bar-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-axis-text-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}}},decorators:[(r,o)=>{const b=o.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",y=o.args["background-color"];return t` <div
        style=${h({minHeight:"50px",padding:"20px 10px",marginBottom:"5px",background:o.args.theme==="custom"?y:b})}
      >
        ${r()}
      </div>`}]};function p(r){return r.theme==="custom"?t`
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
  `}function f(r={}){return{args:{...d,...r},render:e=>t`
      ${p(e)}
      <frc-accelerometer
        class=${e.theme}
        value=${e.value}
        min=${e.min}
        max=${e.max}
        center=${e.center}
        precision=${e.precision}
        ?hide-text=${e.hideText}
        num-tick-marks=${e.numTickMarks}
        unit=${g(e.unit||void 0)}
      ></frc-accelerometer>
    `}}const a=f({theme:"light"}),c=f({theme:"dark"});var l,m,u;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`createAccelerometerStory({
  theme: 'light'
})`,...(u=(m=a.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var s,i,n;c.parameters={...c.parameters,docs:{...(s=c.parameters)==null?void 0:s.docs,source:{originalSource:`createAccelerometerStory({
  theme: 'dark'
})`,...(n=(i=c.parameters)==null?void 0:i.docs)==null?void 0:n.source}}};const w=["LightTheme","DarkTheme"];export{c as DarkTheme,a as LightTheme,w as __namedExportsOrder,M as default};
