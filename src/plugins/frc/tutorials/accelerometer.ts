const tutorial = `
<div style="padding: 15px 20px" default-source-provider="Demo">

<style>
  frc-accelerometer {
    margin-bottom: 10px;
  }

  h1 {
    margin: 0 0 10px;
  }
</style>
<fwc-code-sample title="With attributes">
  <!-- Code for "With attributes" example -->
  <frc-accelerometer value=".5"></frc-accelerometer>
  <frc-accelerometer value=".9" min="0"></frc-accelerometer>
  <frc-accelerometer 
    value="2"
    min="-5"
    max="5"
    center="0"
    precision="4"
    num-tick-marks="3"
    unit="g"
  ></frc-accelerometer>
  <frc-accelerometer 
    value="-.5"
    hide-text
    num-tick-marks="10"
  ></frc-accelerometer>
</fwc-code-sample>
<fwc-code-sample title="With styles">
  <style>
    .with-styles {
      width: 700px;
    }
  </style>
  <frc-accelerometer 
    class="with-styles"
    value=".9"
    num-tick-marks="11"
  ></frc-accelerometer>
</fwc-code-sample>

<!-- code for "Try it out" section -->
<h3>Try it out!</h3>
<fwc-number source-key="/playground/value" value="1"></fwc-number>
<fwc-number source-key="/playground/min" value="-10"></fwc-number>
<fwc-number source-key="/playground/max" value="10"></fwc-number>
<fwc-number source-key="/playground/center" value="0"></fwc-number>
<fwc-number source-key="/playground/precision" value="0"></fwc-number>
<fwc-boolean source-key="/playground/hideText"></fwc-boolean>
<fwc-number source-key="/playground/numTickMarks" value="7"></fwc-number>
<fwc-string source-key="/playground/unit" value="g"></fwc-string>
<frc-accelerometer source-key="/playground"></frc-accelerometer>

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
    label="Value" 
    theme="small" 
    source-key="/playground/value"
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
  <vaadin-number-field 
    label="Number of Ticks Marks" 
    theme="small" 
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
