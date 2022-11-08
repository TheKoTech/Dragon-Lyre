import React from 'react'
import Sound from './Sound'


function Scene() {

	const handleOnPlay = (e) => {
		console.log('Play button clicked')
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
