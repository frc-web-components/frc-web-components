import{s as f,i as r,k as v,X as x}from"./property-293dc01c-d6840d48.js";var w=Object.defineProperty,C=Object.getOwnPropertyDescriptor,b=(e,t,i,o)=>{for(var n=o>1?void 0:o?C(t,i):t,a=e.length-1,l;a>=0;a--)(l=e[a])&&(n=(o?l(t,i,n):l(n))||n);return o&&n&&w(t,i,n),n},k=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},$=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},d=(e,t,i)=>(k(e,t,"access private method"),i),s,h;class p extends v{constructor(){super(...arguments),$(this,s),this.p=0,this.i=0,this.d=0,this.setpoint=0,this.running=!1}onPChange(t){this.p=parseFloat(t.target.value),d(this,s,h).call(this)}onIChange(t){this.i=parseFloat(t.target.value),d(this,s,h).call(this)}onDChange(t){this.d=parseFloat(t.target.value),d(this,s,h).call(this)}onSetpointChange(t){this.setpoint=parseFloat(t.target.value),d(this,s,h).call(this)}onRunningClick(){this.running=!this.running,d(this,s,h).call(this)}render(){return x`
      <input
        type="checkbox"
        id="running"
        ?checked=${this.running}
        @click=${this.onRunningClick}
      />
      <label for="running">Running</label>
      <label>P</label>
      <input type="number" .value=${this.p} @change=${this.onPChange} />
      <label>I</label>
      <input type="number" .value=${this.i} @change=${this.onIChange} />
      <label>D</label>
      <input type="number" .value=${this.d} @change=${this.onDChange} />
      <label>Setpoint</label>
      <input
        type="number"
        .value=${this.setpoint}
        @change=${this.onSetpointChange}
      />
    `}}s=new WeakSet;h=function(){this.dispatchEvent(new CustomEvent("change",{detail:{p:this.p,i:this.i,d:this.d,setpoint:this.setpoint,running:this.running}}))};p.styles=f`
    :host {
      display: inline-grid;
      grid-template-columns: min-content auto;
      grid-template-rows: auto auto auto auto auto;
      column-gap: 10px;
      row-gap: 8px;
      align-items: center;
      width: 150px;
      height: auto;
      font-family: sans-serif;
      color: var(--frc-pid-controller-text-color, black);
    }

    label {
      font-weight: bold;
      text-align: right;
    }

    input[type='number'] {
      width: 100%;
      min-width: 50px;
      display: inline-block;
      box-sizing: border-box;
      padding-left: 5px;
      border-radius: 3px;
      line-height: 36px;
      height: 36px;
      border: 1px solid var(--frc-pid-controller-input-border-color, #e0e0e0);
      color: var(--frc-pid-controller-text-color, black);
      background: var(--frc-pid-controller-input-background-color, white);
    }

    input[type='checkbox'] {
      justify-self: right;
      margin: 0;
      width: 16px;
      height: 16px;
    }

    label[for='running'] {
      justify-self: left;
    }
  `;b([r({type:Number})],p.prototype,"p",2);b([r({type:Number})],p.prototype,"i",2);b([r({type:Number})],p.prototype,"d",2);b([r({type:Number})],p.prototype,"setpoint",2);b([r({type:Boolean})],p.prototype,"running",2);customElements.get("frc-pid-command")||customElements.define("frc-pid-command",p);var E=Object.defineProperty,P=Object.getOwnPropertyDescriptor,y=(e,t,i,o)=>{for(var n=o>1?void 0:o?P(t,i):t,a=e.length-1,l;a>=0;a--)(l=e[a])&&(n=(o?l(t,i,n):l(n))||n);return o&&n&&E(t,i,n),n},S=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},D=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},m=(e,t,i)=>(S(e,t,"access private method"),i),c,g;class u extends v{constructor(){super(...arguments),D(this,c),this.p=0,this.i=0,this.d=0,this.setpoint=0}onPChange(t){this.p=parseFloat(t.target.value),m(this,c,g).call(this)}onIChange(t){this.i=parseFloat(t.target.value),m(this,c,g).call(this)}onDChange(t){this.d=parseFloat(t.target.value),m(this,c,g).call(this)}onSetpointChange(t){this.setpoint=parseFloat(t.target.value),m(this,c,g).call(this)}render(){return x`
      <label>P</label>
      <input type="number" .value=${this.p} @change=${this.onPChange} />
      <label>I</label>
      <input type="number" .value=${this.i} @change=${this.onIChange} />
      <label>D</label>
      <input type="number" .value=${this.d} @change=${this.onDChange} />
      <label>Setpoint</label>
      <input
        type="number"
        .value=${this.setpoint}
        @change=${this.onSetpointChange}
      />
    `}}c=new WeakSet;g=function(){this.dispatchEvent(new CustomEvent("change",{detail:{p:this.p,i:this.i,d:this.d,setpoint:this.setpoint}}))};u.styles=f`
    :host {
      display: inline-grid;
      grid-template-columns: min-content auto;
      grid-template-rows: auto auto auto auto;
      column-gap: 10px;
      row-gap: 8px;
      align-items: center;
      height: auto;
      width: 150px;
      font-family: sans-serif;
      color: var(--frc-pid-controller-text-color, black);
    }

    label {
      font-weight: bold;
      text-align: right;
    }

    input {
      width: 100%;
      min-width: 50px;
      display: inline-block;
      box-sizing: border-box;
      padding-left: 5px;
      border-radius: 3px;
      line-height: 36px;
      height: 36px;
      border: 1px solid var(--frc-pid-controller-input-border-color, #e0e0e0);
      color: var(--frc-pid-controller-text-color, black);
      background: var(--frc-pid-controller-input-background-color, white);
    }
  `;y([r({type:Number})],u.prototype,"p",2);y([r({type:Number})],u.prototype,"i",2);y([r({type:Number})],u.prototype,"d",2);y([r({type:Number})],u.prototype,"setpoint",2);customElements.get("frc-pid-controller")||customElements.define("frc-pid-controller",u);
