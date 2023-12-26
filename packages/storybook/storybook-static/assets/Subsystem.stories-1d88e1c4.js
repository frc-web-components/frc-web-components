import"./command-based.es-f0dda951.js";import{x as a}from"./lit-element-37c36932.js";import{o as i}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";import"./toggle-button.es-617cdee3.js";const b={default:"",command:"",hasCommand:!1,hasDefault:!1,label:"",name:"",hideName:!1,theme:"light","background-color":"#fff","--frc-label-text-color":"black","--frc-robot-subsystem-header-color":"purple"},V={title:"Command Based/Robot Subsystem",tags:["autodocs"],component:"frc-robot-subsystem",args:b,argTypes:{default:{table:{category:"Properties",defaultValue:{summary:""}}},command:{table:{category:"Properties",defaultValue:{summary:""}}},hasCommand:{table:{category:"Properties",defaultValue:{summary:!1}}},hasDefault:{table:{category:"Properties",defaultValue:{summary:!1}}},label:{table:{category:"Properties",defaultValue:{summary:""}}},name:{table:{category:"Properties",defaultValue:{summary:""}}},hideName:{table:{category:"Properties",defaultValue:{summary:!1}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-label-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-robot-subsystem-header-color":{table:{category:"Styles",defaultValue:{summary:"purple"}}}},decorators:[(t,r)=>{const n=r.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",h=r.args["background-color"];return a` <div
        style=${i({padding:"20px 10px",marginBottom:"5px",background:r.args.theme==="custom"?h:n})}
      >
        ${t()}
      </div>`}]};function p(t){return t.theme==="custom"?a`
      <style>
        .custom {
          --frc-label-text-color: ${t["--frc-label-text-color"]};
          --frc-robot-subsystem-header-color: ${t["--frc-robot-subsystem-header-color"]};
        }
      </style>
    `:t.theme==="dark"?a`
      <style>
        .dark {
          --frc-label-text-color: white;
          --frc-robot-subsystem-header-color: #a020f0;
        }
      </style>
    `:a`
    <style>
      .light {
        --frc-label-text-color: black;
        --frc-robot-subsystem-header-color: purple;
      }
    </style>
  `}function y(t={}){return{args:{...b,...t},render:e=>a`
      ${p(e)}
      <frc-robot-subsystem
        class=${e.theme}
        default=${e.default}
        command=${e.command}
        ?has-command=${e.hasCommand}
        ?has-default=${e.hasDefault}
        label=${e.label}
        name=${e.name}
        ?hide-name=${e.hideName}
      ></frc-robot-subsystem>
    `}}const o=y({theme:"light"}),s=y({theme:"dark"});var l,m,c;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`createSubsystemStory({
  theme: 'light'
})`,...(c=(m=o.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};var u,d,f;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`createSubsystemStory({
  theme: 'dark'
})`,...(f=(d=s.parameters)==null?void 0:d.docs)==null?void 0:f.source}}};const D=["LightTheme","DarkTheme"];export{s as DarkTheme,o as LightTheme,D as __namedExportsOrder,V as default};
