import"./toggle-button.es-617cdee3.js";import{x as e}from"./lit-element-37c36932.js";import{o as y}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";const b={toggled:!1,label:"Button",disabled:!1,theme:"light","background-color":"#fff","--frc-button-background-color":"rgb(230, 230, 230)","--frc-button-text-color":"black","--frc-button-toggled-background-color":"black","--frc-button-toggled-text-color":"white"},T={title:"FRC/Toggle Button",tags:["autodocs"],component:"frc-toggle-button",args:b,argTypes:{toggled:{table:{category:"Properties",defaultValue:{summary:!1}}},label:{table:{category:"Properties",defaultValue:{summary:"Button"}}},disabled:{table:{category:"Properties",defaultValue:{summary:!1}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-button-background-color":{table:{category:"Styles",defaultValue:{summary:"rgb(230, 230, 230)"}}},"--frc-button-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-button-toggled-background-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-button-toggled-text-color":{table:{category:"Styles",defaultValue:{summary:"white"}}}},decorators:[(t,r)=>{const m=r.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",i=r.args["background-color"];return e` <div
        style=${y({padding:"20px 10px",marginBottom:"5px",background:r.args.theme==="custom"?i:m})}
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
  `}function f(t={}){return{args:{...b,...t},render:o=>e`
      ${k(o)}
      <frc-toggle-button
        class=${o.theme}
        ?toggled=${o.toggled}
        label=${o.label}
        ?disabled=${o.disabled}
      ></frc-toggle-button>
    `}}const l=f({theme:"light"}),c=f({theme:"dark"});var a,u,g;l.parameters={...l.parameters,docs:{...(a=l.parameters)==null?void 0:a.docs,source:{originalSource:`createToggleButtonStory({
  theme: 'light'
})`,...(g=(u=l.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var n,s,d;c.parameters={...c.parameters,docs:{...(n=c.parameters)==null?void 0:n.docs,source:{originalSource:`createToggleButtonStory({
  theme: 'dark'
})`,...(d=(s=c.parameters)==null?void 0:s.docs)==null?void 0:d.source}}};const $=["LightTheme","DarkTheme"];export{c as DarkTheme,l as LightTheme,$ as __namedExportsOrder,T as default};
