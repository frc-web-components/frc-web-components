const tutorial = `
<div style="padding: 15px 20px" default-source-provider="Demo">

  <style>
    h1 {
      margin: 0 0 10px;
    }
  </style>

  <h1>Mecanum Drivebase</h1>
  
  <fwc-code-sample>
    <frc-mecanum-drivebase 
      fl-motor-speed=".7"
      fr-motor-speed="-.1"
      rl-motor-speed=".7"
      rr-motor-speed="-.5"
    ></frc-mecanum-drivebase>
  </fwc-code-sample>

  <!-- code for "Try it out" section -->
  <h3>Try it out!</h3>

  <fwc-number 
    source-key="/drivebase/Front Left Motor Speed" 
    value=".5"
  ></fwc-number>

  <fwc-number 
    source-key="/drivebase/Front Right Motor Speed" 
    value=".5"
  ></fwc-number>

  <fwc-number 
    source-key="/drivebase/Rear Left Motor Speed" 
    value=".5"
  ></fwc-number>

  <fwc-number 
    source-key="/drivebase/Rear Right Motor Speed" 
    value=".5"
  ></fwc-number>

  <frc-mecanum-drivebase 
    source-key="/drivebase"
  ></frc-mecanum-drivebase>

  <div class="try-it-out">

    <vaadin-number-field 
      style="width: 150px"
      label="Front Left Motor Speed" 
      theme="small" 
      source-key="/drivebase/Front Left Motor Speed"
      has-controls
      min="-1"
      max="1"
      step=".1"
    ></vaadin-number-field>

    <vaadin-number-field 
      style="width: 150px"
      label="Front Right Motor Speed" 
      theme="small" 
      source-key="/drivebase/Front Right Motor Speed"
      has-controls
      min="-1"
      max="1"
      step=".1"
    ></vaadin-number-field>

    <vaadin-number-field
      style="width: 150px"
      label="Rear Left Motor Speed" 
      theme="small" 
      source-key="/drivebase/Rear Left Motor Speed"
      has-controls
      min="-1"
      max="1"
      step=".1"
    ></vaadin-number-field>

    <vaadin-number-field 
      style="width: 150px"
      label="Rear Right Motor Speed" 
      theme="small" 
      source-key="/drivebase/Rear Right Motor Speed"
      has-controls
      min="-1"
      max="1"
      step=".1"
    ></vaadin-number-field>
  </div>
  </div>

</div>
`;

export default tutorial;
