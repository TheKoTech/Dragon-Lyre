export class DistortionNode {

	#waveShaperNode;

	constructor(context) {
		this.#waveShaperNode = context.createWaveShaper();
		this.setDistortionCurve(50);
	}

	/**
	 * Formula `((3 + k) × x × 20 × (π ÷ 180)) / (π + k × | x |)` applies to the sound curve.
	 * @param {number} k
	 */
	setDistortionCurve(k) {
		const n_samples = 44100;
		const curve = new Float32Array(n_samples);
		const deg = Math.PI / 180;

		for (let i = 0; i < n_samples; i++) {
			const x = (i * 2) / n_samples - 1;
			curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
		}

		this.#waveShaperNode.curve = curve;
	}

	/**
	 * Connect the distortion node to the destination.
	 * @param {AudioNode} sourceNode AudioNode which connect to DistortionNode.
	 * @param {AudioNode} destinationNode AudioNode to which to connect.
	 * @returns {AudioNode} Reference to the destination node.
	 */
	connectBetween(sourceNode, destinationNode) {
		sourceNode.connect(this.#waveShaperNode);
		this.#waveShaperNode.connect(destinationNode);

		return destinationNode;
	}
}