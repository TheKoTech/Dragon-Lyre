import React from 'react';


function Sound({
	               id, title, isPlayed, isLooped, volume, interval,
	               onTitleChange, onPlayBtn, onVolumeChange, onLoopedChange, onIntervalChange, onDelete
               }) {
	return (
		<span className='sound'>
			<div className='sound_title'>
				<input
					type='text'
					value={ title }
					onChange={ e => onTitleChange(e, id) }
				/>
				<a className='close_btn' onClick={ () => onDelete(id) }>
					X
				</a>
			</div>
			<input
				className='play_btn'
				type='button'
				value={ isPlayed ? 'Stop' : 'Play' }
				onClick={ () => onPlayBtn(id) }
			/>
			<input
				type='range'
				min={ 0.0 }
				max={ 1.0 }
				step={ 0.01 }
				className='volume_slider'
				value={ volume }
				onChange={ e => onVolumeChange(e, id) }
			/>
			<input
				type='checkbox'
				className='loop_checkbox'
				checked={ isLooped }
				onChange={ e => onLoopedChange(e, id) }
			/>
			<label>
				interval:
			</label>
			<input
				type='text'
				className='interval-input'
				value={ interval }
				onChange={ e => onIntervalChange(e, id) }/>
		</span>
	);
}

export default Sound;