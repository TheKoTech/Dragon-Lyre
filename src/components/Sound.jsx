import React from 'react'


function Sound({ id, title, onPlay }) {
	return (
		<span className='sound'>
			{title}
			<input
				className='play_btn'
				type="button"
				value="Play sound"
				onClick={e => onPlay(e)}
			/>
		</span>
	)
}

export default Sound