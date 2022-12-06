export default class SoundManagement {

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
	// Adding Sound
	// ========================================

	/**
	 * @returns {Promise<File[]>} A promise of a file or array of files if the multiple parameter is true.
	 */
	static selectFiles() {
		return new Promise(resolve => {
			const input = document.createElement('input');
			input.type = 'file';
			input.multiple = true;

			input.onchange = () => {
				resolve(Array.from(input.files));
			};

			input.click();
		});
	}

	/**
	 * Don't run it function in a row, it works asynchronously.
	 * @param {AudioContext} audioContext
	 * @param {[SoundParameters[], Dispatch<SetStateAction<SoundParameters[]>>]} soundListState
	 * @param {SoundParameters} sound
	 */
	static setupSoundAndAddInSoundList(audioContext, soundListState, sound) {
		const fileName = sound.title + '.' + sound.extension;

		this.getAudioBufferFromFile(audioContext, fileName).then(audioBuffer => {
			soundListState[1]([
				...soundListState[0],
				{
					...sound,
					isPlaying: false,
					buffer: audioBuffer,
				}
			]);
		});
	}

	/**
	 * @param {AudioContext} audioContext
	 * @param {[SoundParameters[], Dispatch<SetStateAction<SoundParameters[]>>]} soundListState
	 * @param {SoundParameters[]} newSounds
	 */
	static addNewSoundsInSoundList(audioContext, soundListState, newSounds) {
		soundListState[1]([
			...soundListState[0],
			...(newSounds.map(sound => {
				const fileName = sound.title + '.' + sound.extension;

				return {
					...sound,
					isPlaying: false,
					buffer: this.getAudioBufferFromFile(audioContext, fileName),
				};
			}))
		]);
	}

	/**
	 * Decodes audio data from the file and creates audio buffer.
	 * @param {string} fileName The file name must contain the file extension.
	 * @param {AudioContext} audioContext
	 * @returns {Promise<AudioBuffer>}
	 */
	static async getAudioBufferFromFile(audioContext, fileName) {
		// todo: Make 'fetch' work with the local resources
		const response = await fetch('sounds/' + fileName);
		const arrayBuffer = await response.arrayBuffer();
		return await audioContext.decodeAudioData(arrayBuffer);
	}

	/**
	 * Returns an ID for a new element in the list.
	 * @returns {number} Integer number.
	 */
	static getNewElementId(list) {
		let id;
		if (list.length === 0)
			id = 0;
		else
			id = Math.max(...list.map(element => element.id)) + 1;
		return id;
	}


	// ========================================
	// Starting Sound
	// ========================================


	/**
	 * @param {AudioContext} audioContext
	 * @param {SoundParameters} sound
	 * @param {number} when
	 */
	static startSound(audioContext, sound, when = 0) {
		this.addToSoundNewSourceAndGain(audioContext, sound);

		let offset = 0;
		if (sound.stoppedAt) {
			if (sound.stoppedAt - sound.startedAt >= 0) {
				offset = sound.stoppedAt - sound.startedAt;
			} else {
				when = sound.startedAt - sound.stoppedAt;
			}
		}
		sound.source.start(audioContext.currentTime + when, offset);
		sound.isPlaying = true;
		sound.startedAt = audioContext.currentTime - offset + when;
		sound.stoppedAt = undefined;
	}

	/**
	 * Creates SourceNode and GainNode.
	 * Transfers the settings from the sound with the given ID.
	 * Attaches SourceNode and GainNode to the sound.
	 * @param {AudioContext} audioContext
	 * @param {SoundParameters} sound
	 */
	static addToSoundNewSourceAndGain(audioContext, sound) {
		const [sourceNode, gainNode] = this.createSourceAndGain(audioContext, sound.buffer);

		if (sound.source && sound.gainNode) {
			gainNode.gain.value = sound.volume;
			sourceNode.onended = sound.source.onended;
		} else {
			// Default values
			gainNode.gain.value = 0.5;
			sourceNode.onended = () => {
				if (sound.isPlaying) {
					this.startSound(audioContext, sound, sound.maxInterval);
				}
			};
		}

		sound.source = sourceNode;
		sound.gainNode = gainNode;
	}

	/**
	 * Creates audio source (thread) with gain and connects it to the context.
	 * @param {AudioContext} audioContext
	 * @param {AudioBuffer} audioBuffer
	 * @returns {[AudioBufferSourceNode, GainNode]}
	 */
	static createSourceAndGain(audioContext, audioBuffer) {
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
	 * @param {Boolean} disconnect If true, disconnects the source from the context.
	 */
	static stopSound(audioContext, sound, disconnect = false) {
		if (sound.source) {
			if (disconnect) {
				sound.source.disconnect();
			} else {
				sound.source.stop();
			}
			sound.isPlaying = false;
			sound.stoppedAt = audioContext.currentTime;
		}
	}
}