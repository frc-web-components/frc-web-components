import"./command-based.es-f0dda951.js";import{x as e}from"./lit-element-37c36932.js";import{o as y}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";import"./toggle-button.es-617cdee3.js";const s={name:"Command",running:!1,controllable:!1,label:"",theme:"light","background-color":"#fff","--frc-button-background-color":"rgb(230, 230, 230)","--frc-button-text-color":"black","--frc-button-toggled-background-color":"black","--frc-button-toggled-text-color":"white"},V={title:"Command Based/Robot Command",tags:["autodocs"],component:"frc-robot-command",args:s,argTypes:{name:{table:{category:"Properties",defaultValue:{summary:"Command"}}},running:{table:{category:"Properties",defaultValue:{summary:!1}}},controllable:{table:{category:"Properties",defaultValue:{summary:!1}}},label:{table:{category:"Properties",defaultValue:{summary:""}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-button-background-color":{table:{category:"Styles",defaultValue:{summary:"rgb(230, 230, 230)"}}},"--frc-button-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-button-toggled-background-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-button-toggled-text-color":{table:{category:"Styles",defaultValue:{summary:"white"}}}},decorators:[(t,r)=>{const f=r.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",i=r.args["background-color"];return e` <div
        style=${y({padding:"20px 10px",marginBottom:"5px",background:r.args.theme==="custom"?i:f})}
      >
        ${t()}
      </div>`}]};function k(t){return t.theme==="custom"?e`
      <style>
        .custom {
          --frc-button-background-color: ${t["--frc-button-background-color"]};
          --frc-button-text-color: ${t["--frc-button-text-color"]};
          --frc-button-toggled-background-color: ${t["--frc-button-toggled-background-color"]};
          --frc-button-toggled-text-color: ${t["--frc-button-toggled-text-color"]};
        }
      </style>
    `:t.theme==="dark"?e`
      <style>
        .dark {
          --frc-button-background-color: rgba(255, 255, 255, 0.1);
          --frc-button-text-color: white;
          --frc-button-toggled-background-color: rgba(240, 240, 240);
          --frc-button-toggled-text-color: black;
        }
      </style>
    `:e`
    <style>
      .light {
        --frc-button-background-color: rgb(230, 230, 230);
        --frc-button-text-color: black;
        --frc-button-toggled-background-color: black;
        --frc-button-toggled-text-color: white;
      }
    </style>
  `}function g(t={}){return{args:{...s,...t},render:o=>e`
      ${k(o)}
      <frc-robot-command
        class=${o.theme}
        name=${o.name}
        ?running=${o.running}
        ?controllable=${o.controllable}
        label=${o.label}
      ></frc-robot-command>
    `}}const a=g({theme:"light"}),c=g({theme:"dark"});var l,n,u;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`createCommandStory({
  theme: 'light'
})`,...(u=(n=a.parameters)==null?void 0:n.docs)==null?void 0:u.source}}};var m,b,d;c.parameters={...c.parameters,docs:{...(m=c.parameters)==null?void 0:m.docs,source:{originalSource:`createCommandStory({
  theme: 'dark'
})`,...(d=(b=c.parameters)==null?void 0:b.docs)==null?void 0:d.source}}};const C=["LightTheme","DarkTheme"];export{c as DarkTheme,a as LightTheme,C as __namedExportsOrder,V as default};
