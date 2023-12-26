import{s as P,i as b,k as w,X as C}from"./property-293dc01c-d6840d48.js";import{x as $}from"./lit-element-37c36932.js";import{o as x}from"./if-defined-04ae3851.js";var j=Object.defineProperty,k=Object.getOwnPropertyDescriptor,d=(c,t,e,a)=>{for(var o=a>1?void 0:a?k(t,e):t,f=c.length-1,y;f>=0;f--)(y=c[f])&&(o=(a?y(t,e,o):y(o))||o);return a&&o&&j(t,e,o),o};const r=class s extends w{constructor(){super(...arguments),this.value=!1,this.falseColor=s.DEFAULT_FALSE_COLOR,this.trueColor=s.DEFAULT_TRUE_COLOR,this.label=""}updated(){const t=this.falseColor||s.DEFAULT_FALSE_COLOR,e=this.trueColor||s.DEFAULT_TRUE_COLOR,a=this.renderRoot.querySelector("[part=box]"),o=this.value?e:t;a.style.setProperty("--box-color",o)}render(){return C` <div part="box">${this.label||C`&nbsp;`}</div> `}};r.DEFAULT_FALSE_COLOR="#ff0000";r.DEFAULT_TRUE_COLOR="#00ff00";r.styles=P`
    :host {
      display: inline-block;
      width: 80px;
      height: 80px;
      padding: 5px;
      box-sizing: border-box;
    }

    [part='box'] {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      background-color: var(--box-color);
      text-align: center;
    }
  `;d([b({type:Boolean})],r.prototype,"value",2);d([b({type:String,attribute:"false-color"})],r.prototype,"falseColor",2);d([b({type:String,attribute:"true-color"})],r.prototype,"trueColor",2);d([b({type:String})],r.prototype,"label",2);let I=r;customElements.get("frc-boolean-box")||customElements.define("frc-boolean-box",I);const D={value:!1,falseColor:"#ff0000",trueColor:"#00ff00",label:""},z={title:"FRC/Boolean Box",tags:["autodocs"],component:"frc-boolean-box",args:D,argTypes:{value:{table:{category:"Properties",defaultValue:{summary:!1}}},falseColor:{control:"color",table:{category:"Properties",defaultValue:{summary:"#ff0000"}}},trueColor:{control:"color",table:{category:"Properties",defaultValue:{summary:"#00ff00"}}},label:{table:{category:"Properties",defaultValue:{summary:""}}}}};function l(c={}){return{args:{...D,...c},parameters:{canvas:{sourceState:"shown"}},render:e=>$`
      <frc-boolean-box
        ?value=${e.value}
        false-color=${x(e.falseColor||void 0)}
        true-color=${x(e.trueColor||void 0)}
        label=${x(e.label||void 0)}
      ></frc-boolean-box>
    `}}const u=l(),n=l({value:!0}),p=l({falseColor:"#f67b12"}),i=l({value:!0,trueColor:"#21e4bb"}),m=l({label:"I'm a box"});var g,h,v;u.parameters={...u.parameters,docs:{...(g=u.parameters)==null?void 0:g.docs,source:{originalSource:"createBooleanBoxStory()",...(v=(h=u.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var S,L,O;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`createBooleanBoxStory({
  value: true
})`,...(O=(L=n.parameters)==null?void 0:L.docs)==null?void 0:O.source}}};var B,E,F;p.parameters={...p.parameters,docs:{...(B=p.parameters)==null?void 0:B.docs,source:{originalSource:`createBooleanBoxStory({
  falseColor: '#f67b12'
})`,...(F=(E=p.parameters)==null?void 0:E.docs)==null?void 0:F.source}}};var T,A,R;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`createBooleanBoxStory({
  value: true,
  trueColor: '#21e4bb'
})`,...(R=(A=i.parameters)==null?void 0:A.docs)==null?void 0:R.source}}};var _,U,V;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:"createBooleanBoxStory({\n  label: `I'm a box`\n})",...(V=(U=m.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};const G=["FalseValue","TrueValue","CustomFalseColor","CustomTrueColor","WithLabel"];export{p as CustomFalseColor,i as CustomTrueColor,u as FalseValue,n as TrueValue,m as WithLabel,G as __namedExportsOrder,z as default};
