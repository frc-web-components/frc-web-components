import"./pid.es-e4d78811.js";import{x as e}from"./lit-element-37c36932.js";import{o as y}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";const p={p:0,i:0,d:0,goal:0,theme:"light","background-color":"#fff","--frc-pid-controller-text-color":"black","--frc-pid-controller-input-background-color":"white","--frc-pid-controller-input-border-color":"#e0e0e0"},$={title:"PID Controller/Profiled PID Controller",tags:["autodocs"],component:"frc-profiled-pid-controller",args:p,argTypes:{p:{table:{category:"Properties",defaultValue:{summary:0}}},i:{table:{category:"Properties",defaultValue:{summary:0}}},d:{table:{category:"Properties",defaultValue:{summary:0}}},goal:{table:{category:"Properties",defaultValue:{summary:0}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-pid-controller-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-pid-controller-input-background-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"white"}}},"--frc-pid-controller-input-border-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"#e0e0e0"}}}},decorators:[(r,t)=>{const f=t.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",g=t.args["background-color"];return e` <div
        style=${y({padding:"20px 10px",marginBottom:"5px",background:t.args.theme==="custom"?g:f})}
      >
        ${r()}
      </div>`}]};function h(r){return r.theme==="custom"?e`
      <style>
        .custom {
          --frc-pid-controller-text-color: ${r["--frc-pid-controller-text-color"]};
          --frc-pid-controller-input-background-color: ${r["--frc-pid-controller-input-background-color"]};
          --frc-pid-controller-input-border-color: ${r["--frc-pid-controller-input-border-color"]};
        }
      </style>
    `:r.theme==="dark"?e`
      <style>
        .dark {
          --frc-pid-controller-text-color: white;
          --frc-pid-controller-input-background-color: rgba(255, 255, 255, 0.2);
          --frc-pid-controller-input-border-color: rgba(255, 255, 255, 0.5);
        }
      </style>
    `:e`
    <style>
      .light {
        --frc-pid-controller-text-color: black;
        --frc-pid-controller-input-background-color: white;
        --frc-pid-controller-input-border-color: #e0e0e0;
      }
    </style>
  `}function m(r={}){return{args:{...p,...r},render:o=>e`
      ${h(o)}
      <frc-profiled-pid-controller
        class=${o.theme}
        p=${o.p}
        i=${o.i}
        d=${o.d}
        goal=${o.goal}
      ></frc-profiled-pid-controller>
    `}}const l=m({theme:"light"}),c=m({theme:"dark"});var a,n,d;l.parameters={...l.parameters,docs:{...(a=l.parameters)==null?void 0:a.docs,source:{originalSource:`createPidControllerStory({
  theme: 'light'
})`,...(d=(n=l.parameters)==null?void 0:n.docs)==null?void 0:d.source}}};var i,u,s;c.parameters={...c.parameters,docs:{...(i=c.parameters)==null?void 0:i.docs,source:{originalSource:`createPidControllerStory({
  theme: 'dark'
})`,...(s=(u=c.parameters)==null?void 0:u.docs)==null?void 0:s.source}}};const P=["LightTheme","DarkTheme"];export{c as DarkTheme,l as LightTheme,P as __namedExportsOrder,$ as default};
