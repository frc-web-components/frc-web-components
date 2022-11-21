const tutorial = `
<div style="padding: 15px 20px" default-source-provider="Demo">

  <style>
    h1 {
      margin: 0 0 10px;
    }
  </style>

  <h1>Encoder</h1>
  
  <fwc-code-sample>
    <frc-encoder
      distance="10"
      speed="2"
    ></frc-encoder>
  </fwc-code-sample>

  <!-- code for "Try it out" section -->
  <h3>Try it out!</h3>

  <fwc-number source-key="/encoder/distance" value="2"></fwc-number>
  <fwc-number source-key="/encoder/speed" value="3"></fwc-number>

  <frc-encoder source-key="/encoder"></frc-encoder>


  <div class="try-it-out">

    <vaadin-number-field 
      label="Distance" 
      theme="small" 
      source-key="/encoder/distance"
      has-controls
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Speed" 
      theme="small" 
      source-key="/encoder/speed"
      has-controls
    ></vaadin-number-field>
  </div>
</div>
`;

export default tutorial;
