export default class SSSound {

	// ========================================
	// Types
	// ========================================


	/**
	 * @typedef {Object} SoundParameters
	 * @property {number} id Sound ID.
	 * @property {string} title Representing the sound name.
	 * @property {string} extension File extension.
	 * @property {number} volume Sound volume (in the range from 0 to 1).
	 * @property {number | undefined} startedAt Fractional number representing the start time of the sound (by time in
	 *     the AudioContext).
	 * @property {number | undefined} stoppedAt Fractional number representing the stop time of the sound (by time in
	 *     the AudioContext).
	 * @property {boolean} isPlaying Indicates whether the sound is playing. By default, is false.
	 * @property {number} minInterval
	 * @property {number} maxInterval
	 * @property {AudioBuffer} buffer An object that contains all information about the sound file. From it, you can
	 *     get AudioBufferSourceNode.
	 * @property {GainNode | undefined} gainNode An object that allowing you to control the volume of the sound.
	 *     Connected to the AudioContext
	 * @property {AudioBufferSourceNode | undefined} source An object that represents a thread that directly controls
	 *     audio playback. Connected to GainNode.
	 */


	// ========================================
	// Starting Sound
	// ========================================


	/**
	 * @param {AudioContext} audioContext
	 * @param {SoundParameters} sound
	 * @param {number} when
	 * @returns {SoundParameters}
	 */
	static startSound(audioContext, sound, when = 0) {
		const newSound = this.#createNewSoundWithSourceAndGain(audioContext, sound);

		let offset = 0;
		if (sound.stoppedAt) {
			if (sound.stoppedAt - sound.startedAt >= 0) {
				offset = sound.stoppedAt - sound.startedAt;
			} else {
				when = sound.startedAt - sound.stoppedAt;
			}
		}
		newSound.source.start(audioContext.currentTime + when, offset);
		newSound.isPlaying = true;
		newSound.startedAt = audioContext.currentTime - offset + when;
		newSound.stoppedAt = undefined;

		return newSound;
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
		const gainNode = audioContext.createGain();
		sourceNode.buffer = audioBuffer;
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