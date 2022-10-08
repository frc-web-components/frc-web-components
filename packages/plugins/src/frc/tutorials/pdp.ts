const tutorial = `
<div style="padding: 15px 20px" default-source-provider="Demo">

  <style>
    frc-boolean-box {
      margin-bottom: 5px;
    }
    h1 {
      margin: 0 0 10px;
    }
  </style>

  <h1>Boolean Box</h1>
  
  <fwc-code-sample title="With attributes">
    <frc-pdp
      voltage="15"
      total-current="400"
      chan0="30"
      chan1="0"
      chan2="0"
      chan3="0"
      chan4="0"
      chan5="5.3"
      chan6="0"
      chan7="0"
      chan8="0"
      chan9="0"
      chan10="3.2372"
      chan11="0"
      chan12="10"
      chan13="0"
      chan14="35"
      chan15="40"
    ></frc-pdp>
  </fwc-code-sample>

  <fwc-code-sample title="With Labels">
    <frc-pdp chan0="10" chan1="5" chan2="20" chan13="10" voltage="12" total-current="45">
      <span slot="channel-label0">Left Drive Motor</span>
      <span slot="channel-label1">Right Drive Motor</span>
      <span slot="channel-label2">Lift Motor</span>
      <span slot="channel-label13">Intake</span>
    </frc-pdp>
  </fwc-code-sample>

  <!-- code for "Try it out" section -->
  <h3>Try it out!</h3>

  <fwc-number source-key="/pdp/voltage" value="10"></fwc-number>
  <fwc-number source-key="/pdp/totalCurrent" value="500"></fwc-number>
  <fwc-number source-key="/pdp/chan0" value="40"></fwc-number>
  <fwc-number source-key="/pdp/chan1" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan2" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan3" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan4" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan5" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan6" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan7" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan8" value="20"></fwc-number>
  <fwc-number source-key="/pdp/chan9" value="30"></fwc-number>
  <fwc-number source-key="/pdp/chan10" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan11" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan12" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan13" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan14" value="0"></fwc-number>
  <fwc-number source-key="/pdp/chan15" value="0"></fwc-number>

  <frc-pdp source-key="/pdp"></frc-pdp>

  <div class="try-it-out" style="width: 500px">    
    <vaadin-number-field 
      label="Voltage" 
      theme="small" 
      source-key="/pdp/voltage"
      has-controls
      min="0"
      max="15"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Total Current" 
      theme="small" 
      source-key="/pdp/totalCurrent"
      has-controls
      min="0"
      max="500"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 0" 
      theme="small" 
      source-key="/pdp/chan0"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 1" 
      theme="small" 
      source-key="/pdp/chan1"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 2" 
      theme="small" 
      source-key="/pdp/chan2"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 3" 
      theme="small" 
      source-key="/pdp/chan3"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 4" 
      theme="small" 
      source-key="/pdp/chan4"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 5" 
      theme="small" 
      source-key="/pdp/chan5"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 6" 
      theme="small" 
      source-key="/pdp/chan6"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 7" 
      theme="small" 
      source-key="/pdp/chan7"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 8" 
      theme="small" 
      source-key="/pdp/chan8"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 9" 
      theme="small" 
      source-key="/pdp/chan9"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 10" 
      theme="small" 
      source-key="/pdp/chan10"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 11" 
      theme="small" 
      source-key="/pdp/chan11"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 12" 
      theme="small" 
      source-key="/pdp/chan12"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 13" 
      theme="small" 
      source-key="/pdp/chan13"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 14" 
      theme="small" 
      source-key="/pdp/chan14"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>

    <vaadin-number-field 
      label="Channel 15" 
      theme="small" 
      source-key="/pdp/chan15"
      has-controls
      min="0"
      max="40"
    ></vaadin-number-field>
  </div>

</div>
`;

export default tutorial;
