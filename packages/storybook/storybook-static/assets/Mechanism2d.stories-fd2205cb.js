import{s as b,i as l,k as $,Y as g}from"./property-293dc01c-d6840d48.js";import{n as k}from"./state-6b86eede-5fd1e84e.js";import{h as v}from"./query-b33b5ea2-b51c1579.js";import{x as f}from"./lit-element-37c36932.js";import{o as w}from"./style-map-4c049cd0.js";var C=Object.defineProperty,S=Object.getOwnPropertyDescriptor,c=(i,e,t,s)=>{for(var r=s>1?void 0:s?S(e,t):e,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(e,t,r):n(r))||r);return s&&r&&C(e,t,r),r};class a extends ${constructor(){super(...arguments),this.backgroundColor="#000020",this.dims=[3,3],this.roots=[],this.mechanism2d=this.getMechanism2d()}firstUpdated(){new ResizeObserver(()=>{this.resized()}).observe(this),requestAnimationFrame(()=>{this.updateMechanism2d()})}getMech2dSize(){const{width:e,height:t}=this.getBoundingClientRect(),[s,r]=this.dims;return r/s*e<t?[e,r/s*e]:[s/r*t,t]}resized(){this.requestUpdate()}getSize(){const{width:e}=this.getBoundingClientRect();return e}updated(e){e.has("backgroundColor")&&this._svg.style.setProperty("background-color",this.backgroundColor),e.has("dims")&&this.requestUpdate()}updateMechanism2d(){this.mechanism2d=this.getMechanism2d(),requestAnimationFrame(()=>{this.updateMechanism2d()})}getMechanism2d(){return{backgroundColor:this.backgroundColor,dims:this.dims,roots:this.roots}}render(){const[e,t]=this.getMech2dSize();return g`
      <svg
        style="width: ${e}px; height: ${t}px; background: ${this.mechanism2d.backgroundColor}"
      >
        ${this.mechanism2d.roots.map(s=>this.renderMechanism2dRoot(s))}
      </svg>
    `}renderMechanism2dRoot(e){const[t,s]=this.dims,[r,o]=this.getMech2dSize(),n=e.x/t*r,d=e.y/s*o;return g`
      <g style="transform: translate(${n}px, ${o-d}px)">
        ${e.children.map(m=>this.renderMechanism2dLine(m))}
      </g>
    `}renderMechanism2dLine(e){const[t]=this.dims,[s]=this.getMech2dSize(),r=s/t*e.length,o=e.angle*Math.PI/180,n=Math.cos(o)*r,d=-Math.sin(o)*r,m=Math.max(1,e.weight*2/3);return g`
      <line stroke=${e.color} stroke-width=${m} x1="0" y1="0" x2="${n}px" y2="${d}px"  />
      <g style="transform: translate(${n}px, ${d}px) rotate(${-e.angle}deg)">
        ${e.children.map(M=>this.renderMechanism2dLine(M))}
      </g>
    `}}a.styles=b`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 300px;
      height: 300px;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `;c([l({type:String,attribute:"background-color"})],a.prototype,"backgroundColor",2);c([l({type:Array})],a.prototype,"dims",2);c([l({type:Array})],a.prototype,"roots",2);c([v("svg")],a.prototype,"_svg",2);c([k()],a.prototype,"mechanism2d",2);customElements.get("frc-mechanism2d")||customElements.define("frc-mechanism2d",a);const x={backgroundColor:"#000020",dims:[3,3],roots:[]},j={title:"FRC/Mechanism2d",tags:["autodocs"],component:"frc-mechanism2d",args:x,argTypes:{backgroundColor:{control:"color",table:{category:"Properties",defaultValue:{summary:"#000020"}}},dims:{control:"object",table:{category:"Properties",defaultValue:{summary:[3,3]}}},roots:{control:"object",table:{category:"Properties",defaultValue:{summary:[]}}}},decorators:[i=>f` <div
      style=${w({padding:"20px 10px",marginBottom:"5px"})}
    >
      ${i()}
    </div>`]};function z(i={}){return{args:{...x,...i},render:t=>f`
      <frc-mechanism2d
        class=${t.theme}
        background-color=${t.backgroundColor}
        dims=${JSON.stringify(t.dims)}
        roots=${JSON.stringify(t.roots)}
      ></frc-mechanism2d>
    `}}const h=z({roots:[{x:1.5,y:.5,children:[{angle:90,color:"#00FF00",length:.5334,weight:10,children:[{angle:0,color:"#008000",length:.5,weight:6,children:[]}]}]}]});var p,u,y;h.parameters={...h.parameters,docs:{...(p=h.parameters)==null?void 0:p.docs,source:{originalSource:`createMechanism2dStory({
  roots: [{
    x: 1.5,
    y: 0.5,
    children: [{
      angle: 90,
      color: '#00FF00',
      length: 0.5334,
      weight: 10,
      children: [{
        angle: 0,
        color: '#008000',
        length: 0.5,
        weight: 6,
        children: []
      }]
    }]
  }]
})`,...(y=(u=h.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};const q=["Mechanism2d"];export{h as Mechanism2d,q as __namedExportsOrder,j as default};
