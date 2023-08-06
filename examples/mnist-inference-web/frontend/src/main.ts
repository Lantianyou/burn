/**
 *
 * This demo is part of Burn project: https://github.com/burn-rs/burn
 *
 * Released under a dual license:
 * https://github.com/burn-rs/burn/blob/main/LICENSE-MIT
 * https://github.com/burn-rs/burn/blob/main/LICENSE-APACHE
 *
 */

import "./style.css"
import wasm, { Mnist } from "../pkg/mnist_inference_web.js"
import { fabric } from "fabric"
import { chartConfigBuilder } from "./chartConfigBuilder.js"
import { cropScaleGetImageData } from "./cropScaleGetImageData.js"

const cropEl = document.getElementById("crop-canvas") as HTMLCanvasElement
const scaledCanvasEl = document.getElementById(
	"scaled-canvas",
) as HTMLCanvasElement
const cropContext = cropEl.getContext("2d", { willReadFrequently: true })!
const scaledContext = scaledCanvasEl.getContext("2d", {
	willReadFrequently: true,
})!

const cropCanvas = new fabric.Canvas("crop-canvas")
// add drawing canvas
const fabricCanvas = new fabric.Canvas("main-canvas", {
	isDrawingMode: true,
	fill: "white",
})
fabricCanvas.freeDrawingBrush.width = 25

let timeoutId: number = null!
let isDrawing = false
let isTimeOutSet = false

wasm().then(async () => {
	const model = new Mnist()

	function fireOffInference() {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => {
			isTimeOutSet = true
			// fabricCanvas.freeDrawingBrush._finalizeAndAddPath()
			const data = cropScaleGetImageData(
				fabricCanvas,
				cropContext,
				scaledContext,
				cropCanvas
			)
			// const length = data.length;
			// const sharedArray = new SharedArrayBuffer(length);
			// console.log(data)
			const output = model.inference(data)
			// @ts-ignore
			chart.data.datasets[0].data = output
			chart.update()
			isTimeOutSet = false
		}, 50)
		isTimeOutSet = true
	}

	fabricCanvas.on("mouse:down", function () {
		isDrawing = true
	})
	fabricCanvas.on("mouse:up", function () {
		isDrawing = false
		fireOffInference()
	})

	fabricCanvas.on("mouse:move", function () {
		if (isDrawing && !isTimeOutSet) {
			fireOffInference()
		}
	})
})

// chart component
const chartEl = document.getElementById("chart") as HTMLCanvasElement
const chart = chartConfigBuilder(chartEl)

// clear button
Object.assign(document.getElementById("clear")!, {
	onclick() {
		fabricCanvas.clear()
		fabricCanvas.renderAll()
		cropCanvas.clear()

		scaledContext.clearRect(
			0,
			0,
			scaledContext.canvas.height,
			scaledContext.canvas.width,
		)


		chart.data.datasets[0].data = Array(10).fill(0)
		chart.update()
	},
})
