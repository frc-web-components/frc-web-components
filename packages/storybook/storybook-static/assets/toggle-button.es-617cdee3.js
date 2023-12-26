import{s as c,i as g,k as d,X as b}from"./property-293dc01c-d6840d48.js";var h=Object.defineProperty,p=Object.getOwnPropertyDescriptor,a=(l,o,i,r)=>{for(var t=r>1?void 0:r?p(o,i):o,n=l.length-1,s;n>=0;n--)(s=l[n])&&(t=(r?s(o,i,t):s(t))||t);return r&&t&&h(o,i,t),t};class e extends d{constructor(){super(...arguments),this.toggled=!1,this.disabled=!1,this.label="Button"}onClick(){this.disabled||(this.toggled=!this.toggled,this.dispatchEvent(new CustomEvent("toggle",{detail:{toggled:this.toggled},bubbles:!0,composed:!0})))}render(){return b`
      <button class="${this.toggled?"toggled":""}" @click="${this.onClick}">
        ${this.label}
      </button>
    `}}e.styles=c`
    :host {
      display: inline-block;
      width: 100px;
      height: 50px;
      font-family: sans-serif;
      font-size: 16px;
      letter-spacing: 0.5px;
    }

    button {
      width: 100%;
      height: 100%;
      margin: 0;
      border: none;
      border-radius: 4px;
      font-size: inherit;
      font-family: inherit;
      letter-spacing: inherit;
      background: var(--frc-button-background-color, rgb(230, 230, 230));
      color: var(--frc-button-text-color, black);
    }

    .toggled {
      background: var(--frc-button-toggled-background-color, black);
      color: var(--frc-button-toggled-text-color, white);
      font-weight: bold;
    }
  `;a([g({type:Boolean})],e.prototype,"toggled",2);a([g({type:Boolean})],e.prototype,"disabled",2);a([g({type:String})],e.prototype,"label",2);customElements.get("frc-toggle-button")||customElements.define("frc-toggle-button",e);
