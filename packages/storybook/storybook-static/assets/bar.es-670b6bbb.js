import{s as p,i as g,k as l,X as m}from"./property-293dc01c-d6840d48.js";import{n as f}from"./state-6b86eede-5fd1e84e.js";import{h as y}from"./query-b33b5ea2-b51c1579.js";var b=Object.defineProperty,c=Object.getOwnPropertyDescriptor,a=(d,t,e,o)=>{for(var i=o>1?void 0:o?c(t,e):t,r=d.length-1,s;r>=0;r--)(s=d[r])&&(i=(o?s(t,e,i):s(i))||i);return o&&i&&b(t,e,i),i};alert("bar!");function u(d,t,e){return Math.min(e,Math.max(d,t))}class n extends l{constructor(){super(...arguments),this._min=-1,this._max=1,this.value=0,this.center=0,this.dragging=!1}get min(){return Math.min(this._min,this._max)}set min(t){const e=this._min;this._min=t,this.requestUpdate("min",e)}get max(){return Math.max(this._min,this._max)}set max(t){const e=this._max;this._max=t,this.requestUpdate("max",e)}updateForeground(){const{min:t,max:e,center:o,value:i,foreground:r}=this,s=u(i,t,e);e<o?(r.style.setProperty("--foreground-width",`${Math.abs(s-e)/(e-t)*100}%`),r.style.setProperty("--foreground-left","auto"),r.style.setProperty("--foreground-right","0")):t>o?(r.style.setProperty("--foreground-width",`${Math.abs(s-t)/(e-t)*100}%`),r.style.setProperty("--foreground-left","0"),r.style.setProperty("--foreground-right","auto")):s>o?(r.style.setProperty("--foreground-width",`${Math.abs(s-o)/(e-t)*100}%`),r.style.setProperty("--foreground-left",`${Math.abs(t-o)/(e-t)*100}%`),r.style.setProperty("--foreground-right","auto")):(r.style.setProperty("--foreground-width",`${Math.abs(s-o)/(e-t)*100}%`),r.style.setProperty("--foreground-left","auto"),r.style.setProperty("--foreground-right",`${Math.abs(e-o)/(e-t)*100}%`))}resized(){this.updateForeground()}updated(){this.updateForeground()}setDragPosition(t){const{left:e,width:o}=this.getBoundingClientRect(),i=t.clientX-e,r=u(i/o,0,1),s=this.min+(this.max-this.min)*r,h=new CustomEvent("barDrag",{bubbles:!0,composed:!0,detail:{value:s}});this.dispatchEvent(h)}firstUpdated(){this.setAttribute("draggable","false"),window.addEventListener("mousemove",t=>{this.dragging&&this.setDragPosition(t)}),window.addEventListener("mouseup",()=>{this.dragging=!1})}onMouseDown(t){this.dragging=!0,this.setDragPosition(t)}render(){return m`
      <div part="foreground" draggble="false"></div>
      <div class="content" draggable="false">
        <slot></slot>
      </div>
      <div part="dragger" @mousedown="${this.onMouseDown}"></div>
    `}}n.styles=p`
    :host {
      display: inline-block;
      position: relative;
      width: 300px;
      height: 20px;
      background: var(--frc-bar-background, #ddd);
      color: var(--frc-bar-color, black);
      font-size: 15px;
      line-height: 18px;
      text-align: center;
    }

    [part='dragger'] {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
    }

    [part='foreground'] {
      position: absolute;
      top: 0;
      height: 100%;
      background: var(--frc-bar-foreground, lightblue);
      border-radius: 3px;
      width: var(--foreground-width);
      left: var(--foreground-left);
      right: var(--foreground-right);
      pointer-events: none;
    }

    .content {
      position: relative;
    }
  `;a([g({type:Number})],n.prototype,"value",2);a([g({type:Number})],n.prototype,"center",2);a([f()],n.prototype,"dragging",2);a([g({type:Number})],n.prototype,"min",1);a([g({type:Number})],n.prototype,"max",1);a([y("[part=foreground]")],n.prototype,"foreground",2);customElements.get("frc-bar")||customElements.define("frc-bar",n);
