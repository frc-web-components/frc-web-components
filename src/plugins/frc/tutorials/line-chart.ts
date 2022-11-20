const tutorial = `
<div style="padding: 15px 20px; box-sizing: border-box" default-source-provider="Demo">

  <style>
    h1 {
      margin: 0 0 10px;
    }
  </style>

  <h1>Line Chart</h1>


  <fwc-code-sample title="With title and labels">
    <frc-line-chart title="Graph Title" x-axis-label="x-axis label" y-axis-label="y-axis label">
      <frc-chart-data label="Data label" class="random"></frc-chart-data>
      <frc-chart-axis></frc-chart-axis>
    </frc-line-chart>
    <script>
      (function() {
        const randomData = document.querySelector('.random');
        setInterval(() => {
          randomData.value = Math.random() * 2 - 1;
        }, 500);
      })();
    </script>
  </fwc-code-sample>

  <fwc-code-sample title="Graphing multiple values">
    <frc-line-chart title="Trig functions">
      <frc-chart-data label="sin" class="sin"></frc-chart-data>
      <frc-chart-data label="cos" class="cos"></frc-chart-data>
      <frc-chart-data label="sin 2" class="sin2"></frc-chart-data>
      <frc-chart-axis></frc-chart-axis>
    </frc-line-chart>
    <script>
      (function() {
        const sinData = document.querySelector('.sin');
        const cosData = document.querySelector('.cos');
        const sin2Data = document.querySelector('.sin2');
        let angle = 0;
        setInterval(() => {
          angle += .1;
          sinData.value = Math.sin(angle);
          cosData.value = Math.cos(angle);
          sin2Data.value = Math.sin(angle / 2);
        }, 100);
      })();
    </script>
  </fwc-code-sample>

  <fwc-code-sample title="Changing tracked time on graph">
    <style>
      [title="Tracking 8 seconds"], [title="Tracking 2 seconds"] {
        width: 300px;
        height: 300px;
      }
    </style>
    <frc-line-chart title="Tracking 8 seconds" tracked-time="8">
      <frc-chart-data class="eight-seconds"></frc-chart-data>
      <frc-chart-axis min="-2" max="2"></frc-chart-axis>
    </frc-line-chart>
    <frc-line-chart title="Tracking 2 seconds" tracked-time="2">
      <frc-chart-data class="two-seconds"></frc-chart-data>
      <frc-chart-axis min="-2" max="2"></frc-chart-axis>
    </frc-line-chart>
    <script>
      (function() {
        const eightSecondsData = document.querySelector('.eight-seconds');
        const twoSecondsData = document.querySelector('.two-seconds');
        let value = 0;
        setInterval(() => {
          value += .1;
          eightSecondsData.value = value % 4 - 2;
          twoSecondsData.value = value % 4 - 2;
        }, 100);
      })();
    </script>
  </fwc-code-sample>

  <fwc-code-sample title="Changing time step">
    <style>
      [title=".5 second timestep"], [title="2 second timestep"] {
        width: 300px;
        height: 300px;
      }
    </style>
    <frc-line-chart title=".5 second timestep" time-step=".5">
      <frc-chart-data class="half-second-step"></frc-chart-data>
      <frc-chart-axis min="-10" max="10"></frc-chart-axis>
    </frc-line-chart>
    <frc-line-chart title="2 second timestep" time-step="2">
      <frc-chart-data class="two-second-step"></frc-chart-data>
      <frc-chart-axis min="-10" max="10"></frc-chart-axis>
    </frc-line-chart>
    <script>
      (function() {
        const halfSecondStepData = document.querySelector('.half-second-step');
        const twoSecondStepData = document.querySelector('.two-second-step');
        value = 0;
        setInterval(() => {
          value += Math.random() * 2 - 1;
          value = Math.max(-10, Math.min(10, value));
          halfSecondStepData.value = value;
          twoSecondStepData.value = value;
        }, 100);
      })();
    </script>
  </fwc-code-sample>

  <!-- code for "Try it out" section -->
  <h3>Try it out!</h3>

  <fwc-string source-key="/chart/title" value="Title"></fwc-string>
  <fwc-number source-key="/chart/minY" value="-10"></fwc-number>
  <fwc-number source-key="/chart/maxY" value="10"></fwc-number>
  <fwc-string source-key="/chart/xAxisLabel" value="time"></fwc-string>
  <fwc-string source-key="/chart/yAxisLabel" value="value"></fwc-string>
  <fwc-number source-key="/chart/trackedTime" value="10"></fwc-number>
  <fwc-number source-key="/chart/timeStep" value=".1"></fwc-number>

  <fwc-string source-key="/chart/data/color" value="blue"></fwc-string>
  <fwc-string source-key="/chart/data/label" value="some label"></fwc-string>
  <fwc-number source-key="/chart/data/value" value="1"></fwc-number>

  <fwc-string source-key="/chart/axis/scaleType" value="linear"></fwc-string>
  <fwc-number source-key="/chart/axis/min" value="-5"></fwc-number>
  <fwc-number source-key="/chart/axis/max" value="5"></fwc-number>
  <fwc-string source-key="/chart/axis/label" value="Value"></fwc-string>
  <fwc-string source-key="/chart/axis/position" value="left"></fwc-string>

  <frc-line-chart source-key="/chart">
    <frc-chart-data source-key="/chart/data"></frc-chart-data>
    <frc-chart-axis source-key="/chart/axis"></frc-chart-axis>
  </frc-line-chart>

  <div class="try-it-out">

    <div>
      <vaadin-text-field 
        label="Title" 
        theme="small" 
        source-key="/chart/title"
      ></vaadin-text-field>

      <vaadin-text-field 
        label="x-Axis Label" 
        theme="small" 
        source-key="/chart/xAxisLabel"
      ></vaadin-text-field>


      <vaadin-number-field 
        label="Tracked Time" 
        theme="small" 
        source-key="/chart/trackedTime"
        has-controls
      ></vaadin-number-field>

      <vaadin-number-field 
        label="Time Step" 
        theme="small" 
        source-key="/chart/timeStep"
        step=".05"
        min="0"
        has-controls
      ></vaadin-number-field>
    </div>

    <div>
      <vaadin-text-field 
        label="Data Label" 
        theme="small" 
        source-key="/chart/data/label"
      ></vaadin-text-field>

      <vaadin-text-field 
        label="Data Color" 
        theme="small" 
        source-key="/chart/data/color"
      ></vaadin-text-field>

      <vaadin-number-field 
        label="Data Value" 
        theme="small" 
        source-key="/chart/data/value"
        has-controls
      ></vaadin-number-field>
    </div>

    <div>
      <vaadin-combo-box
        theme="small"
        label="Scale Type"
        source-key="/chart/axis/scaleType"
        items='["linear", "logarithmic"]'
      ></vaadin-combo-box>

      <vaadin-number-field 
        label="Min Axis Value" 
        theme="small" 
        source-key="/chart/axis/min"
        has-controls
      ></vaadin-number-field>

      <vaadin-number-field 
        label="Max Axis Value" 
        theme="small" 
        source-key="/chart/axis/max"
        has-controls
      ></vaadin-number-field>

      <vaadin-text-field 
        label="Axis Label" 
        theme="small" 
        source-key="/chart/axis/label"
      ></vaadin-text-field>

      <vaadin-combo-box
        theme="small"
        label="Axis Position"
        source-key="/chart/axis/position"
        items='["left", "right"]'
      ></vaadin-combo-box>
    </div>


  </div>

  </div>
`;

export default tutorial;
