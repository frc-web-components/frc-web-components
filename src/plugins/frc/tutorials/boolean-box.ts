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

  <h3>Try it out!</h3>

  <fwc-boolean source-key="/box/value" value="true"></fwc-boolean>
  <fwc-string source-key="/box/trueColor" value="green"></fwc-string>
  <fwc-string source-key="/box/falseColor" value="#ff0000"></fwc-string>

  <frc-boolean-box source-key="/box"></frc-boolean-box>

  <div class="try-it-out">

    <vaadin-text-field 
      label="True Color" 
      theme="small" 
      source-key="/box/trueColor"
    ></vaadin-text-field>

    <vaadin-text-field 
      label="False Color" 
      theme="small" 
      source-key="/box/falseColor"
    ></vaadin-text-field>

    <vaadin-checkbox-group theme="horizontal">
      <vaadin-checkbox source-key="/box/value">Value</vaadin-checkbox>
    </vaadin-checkbox-group>
  </div>

</div>
`;

export default tutorial;
