import React, { useEffect, useState } from 'react';
import './css/Scene.css';

import Sound from './Sound/Sound';
import EditorTitlebar from './EditorTitlebar';
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
	 * @property {string} title Sound name in the app.
	 * @property {string} fileName File name in the system.
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
		const sceneSave = window['electronAPI'].readSceneSave('./public/saves/new_scene.json');

		sceneSave.then(resolve => {
			if (resolve === null) return;

			const json = JSON.parse(resolve);
			setSceneTitle(json['title']);

			let id = ASound.getNewElementId(soundList);
			ASound.addNewSoundsInSoundList(audioContext, soundListState, json['sounds'].map(soundJson => {
				return {
					id: id += 1,
					title: soundJson.title,
					fileName: soundJson.fileName,
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
	 * @param {ChangeEvent<HTMLInputElement>} e
	 * @param {number} id Sound ID.
	 */
	const handleSoundTitleChange = (e, id) => {
		setSoundList(prevList => {
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
	 * @param {ChangeEvent<HTMLInputElement>} e
	 * @param {number} id Sound ID.
	 */
	const handleVolumeChange = (e, id) => {
		const sound = soundList.find(sound => sound.id === id);
		if (sound.gainNode) {
			sound.gainNode.gain.value = +e.target.value;
		}

		setSoundList(prevList => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, volume: +e.target.value }
					: sound;
			});
		});
	};

	/**
	 * @param {ChangeEvent<HTMLInputElement>} e
	 * @param {number} id Sound ID.
	 */
	const handleMinIntervalChange = (e, id) => {
		setSoundList(prevList => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, minInterval: +e.target.value }
					: sound;
			});
		});
	};

	/**
	 * @param {ChangeEvent<HTMLInputElement>} e
	 * @param {number} id Sound ID.
	 */
	const handleMaxIntervalChange = (e, id) => {
		setSoundList(prevList => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, maxInterval: +e.target.value }
					: sound;
			});
		});
	};

	const handleAddSound = () => {
		ASound.selectFiles().then(files => {
			let id = ASound.getNewElementId(soundList);

			ASound.addNewSoundsInSoundList(audioContext, soundListState, files.map(file => ({
				id: id += 1,
				title: file.name.substring(0, file.name.lastIndexOf('.')),
				fileName: file.name,
				volume: 0.5,
				minInterval: 0,
				maxInterval: 5,
				effectsList: [
					{
						id: 1,
						name: 'Reverb',
					},
					{
						id: 2,
						name: 'Distortion',
					},
				],
			})));
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
	 */
	const handleSoundEnd = (id) => {
		const sound = soundList.find(sound => sound.id === id);
		const newSound = SSSound.startSound(audioContext, sound);

		setSoundList(prevList => {
			return prevList.map(sound => {
				return sound.id === id
					? newSound
					: sound;
			});
		});
	};

	/**
	 * @param {MouseEvent<HTMLButtonElement>} e
	 */
	function handleOnSave(e) {
		const jsonString = JSON.stringify({
			title: sceneTitle,
			sounds: soundList.map(sound => {
				return {
					title: sound.title,
					fileName: sound.fileName,
					volume: sound.volume,
					minInterval: sound.minInterval,
					maxInterval: sound.maxInterval,
				};
			})
		});

		const saveFileName = sceneTitle.toLowerCase().replace(' ', '_') + '.json';
		// Add a checkmark animation in then block.
		window['electronAPI'].writeSceneSave(`./public/saves/${ saveFileName }`, jsonString).then();
	}

	/**
	 *
	 * @param e
	 */
	function handleOnTitleSceneChange(e) {
		const oldName = './public/saves/' + sceneTitle.toLowerCase().replace(' ', '_') + '.json';
		const newName = './public/saves/' + e.target.value.toLowerCase().replace(' ', '_') + '.json';
		// Add a checkmark animation in then block.
		window['electronAPI'].renameSceneSave(oldName, newName).then();

		setSceneTitle(e.target.value);
	}

	/**
	 * @param {number} soundId
	 * @param {number} effectId
	 */
	function handleEffectClick(soundId, effectId) {
		const sound = soundList.find(sound => sound.id === soundId)
		const effect = sound.effectsList.find(effect => effect.id === effectId)
		console.log(`Effect ${ effect.name } clicked`);
	}

	return (
		<div className='editor'>
			<div className='editor__sidebar'>
				<SceneSidebar />
			</div>
			<div className='editor__content'>
				<EditorTitlebar onSave={ handleOnSave } />
				<input
					className='editor__content_title'
					type='text'
					value={ sceneTitle }
					onChange={ (e) => handleOnTitleSceneChange(e) } />
				<div className='editor__content_sounds-list'>
					{ soundList.map((props) =>
						<Sound
							key={ props.id }
							{ ...props }
							onTitleChange={ handleSoundTitleChange }
							onPlayBtn={ handlePlayBtn }
							onVolumeChange={ handleVolumeChange }
							onMinIntervalChange={ handleMinIntervalChange }
							onMaxIntervalChange={ handleMaxIntervalChange }
							onDelete={ handleDeleteBtn }
							onSoundEnd={ handleSoundEnd }
							onEffectClick={ handleEffectClick }
						/>
					) }
					<SoundAddBtn onClick={ handleAddSound } />
				</div>
			</div>
		</div>
	);
}

export default Scene;