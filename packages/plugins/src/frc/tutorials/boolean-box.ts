const tutorial = `
<div style="padding: 15px">

  <style>
    frc-boolean-box {
      margin-bottom: 5px;
    }
  </style>

  <h1>Boolean Box</h1>
  
  <p>
    The boolean box element is used to indicate if a value is true or false. When false one color
    is shown, and when true another is shown.
  </p>

  <fwc-code-sample title="Basic Usage">
    <!-- The value of the box is false by default. The default false color is red -->
    <frc-boolean-box></frc-boolean-box>

    <!-- Add the 'value' attribute to the box to make it true. The default true color is green. -->
    <frc-boolean-box value></frc-boolean-box>

    <!-- You can pass in a hex color into the 'false-color' attribute to change what color is shown when the boolean box is false -->
    <frc-boolean-box false-color="#ff7788"></frc-boolean-box>

    <!-- You can pass in a hex color into the 'true-color' attribute to change what color is shown when the boolean box is true -->
    <frc-boolean-box value true-color="#ff00ff"></frc-boolean-box>

    <!-- You can add a label to the boolean box with the 'label' attribute -->
    <frc-boolean-box label="Hello" value></frc-boolean-box>
  </fwc-code-sample>

  <fwc-code-sample title="With NetworkTables">
    <nt-boolean key="/bool1" value="true"></nt-boolean>
    <nt-boolean key="/bool2" value="false"></nt-boolean>
    <nt-boolean key="/bool3"></nt-boolean>

    <frc-boolean-box source-key="/bool1"></frc-boolean-box>
    <frc-boolean-box source-key="/bool2"></frc-boolean-box>
    <frc-boolean-box source-key="/bool3"></frc-boolean-box>

    <nt-boolean key="/box1/value" value="true"></nt-boolean>
    <nt-string key="/box1/trueColor" value="blue"></nt-string>

    <frc-boolean-box source-key="/box1"></frc-boolean-box>
  </fwc-code-sample>

  <fwc-code-sample title="With attributes and NetworkTables">
    <nt-boolean key="/box2/value" value="false"></nt-boolean>

    <frc-boolean-box 
      source-key="/box2"
      true-color="blue"
      false-color="#00aa88"
    ></frc-boolean-box>
  </fwc-code-sample>

  <fwc-code-sample title="With styles">
    <style>
      .with-styles::part(box) {
        border-radius: 50%;
        border: 3px solid black;
        color: white;
      }
    </style>
    <frc-boolean-box class="with-styles" value>
      Boolean Circle
    </frc-boolean-box>
  </fwc-code-sample>

</div>
`;

export default tutorial;