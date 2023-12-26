import"./canvas.es-099ec9bc.js";import{x as l}from"./lit-element-37c36932.js";import{o as u}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";import"./query-b33b5ea2-b51c1579.js";import"./state-6b86eede-5fd1e84e.js";import"./get-poses-0c84fca5-6b528050.js";import"./directive-daf4e9b6-78860a76.js";import"./directive-helpers-6b2c92c9-aa4f1afd.js";import"./_commonjsHelpers-10dfc225-be18f180.js";function m(){const e=[],n=["top","center","bottom"],r=["left","center","right"];return n.forEach(t=>{r.forEach(o=>{e.push({name:`${t} ${o}`,value:[o,t]})})}),e}const p={points:[100,100,300,100],opacity:1,color:"gray",lineWidth:2,transform:[0,0,0],transformOrigin:[0,0],drawOrigin:0,zIndex:0},P={title:"FRC Canvas/Canvas Line",tags:["autodocs"],component:"frc-canvas-line",args:p,argTypes:{points:{table:{category:"Line Properties",defaultValue:{summary:[]}}},opacity:{table:{category:"Line Properties",defaultValue:{summary:1}},control:{type:"number",min:0,max:1}},color:{control:"color",table:{category:"Line Properties",defaultValue:{summary:"gray"}}},lineWidth:{table:{category:"Line Properties",defaultValue:{summary:1}},control:{type:"number",min:0}},transform:{table:{category:"Line Properties",defaultValue:{summary:[0,0,0]}}},transformOrigin:{table:{category:"Line Properties",defaultValue:{summary:[0,0]}}},drawOrigin:{table:{category:"Line Properties",defaultValue:{summary:0}},options:[0,1,2,3,4,5,6,7,8],control:{type:"select",labels:m().map(({name:e})=>e)}},zIndex:{table:{category:"Line Properties",defaultValue:{summary:0}},control:{type:"number",min:0}},backgroundColor:{control:"color",table:{category:"Canvas Properties",defaultValue:{summary:"black"}}}},decorators:[e=>l` <div
      style=${u({padding:"20px 10px",marginBottom:"5px"})}
    >
      ${e()}
    </div>`]};function d(e={}){return{args:{...p,...e},render:r=>{const[t,o]=m()[r.drawOrigin].value;return l`
        <frc-canvas background-color=${r.backgroundColor}>
          <frc-canvas-line
            points=${JSON.stringify(r.points)}
            opacity=${r.opacity}
            color=${r.color}
            line-width=${r.lineWidth}
            transform=${JSON.stringify(r.transform)}
            transform-origin=${JSON.stringify(r.transformOrigin)}
            .drawOrigin=${[t,o]}
            z-index=${JSON.stringify(r.zIndex)}
          ></frc-canvas-line>
        </frc-canvas>
      `}}}const a=d();var i,s,c;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:"createCanvasLineStory()",...(c=(s=a.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};const V=["CanvasLine"];export{a as CanvasLine,V as __namedExportsOrder,P as default};
