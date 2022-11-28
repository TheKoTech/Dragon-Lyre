import React, { useState } from 'react';
import { SceneSidebar } from './SceneSidebar';
import Sound from './Sound';
import SoundAddBtn from './SoundAddBtn';


function Scene({ audioContext }) {
	const [soundsList, setSoundsList] = useState([]);

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
	 * @param {number} id
	 */
	const handlePlayBtn = id => {
		const sound = soundsList[id];
		if (sound.source !== undefined)
			sound.source.stop();

		const [source, gain] = playSound(sound.buffer);
		gain.gain.value = sound.volume;
		source.onended = sound.source.onended;

		sound.source = source;
		sound.gain = gain;
	};

	/**
	 * Creates audio source (thread) and starts it.
	 * @param {AudioBuffer} audioBuffer
	 * @returns {[AudioBufferSourceNode, GainNode]}
	 */
	function playSound(audioBuffer) {
		const source = audioContext.createBufferSource();
		const gainNode = audioContext.createGain();
		source.buffer = audioBuffer;
		source.connect(gainNode);
		gainNode.connect(audioContext.destination);
		source.start();

		return [source, gainNode];
	}

	/**
	 * Decodes audio data from the file and creates audio buffer.
	 * @param {String} filePath The path must contain the file extension.
	 * @returns {Promise<AudioBuffer>}
	 */
	async function setupSound(filePath) {
		return await getAudioBufferFromFile(filePath);
	}

	async function getAudioBufferFromFile(filePath) {
		const response = await fetch(filePath);
		const arrayBuffer = await response.arrayBuffer();
		return await audioContext.decodeAudioData(arrayBuffer);
	}

	/**
	 * @param {Event} e
	 * @param {number} id
	 */
	const handleVolumeChange = (e, id) => {
		if (soundsList[id].gain !== undefined)
			soundsList[id].gain.gain.value = e.target.value;

		setSoundsList((prevList) => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, volume: e.target.value }
					: sound;
			});
		});
	};

	/**
	 * @param {Event} e
	 * @param {number} id
	 */
	const handleLoopedChange = (e, id) => {
		setSoundsList((prevList) => {
			return prevList.map(sound => {
				return sound.id === id
					? { ...sound, isLooped: e.target.checked }
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
		console.log(soundsList[id].interval);
	};

	const addSound = () => {
		selectFile('', false).then(file => setupSoundAndAddInSoundList(file));
	};

	/**
	 * Select file(s).
	 * @param {String} contentType The files you wish to select. For instance, use "image/*" to select all types of images.
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
		setupSound(filePath).then(audioBuffer => addSoundInSoundList(soundName, audioBuffer));
	}

	/**
	 * Starts a sound and then creates an object Sound and add it to the Scene.
	 * @param {String} soundName
	 * @param {AudioBuffer} buffer A buffer containing audio information.
	 */
	function addSoundInSoundList(soundName, buffer) {
		const [source, gain] = playSound(buffer);
		gain.gain.value = 0.5;

		setSoundsList([
			...soundsList,
			{
				id: getNewSoundId(),
				title: soundName,
				volume: gain.gain.value,
				minInterval: 0,
				maxInterval: 6,
				buffer: buffer,
				source: source,
				gain: gain,
				audioContext: audioContext,
			}
		]);
	}

	/**
	 * Returns max sound ID + 1.
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

	const deleteSound = (id) => {
		const sound = soundsList.find(sound => sound.id === id);
		sound.source.stop();
		sound.source.disconnect();
		setSoundsList(prevList => prevList.filter(sound => sound.id !== id));
	};

	return (
		<div className='scene'>
			<SceneSidebar />
			<div className='sounds_list'>
				{ soundsList.map((props) =>
					<Sound
						key={ props.id }
						{ ...props }
						onTitleChange={ handleSoundTitleChange }
						onPlayBtn={ handlePlayBtn }
						onVolumeChange={ handleVolumeChange }
						onLoopedChange={ handleLoopedChange }
						onIntervalChange={ handleIntervalChange }
						onDelete={ deleteSound }
					/>
				) }
				<SoundAddBtn onClick={ addSound } />
			</div>
		</div>
	);
}

export default Scene;
