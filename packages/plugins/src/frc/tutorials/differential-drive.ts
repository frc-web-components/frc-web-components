const tutorial = `
<div style="padding: 15px 20px" default-source-provider="Demo">

  <style>
    h1 {
      margin: 0 0 10px;
    }
  </style>

  <h1>Differential Drivebase</h1>
  
  <fwc-code-sample>
    <frc-differential-drivebase 
      left-motor-speed=".7"
      right-motor-speed="-.1"
    ></frc-differential-drivebase>
  </fwc-code-sample>

  <!-- code for "Try it out" section -->
  <h3>Try it out!</h3>

  <fwc-number 
    source-key="/drivebase/Left Motor Speed" 
    value="-.5"
  ></fwc-number>

  <fwc-number 
    source-key="/drivebase/Right Motor Speed" 
    value=".5"
  ></fwc-number>

  <frc-differential-drivebase 
    source-key="/drivebase"
  ></frc-differential-drivebase>

  <div class="try-it-out">

    <vaadin-number-field 
      style="width: 150px"
      label="Left Motor Speed" 
      theme="small" 
      source-key="/drivebase/Left Motor Speed"
      has-controls
      min="-1"
      max="1"
      step=".1"
    ></vaadin-number-field>

    <vaadin-number-field 
      style="width: 150px"
      label="Right Motor Speed" 
      theme="small" 
      source-key="/drivebase/Right Motor Speed"
      has-controls
      min="-1"
      max="1"
      step=".1"
    ></vaadin-number-field>
  </div>

</div>
`;

export default tutorial;
