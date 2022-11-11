import React from 'react';
import { useState } from 'react';
import Sound from './Sound';
import SoundAddBtn from './SoundAddBtn';


function Scene({ audioContext }) {
	const [soundsList, setSoundsList] = useState([]);

	/**
	 * @param {number} id
	 */
	const handlePlayBtn = id => {
		const sound = soundsList[id];
		if (sound.source !== undefined)
			sound.source.stop();
		sound.source = playSound(sound.buffer);
		sound.source.loop = sound.isLooped;
	};

	/**
	 *
	 * @param {AudioBuffer} audioBuffer
	 * @returns {AudioBufferSourceNode}
	 */
	function playSound(audioBuffer) {
		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(audioContext.destination);
		source.start();

		return source;
	}

	/**
	 *
	 * @param {String} filePath The path must contain the file extension.
	 * @returns {Promise<AudioBuffer>} A promise of a sound buffer.
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
		setSoundsList((prevList) => {
			const newList = prevList.map(sound => {
				return sound.id === id
					? { ...sound, volume: e.target.value }
					: sound;
			});
			console.log(`Sound ${ id } { volume: ${ newList[id].volume } }`);
			return newList;
		});
	};

	/**
	 * @param {Event} e
	 * @param {number} id
	 */
	const handleLoopedChange = (e, id) => {
		setSoundsList((prevList) => {
			const newList = prevList.map(sound => {
				return sound.id === id
					? { ...sound, isLooped: e.target.checked }
					: sound;
			});
			console.log(`Sound ${ id } { isLooped: ${ newList[id].isLooped } }`);
			return newList;
		});
	};

	const addSound = () => {
		selectFile('', false).then(file => {
				// TODO: Cut into two methods.
				const newId = soundsList.length === 0
					? 0
					: Math.max(...soundsList.map(sound => sound.id)) + 1;
				console.log(soundsList.map(sound => sound.id));
				const soundName = file.name.substring(0, file.name.lastIndexOf('.'));

				setupSound('/sounds/' + file.name).then(audioBuffer => {
					const audioSource = playSound(audioBuffer);
					audioSource.loop = true;

					setSoundsList([
						...soundsList,
						{
							id: newId,
							title: soundName,
							isPlayed: false,
							isLooped: true,
							volume: 50,
							buffer: audioBuffer,
							source: audioSource,
						}
					]);
				});
			}
		);
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

	const deleteSound = (id) => {
		soundsList.find(sound => sound.id === id).source.stop();
		setSoundsList(prevList => prevList.filter(sound => sound.id !== id));
	};

	return (
		<div className='scene'>
			Scene component

			<div className='sounds_list'>
				{ soundsList.map((props) =>
					<Sound
						key={ props.id }
						{ ...props }
						onPlayBtn={ handlePlayBtn }
						onVolumeChange={ handleVolumeChange }
						onLoopedChange={ handleLoopedChange }
						onDelete={ deleteSound }
					/>
				) }
				<SoundAddBtn onClick={ addSound }/>
			</div>
		</div>
	);
}

export default Scene;
