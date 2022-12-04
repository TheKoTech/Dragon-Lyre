import React, { useState } from 'react';
import { IconButton } from './IconButton';
import { PopupMenu } from './PopupMenu/PopupMenu';

import './css/Sound.css'
import { PopupMenuItem } from './PopupMenu/PopupMenuItem';

/**
 * @param {Object} Sound
 * @param {number} Sound.id
 * @param {string} Sound.title
 * @param {number} Sound.volume
 * @param {number} Sound.minInterval
 * @param {number} Sound.maxInterval
 * @param {AudioBufferSourceNode | undefined} Sound.source
 */
function Sound({
	id,
	title,
	volume,
	minInterval,
	maxInterval,
	source,
	onTitleChange, onPlayBtn, onVolumeChange, onIntervalChange, onDelete, onEnded
}) {
	if (source) {
		source.onended = () => {
			onEnded(id, maxInterval);
		};
	}

	const [showPopupMenu, setShowPopupMenu] = useState(false);

	return (
		<span className='sound'>

			<div className='sound_title'>
				<input
					type='text'
					value={ title }
					onChange={ e => onTitleChange(e, id) }
				/>
				<IconButton iconName={ 'Effects' } onClick={ () => { } } />
				<IconButton iconName={ 'Options' } onClick={ () => setShowPopupMenu(true) } />
			</div>
			<PopupMenu
				show={ showPopupMenu }
				onClickOutside={ () => setShowPopupMenu(false) }
			>
				<PopupMenuItem
					text={ `Duplicate` }
					onClick={ () => null } />
				<PopupMenuItem
					text={ `Delete` }
					onClick={ () => onDelete(id) } />
			</PopupMenu>
			<input
				type='range'
				min={ 0.0 }
				max={ 1.0 }
				step={ 0.01 }
				className='volume_slider'
				value={ volume }
				onChange={ e => onVolumeChange(e, id) }
			/>
			<label>
				min interval:
			</label>
			<input
				type='number'
				className='min-interval-input'
				defaultValue={ minInterval } />
			<label>
				max interval:
			</label>
			<input
				type='number'
				className='max-interval-input'
				value={ maxInterval }
				onChange={ e => onIntervalChange(e, id) } />
		</span>
	);
}

export default Sound;