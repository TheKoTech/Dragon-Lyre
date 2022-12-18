export default class SoundReproduction {

	/**
	 * @param {AudioContext} audioContext
	 * @param {SoundParameters} sound
	 * @returns {SoundParameters}
	 */
	static startSound(audioContext, sound) {
		const newSound = this.#createNewSoundWithSourceAndGain(audioContext, sound);

		const offset = this.calculateOffset(sound.startedAt, sound.stoppedAt);
		newSound.source.start(0, offset);
		newSound.isPlaying = true;
		newSound.startedAt = audioContext.currentTime - offset;
		newSound.stoppedAt = undefined;

		return newSound;
	}

	/**
	 * @param {number} startedAt
	 * @param {number} stoppedAt
	 * @returns {number}
	 */
	static calculateOffset(startedAt, stoppedAt) {
		let offset = 0;

		if (stoppedAt - startedAt >= 0) {
			offset = stoppedAt - startedAt;
		}

		return offset;
	}

	/**
	 * @param {AudioContext} audioContext
	 * @param {SoundParameters} sound
	 */
	static #createNewSoundWithSourceAndGain(audioContext, sound) {
		const newSound = Object.assign({}, sound);
		const [sourceNode, gainNode] = this.#createSourceAndGain(audioContext, sound.buffer);

		gainNode.gain.value = sound.volume;

		newSound.source = sourceNode;
		newSound.gainNode = gainNode;

		return newSound;
	}

	/**
	 * Creates audio source (thread) with gain and connects it to the context.
	 * @param {AudioContext} audioContext
	 * @param {AudioBuffer} audioBuffer
	 * @returns {[AudioBufferSourceNode, GainNode]}
	 */
	static #createSourceAndGain(audioContext, audioBuffer) {
		const sourceNode = audioContext.createBufferSource();
		sourceNode.buffer = audioBuffer;

		const gainNode = audioContext.createGain();

		sourceNode.connect(gainNode);
		gainNode.connect(audioContext.destination);

		return [sourceNode, gainNode];
	}


	// ========================================
	// Stopping Sound
	// ========================================


	/**
	 * @param {AudioContext} audioContext
	 * @param {SoundParameters} sound
	 * @returns {SoundParameters}
	 */
	static stopSound(audioContext, sound) {
		const newSound = Object.assign({}, sound);

		if (sound.source) {
			newSound.source.onended = null;
			newSound.source.stop();
			newSound.source = undefined;

			newSound.isPlaying = false;
			newSound.stoppedAt = audioContext.currentTime;
		}

		return newSound;
	}
}