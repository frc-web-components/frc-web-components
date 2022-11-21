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

  <h1>Number Slider</h1>

  <fwc-code-sample>

    <frc-number-slider value=".5"></frc-number-slider>

    <frc-number-slider 
      value="25"
      min="0"
      max="100"
      block-increment="25"
    ></frc-number-slider>
  </fwc-code-sample>

  <!-- code for "Try it out" section -->
  <h3>Try it out!</h3>

  <fwc-number source-key="/slide/value" value="1"></fwc-number>
  <fwc-number source-key="/slide/min" value="-10"></fwc-number>
  <fwc-number source-key="/slide/max" value="10"></fwc-number>
  <fwc-number source-key="/slide/blockIncrement" value=".1"></fwc-number>

  <frc-number-slider source-key="/slide"></frc-number-slider>

  <div class="try-it-out">
    <vaadin-number-field 
      label="Value" 
      theme="small" 
      source-key="/slide/value"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Min" 
      theme="small" 
      source-key="/slide/min"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Max" 
      theme="small" 
      source-key="/slide/max"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Block Increment" 
      theme="small" 
      source-key="/slide/blockIncrement"
      has-controls
      step=".1"
    ></vaadin-number-field>
  </div>

</div>
`;

export default tutorial;
