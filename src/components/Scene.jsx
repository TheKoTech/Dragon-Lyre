import React from 'react'
import Sound from './Sound'


function Scene() {

	const handleOnPlay = () => {
		let audio = new Audio('/sounds/10000208.ogg');
		let promise = audio.play();

		if (promise !== undefined) {
			promise.then(_ => {
				console.log('Audio start playing.')
			}).catch(error => {
				console.log(`Audio can\'t be played. (${error})`)
			})
		}
	}

	return (
		<div className='scene'>
			Scene component

			<div className='sounds_list'>
				<Sound
					title='Sound item'
					id={0}
					onPlay={handleOnPlay}
				>

				</Sound>
			</div>
		</div>
	)
}

export default Scene
