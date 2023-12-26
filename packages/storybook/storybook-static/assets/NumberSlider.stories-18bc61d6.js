import{s as $,i as n,k as w,X as T}from"./property-293dc01c-d6840d48.js";import{x as i}from"./lit-element-37c36932.js";import{o as C}from"./style-map-4c049cd0.js";var N=Object.defineProperty,E=Object.getOwnPropertyDescriptor,m=(r,e,t,o)=>{for(var a=o>1?void 0:o?E(e,t):e,u=r.length-1,d;u>=0;u--)(d=r[u])&&(a=(o?d(e,t,a):d(a))||a);return o&&a&&N(e,t,a),a},V=(r,e,t)=>{if(!e.has(r))throw TypeError("Cannot "+t)},I=(r,e,t)=>{if(e.has(r))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(r):e.set(r,t)},P=(r,e,t)=>(V(r,e,"access private method"),t),h,k;class s extends w{constructor(){super(...arguments),I(this,h),this.value=0,this.min=-1,this.max=1,this.blockIncrement=.05}onChange(e){this.value=parseFloat(e.target.value),P(this,h,k).call(this)}firstUpdated(){setTimeout(()=>{const e=this.renderRoot.querySelector("#slider");e&&(e.value=this.value)})}render(){const e=Math.min(this.min,this.max),t=Math.max(this.min,this.max),o=Math.max(e,Math.min(this.value,t));return T`
      <div class="slider-container">
        <input
          id="slider"
          type="range"
          .value="${o.toString()}"
          min="${e}"
          max="${t}"
          step="${this.blockIncrement}"
          @change="${this.onChange}"
        />

        <frc-axis ticks="5" min=${e} max=${t}></frc-axis>
      </div>
    `}}h=new WeakSet;k=function(){this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0}))};s.styles=$`
    :host {
      display: inline-block;
      height: 50px;
      width: 300px;
    }

    .slider-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 15px;
    }

    input {
      width: 100%;
    }

    table-axis {
      width: calc(85% - 14px);
      max-width: calc(100% - 74px);
      display: block;
    }
  `;m([n({type:Number})],s.prototype,"value",2);m([n({type:Number})],s.prototype,"min",2);m([n({type:Number})],s.prototype,"max",2);m([n({type:Number,attribute:"block-increment"})],s.prototype,"blockIncrement",2);customElements.get("frc-number-slider")||customElements.define("frc-number-slider",s);const v={value:0,min:-1,max:1,blockIncrement:.05,theme:"light","background-color":"#fff","--frc-axis-text-color":"black"},A={title:"FRC/Number Slider",tags:["autodocs"],component:"frc-number-slider",args:v,argTypes:{value:{table:{category:"Properties",defaultValue:{summary:0}}},min:{table:{category:"Properties",defaultValue:{summary:-1}}},max:{table:{category:"Properties",defaultValue:{summary:1}}},blockIncrement:{table:{category:"Properties",defaultValue:{summary:.05}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-axis-text-color":{control:"color",table:{category:"Styles",defaultValue:{summary:"black"}}}},decorators:[(r,e)=>{const o=e.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",a=e.args["background-color"];return i` <div
        style=${C({padding:"20px 10px",marginBottom:"5px",background:e.args.theme==="custom"?a:o})}
      >
        ${r()}
      </div>`}]};function D(r){return r.theme==="custom"?i`
      <style>
        .custom {
          --frc-axis-text-color: ${r["--frc-axis-text-color"]};
        }
      </style>
    `:r.theme==="dark"?i`
      <style>
        .dark {
          --frc-axis-text-color: white;
        }
      </style>
    `:i`
    <style>
      .light {
        --frc-axis-text-color: black;
      }
    </style>
  `}function S(r={}){return{args:{...v,...r},render:t=>i`
      ${D(t)}
      <frc-number-slider
        class=${t.theme}
        value=${t.value}
        min=${t.min}
        max=${t.max}
        block-increment=${t.blockIncrement}
      ></frc-number-slider>
    `}}const c=S({theme:"light"}),l=S({theme:"dark"});var p,f,y;c.parameters={...c.parameters,docs:{...(p=c.parameters)==null?void 0:p.docs,source:{originalSource:`createNumberSliderStory({
  theme: 'light'
})`,...(y=(f=c.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var b,x,g;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`createNumberSliderStory({
  theme: 'dark'
})`,...(g=(x=l.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};const F=["LightTheme","DarkTheme"];export{l as DarkTheme,c as LightTheme,F as __namedExportsOrder,A as default};
