import{s as D,i as u,k as U,X as T,Y as w}from"./property-293dc01c-d6840d48.js";import"./bar.es-670b6bbb.js";import"./axis.es-6aacbeb0.js";import{h as F}from"./query-b33b5ea2-b51c1579.js";import{E as k}from"./transform-bc2573b1-2dde8094.js";function q(o){return o*180/Math.PI}function W(o,t,e,r){return`<line x1="${o}" y1="${t}" x2="${e}" y2="${r}" />`}function N(o,t,e){return`<polygon 
            points="${o.x},${o.y} ${t.x},${t.y} ${e.x},${e.y}" />`}function E(o,t,e,r){const i=r*Math.PI/180;return{x:o+e*Math.cos(i),y:t-e*Math.sin(i)}}function J(o,t,e,r,i){const s=E(o,t,e,i),n=E(o,t,e,r),a=i-r<=180?"0":"1",d=i>r?1:0;return["M",s.x,s.y,"A",e,e,0,a,d,n.x,n.y].join(" ")}function K(o,t,e,r,i){return`<path d="${J(o,t,e,r,i)}"/>`}function Q(o,t,e,r){const i=t/2,s=Math.cos(o),n=Math.sin(o),a=Math.cos(o+Math.PI/2)*i,d=Math.sin(o+Math.PI/2)*i,c={x:s*r-a+e,y:n*r-d},h={x:s*r+a+e,y:n*r+d},l={x:s*(t+r)+e,y:n*(t+r)};return N(c,h,l)}function j(o,t,e,r){const i=Math.cos(t)*o,s=Math.sin(t)*o,n=W(e,0,i+e,s),a=Q(t,r,e,o);return n+a}function Z(o,t,e,r){const i=e/t,s=q(i);return K(r,0,t,q(o),q(o)-s)}function tt(o,t,e,r,i){const s=t/2,n=i/e-o,a=Math.sqrt(t*t+e*e),d=(i+t*Math.sign(i))/e-o,c=Math.cos(n),h=Math.sin(n),l={x:(e+s)*c+r,y:(e+s)*h},y={x:(e-s)*c+r,y:(e-s)*h},v={x:a*Math.cos(d)+r,y:a*Math.sin(d)};return N(l,v,y)}function C(o,t,e,r,i){if(t<0)throw new Error(`Radius cannot be negative. Given: ${t}`);if(i<0)throw new Error(`The size of the arrowhead cannot be negative. Given: ${i}`);return t===1/0?j(e,o,r,i):Z(o,t,e,r)+tt(o,i,t,r,e)}function z(o,t,e,r,i){return C(o,t,t*e,r,i)}var et=Object.defineProperty,rt=Object.getOwnPropertyDescriptor,_=(o,t,e,r)=>{for(var i=r>1?void 0:r?rt(t,e):t,s=o.length-1,n;s>=0;s--)(n=o[s])&&(i=(r?n(t,e,i):n(i))||i);return r&&i&&et(t,e,i),i};function P(o,t,e){return Math.min(e,Math.max(o,t))}function it(o,t,e,r,i){return(o-t)*(i-r)/(e-t)+r}function ot(o){const t=o/2,e=`
    <line 
      x1="${-t}"
      y1="${-t}"
      x2="${t}"
      y2="${t}"
    />
  `,r=`
    <line 
      x1="${-t}"
      y1="${t}"
      x2="${t}"
      y2="${-t}"
    />
  `;return`<g class="x">${e} ${r}</g>`}class V extends U{constructor(){super(),this.leftMotorSpeed=0,this.rightMotorSpeed=0,new ResizeObserver(()=>{this.resized()}).observe(this)}get clampedLeftMotorSpeed(){return P(this.leftMotorSpeed,-1,1)}get clampedRightMotorSpeed(){return P(this.rightMotorSpeed,-1,1)}drawMotionVector(t,e){const r=this.renderRoot.querySelector("#svg").getBoundingClientRect(),i=r.width*.13,s=20,n=20,a=r.width-(i+s)*2,d=r.height-n*2;if(Math.abs(t)<=.05&&Math.abs(e)<=.05)return ot(r.width*.2);const c=Math.min(a,d)/2-8,h=8;if(Math.abs(t-e)<=.001)return`<g class="arrow">${j(Math.abs(t*c),-Math.sign(t)*Math.PI/2,0,h)}</g>`;const l=Math.PI,y=(e-t)/2,v=(t+e)/2,g=v/y;let M;if(Math.abs(g)>=1){const x=-Math.sign(g),$=(x+1)*l/2,m=Math.abs(g*c);M=C($,m,x*v*c,x*m,h)}else{const x=Math.sign(t-e);if(g===0){const $=Math.max(t,e)*c,m=x*l,R=y<0?l:0;M=z(R,$,m,0,h)}else{const $=g<0?t:e,m=g<0?e:t,R=Math.abs($)*c,G=-g*R,X=it(m/$,0,-1,.5,l),Y=g<0?l:0;M=z(Y,R,x*X,G,h)}}return`<g class="arrow">${M}</g>`}drawDrivetrain(){const t=this.renderRoot.querySelector("#svg").getBoundingClientRect(),e=t.width*.13,r=Math.min(t.width*.13,t.height*.15),i=20,s=20,n=`
      <rect 
        width="calc(100% - ${(e+i)*2}px)" 
        height="calc(100% - ${s*2}px)"
        x="${e+i}" 
        y="20px" 
      />
    `,a=`
      <rect 
        width="${e}px" 
        height="${r*2}" 
        x="${i}px" 
        y="${s}px" 
      />
    `,d=`
      <rect 
        width="${e}px" 
        height="${r*2}" 
        x="calc(100% - ${e+i}px)" 
        y="${s}px" 
      />
    `,c=`
      <rect 
        width="${e}px" 
        height="${r*2}" 
        x="${i}px"
        y="calc(100% - ${r*2+s}px)"
      />
    `,h=`
      <rect 
        width="${e}px" 
        height="${r*2}" 
        x="calc(100% - ${e+i}px)" 
        y="calc(100% - ${r*2+s}px)"
      />
    `;return n+a+d+c+h}getLeftForegroundStyle(){return this.getForegroundStyle(this.clampedLeftMotorSpeed)}getRightForegroundStyle(){return this.getForegroundStyle(this.clampedRightMotorSpeed)}getForegroundStyle(t){const e=P(t,-1,1);return e>0?`
        height: ${Math.abs(e)/(1- -1)*100}%;
        top: auto;
        bottom: 50%;
      `:`
        height: ${Math.abs(e)/(1- -1)*100}%;
        top: 50%;
        bottom: auto;
      `}firstUpdated(){const t=this.drawMotionVector(0,0);this.renderRoot.querySelector("#drivetrain").innerHTML=this.drawDrivetrain(),this.renderRoot.querySelector("#forceVector").innerHTML=t}resized(){const t=this.drawMotionVector(this.clampedLeftMotorSpeed,this.clampedRightMotorSpeed);this.renderRoot.querySelector("#forceVector").innerHTML=t;const e=this.renderRoot.querySelector("#svg").getBoundingClientRect();this.renderRoot.querySelector("#forceVector").style.transform=`translate(${e.width*.5}px, ${e.height*.5}px)`,this.renderRoot.querySelector("#drivetrain").innerHTML=this.drawDrivetrain()}updated(){const t=this.drawMotionVector(this.clampedLeftMotorSpeed,this.clampedRightMotorSpeed);this.renderRoot.querySelector("#forceVector").innerHTML=t}render(){return T`
      <div class="diff-drive-container">
        <div class="speed">
          <frc-axis ticks="5" vertical min="1" max="-1"></frc-axis>
          <div class="bar">
            <div
              class="foreground"
              style="${this.getLeftForegroundStyle()}"
            ></div>
          </div>
        </div>
        <svg id="svg">
          <g id="forceVector"></g>
          <g id="drivetrain" class="drivetrain"></g>
        </svg>
        <div class="speed">
          <frc-axis ticks="5" vertical min="1" max="-1"></frc-axis>
          <div class="bar">
            <div
              class="foreground"
              style="${this.getRightForegroundStyle()}"
            ></div>
          </div>
        </div>
      </div>
    `}}V.styles=D`
    :host {
      display: inline-block;
      width: 400px;
      height: 300px;
      padding: 0 10px;
      font-family: sans-serif;
    }

    .diff-drive-container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    svg {
      overflow: overlay;
      flex: 1;
      height: 100%;
    }

    svg .x {
      stroke: rgb(50, 50, 255);
      stroke-width: 2;
    }

    svg .arrow line,
    svg .arrow path {
      stroke: rgb(50, 50, 255);
      stroke-width: 2;
      fill: none;
    }

    svg .arrow polygon {
      stroke: rgb(50, 50, 255);
      fill: rgb(50, 50, 255);
    }

    svg .drivetrain {
      fill: none;
      stroke: var(--frc-differential-drivebase-drivetrain-color, #000);
    }

    .bar {
      position: relative;
      height: calc(100% - 30px);
      width: 20px;
      border-radius: 3px;
      margin: 15px 0;
      background: var(--frc-bar-background, #ddd);
    }

    .speed {
      display: flex;
      height: 100%;
      flex-direction: row;
      align-items: center;
      margin-left: 30px;
    }

    frc-axis {
      width: 10px;
      height: calc(100% - 35px);
    }

    .foreground {
      position: absolute;
      top: 0;
      width: 20px;
      background: var(--frc-bar-foreground, lightblue);
      border-radius: 3px;
    }
  `;_([u({type:Number,attribute:"left-motor-speed"})],V.prototype,"leftMotorSpeed",2);_([u({type:Number,attribute:"right-motor-speed"})],V.prototype,"rightMotorSpeed",2);customElements.get("frc-differential-drivebase")||customElements.define("frc-differential-drivebase",V);var st=Object.defineProperty,nt=Object.getOwnPropertyDescriptor,B=(o,t,e,r)=>{for(var i=r>1?void 0:r?nt(t,e):t,s=o.length-1,n;s>=0;s--)(n=o[s])&&(i=(r?n(t,e,i):n(i))||i);return r&&i&&st(t,e,i),i};function at(o){const t=o/2,e=`
    <line 
      x1="${-t}"
      y1="${-t}"
      x2="${t}"
      y2="${t}"
    />
  `,r=`
    <line 
      x1="${-t}"
      y1="${t}"
      x2="${t}"
      y2="${-t}"
    />
  `;return`<g class="x">${e} ${r}</g>`}function b(o){return Math.min(1,Math.max(o,-1))}function L(o){const t=b(o);return t>0?`
      height: ${Math.abs(t)/(1- -1)*100}%;
      top: auto;
      bottom: 50%;
    `:`
    height: ${Math.abs(t)/(1- -1)*100}%;
    top: 50%;
    bottom: auto;
  `}class S extends U{constructor(){super(),this.frontLeftMotorSpeed=0,this.frontRightMotorSpeed=0,this.rearLeftMotorSpeed=0,this.rearRightMotorSpeed=0,new ResizeObserver(()=>{this.resized()}).observe(this)}drawMotionVector(t,e,r,i){const s=this.renderRoot.querySelector("#svg").getBoundingClientRect(),n=s.width*.13,a=20,d=20,c=s.width-(n+a)*2,h=s.height-d*2,l=Math.min(c,h)/2-16,y={x:(t-e-r+i)/4,y:(t+e+r+i)/4},v=(-t+e-r+i)/4,g=Math.hypot(y.x,y.y),M=Math.atan2(y.y,y.x);if(Math.abs(v)<=.01&&g<=.01)return at(s.width*.2);let x="",$="",m="";return Math.abs(v)>.01&&(x=z(0,l,-v*Math.PI,0,8),$=z(Math.PI,l,-v*Math.PI,0,8)),g>.01&&(m=j(g*l,-M,0,8)),`<g class="arrow">${x} ${$} ${m}</g>`}drawDrivetrain(){const t=this.renderRoot.querySelector("#svg").getBoundingClientRect(),e=t.width*.13,r=Math.min(t.width*.13,t.height*.15),i=20,s=20,n=`
      <rect 
        width="calc(100% - ${(e+i)*2}px)" 
        height="calc(100% - ${s*2}px)"
        x="${e+i}" 
        y="20px" 
      />
    `,a=`
      <rect 
        width="${e}px" 
        height="${r*2}" 
        x="${i}px" 
        y="${s}px" 
      />
    `,d=`
      <rect 
        width="${e}px" 
        height="${r*2}" 
        x="calc(100% - ${e+i}px)" 
        y="${s}px" 
      />
    `,c=`
      <rect 
        width="${e}px" 
        height="${r*2}" 
        x="${i}px"
        y="calc(100% - ${r*2+s}px)"
      />
    `,h=`
      <rect 
        width="${e}px" 
        height="${r*2}" 
        x="calc(100% - ${e+i}px)" 
        y="calc(100% - ${r*2+s}px)"
      />
    `;return n+a+d+c+h}getFlForegroundStyle(){return L(this.frontLeftMotorSpeed)}getFrForegroundStyle(){return L(this.frontRightMotorSpeed)}getRlForegroundStyle(){return L(this.rearLeftMotorSpeed)}getRrForegroundStyle(){return L(this.rearRightMotorSpeed)}firstUpdated(){const t=this.drawMotionVector(0,0,0,0);this.renderRoot.querySelector("#drivetrain").innerHTML=this.drawDrivetrain(),this.renderRoot.querySelector("#forceVector").innerHTML=t}resized(){const t=this.drawMotionVector(b(this.frontLeftMotorSpeed),b(this.frontRightMotorSpeed),b(this.rearLeftMotorSpeed),b(this.rearRightMotorSpeed));this.renderRoot.querySelector("#forceVector").innerHTML=t;const e=this.renderRoot.querySelector("#svg").getBoundingClientRect();this.renderRoot.querySelector("#forceVector").style.transform=`translate(${e.width*.5}px, ${e.height*.5}px)`,this.renderRoot.querySelector("#drivetrain").innerHTML=this.drawDrivetrain()}updated(t){super.updated(t);const e=this.drawMotionVector(b(this.frontLeftMotorSpeed),b(this.frontRightMotorSpeed),b(this.rearLeftMotorSpeed),b(this.rearRightMotorSpeed));this.renderRoot.querySelector("#forceVector").innerHTML=e}render(){return T`
      <div class="diff-drive-container">
        <div class="speed-pair">
          <div class="speed">
            <frc-axis ticks="5" vertical min="1" max="-1"></frc-axis>
            <div class="bar">
              <div
                class="foreground"
                style="${this.getFlForegroundStyle()}"
              ></div>
            </div>
          </div>
          <div class="speed">
            <frc-axis ticks="5" vertical min="1" max="-1"></frc-axis>
            <div class="bar">
              <div
                class="foreground"
                style="${this.getRlForegroundStyle()}"
              ></div>
            </div>
          </div>
        </div>
        <svg id="svg">
          <g id="forceVector"></g>
          <g id="drivetrain" class="drivetrain"></g>
        </svg>
        <div class="speed-pair">
          <div class="speed">
            <frc-axis ticks="5" vertical min="1" max="-1"></frc-axis>
            <div class="bar">
              <div
                class="foreground"
                style="${this.getFrForegroundStyle()}"
              ></div>
            </div>
          </div>
          <div class="speed">
            <frc-axis ticks="5" vertical min="1" max="-1"></frc-axis>
            <div class="bar">
              <div
                class="foreground"
                style="${this.getRrForegroundStyle()}"
              ></div>
            </div>
          </div>
        </div>
      </div>
    `}}S.styles=D`
    :host {
      display: inline-block;
      width: 400px;
      height: 300px;
      padding: 0 10px;
      font-family: sans-serif;
    }

    .diff-drive-container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }

    svg {
      overflow: overlay;
      flex: 1;
      height: 100%;
    }

    svg .x {
      stroke: rgb(50, 50, 255);
      stroke-width: 2;
    }

    svg .arrow line,
    svg .arrow path {
      stroke: rgb(50, 50, 255);
      stroke-width: 2;
      fill: none;
    }

    svg .arrow polygon {
      stroke: rgb(50, 50, 255);
      fill: rgb(50, 50, 255);
    }

    svg .drivetrain {
      fill: none;
      stroke: var(--frc-mecanum-drivebase-drivetrain-color, #000);
    }

    .bar {
      position: relative;
      height: calc(100% - 30px);
      width: 20px;
      border-radius: 3px;
      margin: 15px 0;
      background: var(--frc-bar-background, #ddd);
    }

    .speed-pair {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    .speed {
      display: flex;
      height: 48%;
      flex-direction: row;
      align-items: center;
      margin-left: 30px;
    }

    frc-axis {
      width: 10px;
      height: calc(100% - 35px);
    }

    .foreground {
      position: absolute;
      top: 0;
      width: 20px;
      background: var(--frc-bar-foreground, lightblue);
      border-radius: 3px;
    }
  `;B([u({type:Number,attribute:"front-left-motor-speed"})],S.prototype,"frontLeftMotorSpeed",2);B([u({type:Number,attribute:"front-right-motor-speed"})],S.prototype,"frontRightMotorSpeed",2);B([u({type:Number,attribute:"rear-left-motor-speed"})],S.prototype,"rearLeftMotorSpeed",2);B([u({type:Number,attribute:"rear-right-motor-speed"})],S.prototype,"rearRightMotorSpeed",2);customElements.get("frc-mecanum-drivebase")||customElements.define("frc-mecanum-drivebase",S);var dt=Object.defineProperty,ct=Object.getOwnPropertyDescriptor,f=(o,t,e,r)=>{for(var i=r>1?void 0:r?ct(t,e):t,s=o.length-1,n;s>=0;s--)(n=o[s])&&(i=(r?n(t,e,i):n(i))||i);return r&&i&&dt(t,e,i),i};function I(o,...t){return t.some(e=>o.has(e))}function A(o){return o*Math.PI/180}function O(o){return o*180/Math.PI}function ht(o,t,e){return Math.max(Math.min(o,e),t)}function H(o,t=!1){const e=A(-(o-90));return[t?-Math.cos(e):Math.cos(e),Math.sin(e)]}class p extends U{constructor(){super(...arguments),this.moduleCount=4,this.wheelLocations=[2.5,2,2.5,-2,-2.5,2,-2.5,-2],this.measuredStates=[0,0,0,0,0,0,0,0],this.desiredStates=[0,0,0,0,0,0,0,0],this.robotRotation=0,this.maxSpeed=1,this.rotationUnit="radians",this.sizeLeftRight=4,this.sizeFrontBack=5,this.normalizedRotation=0}drawBase(){const[t,e]=this.getBaseSize();k(this._base).attr("width",t).attr("height",e).attr("stroke-width",5).attr("fill","none")}setSwerveRotation(){k(this._swerve).attr("transform",`rotate(${-this.normalizedRotation})`)}setSwerveOrigin(){const[t,e]=this.getBaseSize();k(this._swerve).attr("transform-origin",`${t/2} ${e/2}`)}getRobotRotationRad(){const t=this.robotRotation;return this.rotationUnit==="radians"?t:A(t)}getSvgSize(){const{width:t}=this.getBoundingClientRect();return[t,t*this.sizeFrontBack/this.sizeLeftRight]}getBaseSize(){const[t]=this.getSvgSize();return[t,t*this.sizeFrontBack/this.sizeLeftRight]}updated(t){if(t.has("robotRotation")){const e=this.robotRotation??0,r=(t.get("robotRotation")??e)-e,i=this.rotationUnit==="degrees"?r:O(r),s=[i-720,i-360,i,i+360,i+720];let n=0,a=Math.abs(s[0]);for(let d=1;d<s.length;d+=1){const c=Math.abs(s[d]);c<a&&(n=d,a=c)}this.normalizedRotation-=s[n]}I(t,"sizeLeftRight","sizeFrontBack","robotRotation","rotationUnit")&&this.drawBase(),I(t,"robotRotation","rotationUnit")&&this.setSwerveRotation(),I(t,"sizeLeftRight","sizeFrontBack")&&this.setSwerveOrigin()}resized(){const[t,e]=this.getSvgSize();k(this._svg).attr("width",t).attr("height",e),this.drawBase(),this.setSwerveOrigin(),this.requestUpdate()}firstUpdated(){new ResizeObserver(()=>{this.resized()}).observe(this),this.resized()}getSwerveModules(){const t=[];for(let e=0;e<this.moduleCount;e+=1){const r={location:[this.wheelLocations[e*2],this.wheelLocations[e*2+1]],desiredRotation:this.desiredStates[e*2],desiredVelocity:this.desiredStates[e*2+1],measuredRotation:this.measuredStates[e*2],measuredVelocity:this.measuredStates[e*2+1]};t.push(r)}return t}renderModuleDirectionIndicator(t,e,r){const i=this.rotationUnit==="degrees"?e:O(e),[s,n]=H(i-15,!0),[a,d]=H(i+15,!0),c=`M ${-s*60},${n*60} L 0,0 ${-a*60},${d*60}`;return w`
      <defs>
        <clipPath id=${t}>
          <path d=${c} fill="white" stroke="5" stroke="white" />
        </clipPath>
      </defs>
      <circle r="47.5" fill=${r} stroke-width="0" clip-path=${`url(#${t})`}></circle>
    `}renderModuleVelocityIndicator(t,e,r,i){const s=this.rotationUnit==="degrees"?e:O(e);let n=ht(100*r/this.maxSpeed,-100,100);n+=50*Math.sign(n),n*=-1;const a=Math.abs(n)-20,d=Math.abs(n),c=`M -17.5,${a} L 2.5,${d} L 22.5,${a}`,h=`rotate(${-s+(n<0?180:0)})`,l=`${t}-velocity`;return w`
     <defs>
        <mask id=${l}>
          <circle r="300" fill="white" ></circle>
          <circle r="52.5" fill="black" ></circle>
        </mask>
      </defs>
      <g class="velocity-indicator" transform=${h} mask="url(#${l})">
        <rect width="5" height=${Math.abs(n)} fill=${i}></rect>
        <path d=${c} stroke=${i} stroke-width="5" fill="none" />
      </g>
    `}renderModules(){const t=this.getSwerveModules(),[e,r]=this.getBaseSize();return w`
      <g class="modules">
        ${t.map((i,s)=>{const{desiredRotation:n,measuredRotation:a,location:d,measuredVelocity:c,desiredVelocity:h}=i,l=r/2-r*d[0]/this.sizeFrontBack,y=e/2-e*d[1]/this.sizeLeftRight,v=`module-${s}-measured-clip`,g=`module-${s}-desired-clip`;return w`
            <g transform=${`translate(${y}, ${l})`}>
              <circle class="module-circle" r="50" stroke-width="5" fill="none"></circle>
              ${this.renderModuleDirectionIndicator(v,a,"blue")}
              ${this.renderModuleDirectionIndicator(g,n,"red")}
              ${this.renderModuleVelocityIndicator(v,a,c,"blue")}
              ${this.renderModuleVelocityIndicator(g,n,h,"red")}
            </g>
          `})} 
      </g>
    `}renderWheelMask(){const t=this.getSwerveModules(),[e,r]=this.getBaseSize();return w`
      <defs>
        <mask id="wheel-mask">
          <rect fill="white" width=${e} height=${r} stroke-width="5" stroke="white"></rect>
          ${t.map(i=>{const s=r/2-r*i.location[0]/this.sizeFrontBack,n=e/2-e*i.location[1]/this.sizeLeftRight;return w`
              <circle r="50" fill="black" transform=${`translate(${n}, ${s})`}></circle>
            `})}
        </mask>
      </defs>
    `}renderArrow(){const[t,e]=this.getBaseSize(),r=`M ${t/2-30},60 L ${t/2},30 L ${t/2+30},60`;return w`
      <line class="arrow" x1=${t/2} y1=${30} x2=${t/2} y2=${e-30} stroke-width="5" />
      <path class="arrow" d=${r} stroke-width="5" fill="none" />
      
    `}render(){return T`
      <div>
        ${w`
          <svg>
            ${this.renderWheelMask()}
            <g class="swerve">
              <rect class="base" mask="url(#wheel-mask)"></rect>
              ${this.renderModules()}
              ${this.renderArrow()}
            </g>
          </svg>
      `}
      </div>
    `}}p.styles=D`
    :host {
      display: inline-block;
      width: 300px;
      height: auto;
      overflow: visible;
    }

    svg {
      width: 100%;
      overflow: visible;
    }

    .base {
      stroke: var(--frc-swerve-drive-color, black);
    }

    .arrow {
      stroke: var(--frc-swerve-drive-color, black);
    }

    .module-circle {
      stroke: var(--frc-swerve-drive-color, black);
    }
  `;f([u({type:Number,attribute:"module-count"})],p.prototype,"moduleCount",2);f([u({type:Array,attribute:"wheel-locations"})],p.prototype,"wheelLocations",2);f([u({type:Array,attribute:"measured-states"})],p.prototype,"measuredStates",2);f([u({type:Array,attribute:"desired-states"})],p.prototype,"desiredStates",2);f([u({type:Number,attribute:"robot-rotation"})],p.prototype,"robotRotation",2);f([u({type:Number,attribute:"max-speed"})],p.prototype,"maxSpeed",2);f([u({type:String,attribute:"rotation-unit"})],p.prototype,"rotationUnit",2);f([u({type:Number,attribute:"size-left-right"})],p.prototype,"sizeLeftRight",2);f([u({type:Number,attribute:"size-front-back"})],p.prototype,"sizeFrontBack",2);f([F("svg")],p.prototype,"_svg",2);f([F(".swerve")],p.prototype,"_swerve",2);f([F(".base")],p.prototype,"_base",2);f([F(".modules")],p.prototype,"_modules",2);customElements.get("frc-swerve-drivebase")||customElements.define("frc-swerve-drivebase",p);
