import React, { useState } from 'react';
import { IconButton } from './IconButton';
import { PopupMenu } from './PopupMenu/PopupMenu';

import './css/Sound.css';
import { PopupMenuItem } from './PopupMenu/PopupMenuItem';

/**
 * @param {Object} Sound
 * @param {number} Sound.id
 * @param {string} Sound.title
 * @param {number} Sound.volume
 * @param {number} Sound.minInterval
 * @param {number} Sound.maxInterval
 */
function Sound({
	               id,
	               title,
	               volume,
	               minInterval,
	               maxInterval,
	               onTitleChange, onPlayBtn, onVolumeChange, onIntervalChange, onDelete
               }) {
	const [showPopupMenu, setShowPopupMenu] = useState(false);
	const [paramsTab, setParamsTab] = useState(true);

	return (
		<span className='sound'>
			<div className='sound_title'>
				<input
					type='text'
					value={ title }
					onChange={ e => onTitleChange(e, id) }
				/>
				<IconButton iconName={ 'Effects' } onClick={ () => setParamsTab(prevState => !prevState) }/>
				<IconButton iconName={ 'Options' } onClick={ () => setShowPopupMenu(true) }/>
			</div>
			<PopupMenu
				show={ showPopupMenu }
				onClickOutside={ () => setShowPopupMenu(false) }
			>
				<PopupMenuItem
					text={ `Duplicate` }
					onClick={ () => null }/>
				<PopupMenuItem
					text={ `Delete` }
					onClick={ () => onDelete(id) }/>
			</PopupMenu>
			{ paramsTab ? (
				<div className='sound-parameters'>
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
						defaultValue={ minInterval }/>
					<label>
						max interval:
					</label>
					<input
						type='number'
						className='max-interval-input'
						value={ maxInterval }
						onChange={ e => onIntervalChange(e, id) }/>
				</div>
			) : (
				<div className='sound-effects' style={ { color: `var(--clr-base-60)`, fontSize: `.9em` } }>
					effects list is to be rendered (it's not even designed yet)
				</div>
			)
			}
		</span>
	);
}

export default Sound;