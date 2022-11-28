import React, { useState } from 'react';
import { SceneSidebar } from './SceneSidebar';
import Sound from './Sound';
import SoundAddBtn from './SoundAddBtn';

/**
 * @param {Object} Scene
 * @param {AudioContext} Scene.audioContext
 */
function Scene({ audioContext }) {
	/**
	 * @typedef {Object} SoundParameters
	 * @property {number} id
	 * @property {string} title
	 * @property {number} volume
	 * @property {number | undefined} startedAt
	 * @property {number | undefined} stoppedAt
	 * @property {boolean} isPlaying
	 * @property {number} minInterval
	 * @property {number} maxInterval
	 * @property {AudioBuffer} buffer
	 * @property {GainNode | undefined} gainNode
	 * @property {AudioBufferSourceNode | undefined} source
	 */

	/**
	 * @type [SoundParameters[], Dispatch<SetStateAction<SoundParameters[]>>]
	 */
	const soundState = useState([]);
	const [soundsList, setSoundsList] = soundState;

	const handleSoundTitleChange = (e, id) => {
		setSoundsList((prevList) => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, title: e.target.value }
					: sound;
			});
		});
	};

	/**
	 * @param {number} id Sound ID.
	 */
	const handlePlayBtn = (id) => {
		const sound = soundsList[id];

		if (sound.isPlaying)
			stopSound(id);
		else
			startSound(id);
	};

	/**
	 * Stop the sound with the given ID.
	 * @param {number} id Sound ID.
	 * @param {Boolean} disconnect If true then disconnect the source from the context.
	 */
	function stopSound(id, disconnect = false) {
		const sound = soundsList[id];

		sound.source.stop();
		sound.isPlaying = false;
		sound.stoppedAt = audioContext.currentTime;

		if (disconnect)
			sound.source.disconnect();
	}

	/**
	 * Start the sound with the given ID.
	 * @param {number} id Sound ID.
	 * @param {number} when
	 * @param {number} offset
	 */
	function startSound(id, when = 0, offset = 0) {
		const sound = soundsList[id];

		addToSoundNewSourceAndGain(id);

		if (sound.stoppedAt) {
			if (sound.stoppedAt - sound.startedAt >= 0)
				offset = sound.stoppedAt - sound.startedAt;
			else
				when = sound.startedAt - sound.stoppedAt;
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
	 * @param id Sound ID.
	 */
	function addToSoundNewSourceAndGain(id) {
		const sound = soundsList[id];

		const [sourceNode, gainNode] = createSourceAndGainFromAudioBuffer(sound.buffer);
		applySettingsFromSoundToSourceAndGain(id, sourceNode, gainNode);
		attachSourceAndGainToSound(id, sourceNode, gainNode);
	}

	/**
	 * Creates audio source (thread) with gain and connect it to the context.
	 * @param {AudioBuffer} audioBuffer
	 * @returns {[AudioBufferSourceNode, GainNode]}
	 */
	function createSourceAndGainFromAudioBuffer(audioBuffer) {
		const sourceNode = audioContext.createBufferSource();
		const gainNode = audioContext.createGain();
		sourceNode.buffer = audioBuffer;
		sourceNode.connect(gainNode);
		gainNode.connect(audioContext.destination);

		return [sourceNode, gainNode];
	}

	/**
	 * Must run before attaching to the sound.
	 * @param {number} id Sound ID.
	 * @param {AudioBufferSourceNode} sourceNode The following sound fields will be transferred: loop and onended.
	 * @param {GainNode} gainNode The following sound fields will be transferred: value.
	 */
	function applySettingsFromSoundToSourceAndGain(id, sourceNode, gainNode) {
		const sound = soundsList[id];

		if (sound.source && sound.gainNode) {
			gainNode.gain.value = sound.volume;
			sourceNode.onended = sound.source.onended;
		}
	}

	/**
	 * Must run after applying the settings to the source and the gain.
	 * @param {number} id Sound ID.
	 * @param {AudioBufferSourceNode} sourceNode
	 * @param {GainNode} gainNode
	 */
	function attachSourceAndGainToSound(id, sourceNode, gainNode) {
		const sound = soundsList[id];

		sound.source = sourceNode;
		sound.gainNode = gainNode;
		sound.source.onended = () => {
			handleSoundEnd(sound.id, sound.maxInterval);
		};
	}

	/**
	 * @param {Event} e
	 * @param {number} id
	 */
	const handleVolumeChange = (e, id) => {
		if (soundsList[id].gainNode)
			soundsList[id].gainNode.gain.value = e.target.value;

		setSoundsList((prevList) => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, volume: e.target.value }
					: sound;
			});
		});
	};

	const handleIntervalChange = (e, id) => {
		setSoundsList((prevList) => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, interval: e.target.value }
					: sound;
			});
		});
	};

	const addSound = () => {
		selectFile('', false).then(file => setupSoundAndAddInSoundList(file));
	};

	/**
	 * Select file(s).
	 * @param {string} contentType The files you wish to select. For instance, use "image/*" to select all types of images.
	 * @param {Boolean} multiple Indicates if the user can select multiple files.
	 * @returns {Promise<File|File[]>} A promise of a file or array of files if the multiple parameter is true.
	 */
	function selectFile(contentType, multiple) {
		return new Promise(resolve => {
			const input = document.createElement('input');
			input.type = 'file';
			input.multiple = multiple;
			input.accept = contentType;

			input.onchange = () => {
				const files = Array.from(input.files);
				if (multiple)
					resolve(files);
				else
					resolve(files[0]);
			};

			input.click();
		});
	}

	/**
	 * Initialize AudioBuffer to the sound. Creates an object Sound and add it to the Scene.
	 * @param {File} file
	 */
	function setupSoundAndAddInSoundList(file) {
		const soundName = file.name.substring(0, file.name.lastIndexOf('.'));
		const filePath = '/sounds/' + file.name;
		getAudioBufferFromFile(filePath).then(audioBuffer => {
			addSoundInSoundList(soundName, audioBuffer);
		});
	}

	/**
	 * Decodes audio data from the file and creates audio buffer.
	 * @param {string} filePath The path must contain the file extension.
	 * @returns {Promise<AudioBuffer>}
	 */
	async function getAudioBufferFromFile(filePath) {
		const response = await fetch(filePath);
		const arrayBuffer = await response.arrayBuffer();
		return await audioContext.decodeAudioData(arrayBuffer);
	}

	/**
	 * Starts a sound and then creates an object Sound and add it to the Scene.
	 * @param {string} soundName
	 * @param {AudioBuffer} audioBuffer A buffer containing audio information.
	 */
	function addSoundInSoundList(soundName, audioBuffer) {
		setSoundsList([
			...soundsList,
			{
				id: getNewSoundId(),
				title: soundName,
				volume: 1.0,
				isPlaying: false,
				minInterval: 0,
				maxInterval: 5,
				buffer: audioBuffer,
			}
		]);
	}

	/**
	 * Max sound ID + 1 if at least one ID exists else 0.
	 * @returns {number}
	 */
	function getNewSoundId() {
		let id;
		if (soundsList.length === 0)
			id = 0;
		else
			id = Math.max(...soundsList.map(sound => sound.id)) + 1;
		return id;
	}

	const handleDeleteBtn = (id) => {
		stopSound(id, true);
		setSoundsList(prevList => prevList.filter(sound => sound.id !== id));
	};

	/**
	 * Start the sound with the given ID after a certain amount of time (default 0).
	 * Before start, add to the sound new source and new gain.
	 * @param {number} id Sound ID.
	 * @param {number} when The time, in seconds (attached to AudioContext), at which the sound should start playing.
	 */
	function handleSoundEnd(id, when = 0) {
		const sound = soundsList[id];

		if (sound.isPlaying) {
			startSound(id, when);
		}
	}


	return (
			<div className='scene'>
				<SceneSidebar/>
				<div className='sounds_list'>
					{ soundsList.map((props) =>
							<Sound
									key={ props.id }
									{ ...props }
									onTitleChange={ handleSoundTitleChange }
									onPlayBtn={ handlePlayBtn }
									onVolumeChange={ handleVolumeChange }
									onIntervalChange={ handleIntervalChange }
									onDelete={ handleDeleteBtn }
									onEnded={ handleSoundEnd }
							/>
					) }
					<SoundAddBtn onClick={ addSound }/>
				</div>
			</div>
		</div>
	);
}

export default Scene;
