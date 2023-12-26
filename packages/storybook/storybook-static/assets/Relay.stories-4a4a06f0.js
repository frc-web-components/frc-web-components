import{s as $,i as p,k as w,X as O}from"./property-293dc01c-d6840d48.js";import"./toggle-group.es-38baab62.js";import{x as a}from"./lit-element-37c36932.js";import{o as T}from"./style-map-4c049cd0.js";var V=Object.defineProperty,R=Object.getOwnPropertyDescriptor,k=(t,e,r,c)=>{for(var o=c>1?void 0:c?R(e,r):e,u=t.length-1,i;u>=0;u--)(i=t[u])&&(o=(c?i(e,r,o):i(o))||o);return c&&o&&V(e,r,o),o},C=(t,e,r)=>{if(!e.has(t))throw TypeError("Cannot "+r)},D=(t,e,r)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,r)},E=(t,e,r)=>(C(t,e,"access private method"),r),g,v;const P=["Off","On","Forward","Reverse"];class s extends w{constructor(){super(...arguments),D(this,g),this.value="Off",this.direction="vertical"}render(){return O`
      <frc-toggle-group
        @change=${E(this,g,v)}
        .options=${P}
        value=${this.value}
        direction=${this.direction}
      ></frc-toggle-group>
    `}}g=new WeakSet;v=function(t){this.value=t.detail.value};s.styles=$`
    :host {
      display: inline-block;
      width: 150px;
      height: 300px;
    }

    frc-toggle-group {
      width: 100%;
      height: 100%;
    }
  `;k([p({type:String})],s.prototype,"value",2);k([p({type:String})],s.prototype,"direction",2);customElements.get("frc-relay")||customElements.define("frc-relay",s);const x={value:"Off",direction:"vertical",theme:"light","background-color":"#fff","--frc-button-background-color":"rgb(230, 230, 230)","--frc-button-text-color":"black","--frc-button-toggled-background-color":"black","--frc-button-toggled-text-color":"white"},W={title:"FRC/Relay",tags:["autodocs"],component:"frc-relay",args:x,argTypes:{value:{table:{category:"Properties",defaultValue:"Off"},options:["Off","On","Forward","Reverse"],control:"select"},direction:{table:{category:"Properties",defaultValue:"vertical"},options:["vertical","horizontal"],control:"select"},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-button-background-color":{table:{category:"Styles",defaultValue:{summary:"rgb(230, 230, 230)"}}},"--frc-button-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-button-toggled-background-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-button-toggled-text-color":{table:{category:"Styles",defaultValue:{summary:"white"}}}},decorators:[(t,e)=>{const c=e.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",o=e.args["background-color"];return a` <div
        style=${T({padding:"20px 10px",marginBottom:"5px",background:e.args.theme==="custom"?o:c})}
      >
        ${t()}
      </div>`}]};function A(t){return t.theme==="custom"?a`
      <style>
        .custom {
          --frc-button-background-color: ${t["--frc-button-background-color"]};
          --frc-button-text-color: ${t["--frc-button-text-color"]};
          --frc-button-toggled-background-color: ${t["--frc-button-toggled-background-color"]};
          --frc-button-toggled-text-color: ${t["--frc-button-toggled-text-color"]};
        }
      </style>
    `:t.theme==="dark"?a`
      <style>
        .dark {
          --frc-button-background-color: rgba(255, 255, 255, 0.1);
          --frc-button-text-color: white;
          --frc-button-toggled-background-color: rgba(240, 240, 240);
          --frc-button-toggled-text-color: black;
        }
      </style>
    `:a`
    <style>
      .light {
        --frc-button-background-color: rgb(230, 230, 230);
        --frc-button-text-color: black;
        --frc-button-toggled-background-color: black;
        --frc-button-toggled-text-color: white;
      }
    </style>
  `}function S(t={}){return{args:{...x,...t},render:r=>a`
      ${A(r)}
      <frc-relay
        class=${r.theme}
        value=${r.value}
        direction=${r.direction}
      ></frc-relay>
    `}}const l=S({theme:"light"}),n=S({theme:"dark"});var d,f,b;l.parameters={...l.parameters,docs:{...(d=l.parameters)==null?void 0:d.docs,source:{originalSource:`createRelayStory({
  theme: 'light'
})`,...(b=(f=l.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var m,h,y;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`createRelayStory({
  theme: 'dark'
})`,...(y=(h=n.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};const X=["LightTheme","DarkTheme"];export{n as DarkTheme,l as LightTheme,X as __namedExportsOrder,W as default};
