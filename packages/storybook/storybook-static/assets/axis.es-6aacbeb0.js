import{s as k,i as c,k as M,X as b}from"./property-293dc01c-d6840d48.js";import{n as x}from"./state-6b86eede-5fd1e84e.js";import{h as w}from"./query-b33b5ea2-b51c1579.js";import{E as z}from"./transform-bc2573b1-2dde8094.js";var T=Object.defineProperty,O=Object.getOwnPropertyDescriptor,n=(d,r,p,s)=>{for(var t=s>1?void 0:s?O(r,p):r,h=d.length-1,o;h>=0;h--)(o=d[h])&&(t=(s?o(r,p,t):o(t))||t);return s&&t&&T(r,p,t),t};class i extends M{constructor(){super(...arguments),this.vertical=!1,this.ticks=5,this.min=-1,this.max=1,this.unit="",this.prevSize=0,this.prevTicks=0,this.prevMin=null,this.prevMax=null}setAxis(r){var p;const s=this.vertical?this.clientHeight:this.clientWidth,t=s/Math.max(1,this.ticks-1),h=30,{min:o,max:v}=this;let y=-1/0,m=-1/0;if(this.prevSize===s&&this.prevTicks===this.ticks&&this.prevMin===o&&this.prevMax===v&&!r.has("unit")&&!r.has("vertical"))return;this.prevSize=s,this.prevTicks=this.ticks,this.prevMin=o,this.prevMax=v,this.svg.innerHTML="";const l=z(this.svg).attr("width",this.vertical?h:s).attr("height",this.vertical?s:h);for(let e=0;e<this.ticks;e+=1){if(this.vertical?l.append("line").attr("x1",0).attr("y1",e*t).attr("x2",8).attr("y2",e*t):l.append("line").attr("x1",e*t).attr("y1",0).attr("x2",e*t).attr("y2",8),this.vertical){const a=o+e*(v-o)/Math.max(this.ticks-1,1);l.append("text").attr("x",-3).attr("y",e*t+4).attr("text-anchor","end").text(a.toFixed(2)+(this.unit?` ${this.unit}`:""))}else{const a=(e-y)*t,u=y*t+a*.4;if(m<0||u>m){const f=o+e*(v-o)/Math.max(this.ticks-1,1),g=l.append("text").attr("x",e*t).attr("y",25).attr("text-anchor","middle").text(f.toFixed(2)+(this.unit?` ${this.unit}`:""));m=e*t+(((p=g.node())==null?void 0:p.getBBox().width)??0)/2,y=e}}if(e<this.ticks-1)for(let a=1;a<4;a+=1)this.vertical?l.append("line").attr("x1",4).attr("y1",e*t+a*t/4).attr("x2",8).attr("y2",e*t+a*t/4):l.append("line").attr("x1",e*t+a*t/4).attr("y1",0).attr("x2",e*t+a*t/4).attr("y2",4)}}firstUpdated(){new ResizeObserver(()=>{this.requestUpdate()}).observe(this)}updated(r){console.log("changedProps:",r),this.setAxis(r)}render(){return b` <svg id="svg"></svg> `}}i.styles=k`
    :host {
      display: inline-block;
      position: relative;
    }

    :host([vertical]) {
      height: 100%;
    }

    :host(:not([vertical])) {
      width: 100%;
    }

    svg {
      overflow: visible;
      position: absolute;
      top: 0;
      left: 0;
    }

    line {
      stroke: rgb(150, 150, 150);
      stroke-width: 2;
    }

    text {
      font-weight: normal;
      font-size: 13px;
      fill: var(--frc-axis-text-color, #000);
    }
  `;n([c({type:Boolean})],i.prototype,"vertical",2);n([c({type:Number})],i.prototype,"ticks",2);n([c({type:Number})],i.prototype,"min",2);n([c({type:Number})],i.prototype,"max",2);n([c({type:String})],i.prototype,"unit",2);n([x()],i.prototype,"prevSize",2);n([x()],i.prototype,"prevTicks",2);n([x()],i.prototype,"prevMin",2);n([x()],i.prototype,"prevMax",2);n([w("#svg")],i.prototype,"svg",2);customElements.get("frc-axis")||customElements.define("frc-axis",i);
