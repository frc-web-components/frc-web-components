import{s as k,i as a,k as V,X as A}from"./property-293dc01c-d6840d48.js";import{x as d}from"./lit-element-37c36932.js";import{o as P}from"./style-map-4c049cd0.js";const r={info:{color:"#fff",name:"INFO",level:1},debug:{color:"#fff",name:"DEBUG",level:0},fatal:{color:"#FF3E3E",name:"ERROR",level:4},warning:{color:"#FFC53E",name:"WARNING",level:3},success:{color:"#3EFF45",name:"SUCCESS",level:2}},D={name:"Html Logger",enabled:!0,maxLogCount:1e3,loggingFormat:"[MESSAGE]",argumentsSeparator:" ",utcTime:!1,level:0};var F=function(i){var e=[].slice.call(arguments,1);return e.forEach(function(t){for(var n in t)i[n]=t[n]}),i};class N{constructor(e,t=document.body){this.options=F({},D,e||{}),this.parent=t,this.linesCount=0,this.$={},this.initialized=!1}init(){if(this.initialized)return;if(!document||!document.createElement||!document.body||!document.body.appendChild)throw new Error("HtmlLogger not initialized");this.$.container=document.createElement("div");const e=`width:100%; height: 100%;
					margin:0;
					left:0;
					background: rgba(0, 0, 0, 0.8);
					overflow:auto;
					padding: 5px 7px;
    			box-sizing: border-box;`;this.$.container.setAttribute("style",e),this.$.log=document.createElement("div");const t=document.createElement("span");t.style.color="#afa",t.style.fontWeight="bold";const n=`===== ${this.options.name} - Logger started at ${this.options.utcTime?new Date().toUTCString():new Date} =====`;t.appendChild(document.createTextNode(n));const o=document.createElement("div");o.appendChild(t),o.appendChild(document.createElement("br")),o.appendChild(document.createElement("br")),this.$.container.appendChild(o),this.$.container.appendChild(this.$.log),this.parent.appendChild(this.$.container),this.initialized=!0}setLevel(e){this.options.level=e}setEnable(e=!0){this.initialized&&(this.options.enabled=e,this.$.log.style.color=e?"#fff":"#444")}clean(){if(this.initialized){for(;this.$.log.firstChild;)this.$.log.removeChild(this.$.log.firstChild);this.linesCount=0}}print(e,t=r.info.color,n=r.info.name){if(!this.initialized||!this.options.enabled)return;const o=this.$.container.scrollTop>this.$.container.scrollHeight-this.$.container.clientHeight-5,g=(e.length?e:"[empty]").split(/\r\n|\r|\n/);for(let h=0;h<g.length;h++){let p=document.createElement("div");p.setAttribute("style","color:#999;float:left;");let L=this._getTime();p.appendChild(document.createTextNode(`${L} `));let T=this.options.loggingFormat.replace("[LEVEL]",n).replace("[MESSAGE]",g[h]),f=document.createElement("div");f.setAttribute("style",`word-wrap:break-word;margin-left:6.0em;color: ${t}`),f.appendChild(document.createTextNode(T));let y=document.createElement("div");y.setAttribute("style","clear:both;");var c=document.createElement("div");for(c.appendChild(p),c.appendChild(f),c.appendChild(y),this.$.log.appendChild(c),this.linesCount++;this.linesCount>this.options.maxLogCount;)this.$.log.childNodes[0].remove(),this.linesCount--;o&&(this.$.container.scrollTop=this.$.container.scrollHeight)}}info(){this.options.level<=r.info.level&&this.print([].map.call(arguments,this._determineString).join(this.options.argumentsSeparator))}debug(){this.options.level<=r.debug.level&&this.print([].map.call(arguments,this._determineString).join(this.options.argumentsSeparator),r.debug.color,r.debug.name)}warning(){this.options.level<=r.warning.level&&this.print([].map.call(arguments,this._determineString).join(this.options.argumentsSeparator),r.warning.color,r.warning.name)}success(){this.options.level<=r.success.level&&this.print([].map.call(arguments,this._determineString).join(this.options.argumentsSeparator),r.success.color,r.success.name)}error(){this.options.level<=r.fatal.level&&this.print([].map.call(arguments,this._determineString).join(this.options.argumentsSeparator),r.fatal.color,r.fatal.name)}_getTime(){return(this.options.utcTime?new Date().toUTCString():new Date().toString()).match(/([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/)[0]}_determineString(e){if(e===void 0)return"undefined";if(e===null)return"null";if(e instanceof Array)return JSON.stringify(e);switch(typeof e){default:case"object":return`${e.constructor?e.constructor.name:e.toString()} -> ${JSON.stringify(e)}`;case"function":return e.name||"[function]";case"number":case"string":case"boolean":return e}}}var O=Object.defineProperty,_=Object.getOwnPropertyDescriptor,l=(i,e,t,n)=>{for(var o=n>1?void 0:n?_(e,t):e,g=i.length-1,c;g>=0;g--)(c=i[g])&&(o=(n?c(e,t,o):c(o))||o);return n&&o&&O(e,t,o),o};class s extends V{constructor(){super(...arguments),this.title="Robot Logger",this.maxLogCount=1e3,this.debug="",this.info="",this.success="",this.warning="",this.error="",this.level="info",this.disabled=!1,this.levels=["debug","info","success","warning","error"]}firstUpdated(){const e=this.renderRoot.querySelector("[part=logger]");this.logger=new N({name:this.title,maxLogCount:Math.max(0,this.maxLogCount),level:this.levels.indexOf(this.level),enabled:!this.disabled},e),this.logger.init()}updated(e){this.levels.forEach(t=>{e.has(t)&&this[t]&&this.logger[t](this[t])}),e.has("maxLogCount")&&(this.logger.options.maxLogCount=Math.max(0,this.maxLogCount)),e.has("level")&&this.logger.setLevel(this.levels.indexOf(this.level)),e.has("disabled")&&this.logger.setEnable(!this.disabled)}render(){return A` <div part="logger"></div> `}}s.styles=k`
    :host {
      display: inline-block;
      width: 500px;
      height: 400px;
      font-family: monospace;
      font-size: 14px;
    }

    [part='logger'] {
      width: 100%;
      height: 100%;
    }
  `;l([a({type:String})],s.prototype,"title",2);l([a({type:Number,attribute:"max-log-count"})],s.prototype,"maxLogCount",2);l([a({type:String})],s.prototype,"debug",2);l([a({type:String})],s.prototype,"info",2);l([a({type:String})],s.prototype,"success",2);l([a({type:String})],s.prototype,"warning",2);l([a({type:String})],s.prototype,"error",2);l([a({type:String})],s.prototype,"level",2);l([a({type:Boolean})],s.prototype,"disabled",2);customElements.get("frc-logger")||customElements.define("frc-logger",s);const E={title:"Robot Logger",maxLogCount:1e3,level:"info",debug:"",info:"",success:"",warning:"",error:"",disabled:!1,theme:"light","background-color":"#fff"},U={title:"FRC/Logger",tags:["autodocs"],component:"frc-logger",args:E,argTypes:{title:{table:{category:"Properties",defaultValue:{summary:"Robot Logger"}}},maxLogCount:{table:{category:"Properties",defaultValue:{summary:1e3}}},level:{table:{category:"Properties",defaultValue:{summary:"info"}},options:["debug","info","success","warning","error"],control:"select"},debug:{table:{category:"Properties",defaultValue:{summary:""}}},info:{table:{category:"Properties",defaultValue:{summary:""}}},success:{table:{category:"Properties",defaultValue:{summary:""}}},warning:{table:{category:"Properties",defaultValue:{summary:""}}},error:{table:{category:"Properties",defaultValue:{summary:""}}},disabled:{table:{category:"Properties",defaultValue:{summary:!1}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}}},decorators:[(i,e)=>{const n=e.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",o=e.args["background-color"];return d` <div
        style=${P({padding:"20px 10px",marginBottom:"5px",background:e.args.theme==="custom"?o:n})}
      >
        ${i()}
      </div>`}]};function z(i){return i.theme==="custom"?d`
      <style>
        .custom {
        }
      </style>
    `:i.theme==="dark"?d`
      <style>
        .dark {
        }
      </style>
    `:d`
    <style>
      .light {
      }
    </style>
  `}function w(i={}){return{args:{...E,...i},render:t=>d`
      ${z(t)}
      <frc-logger
        class=${t.theme}
        title=${t.title}
        max-log-count=${t.maxLogCount}
        debug=${t.debug}
        info=${t.info}
        success=${t.success}
        warning=${t.warning}
        error=${t.error}
        level=${t.level}
        ?disabled=${t.disabled}
      ></frc-logger>
    `}}const u=w({theme:"light"}),m=w({theme:"dark"});var b,v,C;u.parameters={...u.parameters,docs:{...(b=u.parameters)==null?void 0:b.docs,source:{originalSource:`createLoggerStory({
  theme: 'light'
})`,...(C=(v=u.parameters)==null?void 0:v.docs)==null?void 0:C.source}}};var S,$,x;m.parameters={...m.parameters,docs:{...(S=m.parameters)==null?void 0:S.docs,source:{originalSource:`createLoggerStory({
  theme: 'dark'
})`,...(x=($=m.parameters)==null?void 0:$.docs)==null?void 0:x.source}}};const G=["LightTheme","DarkTheme"];export{m as DarkTheme,u as LightTheme,G as __namedExportsOrder,U as default};
