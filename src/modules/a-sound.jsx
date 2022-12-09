export default class ASound {

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
	 * @param {AudioContext} audioContext
	 * @param {[SoundParameters[], Dispatch<SetStateAction<SoundParameters[]>>]} soundListState
	 * @param {SoundParameters[]} newSounds
	 */
	static addNewSoundsInSoundList(audioContext, soundListState, newSounds) {
		const soundPromises = newSounds.map(async sound => {
			return {
				...sound,
				isPlaying: false,
				buffer: await this.#getAudioBufferFromFile(audioContext, sound.fileName),
			};
		});

		Promise.all(soundPromises).then(sounds => {
			soundListState[1]([
				...soundListState[0],
				...sounds,
			]);
		});
	}

	/**
	 * Decodes audio data from the file and creates audio buffer.
	 * @param {string} fileName The file name must contain the file extension.
	 * @param {AudioContext} audioContext
	 * @returns {Promise<AudioBuffer>}
	 */
	static async #getAudioBufferFromFile(audioContext, fileName) {
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
}
