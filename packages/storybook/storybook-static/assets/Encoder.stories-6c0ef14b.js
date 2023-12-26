import{s as v,i as b,k as S,X as $}from"./property-293dc01c-d6840d48.js";import{x as c}from"./lit-element-37c36932.js";import{o as w}from"./style-map-4c049cd0.js";var E=Object.defineProperty,T=Object.getOwnPropertyDescriptor,y=(e,r,o,a)=>{for(var t=a>1?void 0:a?T(r,o):r,d=e.length-1,i;d>=0;d--)(i=e[d])&&(t=(a?i(r,o,t):i(t))||t);return a&&t&&E(r,o,t),t};class n extends S{constructor(){super(...arguments),this.distance=0,this.speed=0}render(){return $`
      <label class="distance-label">Distance</label>
      <span>${this.distance}</span>
      <label class="speed-label">Speed</label>
      <span>${this.speed}</span>
    `}}n.styles=v`
    :host {
      display: inline-grid;
      grid-template-columns: min-content auto;
      grid-template-rows: 50% 50%;
      column-gap: 15px;
      row-gap: 5px;
      align-items: center;
      width: 250px;
      font-family: sans-serif;
    }

    label {
      font-weight: bold;
      text-align: right;
      color: var(--frc-encoder-label-color, #000);
    }

    span {
      width: 100%;
      min-width: 50px;
      display: inline-block;
      padding: 5px;
      border: 1px dashed;
      border-color: var(--frc-encoder-value-color, #666);
      color: var(--frc-encoder-value-color, #666);
      border-radius: 3px;
      box-sizing: border-box;
    }
  `;y([b({type:Number})],n.prototype,"distance",2);y([b({type:Number})],n.prototype,"speed",2);customElements.get("frc-encoder")||customElements.define("frc-encoder",n);const k={distance:0,speed:0,theme:"light","background-color":"#fff","--frc-encoder-label-color":"#000","--frc-encoder-value-color":"#666"},A={title:"FRC/Encoder",tags:["autodocs"],component:"frc-encoder",args:k,argTypes:{distance:{table:{category:"Properties",defaultValue:{summary:0}}},speed:{table:{category:"Properties",defaultValue:{summary:0}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-encoder-label-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-encoder-value-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"#666"}}}},decorators:[(e,r)=>{const a=r.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",t=r.args["background-color"];return c` <div
        style=${w({padding:"20px 10px",marginBottom:"5px",background:r.args.theme==="custom"?t:a})}
      >
        ${e()}
      </div>`}]};function D(e){return e.theme==="custom"?c`
      <style>
        .custom {
          --frc-encoder-label-color: ${e["--frc-encoder-label-color"]};
          --frc-encoder-value-color: ${e["--frc-encoder-value-color"]};
        }
      </style>
    `:e.theme==="dark"?c`
      <style>
        .dark {
          --frc-encoder-label-color: white;
          --frc-encoder-value-color: #aaa;
        }
      </style>
    `:c`
    <style>
      .light {
        --frc-encoder-label-color: black;
        --frc-encoder-value-color: #666;
      }
    </style>
  `}function x(e={}){return{args:{...k,...e},render:o=>c`
      ${D(o)}
      <frc-encoder
        class=${o.theme}
        distance=${o.distance}
        speed=${o.speed}
      ></frc-encoder>
    `}}const l=x({theme:"light"}),s=x({theme:"dark"});var m,u,p;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`createEncoderStory({
  theme: 'light'
})`,...(p=(u=l.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};var f,g,h;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`createEncoderStory({
  theme: 'dark'
})`,...(h=(g=s.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const C=["LightTheme","DarkTheme"];export{s as DarkTheme,l as LightTheme,C as __namedExportsOrder,A as default};
