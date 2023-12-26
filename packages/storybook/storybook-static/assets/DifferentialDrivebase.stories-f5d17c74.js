import"./drivebases.es-52a60d67.js";import{x as t}from"./lit-element-37c36932.js";import{o as y}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";import"./bar.es-670b6bbb.js";import"./state-6b86eede-5fd1e84e.js";import"./query-b33b5ea2-b51c1579.js";import"./axis.es-6aacbeb0.js";import"./transform-bc2573b1-2dde8094.js";const m={leftMotorSpeed:0,rightMotorSpeed:0,theme:"light","background-color":"#fff","--frc-differential-drivebase-drivetrain-color":"black","--frc-bar-background":"#ddd","--frc-bar-foreground":"lightblue","--frc-axis-text-color":"black"},M={title:"FRC/Differential Drivebase",tags:["autodocs"],component:"frc-differential-drivebase",args:m,argTypes:{leftMotorSpeed:{table:{category:"Properties",defaultValue:{summary:0}},control:{type:"number",min:-1,max:1}},rightMotorSpeed:{table:{category:"Properties",defaultValue:{summary:0}},control:{type:"number",min:-1,max:1}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-differential-drivebase-drivetrain-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-bar-background":{table:{category:"Styles",defaultValue:{summary:"#ddd"}}},"--frc-bar-foreground":{control:"color",table:{category:"Styles",defaultValue:{summary:"lightblue"}}},"--frc-axis-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}}},decorators:[(e,o)=>{const b=o.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",g=o.args["background-color"];return t` <div
        style=${y({padding:"20px 10px",marginBottom:"5px",background:o.args.theme==="custom"?g:b})}
      >
        ${e()}
      </div>`}]};function h(e){return e.theme==="custom"?t`
      <style>
        .custom {
          --frc-differential-drivebase-drivetrain-color: ${e["--frc-differential-drivebase-drivetrain-color"]};
          --frc-bar-background: ${e["--frc-bar-background"]};
          --frc-bar-foreground: ${e["--frc-bar-foreground"]};
          --frc-axis-text-color: ${e["--frc-axis-text-color"]};
        }
      </style>
    `:e.theme==="dark"?t`
      <style>
        .dark {
          --frc-differential-drivebase-drivetrain-color: #aaa;
          --frc-bar-background: #444;
          --frc-bar-foreground: steelblue;
          --frc-axis-text-color: white;
        }
      </style>
    `:t`
    <style>
      .light {
        --frc-differential-drivebase-drivetrain-color: black;
        --frc-bar-background: #ddd;
        --frc-bar-foreground: lightblue;
        --frc-axis-text-color: black;
      }
    </style>
  `}function u(e={}){return{args:{...m,...e},render:r=>t`
      ${h(r)}
      <frc-differential-drivebase
        class=${r.theme}
        left-motor-speed=${r.leftMotorSpeed}
        right-motor-speed=${r.rightMotorSpeed}
      ></frc-differential-drivebase>
    `}}const a=u({theme:"light"}),c=u({theme:"dark"});var l,i,d;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`createDrivebaseStory({
  theme: 'light'
})`,...(d=(i=a.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};var s,f,n;c.parameters={...c.parameters,docs:{...(s=c.parameters)==null?void 0:s.docs,source:{originalSource:`createDrivebaseStory({
  theme: 'dark'
})`,...(n=(f=c.parameters)==null?void 0:f.docs)==null?void 0:n.source}}};const A=["LightTheme","DarkTheme"];export{c as DarkTheme,a as LightTheme,A as __namedExportsOrder,M as default};
