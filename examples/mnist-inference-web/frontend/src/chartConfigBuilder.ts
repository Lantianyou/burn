import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

/**
 * Helper function that builds a chart using Chart.js library.
 *
 * NOTE: Assumes chart.js is loaded into the global.
 */

export function chartConfigBuilder(chartEl: HTMLCanvasElement) {
	Chart.register(ChartDataLabels);
	return new Chart(chartEl, {
		plugins: [ChartDataLabels],
		type: "bar",
		data: {
			labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
			datasets: [
				{
					data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
					borderWidth: 0,
					// fill: true,
					backgroundColor: "#247ABF",
				},
			],
		},
		options: {
			responsive: false,
			maintainAspectRatio: false,
			// animation: true,
			plugins: {
				legend: {
					display: false,
				},
				tooltip: {
					enabled: true,
				},
				datalabels: {
					color: "white",
					formatter: function (value) {
						return Math.round((value * 100) / 100).toFixed(2);
					},
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					max: 1,
				},
			},
		},
	});
}
