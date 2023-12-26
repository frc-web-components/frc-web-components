import"./bar.es-670b6bbb.js";import{x as t}from"./lit-element-37c36932.js";import{o as y}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";import"./state-6b86eede-5fd1e84e.js";import"./query-b33b5ea2-b51c1579.js";const f={value:0,min:-1,max:1,center:0,theme:"light","background-color":"#fff","--frc-bar-background":"#ddd","--frc-bar-foreground":"lightblue","--frc-bar-color":"black"},T={title:"FRC/Bar",tags:["autodocs"],component:"frc-bar",args:f,argTypes:{value:{table:{category:"Properties",defaultValue:{summary:0}}},min:{table:{category:"Properties",defaultValue:{summary:-1}}},max:{table:{category:"Properties",defaultValue:{summary:1}}},center:{table:{category:"Properties",defaultValue:{summary:0}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-bar-background":{table:{category:"Styles",defaultValue:{summary:"#ddd"}}},"--frc-bar-foreground":{control:"color",table:{category:"Styles",defaultValue:{summary:"lightblue"}}},"--frc-bar-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}}},decorators:[(r,a)=>{const i=a.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",g=a.args["background-color"];return t` <div
        style=${y({padding:"20px 10px",marginBottom:"5px",background:a.args.theme==="custom"?g:i})}
      >
        ${r()}
      </div>`}]};function h(r){return r.theme==="custom"?t`
      <style>
        .custom {
          --frc-bar-background: ${r["--frc-bar-background"]};
          --frc-bar-foreground: ${r["--frc-bar-foreground"]};
          --frc-bar-color: ${r["--frc-bar-color"]};
        }
      </style>
    `:r.theme==="dark"?t`
      <style>
        .dark {
          --frc-bar-background: #444;
          --frc-bar-foreground: steelblue;
          --frc-bar-color: white;
        }
      </style>
    `:t`
    <style>
      .light {
        --frc-bar-background: #ddd;
        --frc-bar-foreground: lightblue;
        --frc-bar-color: black;
      }
    </style>
  `}function b(r={}){return{args:{...f,...r},render:e=>t`
      ${h(e)}
      <frc-bar
        class=${e.theme}
        value=${e.value}
        min=${e.min}
        max=${e.max}
        center=${e.center}
      ></frc-bar>
    `}}const o=b({theme:"light"}),c=b({theme:"dark"});var l,u,s;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`createBarStory({
  theme: 'light'
})`,...(s=(u=o.parameters)==null?void 0:u.docs)==null?void 0:s.source}}};var m,d,n;c.parameters={...c.parameters,docs:{...(m=c.parameters)==null?void 0:m.docs,source:{originalSource:`createBarStory({
  theme: 'dark'
})`,...(n=(d=c.parameters)==null?void 0:d.docs)==null?void 0:n.source}}};const v=["LightTheme","DarkTheme"];export{c as DarkTheme,o as LightTheme,v as __namedExportsOrder,T as default};
