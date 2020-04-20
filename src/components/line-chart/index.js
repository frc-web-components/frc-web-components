import { Webbit, html, css } from '@webbitjs/webbit';
import './chart';

// //import Chart from 'chart.js';

// import {Chart} from 'chart.js';

//import 'chartjs-web-components';

// window.Chart = Chart;
// console.log("CHARTs:", Chart);

class LineChart extends Webbit {

  static get styles() {
    return css`
      :host { 
        display: block; 
        
      }

      
    `;
  }

  static get properties() {
    return {
      
    };
  }

  constructor() {
    super();
    
		this.config = {
			type: 'line',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [{
					label: 'My First dataset!',
					data: [
						Math.random(),
						Math.random(),
						Math.random(),
					],
					fill: false,
				}, {
					label: 'My Second dataset',
					fill: false,
					data: [
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random(),
						Math.random()
					],
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Chart.js Line Chart'
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Month'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Value'
						}
					}]
				}
			}
		};
  }

  updated() {
    
  }

  render() {
    return html`
      <base-chart 
        id="chart" 
        type="line" 
        .data="${this.config.data}" 
        .options="${this.config.options}"
      ></base-chart>
 
    `;
  }
}

webbitRegistry.define('frc-line-chart', LineChart);