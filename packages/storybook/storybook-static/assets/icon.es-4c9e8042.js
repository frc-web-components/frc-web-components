import{s as l,i,k as g,X as v}from"./property-293dc01c-d6840d48.js";const a={check:"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z","check-circle":"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z",close:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z",edit:"M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"};var w=Object.defineProperty,m=Object.getOwnPropertyDescriptor,r=(c,t,h,o)=>{for(var e=o>1?void 0:o?m(t,h):t,n=c.length-1,p;n>=0;n--)(p=c[n])&&(e=(o?p(t,h,e):p(e))||e);return o&&e&&w(t,h,e),e};class s extends g{constructor(){super(...arguments),this.color="#000000",this.icon="",this.svgPath="",this.viewBox="0 0 24 24"}render(){const t=this.icon==="Custom"||!this.icon;return v`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox=${t?this.viewBox:"0 0 24 24"}
        width="24px"
        fill=${this.color}
      >
        <path d=${t?this.svgPath:a[this.icon]} />
      </svg>
    `}}s.styles=l`
    :host {
      display: inline-block;
      width: 24px;
      height: 24px;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `;r([i({type:String})],s.prototype,"color",2);r([i({type:String})],s.prototype,"icon",2);r([i({type:String,attribute:"svg-path"})],s.prototype,"svgPath",2);r([i({type:String,attribute:"view-box"})],s.prototype,"viewBox",2);customElements.get("frc-icon")||customElements.define("frc-icon",s);export{a as w};