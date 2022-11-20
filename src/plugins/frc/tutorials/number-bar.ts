const tutorial = `
<div style="padding: 15px 20px" default-source-provider="Demo">

  <style>
    frc-number-bar {
      margin-bottom: 10px;
    }
    h1 {
      margin: 0 0 10px;
    }
  </style>

  <h1>Number Bar</h1>

  <fwc-code-sample>
    <frc-number-bar value=".5"></frc-number-bar>

    <frc-number-bar 
      value="2"
      min="-10"
      max="20"
      center="5"
      precision="3"
      num-tick-marks="3"
      unit="s"
    ></frc-number-bar>

    <frc-number-bar 
      value=".7"
      min="0"
      max="1"
      center="0"
      hide-text
    ></frc-number-bar>
  </fwc-code-sample>

  <!-- code for "Try it out" section -->
  <h3>Try it out!</h3>

  <fwc-number source-key="/bar/value" value="1"></fwc-number>
  <fwc-number source-key="/bar/min" value="-10"></fwc-number>
  <fwc-number source-key="/bar/max" value="10"></fwc-number>
  <fwc-number source-key="/bar/center" value="0"></fwc-number>
  <fwc-number source-key="/bar/precision" value="0"></fwc-number>
  <fwc-boolean source-key="/bar/hideText"></fwc-boolean>
  <fwc-number source-key="/bar/numTickMarks" value="7"></fwc-number>
  <fwc-string source-key="/bar/unit" value=""></fwc-string>

  <frc-number-bar source-key="/bar"></frc-number-bar>

  <div class="try-it-out">

    <vaadin-number-field 
      label="Value" 
      theme="small" 
      source-key="/bar/value"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Min" 
      theme="small" 
      source-key="/bar/min"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Max" 
      theme="small" 
      source-key="/bar/max"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Center" 
      theme="small" 
      source-key="/bar/center"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Precision" 
      theme="small" 
      source-key="/bar/precision"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Number of Ticks Marks" 
      theme="small" 
      source-key="/bar/numTickMarks"
      has-controls
    ></vaadin-number-field>

    <vaadin-text-field 
      label="Unit" 
      theme="small" 
      source-key="/bar/unit"
    ></vaadin-text-field>

    <vaadin-checkbox-group theme="horizontal">
      <vaadin-checkbox source-key="/bar/hideText">Hide Text</vaadin-checkbox>
    </vaadin-checkbox-group>
  </div>

</div>
`;

export default tutorial;
