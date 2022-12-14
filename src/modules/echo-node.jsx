import { DEFAULT_ECHO_DELAY, DEFAULT_ECHO_FILTER_FREQUENCY, DEFAULT_ECHO_GAIN } from './constants';

export class EchoNode {

	#delayNode;
	#gainNode;
	#filterNode;

	delayTime;
	gain;
	frequency;

	constructor(audioContext) {
		this.#delayNode = audioContext.createDelay();
		this.#gainNode = audioContext.createGain();
		this.#filterNode = audioContext.createBiquadFilter();

		this.#delayNode.delayTime.value = DEFAULT_ECHO_DELAY;
		this.#gainNode.gain.value = DEFAULT_ECHO_GAIN;
		this.#filterNode.type = 'highpass';
		this.#filterNode.frequency.value = DEFAULT_ECHO_FILTER_FREQUENCY;

		this.delayTime = this.#delayNode.delayTime;
		this.gain = this.#gainNode.gain;
		this.frequency = this.#filterNode.frequency;

		this.#delayNode.connect(this.#gainNode);
		this.#gainNode.connect(this.#filterNode);
		this.#filterNode.connect(this.#delayNode);
	}

	/**
	 * Connect the echo node to the destination.
	 * @param {AudioNode} sourceNode AudioNode which connect to EchoNode.
	 * @param {AudioNode} destinationNode AudioNode to which to connect.
	 * @returns {AudioNode} Reference to the destination node.
	 */
	connectBetween(sourceNode, destinationNode) {
		sourceNode.connect(this.#delayNode);
		sourceNode.connect(destinationNode);
		this.#gainNode.connect(destinationNode);

		return destinationNode;
	}
}