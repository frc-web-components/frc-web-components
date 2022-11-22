const tutorial = `
<div style="padding: 15px 20px" default-source-provider="Demo">

<h1>Basic FMS Info</h1>
  
<p>
  Component used for displaying information from the Field Management System (FMS).
</p>


<fwc-code-sample title="With attributes">
  <frc-basic-fms-info
    match-type="2"
    match-number="5"
    event-name="Some Event"
    fms-control-data="33"
  ></frc-basic-fms-info>
</fwc-code-sample>

<fwc-code-sample title="With styles">
  <style>
    .with-styles {
      font-size: 20px;
      font-family: cursive;
      color: purple;
    }
  </style>
  <frc-basic-fms-info class="with-styles"></frc-basic-fms-info>
</fwc-code-sample>

<!-- code for "Try it out" section -->
<h3>Try it out!</h3>
<fwc-number source-key="/playground/MatchType" value="1"></fwc-number>
<fwc-number source-key="/playground/MatchNumber" value="2"></fwc-number>
<fwc-string source-key="/playground/EventName" value="Another Event"></fwc-string> 
<fwc-number source-key="/playground/FMSControlData" value="29"></fwc-number>
<frc-basic-fms-info source-key="/playground"></frc-basic-fms-info>

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
    label="Match Type" 
    theme="small" 
    source-key="/playground/MatchType"
    has-controls
  ></vaadin-number-field>
  <vaadin-number-field 
    label="Match Number" 
    theme="small" 
    source-key="/playground/MatchNumber"
    has-controls
  ></vaadin-number-field>
  <vaadin-number-field 
    label="FMS Control Data" 
    theme="small" 
    source-key="/playground/FMSControlData"
    has-controls
  ></vaadin-number-field>
  <vaadin-text-field 
    label="Event Name" 
    theme="small" 
    source-key="/playground/EventName"
  ></vaadin-text-field>
</div>

</div>
`;

export default tutorial;
