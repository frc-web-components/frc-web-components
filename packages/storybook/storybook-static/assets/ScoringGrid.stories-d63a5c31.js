import{s as I,i,k as A,X as h,Y as u}from"./property-293dc01c-d6840d48.js";import{n as N}from"./state-6b86eede-5fd1e84e.js";import{m as w}from"./style-map-d5dd5db8-059c0b16.js";import{o as m}from"./when-b4f6626a-8a775126.js";import{x as p}from"./lit-element-37c36932.js";import{o as G}from"./style-map-4c049cd0.js";import"./directive-daf4e9b6-78860a76.js";var M=Object.defineProperty,z=Object.getOwnPropertyDescriptor,g=(t,e,r,o)=>{for(var s=o>1?void 0:o?z(e,r):e,c=t.length-1,a;c>=0;c--)(a=t[c])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&M(e,r,s),s},_=(t,e,r)=>{if(!e.has(t))throw TypeError("Cannot "+r)},J=(t,e,r)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,r)},X=(t,e,r)=>(_(t,e,"access private method"),r),k,V;class d extends A{constructor(){super(...arguments),J(this,k),this.nodeId=1,this.selected=!1,this.cones=0,this.cubes=0,this.background=""}updated(e){(e.has("selected")||e.has("nodeId"))&&X(this,k,V).call(this)}render(){return h`
      <div style="text-align: center; margin-block:auto;">${this.nodeId}</div>

      <!-- empty on:click binding above passes click events to be bound on the Node component -->
      ${u`
        <svg
          viewBox="-2 -2 28 28"
          style="margin-right: 8px; width:100%; height:100%; pointer-events:none"
        >
          ${m(this.cubes>1,()=>u`
              <polygon
                points="8,8 8,20 20,20, 20,8"
                style="fill:rgb(150,0,255);stroke-width:1;stroke:rgb(0,0,0)"
              />
              <polygon
                points="4,4 4,16 16,16, 16,4"
                style="fill:rgb(150,0,255);stroke-width:1;stroke:rgb(0,0,0)"
              />
            `)}
          ${m(this.cubes===1,()=>u`
              <polygon
                points="6,6 6,18 18,18, 18,6"
                style="fill:rgb(150,0,255);stroke-width:1;stroke:rgb(0,0,0)"
              />
            `)}
          ${m(this.cones>1,()=>u`
              <polygon
                points="13,8 11,8 8,22 5,22 19,22 16,22"
                style="fill:rgb(255,200,0);stroke-width:1;stroke:rgb(0,0,0)"
              />
              <polygon
                points="13,4 11,4 8,18 5,18 19,18 16,18"
                style="fill:rgb(255,200,0);stroke-width:1;stroke:rgb(0,0,0)"
              />
            `)}
          
          ${m(this.cones===1,()=>u`
              <polygon
                points="13,6 11,6 8,20 5,20 19,20 16,20"
                style="fill:rgb(255,200,0);stroke-width:1;stroke:rgb(0,0,0)"
              />
            `)}  
        </svg>
      `}
    `}}k=new WeakSet;V=function(){this.selected?this.background="green":this.nodeId>=1&&this.nodeId<=9?this.background="lightgray":(this.nodeId-1)%3===1?this.background="purple":this.background="yellow",this.style.setProperty("background-color",this.background)};d.styles=I`
    :host {
      display: block;
      color: black;
      font-size: 2em;
      height: 100%;
      flex-grow: 1;
      border: 1px solid black;
      box-sizing: border-box;
    }
  `;g([i({type:Number,attribute:"node-id"})],d.prototype,"nodeId",2);g([i({type:Boolean})],d.prototype,"selected",2);g([i({type:Number})],d.prototype,"cones",2);g([i({type:Number})],d.prototype,"cubes",2);g([N()],d.prototype,"background",2);customElements.get("frc-scoring-grid-node")||customElements.define("frc-scoring-grid-node",d);var Y=Object.defineProperty,U=Object.getOwnPropertyDescriptor,l=(t,e,r,o)=>{for(var s=o>1?void 0:o?U(e,r):e,c=t.length-1,a;c>=0;c--)(a=t[c])&&(s=(o?a(e,r,s):a(s))||s);return o&&s&&Y(e,r,s),s},q=(t,e,r)=>{if(!e.has(t))throw TypeError("Cannot "+r)},$=(t,e,r)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,r)},x=(t,e,r)=>(q(t,e,"access private method"),r),v,B,S,j;function f(t,e=!1){return e?9-(t-1)%9:1+(t-1)%9}function C(t,e=!1){return e?3-Math.floor((t-1)/9):Math.floor((t-1)/9)+1}function F(t,e){return Array.from(Array(e+1).keys()).slice(t)}class n extends A{constructor(){super(...arguments),$(this,v),$(this,S),this.selection=0,this.cubesScored=[],this.conesScored=[],this.hideLinks=!1,this.reverseRow=!1,this.reverseCol=!1,this.leftOfLinks=[]}updated(e){(e.has("cubesScored")||e.has("conesScored"))&&x(this,S,j).call(this)}renderLinks(){return this.hideLinks?h``:h`
      ${this.leftOfLinks.map(e=>h`
          <div
            class="link"
            style=${w({gridColumn:`${Math.min(f(e,this.reverseCol),f(e+2,this.reverseCol))} / span 3`,gridRow:C(e,this.reverseRow)})}
          ></div>
        `)}
    `}render(){return h`
      <div class="grid">
        ${F(1,27).map(e=>h`
            <div
              style=${w({gridColumn:f(e,this.reverseCol),gridRow:C(e,this.reverseRow)})}
            >
              <frc-scoring-grid-node
                node-id=${e}
                ?selected=${this.selection===e}
                @click=${()=>{x(this,v,B).call(this,e)}}
                cubes=${this.cubesScored.filter(r=>r===e).length}
                cones=${this.conesScored.filter(r=>r===e).length}
              >
              </frc-scoring-grid-node>
            </div>
          `)}
        ${this.renderLinks()}
      </div>
    `}}v=new WeakSet;B=function(t){this.selection===t?this.selection=0:this.selection=t;const e=new CustomEvent("select",{bubbles:!0,composed:!0,detail:{nodeId:this.selection}});this.dispatchEvent(e)};S=new WeakSet;j=function(){const t=[],e=this.cubesScored.concat(this.conesScored);for(let r=0;r<3;r+=1)for(let o=1;o<=7;o+=1)e.includes(r*9+o)&&e.includes(r*9+o+1)&&e.includes(r*9+o+2)&&(t.push(r*9+o),o+=2);this.leftOfLinks=t};n.styles=I`
    :host {
      display: inline-block;
      width: 550px;
      height: 380px;
    }

    .grid {
      display:grid;
      grid-template-columns: repeat(9, calc(100% / 9));
      grid-template-rows: repeat(3, calc(100% / 3));
      height:100%;
      width:100%;
      flex-direction:row-reverse;
      grid-auto-flow: dense;"
    }

    .link {
      border: 5px solid black;
      border-radius: 10px;
      margin: 5px;
      box-sizing: border-box;
      pointer-events: none;
    }
  `;l([i({type:Number})],n.prototype,"selection",2);l([i({type:Array,attribute:"cubes-scored"})],n.prototype,"cubesScored",2);l([i({type:Array,attribute:"cones-scored"})],n.prototype,"conesScored",2);l([i({type:Boolean,attribute:"hide-links"})],n.prototype,"hideLinks",2);l([i({type:Boolean,attribute:"reverse-row"})],n.prototype,"reverseRow",2);l([i({type:Boolean,attribute:"reverse-col"})],n.prototype,"reverseCol",2);l([N()],n.prototype,"leftOfLinks",2);customElements.get("frc-scoring-grid")||customElements.define("frc-scoring-grid",n);const D={selection:-1,cubesScored:[],conesScored:[],hideLinks:!1,reverseRow:!1,reverseCol:!1,theme:"light","background-color":"#fff"},se={title:"Charged Up/Scoring Grid",tags:["autodocs"],component:"frc-scoring-grid",args:D,argTypes:{selection:{table:{category:"Properties",defaultValue:{summary:0}},control:{type:"number",min:0,step:27}},cubesScored:{control:"object",table:{category:"Properties",defaultValue:{summary:[]}}},conesScored:{control:"object",table:{category:"Properties",defaultValue:{summary:[]}}},hideLinks:{table:{category:"Properties",defaultValue:{summary:!1}}},reverseRow:{table:{category:"Properties",defaultValue:{summary:!1}}},reverseCol:{table:{category:"Properties",defaultValue:{summary:!1}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}}},decorators:[(t,e)=>{const o=e.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",s=e.args["background-color"];return p` <div
        style=${G({padding:"20px 10px",marginBottom:"5px",background:e.args.theme==="custom"?s:o})}
      >
        ${t()}
      </div>`}]};function H(t){return t.theme==="custom"?p`
      <style>
        .custom {
        }
      </style>
    `:t.theme==="dark"?p`
      <style>
        .dark {
        }
      </style>
    `:p`
    <style>
      .light {
      }
    </style>
  `}function W(t={}){return{args:{...D,...t},render:r=>p`
      ${H(r)}
      <frc-scoring-grid
        class=${r.theme}
        selection=${r.selection}
        cubes-scored=${JSON.stringify(r.cubesScored)}
        cones-scored=${JSON.stringify(r.conesScored)}
        ?hide-links=${r.hideLinks}
        ?reverse-row=${r.reverseRow}
        ?reverse-column=${r.reverseColumn}
      ></frc-scoring-grid>
    `}}const y=W({theme:"light",cubesScored:[1,1,2,3,5,13],conesScored:[11,14,14]}),b=W({theme:"dark",cubesScored:[1,1,2,3,5,13],conesScored:[11,14,14]});var L,O,E;y.parameters={...y.parameters,docs:{...(L=y.parameters)==null?void 0:L.docs,source:{originalSource:`createScoringGridStory({
  theme: 'light',
  cubesScored: [1, 1, 2, 3, 5, 13],
  conesScored: [11, 14, 14]
})`,...(E=(O=y.parameters)==null?void 0:O.docs)==null?void 0:E.source}}};var P,T,R;b.parameters={...b.parameters,docs:{...(P=b.parameters)==null?void 0:P.docs,source:{originalSource:`createScoringGridStory({
  theme: 'dark',
  cubesScored: [1, 1, 2, 3, 5, 13],
  conesScored: [11, 14, 14]
})`,...(R=(T=b.parameters)==null?void 0:T.docs)==null?void 0:R.source}}};const ie=["LightTheme","DarkTheme"];export{b as DarkTheme,y as LightTheme,ie as __namedExportsOrder,se as default};
