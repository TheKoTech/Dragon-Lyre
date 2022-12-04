import React, { useEffect, useState } from 'react';
import { SceneSidebar } from './SceneSidebar';
import Sound from './Sound';
import SoundAddBtn from './SoundAddBtn';
import { Toolbar } from './Toolbar';
import './css/Scene.css';

/**
 * @param {Object} Scene
 * @param {AudioContext} Scene.audioContext
 */
function Scene({ audioContext }) {

	// ========================================
	// Types
	// ========================================


	/**
	 * @typedef {Object} SoundParameters
	 * @property {number} id
	 * @property {string} title
	 * @property {string} extension
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


	// ========================================
	// State
	// ========================================


	/**
	 * @type [SoundParameters[], Dispatch<SetStateAction<SoundParameters[]>>]
	 */
	const soundState = useState([]);
	const [soundsList, setSoundsList] = soundState;

	useEffect(() => {
		const sceneSave = window['electronAPI'].readSceneSave('./public/saves/scene_name.json');
		sceneSave.then(resolve => {
			const json = JSON.parse(resolve);
			let id = 0;

			setSoundsList(json.map(soundJson => {
				return {
					id: id += 1,
					title: soundJson.title,
					extension: soundJson.extension,
					volume: soundJson.volume,
					isPlaying: false,
					minInterval: soundJson.minInterval,
					maxInterval: soundJson.maxInterval,
					buffer: getAudioBufferFromFile(`/sounds/${ soundJson.title + '.' + soundJson.extension }`)
				};
			}));
		}).catch(error => error);
	}, [setSoundsList]);


	// ========================================
	// Logic
	// ========================================


	/**
	 * Starts the sound with the given ID.
	 * @param {number} id Sound ID.
	 * @param {number} when
	 * @param {number} offset
	 */
	function startSound(id, when = 0, offset = 0) {
		const sound = soundsList.find(sound => sound.id === id);

		addToSoundNewSourceAndGain(id);

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
	 * Stops the sound with the given ID.
	 * @param {number} id Sound ID.
	 * @param {Boolean} disconnect If true, disconnects the source from the context.
	 */
	function stopSound(id, disconnect = false) {
		const sound = soundsList.find(sound => sound.id === id);

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

	// todo: refactor
	/**
	 * Creates SourceNode and GainNode.
	 * Transfers the settings from the sound with the given ID.
	 * Attaches SourceNode and GainNode to the sound.
	 * @param id Sound ID.
	 */
	function addToSoundNewSourceAndGain(id) {
		const sound = soundsList.find(sound => sound.id === id);

		const [sourceNode, gainNode] = createSourceAndGainFromAudioBuffer(sound.buffer);
		applySettingsFromSoundToSourceAndGain(id, sourceNode, gainNode);
		attachSourceAndGainToSound(id, sourceNode, gainNode);
	}

	// todo: refactor
	/**
	 * Creates audio source (thread) with gain and connects it to the context.
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

	// todo: refactor
	/**
	 * Must run before attaching to the sound.
	 * @param {number} id Sound ID.
	 * @param {AudioBufferSourceNode} sourceNode The following sound fields will be transferred: loop and onended.
	 * @param {GainNode} gainNode The following sound fields will be transferred: value.
	 */
	function applySettingsFromSoundToSourceAndGain(id, sourceNode, gainNode) {
		const sound = soundsList.find(sound => sound.id === id);

		if (sound.source && sound.gainNode) {
			gainNode.gain.value = sound.volume;
			sourceNode.onended = sound.source.onended;
		}
	}

	// todo: refactor
	/**
	 * Must run after applying the settings to the source and the gain.
	 * @param {number} id Sound ID.
	 * @param {AudioBufferSourceNode} sourceNode
	 * @param {GainNode} gainNode
	 */
	function attachSourceAndGainToSound(id, sourceNode, gainNode) {
		const sound = soundsList.find(sound => sound.id === id);

		sound.source = sourceNode;
		sound.gainNode = gainNode;
		sound.source.onended = () => {
			handleSoundEnd(sound.id, sound.maxInterval);
		};
	}

	// todo: refactor
	/**
	 * Initializes AudioBuffer to the sound. Creates an object Sound and add it to the Scene.
	 * @param {File} file
	 */
	function setupSoundAndAddInSoundList(file) {
		const filePath = '/sounds/' + file.name;
		getAudioBufferFromFile(filePath).then(audioBuffer => {
			addSoundInSoundList(file.name, audioBuffer);
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

	// todo: remove this absolutely disgusting dumpster of a function
	/**
	 * Opens a system dialog.
	 * @param {string} contentType The files you wish to select. For instance, use "image/*" to select all types of
	 *     images.
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
	 * Starts a sound and then creates an object Sound and add it to the Scene.
	 * @param {string} fileName
	 * @param {AudioBuffer} audioBuffer A buffer containing audio information.
	 */
	function addSoundInSoundList(fileName, audioBuffer) {
		setSoundsList([
			...soundsList,
			{
				id: getNewSoundId(),
				title: fileName.substring(0, fileName.lastIndexOf('.')),
				extension: fileName.substring(fileName.lastIndexOf('.') + 1),
				volume: 1.0,
				isPlaying: false,
				minInterval: 0,
				maxInterval: 5,
				buffer: audioBuffer,
			}
		]);
	}

	/**
	 * Returns an ID for a new sound.
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


	// ========================================
	// Handlers
	// ========================================


	/**
	 *
	 * @param {ChangeEvent<HTMLInputElement>} e
	 * @param {number} id Sound ID.
	 */
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
	 *
	 * @param {number} id Sound ID.
	 */
	const handlePlayBtn = (id) => {
		const sound = soundsList.find(sound => sound.id === id);

		if (sound.isPlaying)
			stopSound(id);
		else
			startSound(id);
	};

	/**
	 *
	 * @param {ChangeEvent<HTMLInputElement>} e
	 * @param {number} id Sound ID.
	 */
	const handleVolumeChange = (e, id) => {
		const sound = soundsList.find(sound => sound.id === id);
		if (sound.gainNode)
			sound.gainNode.gain.value = e.target.value;

		setSoundsList((prevList) => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, volume: e.target.value }
					: sound;
			});
		});
	};

	/**
	 *
	 * @param {ChangeEvent<HTMLInputElement>} e
	 * @param {number} id Sound ID.
	 */
	const handleIntervalChange = (e, id) => {
		setSoundsList((prevList) => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, maxInterval: e.target.value }
					: sound;
			});
		});
	};

	/**
	 *
	 */
	const handleAddSound = () => {
		selectFile('', false).then(file => setupSoundAndAddInSoundList(file));
	};

	/**
	 * Stops and removes the sound with the given ID from the list and interface.
	 * @param {number} id Sound ID.
	 */
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
		const sound = soundsList.find(sound => sound.id === id);

		if (sound.isPlaying) {
			startSound(id, when);
		}
	}

	/**
	 *
	 * @param {Event} e
	 */
	function handleOnSave(e) {
		const jsonString = JSON.stringify(soundsList.map(sound => {
			return {
				title: sound.title,
				extension: sound.extension,
				volume: sound.volume,
				minInterval: sound.minInterval,
				maxInterval: sound.maxInterval,
			};
		}));

		window['electronAPI'].writeSceneSave('./public/saves/scene_name.json', jsonString);
	}


	return (
		<div className='scene'>
			<SceneSidebar/>
			<Toolbar onSave={ handleOnSave }/>
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
					/>
				) }
				<SoundAddBtn onClick={ handleAddSound }/>
			</div>
		</div>
	);
}

export default Scene;
