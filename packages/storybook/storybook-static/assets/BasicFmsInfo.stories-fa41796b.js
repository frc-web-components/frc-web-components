import{s as S,i as l,k as T,X as n}from"./property-293dc01c-d6840d48.js";import"./icon.es-4c9e8042.js";import{x as c}from"./lit-element-37c36932.js";import{o as v}from"./style-map-4c049cd0.js";var N=Object.defineProperty,$=Object.getOwnPropertyDescriptor,f=(t,r,e,a)=>{for(var o=a>1?void 0:a?$(r,e):r,p=t.length-1,u;p>=0;p--)(u=t[p])&&(o=(a?u(r,e,o):u(o))||o);return a&&o&&N(r,e,o),o};const C=1,A=2,F=4,E=8,P=16,w=32,V=["Unknown","Practice","Qualification","Elimination"];class s extends T{constructor(){super(...arguments),this.matchType=0,this.matchNumber=0,this.eventName="",this.fmsControlData=0}getRobotState(){return this.isEnabled()?this.isTest()?"Test":this.isAuto()?"Autonomous":"Teleoperated":"Disabled"}isEnabled(){return!!(this.fmsControlData&C)}isAuto(){return!!(this.fmsControlData&A)}isTest(){return!!(this.fmsControlData&F)}isEmergencyStopped(){return!!(this.fmsControlData&E)}isFmsAttached(){return!!(this.fmsControlData&P)}isDsAttached(){return!!(this.fmsControlData&w)}render(){return n`
      <p>
        <strong>
          <span>${this.eventName}</span>
          <span>${V[this.matchType]}</span>
          <span>match ${this.matchNumber}</span>
        </strong>
      </p>

      <p style="margin-bottom: 7px; font-weight: normal">
        <span style="margin-right: 5px;">
          ${this.isFmsAttached()?n`
                <span class="info">
                  <frc-icon icon="check" color="green"></frc-icon>
                  FMS connected
                </span>
              `:n`
                <span class="info">
                  <frc-icon icon="close" color="red"></frc-icon>
                  FMS disconnected
                </span>
              `}
        </span>
        <span>
          ${this.isDsAttached()?n`
                <span class="info">
                  <frc-icon icon="check" color="green"></frc-icon>
                  DriverStation connected
                </span>
              `:n`
                <span class="info">
                  <frc-icon icon="close" color="red"></frc-icon>
                  DriverStation disconnected
                </span>
              `}
        </span>
      </p>
      <p style="font-weight: normal">Robot state: ${this.getRobotState()}</p>
    `}}s.styles=S`
    p {
      margin: 5px 0;
    }
    p:first-child {
      margin-top: 0;
    }
    p:last-child {
      margin: 0;
    }
    :host {
      text-align: center;
      font-size: 15px;
      display: inline-flex;
      width: auto;
      flex-direction: column;
      justify-content: center;
      font-family: sans-serif;
      color: var(--frc-basic-fms-info-text-color, #000);
    }

    .info {
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
  `;f([l({type:Number,attribute:"match-type"})],s.prototype,"matchType",2);f([l({type:Number,attribute:"match-number"})],s.prototype,"matchNumber",2);f([l({type:String,attribute:"event-name"})],s.prototype,"eventName",2);f([l({type:Number,attribute:"fms-control-data"})],s.prototype,"fmsControlData",2);customElements.get("frc-basic-fms-info")||customElements.define("frc-basic-fms-info",s);const k={matchType:0,matchNumber:0,eventName:"",fmsControlData:0,theme:"light","background-color":"#fff","--frc-basic-fms-info-text-color":"black"},L={title:"FRC/Basic FMS Info",tags:["autodocs"],component:"frc-basic-fms-info",args:k,argTypes:{matchType:{table:{category:"Properties",defaultValue:{summary:0}},options:[0,1,2,3],control:{type:"select",labels:["Unknown","Practice","Qualification","Elimination"]}},matchNumber:{table:{category:"Properties",defaultValue:{summary:0}}},eventName:{table:{category:"Properties",defaultValue:{summary:""}}},fmsControlData:{table:{category:"Properties",defaultValue:{summary:0}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-basic-fms-info-text-color":{table:{category:"Styles",defaultValue:{summary:"black"}}}},decorators:[(t,r)=>{const a=r.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",o=r.args["background-color"];return c` <div
        style=${v({padding:"20px 10px",marginBottom:"5px",background:r.args.theme==="custom"?o:a})}
      >
        ${t()}
      </div>`}]};function B(t){return t.theme==="custom"?c`
      <style>
        .custom {
          --frc-basic-fms-info-text-color: ${t["--frc-basic-fms-info-text-color"]};
        }
      </style>
    `:t.theme==="dark"?c`
      <style>
        .dark {
          --frc-basic-fms-info-text-color: white;
        }
      </style>
    `:c`
    <style>
      .light {
        --frc-basic-fms-info-text-color: black;
      }
    </style>
  `}function D(t={}){return{args:{...k,...t},render:e=>c`
      ${B(e)}
      <frc-basic-fms-info
        class=${e.theme}
        match-type=${e.matchType}
        match-number=${e.matchNumber}
        event-name=${e.eventName}
        fms-control-data=${e.fmsControlData}
      ></frc-basic-fms-info>
    `}}const i=D({theme:"light"}),m=D({theme:"dark"});var h,d,y;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`createBasicFmsStory({
  theme: 'light'
})`,...(y=(d=i.parameters)==null?void 0:d.docs)==null?void 0:y.source}}};var b,g,x;m.parameters={...m.parameters,docs:{...(b=m.parameters)==null?void 0:b.docs,source:{originalSource:`createBasicFmsStory({
  theme: 'dark'
})`,...(x=(g=m.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const Q=["LightTheme","DarkTheme"];export{m as DarkTheme,i as LightTheme,Q as __namedExportsOrder,L as default};
