import React from 'react';
import { useState } from 'react';
import Sound from './Sound';
import SoundAddBtn from './SoundAddBtn';


function Scene() {
	const [soundsList, setSoundsList] = useState([
		{
			id: 0,
			title: 'Sound item 1',
			isPlayed: false,
			isLooped: true,
			volume: 50,
			audioFile: undefined,
			soundBuffer: undefined,
			soundSource: undefined,
		}
	]);

	// const audioContext = new AudioContext();
	// let soundsBuffers = [];
	// let soundSource;
	// setupSounds(['/sounds/10000208.mp3']).then((response) => {
	// 	soundsBuffers = response;
	// 	console.log('All sounds are ready!');
	// });

	/**
	 * @param {number} id номер звука
	 */
	const handlePlayBtn = id => {
		if (soundSources !== undefined) {
			for (const soundSource of soundSources) {
				soundSource.stop();
			}
		}
		for (const soundBuffer of soundsBuffers) {
			soundSources.push(playSound(soundBuffer));
		}
	};

	function playSound(audioBuffer) {
		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(audioContext.destination);
		source.start();

		return source;
	}

	async function setupSounds(filePaths) {
		const audioBuffers = [];

		for (const filePath of filePaths) {
			const audioBuffer = await getAudioBufferFromFile(filePath);
			audioBuffers.push(audioBuffer);
		}

		return audioBuffers;
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
		const newId = Math.max(...soundsList.map(sound => sound.id)) + 1;
		setSoundsList([
			...soundsList,
			{
				id: newId,
				title: `Sound item ${ newId + 1 }`,
			}
		]);
	};

	const deleteSound = (id) => {
		setSoundsList(prevList =>
			prevList.filter(sound => sound.id !== id)
		);
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
