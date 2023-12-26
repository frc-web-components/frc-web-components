import"./drivebases.es-52a60d67.js";import{x as r}from"./lit-element-37c36932.js";import{o as h}from"./style-map-4c049cd0.js";import"./property-293dc01c-d6840d48.js";import"./bar.es-670b6bbb.js";import"./state-6b86eede-5fd1e84e.js";import"./query-b33b5ea2-b51c1579.js";import"./axis.es-6aacbeb0.js";import"./transform-bc2573b1-2dde8094.js";const u={moduleCount:4,wheelLocations:[2.5,2,2.5,-2,-2.5,2,-2.5,-2],measuredStates:[0,0,0,0,0,0,0,0],desiredStates:[0,0,0,0,0,0,0,0],robotRotation:0,maxSpeed:1,rotationUnit:"radians",sizeLeftRight:4,sizeFrontBack:5,theme:"light","background-color":"#fff","--frc-swerve-drive-color":"black"},z={title:"FRC/Swerve Drivebase",tags:["autodocs"],component:"frc-swerve-drivebase",args:u,argTypes:{moduleCount:{table:{category:"Properties",defaultValue:{summary:4}},control:{type:"number",min:2,step:1}},wheelLocations:{table:{category:"Properties",defaultValue:{summary:[2.5,2,2.5,-2,-2.5,2,-2.5,-2]}}},desiredStates:{table:{category:"Properties",defaultValue:{summary:[0,0,0,0,0,0,0,0]}}},measuredStates:{table:{category:"Properties",defaultValue:{summary:[0,0,0,0,0,0,0,0]}}},robotRotation:{table:{category:"Properties",defaultValue:{summary:0}}},maxSpeed:{table:{category:"Properties",defaultValue:{summary:1}}},rotationUnit:{control:"radio",options:["radians","degrees"],table:{category:"Properties",defaultValue:{summary:"radians"}}},sizeLeftRight:{table:{category:"Properties",defaultValue:{summary:4}}},sizeFrontBack:{table:{category:"Properties",defaultValue:{summary:5}}},theme:{control:"radio",options:["light","dark","custom"],table:{category:"Styles",defaultValue:"light"}},"background-color":{table:{category:"Styles",defaultValue:"#fff"}},"--frc-swerve-drive-color":{table:{category:"Styles",defaultValue:{summary:"black"}}}},decorators:[(t,o)=>{const y=o.args.theme==="dark"?"hsl(214, 35%, 21%)":"#fff",p=o.args["background-color"];return r` <div
        style=${h({padding:"80px 60px",marginBottom:"5px",background:o.args.theme==="custom"?p:y,display:"flex",justifyContent:"center"})}
      >
        ${t()}
      </div>`}]};function g(t){return t.theme==="custom"?r`
      <style>
        .custom {
          --frc-swerve-drive-color: ${t["--frc-swerve-drive-color"]};
          width: 250px;
        }
      </style>
    `:t.theme==="dark"?r`
      <style>
        .dark {
          --frc-swerve-drive-color: white;
          width: 250px;
        }
      </style>
    `:r`
    <style>
      .light {
        --frc-swerve-drive-color: black;
        width: 250px;
      }
    </style>
  `}function f(t={}){return{args:{...u,...t},render:e=>r`
      ${g(e)}
      <frc-swerve-drivebase
        class=${e.theme}
        module-count=${e.moduleCount}
        wheel-locations=${JSON.stringify(e.wheelLocations)}
        measured-states=${JSON.stringify(e.measuredStates)}
        desired-states=${JSON.stringify(e.desiredStates)}
        robot-rotation=${e.robotRotation}
        max-speed=${e.maxSpeed}
        rotation-unit=${e.rotationUnit}
        size-left-right=${e.sizeLeftRight}
        size-front-back=${e.sizeFrontBack}
      ></frc-swerve-drivebase>
    `}}const a=f({theme:"light"}),s=f({theme:"dark"});var i,l,c;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`createDrivebaseStory({
  theme: 'light'
})`,...(c=(l=a.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var m,d,n;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`createDrivebaseStory({
  theme: 'dark'
})`,...(n=(d=s.parameters)==null?void 0:d.docs)==null?void 0:n.source}}};const D=["LightTheme","DarkTheme"];export{s as DarkTheme,a as LightTheme,D as __namedExportsOrder,z as default};
