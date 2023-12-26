import{s as K,i as h,k as V,X as Q}from"./property-293dc01c-d6840d48.js";import{h as G}from"./query-b33b5ea2-b51c1579.js";import{s as I,c as m,n as Z}from"./units-a299d414-de746bd8.js";import{n as D}from"./state-6b86eede-5fd1e84e.js";import{f as _}from"./get-poses-0c84fca5-6b528050.js";import{x as X}from"./lit-element-37c36932.js";import{o as z}from"./if-defined-04ae3851.js";var tt=(r,t,e)=>{if(!t.has(r))throw TypeError("Cannot "+e)},P=(r,t,e)=>(tt(r,t,"read from private field"),e?e.call(r):t.get(r)),M=(r,t,e)=>{if(t.has(r))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(r):t.set(r,e)};const v=[{game:"Charged Up",image:"./field-images/2023-field.jpg",corners:{topLeft:[46,36],bottomRight:[1088,544]},size:[54.27083,26.2916],unit:"foot"},{game:"Rapid React",image:"./field-images/2022-field.jpg",corners:{topLeft:[74,50],bottomRight:[1774,900]},size:[54,27],unit:"foot"},{game:"Infinite Recharge",image:"./field-images/2020-field.jpg",corners:{topLeft:[96,25],bottomRight:[1040,514]},size:[52.4375,26.9375],unit:"foot"},{game:"Destination: Deep Space",image:"./field-images/2019-field.jpg",corners:{topLeft:[217,40],bottomRight:[1372,615]},size:[54,27],unit:"foot"},{game:"FIRST Power Up",image:"./field-images/2018-field.jpg",corners:{topLeft:[125,20],bottomRight:[827,370]},size:[54,27],unit:"feet"},{game:"Barrel Racing Path",image:"./field-images/2021-barrel.png",corners:{topLeft:[20,20],bottomRight:[780,400]},size:[30,15],unit:"feet"},{game:"Bounce Path",image:"./field-images/2021-bounce.png",corners:{topLeft:[20,20],bottomRight:[780,400]},size:[30,15],unit:"feet"},{game:"Galactic Search A",image:"./field-images/2021-galacticsearcha.png",corners:{topLeft:[20,20],bottomRight:[780,400]},size:[30,15],unit:"feet"},{game:"Galactic Search B",image:"./field-images/2021-galacticsearchb.png",corners:{topLeft:[20,20],bottomRight:[780,400]},size:[30,15],unit:"feet"},{game:"Slalom Path",image:"./field-images/2021-slalom.png",corners:{topLeft:[20,20],bottomRight:[780,400]},size:[30,15],unit:"feet"}];var S,F;class O{constructor(){M(this,S,{}),M(this,F,new Map)}getImage(t){if(typeof P(this,S)[t]>"u"){const e=new Image,i={src:t,width:0,height:0,loaded:!1,image:e};e.onload=()=>{i.loaded=!0,i.width=e.width,i.height=e.height,[...P(this,F).values()].forEach(o=>{console.log("on load",o),o(t)})},P(this,S)[t]=i,e.src=t}return P(this,S)[t]}static getBoundingBoxDims(t,e){const i=Math.abs(t.width*Math.cos(e))+Math.abs(t.height*Math.sin(e)),o=Math.abs(t.width*Math.sin(e))+Math.abs(t.height*Math.cos(e));return{width:i,height:o}}static fitImageInsideBox(t,e){return e.width/t.width*t.height<=e.height?{width:e.width,height:e.width/t.width*t.height}:{width:e.height/t.height*t.width,height:e.height}}onImageLoad(t){const e=Symbol("image");return P(this,F).set(e,t),()=>{P(this,F).delete(e)}}}S=new WeakMap,F=new WeakMap;var et=Object.defineProperty,it=Object.getOwnPropertyDescriptor,b=(r,t,e,i)=>{for(var o=i>1?void 0:i?it(t,e):t,a=r.length-1,n;a>=0;a--)(n=r[a])&&(o=(i?n(t,e,o):n(o))||o);return i&&o&&et(t,e,o),o};class y extends V{constructor(){super(...arguments),this.unit="inherit",this.rotationUnit="inherit",this.image="",this.color="#0000ff",this.opacity=1,this.pose=[0,0,0],this.width=.6,this.length=.9}draw({canvas:t,unit:e,rotationUnit:i,xToPx:o,yToPx:a,lengthToPx:n,origin:l}){const s=this.unit==="inherit"||this.unit===null?e:this.unit,u=this.rotationUnit==="inherit"||this.rotationUnit===null?i:this.rotationUnit,[c,g]=this.pose,T=u==="rad"?this.pose[2]:this.pose[2]/(180/Math.PI);t.globalAlpha=Math.max(0,Math.min(1,this.opacity)),t.fillStyle="#222",t.strokeStyle=this.color,t.lineWidth=n(3,"in"),t.translate(o(c,s),a(g,s)),t.rotate(-T+(l==="red"?Math.PI:0)),t.roundRect(-n(this.length/2,s),-n(this.width/2,s),n(this.length,s),n(this.width,s),1),t.fill(),t.stroke(),t.beginPath(),t.fillStyle="white",t.strokeStyle="white",t.lineWidth=n(2,"in"),t.moveTo(-n(this.length*.3,s),0),t.lineTo(n(this.length*.3,s),0),t.moveTo(n(this.length*.1,s),-n(this.width*.25,s)),t.lineTo(n(this.length*.3,s),0),t.lineTo(n(this.length*.1,s),n(this.width*.25,s)),t.stroke()}}b([h({type:String})],y.prototype,"unit",2);b([h({type:String,attribute:"rotation-unit"})],y.prototype,"rotationUnit",2);b([h({type:String})],y.prototype,"image",2);b([h({type:String})],y.prototype,"color",2);b([h({type:Number})],y.prototype,"opacity",2);b([h({type:Array})],y.prototype,"pose",2);b([h({type:Number})],y.prototype,"width",2);b([h({type:Number})],y.prototype,"length",2);customElements.get("frc-field-robot")||customElements.define("frc-field-robot",y);var ot=Object.defineProperty,rt=Object.getOwnPropertyDescriptor,w=(r,t,e,i)=>{for(var o=i>1?void 0:i?rt(t,e):t,a=r.length-1,n;a>=0;a--)(n=r[a])&&(o=(i?n(t,e,o):n(o))||o);return i&&o&&ot(t,e,o),o};class f extends V{constructor(){super(...arguments),this.poses=[],this.translations=[],this.color="#FFA500",this.unit="inherit",this.lineWidth=4,this.opacity=.7,this._poses=[],this._translations=[]}updated(t){t.has("poses")&&(this._poses=_(this.poses)),t.has("translations")&&(this._translations=_(this.translations,2))}draw({canvas:t,unit:e,xToPx:i,yToPx:o}){const a=this.unit==="inherit"||this.unit===null?e:this.unit;if(t.lineWidth=this.lineWidth,t.strokeStyle=this.color,t.globalAlpha=this.opacity,this._poses.length>1){for(let n=0;n<this._poses.length-1;n+=1){const[l,s]=this._poses[n],[u,c]=this._poses[n+1];t.moveTo(i(l,a),o(s,a)),t.lineTo(i(u,a),o(c,a))}t.stroke()}if(this._translations.length>1){for(let n=0;n<this._translations.length-1;n+=1){const[l,s]=this._translations[n],[u,c]=this._translations[n+1];t.moveTo(i(l,a),o(s,a)),t.lineTo(i(u,a),o(c,a))}t.stroke()}}}w([h({type:Array})],f.prototype,"poses",2);w([h({type:Array})],f.prototype,"translations",2);w([h({type:String})],f.prototype,"color",2);w([h({type:String})],f.prototype,"unit",2);w([h({type:Number,attribute:"line-width"})],f.prototype,"lineWidth",2);w([h({type:Number})],f.prototype,"opacity",2);w([D()],f.prototype,"_poses",2);w([D()],f.prototype,"_translations",2);customElements.get("frc-field-path")||customElements.define("frc-field-path",f);var at=Object.defineProperty,nt=Object.getOwnPropertyDescriptor,d=(r,t,e,i)=>{for(var o=i>1?void 0:i?nt(t,e):t,a=r.length-1,n;a>=0;a--)(n=r[a])&&(o=(i?n(t,e,o):n(o))||o);return i&&o&&at(t,e,o),o},st=(r,t,e)=>{if(!t.has(r))throw TypeError("Cannot "+e)},C=(r,t,e)=>(st(r,t,"read from private field"),e?e.call(r):t.get(r)),ht=(r,t,e)=>{if(t.has(r))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(r):t.set(r,e)},x;function lt(r){return r*Math.PI/180}class p extends V{constructor(){super(...arguments),this.game=v[0].game,this.cropTop=null,this.cropBottom=null,this.cropLeft=null,this.cropRight=null,this.cropType="percent",this.unit=I,this.rotationUnit="rad",this.rotation=0,this.showGrid=!1,this.gridSize=1,this.origin="blue",ht(this,x,new O)}getConfig(){return v.find(({game:t})=>t===this.game)??v[0]}getCanvasCtx(){return this.canvas.getContext("2d")}getCropPercent(){if(this.cropType==="percent"){const Y=this.cropLeft??0,H=this.cropTop??0,J=this.cropRight??1,q=this.cropBottom??1;return{x1:Y,y1:H,x2:J,y2:q}}const{corners:t,image:e,unit:i,size:o}=this.getConfig(),{loaded:a,width:n,height:l}=C(this,x).getImage(e);if(!a)return{x1:0,y1:0,x2:1,y2:1};const s=[this.cropLeft??0,this.cropTop??0],u=[this.cropRight??m(o[0],i,this.unit),this.cropBottom??m(o[1],i,this.unit)],c=t.topLeft[0]/n,g=t.topLeft[1]/l,T=t.bottomRight[0]/n,$=t.bottomRight[1]/l,R=T-c,k=$-g;return{x1:c+R*m(s[0],this.unit,i)/o[0],y1:g+k*m(s[1],this.unit,i)/o[1],x2:c+R*m(u[0],this.unit,i)/o[0],y2:g+k*m(u[1],this.unit,i)/o[1]}}getFieldRectPx(){const{corners:t,image:e}=this.getConfig(),{loaded:i,width:o,height:a}=C(this,x).getImage(e);if(!i)return{x:0,y:0,width:0,height:0};const n=t.topLeft[0]/o,l=t.topLeft[1]/a,s=t.bottomRight[0]/o,u=t.bottomRight[1]/a,c=this.getCropPercent(),g=c.x2-c.x1,T=c.y2-c.y1,$=this.canvas.width/g,R=this.canvas.height/T;return{x:(n-c.x1)*$,y:(l-c.y1)*R,width:(s-n)*$,height:(u-l)*R}}xToPx(t,e=this.unit){const i=this.getFieldRectPx(),{size:o,unit:a}=this.getConfig();if(i.width===0)return 0;const n=i.width/o[0],l=m(t,e,a);return this.origin!=="red"?i.x+l*n:i.x+i.width-l*n}yToPx(t,e=this.unit){const i=this.getFieldRectPx(),{size:o,unit:a}=this.getConfig();if(i.height===0)return 0;const n=i.height/o[1],l=m(t,e,a);return this.origin!=="red"?i.y+i.height-l*n:i.y+l*n}lengthToPx(t,e=this.unit){const i=this.getFieldRectPx(),{size:o,unit:a}=this.getConfig();if(i.width===0)return 0;const n=i.width/o[0];return m(t,e,a)*n}setContainerSize(){const t={width:this.clientWidth,height:this.clientHeight},e=this.getConfig().image,i=C(this,x).getImage(e),{loaded:o}=i;if(!o)return;const a=this.getCropPercent(),n={width:(a.x2-a.x1)*i.width,height:(a.y2-a.y1)*i.height},l=O.getBoundingBoxDims(n,lt(this.rotation)),s=O.fitImageInsideBox(l,{width:t.width,height:t.height}).width/l.width;this.container.style.width=`${n.width*s}px`,this.container.style.height=`${n.height*s}px`}drawImage(){const t=this.getCanvasCtx(),e=this.getConfig().image,{loaded:i,image:o,width:a,height:n}=C(this,x).getImage(e);if(!i)return;const{clientWidth:l,clientHeight:s}=this.canvas,u=l*window.devicePixelRatio,c=s*window.devicePixelRatio;this.canvas.width=u,this.canvas.height=c;const g=this.getCropPercent();t.drawImage(o,g.x1*a,g.y1*n,(g.x2-g.x1)*a,(g.y2-g.y1)*n,0,0,u,c)}drawFieldRect(){const t=this.getCanvasCtx(),{x:e,y:i,width:o,height:a}=this.getFieldRectPx();t.rect(e,i,o,a),t.lineWidth=2,t.strokeStyle="yellow",t.stroke()}drawGrid(){const t=this.getCanvasCtx(),{image:e,size:i}=this.getConfig(),{loaded:o}=C(this,x).getImage(e);if(!(!o||!this.showGrid||this.gridSize<=0)){t.lineWidth=1,t.strokeStyle="gray";for(let a=0;a<=i[0];a+=this.gridSize)t.beginPath(),t.moveTo(this.xToPx(a),this.yToPx(0)),t.lineTo(this.xToPx(a),this.yToPx(i[1])),t.stroke();for(let a=0;a<=i[1];a+=this.gridSize)t.beginPath(),t.moveTo(this.xToPx(0),this.yToPx(a)),t.lineTo(this.xToPx(i[0]),this.yToPx(a)),t.stroke()}}drawChildren(){const t={canvas:this.getCanvasCtx(),getFieldRectPx:()=>this.getFieldRectPx(),unit:this.unit,rotationUnit:this.rotationUnit,xToPx:(e,i)=>this.xToPx(e,i),yToPx:(e,i)=>this.yToPx(e,i),lengthToPx:(e,i)=>this.lengthToPx(e,i),origin:this.origin};[...this.children].forEach(e=>{var i;const o=this.getCanvasCtx();o.save(),o.beginPath();const a=e;(i=a.draw)==null||i.call(a,t),o.restore()})}drawField(){this.setContainerSize(),this.drawImage(),this.drawFieldRect(),this.drawGrid(),this.drawChildren(),window.requestAnimationFrame(()=>{this.drawField()})}firstUpdated(){this.drawField()}render(){return Q`
      <div class="outside-container">
        <div class="container" style="transform: rotate(${-this.rotation}deg)">
          <canvas></canvas>
        </div>
      </div>
    `}}x=new WeakMap;p.styles=K`
    :host {
      display: inline-flex;
      position: relative;
      width: 500px;
      height: 300px;
      justify-content: center;
      align-items: center;
    }

    .container {
    }

    canvas {
      width: 100%;
      height: 100%;
    }
  `;d([h({type:String})],p.prototype,"game",2);d([h({type:Number,attribute:"crop-top"})],p.prototype,"cropTop",2);d([h({type:Number,attribute:"crop-bottom"})],p.prototype,"cropBottom",2);d([h({type:Number,attribute:"crop-left"})],p.prototype,"cropLeft",2);d([h({type:Number,attribute:"crop-right"})],p.prototype,"cropRight",2);d([h({type:String,attribute:"crop-type"})],p.prototype,"cropType",2);d([h({type:String})],p.prototype,"unit",2);d([h({type:String,attribute:"rotation-unit"})],p.prototype,"rotationUnit",2);d([h({type:Number})],p.prototype,"rotation",2);d([h({type:Boolean,attribute:"show-grid"})],p.prototype,"showGrid",2);d([h({type:Number,attribute:"grid-size"})],p.prototype,"gridSize",2);d([h({type:String})],p.prototype,"origin",2);d([G("canvas",!0)],p.prototype,"canvas",2);d([G(".container",!0)],p.prototype,"container",2);customElements.get("frc-field")||customElements.define("frc-field",p);const ct={game:v[0].game,cropType:"percent",unit:I,rotation:0,showGrid:!1,gridSize:1,origin:"blue",robotColor:"blue",robotOpacity:1,robotX:0,robotY:0,robotAngle:0,robotWidth:.6,robotLength:.9},pt={game:{table:{category:"Field",defaultValue:{summary:v[0].game}},options:v.map(({game:r})=>r),control:"select"},cropType:{control:"radio",options:["percent","distance"],table:{category:"Field",defaultValue:"percent"}},cropTop:{control:"number",table:{category:"Field"}},cropBottom:{control:"number",table:{category:"Field"}},cropLeft:{control:"number",table:{category:"Field"}},cropRight:{control:"number",table:{category:"Field"}},unit:{table:{category:"Field",defaultValue:I},options:Object.keys(Z),control:"select"},rotation:{table:{category:"Field",defaultValue:{summary:0}}},showGrid:{table:{category:"Field",defaultValue:{summary:!1}}},gridSize:{table:{category:"Field",defaultValue:{summary:1}}},origin:{control:"radio",options:["blue","red"],table:{category:"Field",defaultValue:"blue"}}},gt={robotColor:{control:"color",table:{category:"Robot",defaultValue:{summary:"blue"}}},robotOpacity:{table:{category:"Robot",defaultValue:{summary:1}}},robotX:{table:{category:"Robot",defaultValue:{summary:0}}},robotY:{table:{category:"Robot",defaultValue:{summary:0}}},robotAngle:{table:{category:"Robot",defaultValue:{summary:0}}},robotWidth:{table:{category:"Robot",defaultValue:{summary:.6}}},robotLength:{table:{category:"Robot",defaultValue:{summary:.9}}}},Pt={title:"FRC/Field",tags:["autodocs"],component:"frc-field"};function dt(){return{args:ct,argTypes:{...pt,...gt},parameters:{canvas:{sourceState:"shown"}},render:r=>X`
      <frc-field
        game=${r.game}
        crop-type=${r.cropType}
        crop-top=${z(r.cropTop??void 0)}
        crop-bottom=${z(r.cropBottom??void 0)}
        crop-left=${z(r.cropLeft??void 0)}
        crop-right=${z(r.cropRight??void 0)}
        unit=${r.unit}
        rotation=${r.rotation}
        ?show-grid=${r.showGrid}
        grid-size=${r.gridSize}
        origin=${r.origin}
      >
        <frc-field-robot
          color=${r.robotColor}
          opacity=${r.robotOpacity}
          pose="[${[r.robotX,r.robotY,r.robotAngle]}]"
          width=${r.robotWidth}
          length=${r.robotLength}
        ></frc-field-robot>
      </frc-field>
    `}}const L=dt(),W={args:{pathColor:"green",pathOpacity:.7,lineWidth:10,translations:[7,5,9,5,9,3,7,3,7,5,8,7,9,5]},argTypes:{pathColor:{control:"color",table:{category:"Path",defaultValue:{summary:"green"}}},pathOpacity:{table:{category:"Path",defaultValue:{summary:1}}},lineWidth:{table:{category:"Path",defaultValue:{summary:4}}},translations:{table:{category:"Path",defaultValue:{summary:[]}}}},render:r=>X`
    <frc-field>
      <frc-field-path
        color="red"
        opacity="1"
        poses="[1,3,0.22887754381363834,1.2990000000000002,3.0290000000000004,10.658528835460004,1.5920000000000005,3.112,20.372666018396302,1.8730000000000007,3.2430000000000003,29.101450825807632,2.136000000000001,3.4160000000000004,37.14767936631827,2.375000000000001,3.625000000000001,44.84721053029682,2.584000000000001,3.864000000000001,52.539946195371016,2.7570000000000006,4.127000000000001,60.565787789521615,2.888000000000001,4.408000000000002,69.26105821010881,2.9710000000000005,4.701000000000001,78.93100644680327,3,5,90.22887754381367,3.0290000000000004,4.701,100.65852883546,3.112,4.4079999999999995,110.372666018396,3.2430000000000003,4.127,119.10145082580961,3.4160000000000004,3.863999999999999,127.14767936631823,3.625000000000001,3.624999999999999,134.84721053029682,3.864000000000001,3.415999999999999,142.53994619537104,4.127000000000001,3.2429999999999994,150.5657877895216,4.408000000000002,3.111999999999999,159.26105821010884,4.701000000000001,3.0289999999999995,168.93100644680328]"
      ></frc-field-path>
      <frc-field-path
        color=${r.pathColor}
        opacity=${r.pathOpacity}
        line-width=${r.lineWidth}
        translations=${JSON.stringify(r.translations)}
      ></frc-field-path>
    </frc-field>
  `};var B,A,E;L.parameters={...L.parameters,docs:{...(B=L.parameters)==null?void 0:B.docs,source:{originalSource:"createFieldStory()",...(E=(A=L.parameters)==null?void 0:A.docs)==null?void 0:E.source}}};var N,U,j;W.parameters={...W.parameters,docs:{...(N=W.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    pathColor: "green",
    pathOpacity: 0.7,
    lineWidth: 10,
    translations: [7, 5, 9, 5, 9, 3, 7, 3, 7, 5, 8, 7, 9, 5]
  },
  argTypes: {
    pathColor: {
      control: "color",
      table: {
        category: "Path",
        defaultValue: {
          summary: "green"
        }
      }
    },
    pathOpacity: {
      table: {
        category: "Path",
        defaultValue: {
          summary: 1
        }
      }
    },
    lineWidth: {
      table: {
        category: "Path",
        defaultValue: {
          summary: 4
        }
      }
    },
    translations: {
      table: {
        category: "Path",
        defaultValue: {
          summary: []
        }
      }
    }
  },
  render: args => html\`
    <frc-field>
      <frc-field-path
        color="red"
        opacity="1"
        poses="[1,3,0.22887754381363834,1.2990000000000002,3.0290000000000004,10.658528835460004,1.5920000000000005,3.112,20.372666018396302,1.8730000000000007,3.2430000000000003,29.101450825807632,2.136000000000001,3.4160000000000004,37.14767936631827,2.375000000000001,3.625000000000001,44.84721053029682,2.584000000000001,3.864000000000001,52.539946195371016,2.7570000000000006,4.127000000000001,60.565787789521615,2.888000000000001,4.408000000000002,69.26105821010881,2.9710000000000005,4.701000000000001,78.93100644680327,3,5,90.22887754381367,3.0290000000000004,4.701,100.65852883546,3.112,4.4079999999999995,110.372666018396,3.2430000000000003,4.127,119.10145082580961,3.4160000000000004,3.863999999999999,127.14767936631823,3.625000000000001,3.624999999999999,134.84721053029682,3.864000000000001,3.415999999999999,142.53994619537104,4.127000000000001,3.2429999999999994,150.5657877895216,4.408000000000002,3.111999999999999,159.26105821010884,4.701000000000001,3.0289999999999995,168.93100644680328]"
      ></frc-field-path>
      <frc-field-path
        color=\${args.pathColor}
        opacity=\${args.pathOpacity}
        line-width=\${args.lineWidth}
        translations=\${JSON.stringify(args.translations)}
      ></frc-field-path>
    </frc-field>
  \`
}`,...(j=(U=W.parameters)==null?void 0:U.docs)==null?void 0:j.source}}};const vt=["Field","FieldPath"];export{L as Field,W as FieldPath,vt as __namedExportsOrder,Pt as default};
