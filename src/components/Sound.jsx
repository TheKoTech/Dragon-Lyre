import React from 'react'


function Sound({ id, title, isPlayed, isLooped, volume, onPlayBtn, onVolumeChange, onLoopedChange }) {
	return (
		<span className='sound'>
			{title}
			<input
				className='play_btn'
				type='button'
				value={isPlayed ? 'Stop' : 'Play'}
				onClick={() => onPlayBtn(id)}
			/>
			<input
				type='range'
				min={0}
				max={100}
				className='volume_slider'
				value={volume}
				onChange={e => onVolumeChange(e, id)}
			/>
			<input
				type="checkbox"
				className='loop_checkbox'
				checked={isLooped}
				onChange={e => onLoopedChange(e, id)}
			/>
		</span>
	)
}

export default Sound