import{s as u,i as e}from"./property-293dc01c-d6840d48.js";import{t as y}from"./number-bar.es-90879e86.js";import"./bar.es-670b6bbb.js";import"./axis.es-6aacbeb0.js";import"./transform-bc2573b1-2dde8094.js";var a=Object.defineProperty,f=Object.getOwnPropertyDescriptor,l=Object.getPrototypeOf,b=Reflect.get,r=(s,i,p,n)=>{for(var o=n>1?void 0:n?f(i,p):i,m=s.length-1,c;m>=0;m--)(c=s[m])&&(o=(n?c(i,p,o):c(o))||o);return n&&o&&a(i,p,o),o},g=(s,i,p)=>b(l(s),p,i);const t=class extends y{constructor(){super(...arguments),this.value=0,this.min=0,this.max=5,this.center=0,this.precision=2,this.hideText=!1,this.numTickMarks=3,this.unit="V"}};t.styles=[...g(t,t,"styles"),u`
      [part='bar']::part(foreground) {
        background: var(--frc-voltage-view-foreground-color, #ffbd2f);
      }
    `];r([e({type:Number})],t.prototype,"value",2);r([e({type:Number})],t.prototype,"min",2);r([e({type:Number})],t.prototype,"max",2);r([e({type:Number})],t.prototype,"center",2);r([e({type:Number})],t.prototype,"precision",2);r([e({type:Boolean,attribute:"hide-text"})],t.prototype,"hideText",2);r([e({type:Number,attribute:"num-tick-marks"})],t.prototype,"numTickMarks",2);r([e({type:String})],t.prototype,"unit",2);let v=t;customElements.get("frc-voltage-view")||customElements.define("frc-voltage-view",v);