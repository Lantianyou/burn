/**
 *
 * This demo is part of Burn project: https://github.com/burn-rs/burn
 *
 * Released under a dual license:
 * https://github.com/burn-rs/burn/blob/main/LICENSE-MIT
 * https://github.com/burn-rs/burn/blob/main/LICENSE-APACHE
 *
 */

import "./style.css";
import wasm, { Mnist } from "../pkg/mnist_inference_web.js";
// @ts-ignore
import { fabric } from "fabric";
import { chartConfigBuilder } from "./chartConfigBuilder.js";
import { cropScaleGetImageData } from "./cropScaleGetImageData.js";

const mainCanvasEl = document.getElementById(
	"main-canvas",
) as HTMLCanvasElement;
const cropEl = document.getElementById("crop-canvas") as HTMLCanvasElement;
const scaledCanvasEl = document.getElementById(
	"scaled-canvas",
) as HTMLCanvasElement;
const mainContext = mainCanvasEl.getContext("2d", {
	willReadFrequently: true,
})!;
const cropContext = cropEl.getContext("2d", { willReadFrequently: true })!;
const scaledContext = scaledCanvasEl.getContext("2d", {
	willReadFrequently: true,
})!;

let timeoutId: number = null!;
let isDrawing = false;
let isTimeOutSet = false;

wasm().then(() => {
	const mnist = new Mnist();

	function fireOffInference() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			isTimeOutSet = true;
			fabricCanvas.freeDrawingBrush._finalizeAndAddPath();
			const data = cropScaleGetImageData(
				mainContext,
				cropContext,
				scaledContext,
			);
			const output = mnist.inference(data);
			// @ts-ignore
			chart.data.datasets[0].data = output;
			chart.update();
			isTimeOutSet = false;
		}, 50);
		isTimeOutSet = true;
	}

	fabricCanvas.on("mouse:down", function () {
		isDrawing = true;
	});
	fabricCanvas.on("mouse:up", function () {
		isDrawing = false;
		fireOffInference();
	});

	fabricCanvas.on("mouse:move", function () {
		if (isDrawing && !isTimeOutSet) {
			fireOffInference();
		}
	});
});

// add drawing canvas
const fabricCanvas = new fabric.Canvas(mainCanvasEl, {
	isDrawingMode: true,
});
const backgroundColor = "rgba(255, 255, 255, 255)"; // White with solid alpha
fabricCanvas.freeDrawingBrush.width = 25;
fabricCanvas.backgroundColor = backgroundColor;

// chart component
const chartEl = document.getElementById("chart") as HTMLCanvasElement;
const chart = chartConfigBuilder(chartEl);

// clear button
document.getElementById("clear")!.onclick = () => {
	fabricCanvas.clear();
	fabricCanvas.backgroundColor = backgroundColor;
	fabricCanvas.renderAll();
	mainContext.clearRect(0, 0, mainCanvasEl.width, mainCanvasEl.height);
	scaledContext?.clearRect(0, 0, scaledCanvasEl.width, scaledCanvasEl.height);

	chart.data.datasets[0].data = Array(10).fill(0);
	chart.update();
};
