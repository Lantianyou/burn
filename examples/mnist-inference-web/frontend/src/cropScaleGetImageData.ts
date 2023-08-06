/**
 * Converts RGBA image data from canvas to grayscale (0 is white & 255 is black).
 */
function rgba2gray(data: Uint8ClampedArray) {
	const converted = new Float32Array(data.length / 4);

	// Data is stored as [r0,g0,b0,a0, ... r[n],g[n],b[n],a[n]] where n is number of pixels.
	for (let i = 0; i < data.length; i += 4) {
		const r = 255 - data[i]; // red
		const g = 255 - data[i + 1]; // green
		const b = 255 - data[i + 2]; // blue

		// let a = 255 - data[i + 3]; // alpha
		// Use RGB grayscale coefficients (https://imagej.nih.gov/ij/docs/menus/image.html)
		const y = 0.299 * r + 0.587 * g + 0.114 * b;
		converted[i / 4] = y; // 4 times fewer data points but the same number of pixels.
	}
	return converted;
}

/**
 * Auto crops a canvas images and returns its image data.
 * src: https://stackoverflow.com/a/22267731
 */
function cropImageFromCanvas(
	ctx: CanvasRenderingContext2D,
): [number, number, ImageData] {
	const canvas = ctx.canvas;
	const pix: { x: number[]; y: number[] } = { x: [], y: [] };
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	for (let y = 0; y < canvas.height; y++) {
		for (let x = 0; x < canvas.width; x++) {
			const index = (y * canvas.width + x) * 4;
			const r = imageData.data[index];
			const g = imageData.data[index + 1];
			const b = imageData.data[index + 2];
			if (Math.min(r, g, b) !== 255) {
				pix.x.push(x);
				pix.y.push(y);
			}
		}
	}
	pix.x.sort((a, b) => a - b);
	pix.y.sort((a, b) => a - b);
	const n = pix.x.length - 1;
	const w = 1 + pix.x[n] - pix.x[0];
	const h = 1 + pix.y[n] - pix.y[0];
	return [w, h, ctx.getImageData(pix.x[0], pix.y[0], w, h)];
}

/**
 * Auto crops the image, scales to 28x28 pixel image, and returns as grayscale image.
 */
export function cropScaleGetImageData(
	mainContext: CanvasRenderingContext2D,
	cropContext: CanvasRenderingContext2D,
	scaledContext: CanvasRenderingContext2D,
) {
	const cropEl = cropContext.canvas;

	// Get the auto-cropped image data and put into the intermediate/hidden canvas
	cropContext.fillStyle = "rgba(255, 255, 255, 255)"; // white non-transparent color
	cropContext.fillRect(0, 0, cropEl.width, cropEl.height);
	cropContext.save();
	const [w, h, croppedImage] = cropImageFromCanvas(mainContext);
	cropEl.width = Math.max(w, h) * 1.2;
	cropEl.height = Math.max(w, h) * 1.2;
	const leftPadding = (cropEl.width - w) / 2;
	const topPadding = (cropEl.height - h) / 2;
	cropContext.putImageData(croppedImage, leftPadding, topPadding);

	// Copy image data to scale 28x28 canvas
	scaledContext.save();
	scaledContext.clearRect(
		0,
		0,
		scaledContext.canvas.height,
		scaledContext.canvas.width,
	);
	scaledContext.fillStyle = "rgba(255, 255, 255, 255)"; // white non-transparent color
	scaledContext.fillRect(0, 0, cropEl.width, cropEl.height);
	scaledContext.scale(
		28 / cropContext.canvas.width,
		28 / cropContext.canvas.height,
	);
	scaledContext.drawImage(cropEl, 0, 0);

	// Extract image data and convert into single value (greyscale) array
	const data = rgba2gray(scaledContext.getImageData(0, 0, 28, 28).data);
	scaledContext.restore();

	return data;
}
