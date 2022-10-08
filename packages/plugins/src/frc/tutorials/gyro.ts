const tutorial = `
<div style="padding: 15px 20px" default-source-provider="Demo">

  <style>
    h1 {
      margin: 0 0 10px;
    }
  </style>

  <h1>Gyro</h1>
  
  <fwc-code-sample title="With attributes">
    <frc-gyro value="95"></frc-gyro>
    <frc-gyro precision="5"></frc-gyro>
    <frc-gyro value="270.3249" precision="3" hide-label></frc-gyro>
  </fwc-code-sample>

  <!-- code for "Try it out" section -->
  <h3>Try it out!</h3>

  <fwc-number source-key="/gyro/value" value="180"></fwc-number>
  <fwc-number source-key="/gyro/precision" value="2"></fwc-number>
  <fwc-boolean source-key="/gyro/hideLabel"></fwc-boolean>

  <frc-gyro source-key="/gyro"></frc-gyro>

  <div class="try-it-out">

    <vaadin-number-field 
      label="Value" 
      theme="small" 
      source-key="/gyro/value"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Precision" 
      theme="small" 
      source-key="/gyro/precision"
      has-controls
      min="0"
      max="100"
    ></vaadin-number-field>

    <vaadin-checkbox-group theme="horizontal">
      <vaadin-checkbox source-key="/gyro/hideLabel">Hide Label</vaadin-checkbox>
    </vaadin-checkbox-group>
  </div>

</div>
`;

export default tutorial;
