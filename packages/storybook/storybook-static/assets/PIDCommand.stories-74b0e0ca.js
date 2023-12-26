import"./pid.es-e4d78811.js";import{x as o}from"./lit-element-37c36932.js";import{o as y}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";const m={p:0,i:0,d:0,setpoint:0,running:!1,theme:"light","background-color":"#fff","--frc-pid-controller-text-color":"black","--frc-pid-controller-input-background-color":"white","--frc-pid-controller-input-border-color":"#e0e0e0"},S={title:"PID Controller/PID Command",tags:["autodocs"],component:"frc-pid-command",args:m,argTypes:{p:{table:{category:"Properties",defaultValue:{summary:0}}},i:{table:{category:"Properties",defaultValue:{summary:0}}},d:{table:{category:"Properties",defaultValue:{summary:0}}},setpoint:{table:{category:"Properties",defaultValue:{summary:0}}},running:{table:{category:"Properties",defaultValue:{summary:!1}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-pid-controller-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-pid-controller-input-background-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"white"}}},"--frc-pid-controller-input-border-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"#e0e0e0"}}}},decorators:[(r,t)=>{const f=t.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",g=t.args["background-color"];return o` <div
        style=${y({padding:"20px 10px",marginBottom:"5px",background:t.args.theme==="custom"?g:f})}
      >
        ${r()}
      </div>`}]};function b(r){return r.theme==="custom"?o`
      <style>
        .custom {
          --frc-pid-controller-text-color: ${r["--frc-pid-controller-text-color"]};
          --frc-pid-controller-input-background-color: ${r["--frc-pid-controller-input-background-color"]};
          --frc-pid-controller-input-border-color: ${r["--frc-pid-controller-input-border-color"]};
        }
      </style>
    `:r.theme==="dark"?o`
      <style>
        .dark {
          --frc-pid-controller-text-color: white;
          --frc-pid-controller-input-background-color: rgba(255, 255, 255, 0.2);
          --frc-pid-controller-input-border-color: rgba(255, 255, 255, 0.5);
        }
      </style>
    `:o`
    <style>
      .light {
        --frc-pid-controller-text-color: black;
        --frc-pid-controller-input-background-color: white;
        --frc-pid-controller-input-border-color: #e0e0e0;
      }
    </style>
  `}function p(r={}){return{args:{...m,...r},render:e=>o`
      ${b(e)}
      <frc-pid-command
        class=${e.theme}
        p=${e.p}
        i=${e.i}
        d=${e.d}
        setpoint=${e.setpoint}
        ?running=${e.running}
      ></frc-pid-command>
    `}}const l=p({theme:"light"}),c=p({theme:"dark"});var a,n,i;l.parameters={...l.parameters,docs:{...(a=l.parameters)==null?void 0:a.docs,source:{originalSource:`createPidCommandStory({
  theme: 'light'
})`,...(i=(n=l.parameters)==null?void 0:n.docs)==null?void 0:i.source}}};var d,u,s;c.parameters={...c.parameters,docs:{...(d=c.parameters)==null?void 0:d.docs,source:{originalSource:`createPidCommandStory({
  theme: 'dark'
})`,...(s=(u=c.parameters)==null?void 0:u.docs)==null?void 0:s.source}}};const P=["LightTheme","DarkTheme"];export{c as DarkTheme,l as LightTheme,P as __namedExportsOrder,S as default};
