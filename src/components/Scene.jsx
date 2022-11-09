import React from 'react'
import { useState } from 'react'
import Sound from './Sound'
import SoundAddBtn from './SoundAddBtn'


function Scene() {
	const [soundsList, setSoundsList] = useState([{
		id: 0,
		title: 'Sound item 1',
		isPlayed: false,
		isLooped: true,
		volume: 50,
		audioFile: undefined
	}])

	/**
	 * @param {number} id номер звука
	 */
	const handlePlayBtn = id => {
		// следи за постоянством кода. Убрал точки с запятыми
		// Значение не меняется - ставим const
		const audio = new Audio('/sounds/10000208.ogg')
		const promise = audio.play()

		if (promise !== undefined) {
			promise.then(_ => {
				console.log('Audio start playing.')
			}).catch(error => {
				// Ты используешь backticks, обратный слеш для кавычек не нужен
				console.log(`Audio can't be played. (${error})`)
			})
		}
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
					: sound
			})
			console.log(`Sound ${id} { volume: ${newList[id].volume} }`)
			return newList
		})
	}

	/**
	 * @param {Event} e 
	 * @param {number} id 
	 */
	const handleLoopedChange = (e, id) => {
		setSoundsList((prevList) => {
			const newList = prevList.map(sound => {
				return sound.id === id
					? { ...sound, isLooped: e.target.checked }
					: sound
			})
			console.log(`Sound ${id} { isLooped: ${newList[id].isLooped} }`)
			return newList
		})
	}

	const addSound = () => {
		setSoundsList([
			...soundsList,
			{
				id: soundsList.length,
				title: `Sound item ${soundsList.length + 1}`,
				isPlayed: false,
				isLooped: true,
				volume: 50,
				audioFile: undefined
			}])
	}

	return (
		<div className='scene'>
			Scene component

			<div className='sounds_list'>
				{soundsList.map((props) =>
					<Sound
						key={props.id}
						{...props}
						onPlayBtn={handlePlayBtn}
						onVolumeChange={handleVolumeChange}
						onLoopedChange={handleLoopedChange}
					/>
				)}
				<SoundAddBtn onClick={addSound} />
			</div>
		</div>
	)
}

export default Scene
