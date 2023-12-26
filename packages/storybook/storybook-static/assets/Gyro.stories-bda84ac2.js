import{s as C,i as y,k as T,X as f,Y as S}from"./property-293dc01c-d6840d48.js";import{h as d}from"./query-b33b5ea2-b51c1579.js";import{E as u}from"./transform-bc2573b1-2dde8094.js";import{x as h}from"./lit-element-37c36932.js";import{o as L}from"./style-map-4c049cd0.js";function z(r,e,t){r=+r,e=+e,t=(o=arguments.length)<2?(e=r,r=0,1):o<3?1:+t;for(var s=-1,o=Math.max(0,Math.ceil((e-r)/t))|0,c=new Array(o);++s<o;)c[s]=r+s*t;return c}var A=Object.defineProperty,G=Object.getOwnPropertyDescriptor,l=(r,e,t,s)=>{for(var o=s>1?void 0:s?G(e,t):e,c=r.length-1,i;c>=0;c--)(i=r[c])&&(o=(s?i(e,t,o):i(o))||o);return s&&o&&A(e,t,o),o};function M(r){return r*Math.PI/180}function p(r){return r*180/Math.PI}function P(r,e,t){return Math.min(t,Math.max(r,e))}function n(r,e=!1){const t=M(-(r-90));return[e?-Math.cos(t):Math.cos(t),Math.sin(t)]}class a extends T{constructor(){super(...arguments),this.value=0,this.hideLabel=!1,this.precision=2,this.counterClockwise=!1,this.fromRadians=!1}setLabels(){const e=this.getGyroRadius();u(this._labels).selectAll("text").data([0,45,90,135,180,-135,-90,-45]).join(t=>t.append("text").attr("text-anchor","middle").attr("alignment-baseline","middle").attr("font-size",15).attr("fill","var(--frc-gyro-color, #000)").text(s=>`${s}°`)).attr("x",t=>n(t,this.counterClockwise)[0]*(e+30)).attr("y",t=>-n(t,this.counterClockwise)[1]*(e+30))}setDialAngle(){const e=this.getGyroRadius(),t=this.fromRadians?p(this.value):this.value;u(this._dial).attr("x2",n(t,this.counterClockwise)[0]*(e-7)).attr("y2",-n(t,this.counterClockwise)[1]*(e-7))}addTicks(e,t,s,o){const c=this.getGyroRadius();u(e).selectAll("line").data(z(0,360,s)).join(i=>i.append("line").attr("stroke","var(--frc-gyro-color, #000)").attr("stroke-width",o)).attr("x1",i=>n(i)[0]*c).attr("y1",i=>-n(i)[1]*c).attr("x2",i=>n(i)[0]*(c+t)).attr("y2",i=>-n(i)[1]*(c+t))}firstUpdated(){new ResizeObserver(()=>{this.resized()}).observe(this),this.resized()}resized(){const e=this.getSize();u(this._svg).attr("width",e).attr("height",e),u(this._gyro).attr("transform",`translate(${e/2},${e/2})`);const t=this.getGyroRadius();u(this._gyroEdge).attr("r",t),this.addTicks(this._minorTicks,5,5,1),this.addTicks(this._majorTicks,10,45,2),this.setLabels(),this.setDialAngle()}getSize(){const{width:e}=this.getBoundingClientRect();return e}getGyroRadius(){return this.getSize()/2-53}updated(e){(e.has("value")||e.has("fromRadians")||e.has("counterClockwise"))&&this.setDialAngle(),e.has("counterClockwise")&&this.setLabels()}render(){const e=`${(this.fromRadians?p(this.value):this.value).toFixed(P(this.precision,0,100))}`;return f`
      <div>
        ${S`
          <svg>
            <g class="gyro">
              <circle class="gyro-edge" stroke-width="2" stroke="var(--frc-gyro-color, #000)" style="fill: none"></circle>
              <g class="minor-ticks"></g>
              <g class="major-ticks"></g>
              <g class="labels"></g>
              <circle class="dial-circle" r="9"></circle>
              <line class="dial" x1="0" x2="0"></line>
            </g>
          </svg>
        `} ${this.hideLabel?null:f`<label>${e}&deg</label> `}
      </div>
    `}}a.styles=C`
    :host {
      font-family: sans-serif;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      width: 300px;
      height: auto;
    }

    svg {
      width: 100%;
    }

    label {
      color: var(--frc-gyro-color, #000);
      text-align: center;
      display: block;
      font-size: 16px;
    }

    .dial-circle {
      fill: var(--frc-gyro-dial-color, blue);
    }

    .dial {
      stroke: var(--frc-gyro-dial-color, blue);
      stroke-width: 3;
    }
  `;l([y({type:Number})],a.prototype,"value",2);l([y({type:Boolean,attribute:"hide-label"})],a.prototype,"hideLabel",2);l([y({type:Number})],a.prototype,"precision",2);l([y({type:Boolean,attribute:"counter-clockwise"})],a.prototype,"counterClockwise",2);l([y({type:Boolean,attribute:"from-radians"})],a.prototype,"fromRadians",2);l([d("svg")],a.prototype,"_svg",2);l([d(".dial")],a.prototype,"_dial",2);l([d(".gyro")],a.prototype,"_gyro",2);l([d(".gyro-edge")],a.prototype,"_gyroEdge",2);l([d(".minor-ticks")],a.prototype,"_minorTicks",2);l([d(".major-ticks")],a.prototype,"_majorTicks",2);l([d(".labels")],a.prototype,"_labels",2);customElements.get("frc-gyro")||customElements.define("frc-gyro",a);const _={value:0,hideLabel:!1,precision:2,counterClockwise:!1,fromRadians:!1,theme:"light","background-color":"#fff","--frc-gyro-color":"black","--frc-gyro-dial-color":"blue"},F={title:"FRC/Gyro",tags:["autodocs"],component:"frc-gyro",args:_,argTypes:{value:{table:{category:"Properties",defaultValue:{summary:0}}},hideLabel:{table:{category:"Properties",defaultValue:{summary:!1}}},precision:{table:{category:"Properties",defaultValue:{summary:2}},control:{type:"number",min:0,step:1}},counterClockwise:{table:{category:"Properties",defaultValue:{summary:!1}}},fromRadians:{table:{category:"Properties",defaultValue:{summary:!1}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-gyro-color":{table:{category:"Styles",defaultValue:{summary:"black"}}},"--frc-gyro-dial-color":{table:{category:"Styles",defaultValue:{summary:"blue"}}}},decorators:[(r,e)=>{const s=e.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",o=e.args["background-color"];return h` <div
        style=${L({padding:"20px 10px",marginBottom:"5px",background:e.args.theme==="custom"?o:s})}
      >
        ${r()}
      </div>`}]};function V(r){return r.theme==="custom"?h`
      <style>
        .custom {
          --frc-gyro-color: ${r["--frc-gyro-color"]};
          --frc-gyro-dial-color: ${r["--frc-gyro-dial-color"]};
        }
      </style>
    `:r.theme==="dark"?h`
      <style>
        .dark {
          --frc-gyro-color: white;
          --frc-gyro-dial-color: blue;
        }
      </style>
    `:h`
    <style>
      .light {
        --frc-gyro-color: black;
        --frc-gyro-dial-color: blue;
      }
    </style>
  `}function R(r={}){return{args:{..._,...r},render:t=>h`
      ${V(t)}
      <frc-gyro
        class=${t.theme}
        value=${t.value}
        ?hide-label=${t.hideLabel}
        precision=${t.precision}
        ?counter-clockwise=${t.counterClockwise}
        ?from-radians=${t.fromRadians}
      ></frc-gyro>
    `}}const g=R({theme:"light"}),m=R({theme:"dark"});var b,k,v;g.parameters={...g.parameters,docs:{...(b=g.parameters)==null?void 0:b.docs,source:{originalSource:`createGyroStory({
  theme: 'light'
})`,...(v=(k=g.parameters)==null?void 0:k.docs)==null?void 0:v.source}}};var x,w,$;m.parameters={...m.parameters,docs:{...(x=m.parameters)==null?void 0:x.docs,source:{originalSource:`createGyroStory({
  theme: 'dark'
})`,...($=(w=m.parameters)==null?void 0:w.docs)==null?void 0:$.source}}};const I=["LightTheme","DarkTheme"];export{m as DarkTheme,g as LightTheme,I as __namedExportsOrder,F as default};
