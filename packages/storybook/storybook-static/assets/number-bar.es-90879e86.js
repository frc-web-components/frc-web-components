import{s as u,i as r,k as c,X as h}from"./property-293dc01c-d6840d48.js";import"./bar.es-670b6bbb.js";import"./axis.es-6aacbeb0.js";import"./transform-bc2573b1-2dde8094.js";var x=Object.defineProperty,b=Object.getOwnPropertyDescriptor,s=(n,e,i,p)=>{for(var a=p>1?void 0:p?b(e,i):e,o=n.length-1,m;o>=0;o--)(m=n[o])&&(a=(p?m(e,i,a):m(a))||a);return p&&a&&x(e,i,a),a};function y(n,e,i){return Math.min(i,Math.max(n,e))}class t extends c{constructor(){super(...arguments),this.value=0,this.min=-1,this.max=1,this.center=0,this.precision=2,this.hideText=!1,this.numTickMarks=3,this.unit=""}render(){const e=Math.min(this.min,this.max),i=Math.max(this.min,this.max);return h`
      <frc-bar
        value="${this.value}"
        min="${e}"
        max="${i}"
        center="${this.center}"
        part="bar"
      >
        ${this.hideText?"":h`
              ${this.value.toFixed(y(this.precision,0,100))} ${this.unit}
            `}
      </frc-bar>
      ${this.numTickMarks>0?h`
            <frc-axis
              part="axis"
              ticks="${this.numTickMarks}"
              min=${e}
              max=${i}
              unit="${this.unit}"
            ></frc-axis>
          `:""}
    `}}t.styles=[u`
      :host {
        display: inline-block;
        width: 300px;
        height: auto;
        font-family: sans-serif;
      }

      :host([num-tick-marks='0']) [part='bar'] {
        width: 100%;
        margin: 0;
      }

      [part='bar'] {
        position: relative;
        width: calc(100% - 40px);
        height: 20px;
        margin: 0 20px;
        border-radius: 3px;
      }

      [part='axis'] {
        width: calc(100% - 45px);
        margin: 2px auto 0;
        display: block;
      }
    `];s([r({type:Number})],t.prototype,"value",2);s([r({type:Number})],t.prototype,"min",2);s([r({type:Number})],t.prototype,"max",2);s([r({type:Number})],t.prototype,"center",2);s([r({type:Number})],t.prototype,"precision",2);s([r({type:Boolean,attribute:"hide-text"})],t.prototype,"hideText",2);s([r({type:Number,attribute:"num-tick-marks"})],t.prototype,"numTickMarks",2);s([r({type:String})],t.prototype,"unit",2);customElements.get("frc-number-bar")||customElements.define("frc-number-bar",t);export{t};
