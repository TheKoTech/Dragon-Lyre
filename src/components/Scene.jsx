import React, { useEffect, useState } from 'react';
import './css/Scene.css';

import Sound from './Sound';
import Toolbar from './Toolbar';
import SoundAddBtn from './SoundAddBtn';
import SceneSidebar from './SceneSidebar';
import SSSound from '../modules/s-s-sound';
import ASound from '../modules/a-sound';


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
	// State
	// ========================================


	/**
	 * @type [SoundParameters[], Dispatch<SetStateAction<SoundParameters[]>>]
	 */
	const soundListState = useState([]);
	const [soundList, setSoundList] = soundListState;
	/**
	 * @type [string, Dispatch<SetStateAction<string>>]
	 */
	const sceneTitleState = useState('New Scene');
	const [sceneTitle, setSceneTitle] = sceneTitleState;

	useEffect(() => {
		const sceneSave = window['electronAPI'].readSceneSave('./public/saves/scene_name.json');

		sceneSave.then(resolve => {
			if (resolve === null) return;

			let id = ASound.getNewElementId(soundList);

			ASound.addNewSoundsInSoundList(audioContext, soundListState, JSON.parse(resolve).map(soundJson => {
				return {
					id: id += 1,
					title: soundJson.title,
					extension: soundJson.extension,
					volume: soundJson.volume,
					minInterval: soundJson.minInterval,
					maxInterval: soundJson.maxInterval,
				};
			}));
		});
	}, []);


	// ========================================
	// Handlers
	// ========================================


	/**
	 * @param {ChangeEvent<HTMLInputElement>} event
	 * @param {number} id Sound ID.
	 */
	const handleSoundTitleChange = (event, id) => {
		setSoundList(prevList => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, title: event.target.value }
					: sound;
			});
		});
	};

	/**
	 * @param {number} id Sound ID.
	 */
	const handlePlayBtn = (id) => {
		const sound = soundList.find(sound => sound.id === id);

		const newSound = sound.isPlaying
			? SSSound.stopSound(audioContext, sound)
			: SSSound.startSound(audioContext, sound);

		setSoundList(prevList => {
			return prevList.map(sound => {
				return sound.id === id
					? newSound
					: sound;
			});
		});
	};

	/**
	 * @param {ChangeEvent<HTMLInputElement>} event
	 * @param {number} id Sound ID.
	 */
	const handleVolumeChange = (event, id) => {
		const sound = soundList.find(sound => sound.id === id);
		if (sound.gainNode) {
			sound.gainNode.gain.value = +event.target.value;
		}

		setSoundList(prevList => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, volume: +event.target.value }
					: sound;
			});
		});
	};

	/**
	 * @param {ChangeEvent<HTMLInputElement>} event
	 * @param {number} id Sound ID.
	 */
	const handleIntervalChange = (event, id) => {
		setSoundList(prevList => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, maxInterval: +event.target.value }
					: sound;
			});
		});
	};

	/**
	 */
	const handleAddSound = () => {
		ASound.selectFiles().then(files => {
			let id = ASound.getNewElementId(soundList);

			ASound.addNewSoundsInSoundList(audioContext, soundListState, files.map(file => {
				return {
					id: id += 1,
					title: file.name.substring(0, file.name.lastIndexOf('.')),
					extension: file.name.substring(file.name.lastIndexOf('.') + 1),
					volume: 0.5,
					minInterval: 0,
					maxInterval: 5,
				};
			}));
		});
	};

	/**
	 * Stops and removes the sound with the given ID from the list and interface.
	 * @param {number} id Sound ID.
	 */
	const handleDeleteBtn = (id) => {
		const sound = soundList.find(sound => sound.id === id);
		SSSound.stopSound(audioContext, sound);

		setSoundList(prevList => prevList.filter(sound => sound.id !== id));
	};

	/**
	 * @param {number} id
	 * @param {number} minInterval
	 * @param {number} maxInterval
	 */
	const handleSoundEnd = (id, minInterval, maxInterval) => {
		const sound = soundList.find(sound => sound.id === id);

		const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;
		const newSound = SSSound.startSound(audioContext, sound, randomInterval);

		setSoundList(prevList => {
			return prevList.map(sound => {
				return sound.id === id
					? newSound
					: sound;
			});
		});
	};

	/**
	 * @param {MouseEvent<HTMLButtonElement>} event
	 */
	function handleOnSave(event) {
		const jsonString = JSON.stringify(soundList.map(sound => {
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
		<div className='editor'>
			<div className='editor__sidebar'>
				<SceneSidebar/>
			</div>
			<div className='editor__content'>
				<Toolbar onSave={ handleOnSave }/>
				<input
					className='editor__content_title'
					type='text'
					value={ sceneTitle }
					onChange={ (event) => setSceneTitle(event.target.value) }/>
				<div className='editor__content_sounds-list'>
					{ soundList.map((props) =>
						<Sound
							key={ props.id }
							{ ...props }
							onTitleChange={ handleSoundTitleChange }
							onPlayBtn={ handlePlayBtn }
							onVolumeChange={ handleVolumeChange }
							onIntervalChange={ handleIntervalChange }
							onDelete={ handleDeleteBtn }
							onSoundEnd={ handleSoundEnd }
						/>
					) }
					<SoundAddBtn onClick={ handleAddSound }/>
				</div>
			</div>
		</div>
	);
}

export default Scene;