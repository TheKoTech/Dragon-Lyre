import React, { useState, useEffect } from 'react';
import './css/Sound.css';

function Sound({
	id, title, isPlayed, isLooped, volume, maxInterval, source,
	onTitleChange, onPlayBtn, onVolumeChange, onLoopedChange, onIntervalChange, onDelete
}) {
	const [seconds, setSeconds] = useState(undefined);

	useEffect(() => {
		if (seconds !== undefined) {
			const interval = setInterval(() => {
				console.log(seconds);
				if (seconds > 0) {
					setSeconds(seconds => seconds - 1);
				} else {
					setSeconds(undefined);
					onPlayBtn(id);
				}
			}, 1000);
			return () => clearInterval(interval);
		}
	});

	source.onended = () => {
		setSeconds(maxInterval);
	};

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
				value={ maxInterval }
				onChange={ e => onIntervalChange(e, id) } />
		</span>
	);
}

export default Sound;