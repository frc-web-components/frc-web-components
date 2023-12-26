import"./canvas.es-099ec9bc.js";import{x as m}from"./lit-element-37c36932.js";import{o as t}from"./if-defined-04ae3851.js";import{o as l}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";import"./query-b33b5ea2-b51c1579.js";import"./state-6b86eede-5fd1e84e.js";import"./get-poses-0c84fca5-6b528050.js";import"./directive-daf4e9b6-78860a76.js";import"./directive-helpers-6b2c92c9-aa4f1afd.js";import"./_commonjsHelpers-10dfc225-be18f180.js";const c={srcs:[],waitImage:"",origin:[0,0],width:void 0,height:void 0,hideCrosshair:!1,crosshairColor:"white"},M={title:"FRC Canvas/Canvas MJPG Strem",tags:["autodocs"],component:"frc-canvas-mjpg-stream",args:c,argTypes:{srcs:{table:{category:"MJPG Stream Properties",defaultValue:{summary:[]}}},waitImage:{table:{category:"MJPG Stream Properties",defaultValue:{summary:""}}},origin:{table:{category:"MJPG Stream Properties",defaultValue:{summary:[0,0]}}},width:{table:{category:"MJPG Stream Properties",defaultValue:{summary:void 0}},control:{type:"number",min:0}},height:{table:{category:"MJPG Stream Properties",defaultValue:{summary:void 0}},control:{type:"number",min:0}},hideCrosshair:{table:{category:"MJPG Stream Properties",defaultValue:{summary:!1}}},crosshairColor:{control:"color",table:{category:"MJPG Stream Properties",defaultValue:{summary:"gray"}}},backgroundColor:{control:"color",table:{category:"Canvas Properties",defaultValue:{summary:"black"}}}},decorators:[e=>m` <div
      style=${l({padding:"20px 10px",marginBottom:"5px"})}
    >
      ${e()}
    </div>`]};function n(e={}){return{args:{...c,...e},render:r=>m`
      <frc-canvas background-color=${r.backgroundColor}>
        <frc-canvas-mjpg-stream
          .srcs=${r.srcs}
          wait-image=${r.waitImage}
          origin=${JSON.stringify(r.origin)}
          width=${t(r.width?r.width:void 0)}
          height=${t(r.height?r.height:void 0)}
          ?hide-crosshair=${r.hideCrosshair}
          crosshair-color=${r.crosshairColor}
        ></frc-canvas-mjpg-stream>
      </frc-canvas>
    `}}const a=n();var o,s,i;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:"createCanvasMjpgStreamStory()",...(i=(s=a.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};const $=["CanvasMjpgStream"];export{a as CanvasMjpgStream,$ as __namedExportsOrder,M as default};
