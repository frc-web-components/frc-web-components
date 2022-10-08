const tutorial = `
<div style="padding: 15px 20px" default-source-provider="Demo">

  <style>
    h1 {
      margin: 0 0 10px;
    }
  </style>

  <h1>Gauge</h1>
  
  <fwc-code-sample title="Gauge">
    <frc-gauge value="50" min="0" max="100"></frc-gauge>
  </fwc-code-sample>


  <!-- code for "Try it out" section -->
  <h3>Try it out!</h3>

  <fwc-number source-key="/gauge/value" value="50"></fwc-number>
  <fwc-number source-key="/gauge/min" value="0"></fwc-number>
  <fwc-number source-key="/gauge/max" value="100"></fwc-number>

  <frc-gauge source-key="/gauge"></frc-gauge>

  <div class="try-it-out">

    <vaadin-number-field 
      label="Value" 
      theme="small" 
      source-key="/gauge/value"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Min" 
      theme="small" 
      source-key="/gauge/min"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Max" 
      theme="small" 
      source-key="/gauge/max"
      has-controls
    ></vaadin-number-field>
  </div>

</div>
`;

export default tutorial;
