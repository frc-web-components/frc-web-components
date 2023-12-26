import"./drivebases.es-52a60d67.js";import{x as t}from"./lit-element-37c36932.js";import{o as p}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";import"./bar.es-670b6bbb.js";import"./state-6b86eede-5fd1e84e.js";import"./query-b33b5ea2-b51c1579.js";import"./axis.es-6aacbeb0.js";import"./transform-bc2573b1-2dde8094.js";const u={frontLeftMotorSpeed:0,frontRightMotorSpeed:0,rearLeftMotorSpeed:0,rearRightMotorSpeed:0,theme:"light","background-color":"#fff","--frc-mecanum-drivebase-drivetrain-color":"black","--frc-bar-background":"#ddd","--frc-bar-foreground":"lightblue","--frc-axis-text-color":"black"},L={title:"FRC/Mecanum Drivebase",tags:["autodocs"],component:"frc-mecanum-drivebase",args:u,argTypes:{frontLeftMotorSpeed:{table:{category:"Properties",defaultValue:{summary:0}},control:{type:"number",min:-1,max:1}},frontRightMotorSpeed:{table:{category:"Properties",defaultValue:{summary:0}},control:{type:"number",min:-1,max:1}},rearLeftMotorSpeed:{table:{category:"Properties",defaultValue:{summary:0}},control:{type:"number",min:-1,max:1}},rearRightMotorSpeed:{table:{category:"Properties",defaultValue:{summary:0}},control:{type:"number",min:-1,max:1}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-mecanum-drivebase-drivetrain-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-bar-background":{table:{category:"Styles",defaultValue:{summary:"#ddd"}}},"--frc-bar-foreground":{control:"color",table:{category:"Styles",defaultValue:{summary:"lightblue"}}},"--frc-axis-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}}},decorators:[(e,o)=>{const b=o.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",g=o.args["background-color"];return t` <div
        style=${p({padding:"20px 10px",marginBottom:"5px",background:o.args.theme==="custom"?g:b})}
      >
        ${e()}
      </div>`}]};function y(e){return e.theme==="custom"?t`
      <style>
        .custom {
          --frc-mecanum-drivebase-drivetrain-color: ${e["--frc-mecanum-drivebase-drivetrain-color"]};
          --frc-bar-background: ${e["--frc-bar-background"]};
          --frc-bar-foreground: ${e["--frc-bar-foreground"]};
          --frc-axis-text-color: ${e["--frc-axis-text-color"]};
        }
      </style>
    `:e.theme==="dark"?t`
      <style>
        .dark {
          --frc-mecanum-drivebase-drivetrain-color: #aaa;
          --frc-bar-background: #444;
          --frc-bar-foreground: steelblue;
          --frc-axis-text-color: white;
        }
      </style>
    `:t`
    <style>
      .light {
        --frc-mecanum-drivebase-drivetrain-color: black;
        --frc-bar-background: #ddd;
        --frc-bar-foreground: lightblue;
        --frc-axis-text-color: black;
      }
    </style>
  `}function f(e={}){return{args:{...u,...e},render:r=>t`
      ${y(r)}
      <frc-mecanum-drivebase
        class=${r.theme}
        front-left-motor-speed=${r.frontLeftMotorSpeed}
        front-right-motor-speed=${r.frontRightMotorSpeed}
        rear-left-motor-speed=${r.rearLeftMotorSpeed}
        rear-right-motor-speed=${r.rearRightMotorSpeed}
      ></frc-mecanum-drivebase>
    `}}const a=f({theme:"light"}),c=f({theme:"dark"});var m,l,s;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`createDrivebaseStory({
  theme: 'light'
})`,...(s=(l=a.parameters)==null?void 0:l.docs)==null?void 0:s.source}}};var d,i,n;c.parameters={...c.parameters,docs:{...(d=c.parameters)==null?void 0:d.docs,source:{originalSource:`createDrivebaseStory({
  theme: 'dark'
})`,...(n=(i=c.parameters)==null?void 0:i.docs)==null?void 0:n.source}}};const R=["LightTheme","DarkTheme"];export{c as DarkTheme,a as LightTheme,R as __namedExportsOrder,L as default};
