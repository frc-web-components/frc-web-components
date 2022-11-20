const tutorial = `
<div style="padding: 15px 20px" default-source-provider="Demo">

<style>
  frc-3-axis-accelerometer {
    margin-bottom: 20px;
  }
  h1 {
    margin: 0 0 10px;
  }
</style>

<h1>3-Axis Accelerometer</h1>
  
<p>
  Component used for displaying data from a 3-axis accelerometer.
</p>

<fwc-code-sample title="With attributes">
  <frc-3-axis-accelerometer x="5" y="5" z="-8.2"></frc-3-axis-accelerometer>
  <frc-3-axis-accelerometer x="2.9" y="0" z="" min="10"></frc-3-axis-accelerometer>
  <frc-3-axis-accelerometer 
    x="-2"
    y="0"
    z="4"
    min="-4"
    max="4"
    center="0"
    precision="4"
    num-tick-marks="3"
    unit="g"
  ></frc-3-axis-accelerometer>

  <frc-3-axis-accelerometer 
    x="16"
    y="-13"
    z="3"
    hide-text
    num-tick-marks="10"
  ></frc-3-axis-accelerometer>
</fwc-code-sample>

<fwc-code-sample title="With styles">
  <style>
    .with-styles {
      width: 700px;
    }
  </style>
  <frc-3-axis-accelerometer 
    class="with-styles"
    x="5"
    y="2"
    z="-5"
    num-tick-marks="11"
  ></frc-3-axis-accelerometer>
</fwc-code-sample>

<!-- code for "Try it out" section -->
<h3>Try it out!</h3>
<fwc-number source-key="/playground/x" value="1"></fwc-number>
<fwc-number source-key="/playground/y" value="-4"></fwc-number>
<fwc-number source-key="/playground/z" value="6"></fwc-number>
<fwc-number source-key="/playground/min" value="-8"></fwc-number>
<fwc-number source-key="/playground/max" value="8"></fwc-number>
<fwc-number source-key="/playground/center" value="0"></fwc-number>
<fwc-number source-key="/playground/precision" value="0"></fwc-number>
<fwc-boolean source-key="/playground/hideText" value="false"></fwc-boolean>
<fwc-number source-key="/playground/numTickMarks" value="7"></fwc-number>
<fwc-string source-key="/playground/unit" value="g"></fwc-string>
<frc-3-axis-accelerometer source-key="/playground"></frc-3-axis-accelerometer>

<style>
    .try-it-out {
      display: flex;
      flex-direction: row;
      column-gap: 10px;
      max-width: 800px;
      flex-wrap: wrap;
    }
    .try-it-out vaadin-number-field, .try-it-out vaadin-text-field {
      width: 160px;
    }
</style>
<div class="try-it-out">
  <vaadin-number-field 
    label="X" 
    theme="small" 
    source-key="/playground/x"
    has-controls
  ></vaadin-number-field>
  <vaadin-number-field 
    label="Y" 
    theme="small" 
    source-key="/playground/y"
    has-controls
  ></vaadin-number-field>
  <vaadin-number-field 
    label="Z" 
    theme="small" 
    source-key="/playground/z"
    has-controls
  ></vaadin-number-field>
  <vaadin-number-field 
    label="Min" 
    theme="small" 
    source-key="/playground/min"
    has-controls
  ></vaadin-number-field>
  <vaadin-number-field 
    label="Max" 
    theme="small" 
    source-key="/playground/max"
    has-controls
  ></vaadin-number-field>
  <vaadin-number-field 
    label="Center" 
    theme="small" 
    source-key="/playground/center"
    has-controls
  ></vaadin-number-field>
  <vaadin-number-field 
    label="Precision" 
    theme="small" 
    source-key="/playground/precision"
    has-controls
  ></vaadin-number-field>
  <vaadin-number-field 
    label="Number of Ticks Marks" 
    theme="small" 
    source-key="/playground/numTickMarks"
    has-controls
  ></vaadin-number-field>
  <vaadin-text-field 
    label="Unit" 
    theme="small" 
    source-key="/playground/unit"
  ></vaadin-text-field>
</div>
<vaadin-checkbox-group theme="horizontal">
  <vaadin-checkbox source-key="/playground/hideText">Hide Text</vaadin-checkbox>
</vaadin-checkbox-group>

</div>
`;

export default tutorial;
