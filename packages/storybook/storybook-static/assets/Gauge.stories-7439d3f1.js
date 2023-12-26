import{s as se,i as B,k as ue,X as le}from"./property-293dc01c-d6840d48.js";import{h as ce}from"./query-b33b5ea2-b51c1579.js";import{o as ge,l as me}from"./_commonjsHelpers-10dfc225-be18f180.js";import{x as H}from"./lit-element-37c36932.js";import{o as fe}from"./style-map-4c049cd0.js";var U={exports:{}};(function(m){(function(a,o){var u=o(a);m.exports?m.exports=u:a.Gauge=u})(typeof window>"u"?ge:window,function(a,o){var u=a.document,l=Array.prototype.slice,b=a.requestAnimationFrame||a.mozRequestAnimationFrame||a.webkitRequestAnimationFrame||a.msRequestAnimationFrame||function(h){return setTimeout(h,1e3/60)};function A(h){var V=h.duration,C=1,G=60*V,y=h.start||0,E=h.end,M=E-y,P=h.step,S=h.easing||function(t){return(t/=.5)<1?.5*Math.pow(t,3):.5*(Math.pow(t-2,3)+2)};function R(){var t=C/G,e=M*S(t)+y;P(e,C),C+=1,t<1&&b(R)}b(R)}var J=function(){var h="http://www.w3.org/2000/svg",V={centerX:50,centerY:50},C={dialRadius:40,dialStartAngle:135,dialEndAngle:45,value:0,max:100,min:0,valueDialClass:"value",valueClass:"value-text",dialClass:"dial",gaugeClass:"gauge",showValue:!0,gaugeColor:null,label:function(t){return Math.round(t)}};function G(){var t=arguments[0],e=l.call(arguments,1);return e.forEach(function(n){for(var r in n)n.hasOwnProperty(r)&&(t[r]=n[r])}),t}function y(t,e,n){var r=u.createElementNS(h,t);for(var s in e)r.setAttribute(s,e[s]);return n&&n.forEach(function(c){r.appendChild(c)}),r}function E(t,e){return t*e/100}function M(t,e,n){var r=Number(t);return r>n?n:r<e?e:r}function P(t,e,n){var r=n-e,s=t-e;return 100*s/r}function S(t,e,n,r){var s=r*Math.PI/180;return{x:Math.round((t+n*Math.cos(s))*1e3)/1e3,y:Math.round((e+n*Math.sin(s))*1e3)/1e3}}function R(t,e,n){var r=V.centerX,s=V.centerY;return{end:S(r,s,t,n),start:S(r,s,t,e)}}return function(t,e){e=G({},C,e);var n=t,r=e.max,s=e.min,c=M(e.value,s,r),N=e.dialRadius,Q=e.showValue,f=e.dialStartAngle,w=e.dialEndAngle,K=e.valueDialClass,Z=e.valueClass;e.valueLabelClass;var ee=e.dialClass,te=e.gaugeClass,O=e.color,D,x,ae=e.label,re=e.viewBox,F;if(f<w){console.log("WARN! startAngle < endAngle, Swapping");var ne=f;f=w,w=ne}function T(i,p,d,g){var v=R(i,p,d),X=v.start,q=v.end,ie=typeof g>"u"?1:g;return["M",X.x,X.y,"A",i,i,0,ie,1,q.x,q.y].join(" ")}function oe(i){D=y("text",{x:50,y:50,fill:"#999",class:Z,"font-size":"100%","font-family":"sans-serif","font-weight":"normal","text-anchor":"middle","alignment-baseline":"middle","dominant-baseline":"central"}),x=y("path",{class:K,fill:"none",stroke:"#666","stroke-width":2.5,d:T(N,f,f)});var p=E(100,360-Math.abs(f-w)),d=p<=180?0:1,g=y("svg",{viewBox:re||"0 0 100 100",class:te},[y("path",{class:ee,fill:"none",stroke:"#eee","stroke-width":2,d:T(N,f,w,d)}),y("g",{class:"text-container"},[D]),x]);i.appendChild(g)}function j(i,p){var d=P(i,s,r),g=E(d,360-Math.abs(f-w)),v=g<=180?0:1;Q&&(D.textContent=ae.call(e,i)),x.setAttribute("d",T(N,f,g+f,v))}function I(i,p){var d=O.call(e,i),g=p*1e3,v="stroke "+g+"ms ease";x.style.stroke=d,x.style["-webkit-transition"]=v,x.style["-moz-transition"]=v,x.style.transition=v}return F={setMaxValue:function(i){r=i,j(c)},setValue:function(i){c=M(i,s,r),O&&I(c,0),j(c)},setValueAnimated:function(i,p){var d=c;c=M(i,s,r),d!==c&&(O&&I(c,p),A({start:d||0,end:c,duration:p||1,step:function(g,v){j(g)}}))},getValue:function(){return c}},oe(n),F.setValue(c),F}}();return J})})(U);var de=U.exports,he=de;const pe=me(he);var ve=Object.defineProperty,ye=Object.getOwnPropertyDescriptor,$=(m,a,o,u)=>{for(var l=u>1?void 0:u?ye(a,o):a,b=m.length-1,A;b>=0;b--)(A=m[b])&&(l=(u?A(a,o,l):A(l))||l);return u&&l&&ve(a,o,l),l};class k extends ue{constructor(){super(...arguments),this.min=0,this.max=100,this.value=0}setSize(){const a=this.getBoundingClientRect(),o=a.width,u=a.height,l=Math.min(o,u);this.gaugeElement.style.width=`${l}px`}gaugeInit(){this.gaugeElement.innerHTML="",this.gauge=pe(this.gaugeElement,{min:Math.min(this.min,this.max),max:Math.max(this.min,this.max)}),this.setSize()}firstUpdated(){this.gaugeInit(),new ResizeObserver(()=>this.setSize()).observe(this)}updated(a){var o;(a.has("min")||a.has("max"))&&this.gaugeInit(),(o=this.gauge)==null||o.setValue(this.value)}render(){return le`
      <div class="gauge-container-container">
        <div id="gauge" class="gauge-container"></div>
      </div>
    `}}k.styles=se`
    :host {
      display: inline-block;
      width: 200px;
      height: 200px;
    }

    .gauge-container-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .gauge-container {
      display: block;
    }

    .gauge-container > .gauge > .dial {
      stroke: #ddd;
      stroke-width: 3;
      fill: rgba(0, 0, 0, 0);
      stroke: var(--frc-gauge-color, rgb(221, 221, 221));
    }
    .gauge-container > .gauge > .value {
      stroke: var(--frc-gauge-fill-color, rgb(47, 180, 200));
      stroke-width: 3;
      fill: rgba(0, 0, 0, 0);
    }
    .gauge-container > .gauge .value-text {
      fill: var(--frc-gauge-text-color, rgb(100, 100, 100));
      font-family: sans-serif;
      font-size: 1em;
    }
  `;$([B({type:Number})],k.prototype,"min",2);$([B({type:Number})],k.prototype,"max",2);$([B({type:Number})],k.prototype,"value",2);$([ce("#gauge")],k.prototype,"gaugeElement",2);customElements.get("frc-gauge")||customElements.define("frc-gauge",k);const W={value:0,min:0,max:100,theme:"light","background-color":"#fff"},Me={title:"FRC/Gauge",tags:["autodocs"],component:"frc-gauge",args:W,argTypes:{value:{table:{category:"Properties",defaultValue:{summary:0}}},min:{table:{category:"Properties",defaultValue:{summary:0}}},max:{table:{category:"Properties",defaultValue:{summary:100}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}}},decorators:[(m,a)=>{const u=a.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",l=a.args["background-color"];return H` <div
        style=${fe({padding:"20px 10px",marginBottom:"5px",background:a.args.theme==="custom"?l:u})}
      >
        ${m()}
      </div>`}]};function xe(m={}){return{args:{...W,...m},render:o=>H`
      <frc-gauge
        class=${o.theme}
        value=${o.value}
        min=${o.min}
        max=${o.max}
      ></frc-gauge>
    `}}const z=xe();var L,Y,_;z.parameters={...z.parameters,docs:{...(L=z.parameters)==null?void 0:L.docs,source:{originalSource:"createGaugeStory()",...(_=(Y=z.parameters)==null?void 0:Y.docs)==null?void 0:_.source}}};const Ve=["Gauge"];export{z as Gauge,Ve as __namedExportsOrder,Me as default};
