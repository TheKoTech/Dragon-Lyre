import React, { useEffect, useState } from 'react';
import './css/Sound.css';

import IconButton from './IconButton';
import PopupMenu from './PopupMenu/PopupMenu';
import PopupMenuItem from './PopupMenu/PopupMenuItem';

/**
 * @param {Object} Sound
 * @param {number} Sound.id
 * @param {string} Sound.title
 * @param {number} Sound.volume
 * @param {number} Sound.minInterval
 * @param {number} Sound.maxInterval
 * @param {AudioBufferSourceNode} Sound.source
 * @param {function(id: number)} Sound.onPlayBtn
 * @param {function(e: ChangeEvent<HTMLInputElement>, id: number)} Sound.onTitleChange
 * @param {function(e: ChangeEvent<HTMLInputElement>, id: number)} Sound.onVolumeChange
 * @param {function(e: ChangeEvent<HTMLInputElement>, id: number)} Sound.onMinIntervalChange
 * @param {function(e: ChangeEvent<HTMLInputElement>, id: number)} Sound.onMaxIntervalChange
 * @param {function(id: number)} Sound.onDelete
 * @param {function(id: number)} Sound.onSoundEnd
 */
function Sound({
	               id,
	               title,
	               volume,
	               minInterval,
	               maxInterval,
	               source,
	               onPlayBtn,
	               onTitleChange,
	               onVolumeChange,
	               onMinIntervalChange,
	               onMaxIntervalChange,
	               onDelete,
	               onSoundEnd
               }) {

	/**
	 * @type [boolean, Dispatch<SetStateAction<boolean>>]
	 */
	const popupMenuIsShownState = useState(false);
	const [popupMenuIsShown, setPopupMenuIsShown] = popupMenuIsShownState;
	/**
	 * @type [boolean, Dispatch<SetStateAction<boolean>>]
	 */
	const paramsTabState = useState(true);
	const [paramsTab, setParamsTab] = paramsTabState;
	/**
	 * @type [number, Dispatch<SetStateAction<number>>]
	 */
	const timeToStartSoundState = useState(undefined);
	const [soundStartTime, setSoundStartTime] = timeToStartSoundState;

	useEffect(() => {
		if (soundStartTime !== undefined) {
			const interval = setInterval(() => {
				if (soundStartTime < Date.now()) {
					setSoundStartTime(undefined);
					onSoundEnd(id);
				}
			}, 50);
			return () => clearInterval(interval);
		}
	});

	if (source) {
		source.onended = () => {
			const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;
			setSoundStartTime(Date.now() + randomInterval * 1000);
		};
	}


	return (
		<span className='sound'>
			<div className='sound_title'>
				<input
					type='button'
					value='Play'
					onClick={ () => onPlayBtn(id) }
				/>
				<input
					type='text'
					value={ title }
					onChange={ (e) => onTitleChange(e, id) }
				/>
				<IconButton iconName={ 'Effects' } onClick={ () => setParamsTab(prevState => !prevState) }/>
				<IconButton iconName={ 'Options' } onClick={ () => setPopupMenuIsShown(true) }/>
			</div>
			<PopupMenu
				show={ popupMenuIsShown }
				onClickOutside={ () => setPopupMenuIsShown(false) }
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
						onChange={ (e) => onVolumeChange(e, id) }
					/>
					<label>
						min interval:
					</label>
					<input
						type='number'
						className='min-interval-input'
						defaultValue={ minInterval }
						onChange={ (e) => onMinIntervalChange(e, id) }/>
					<label>
						max interval:
					</label>
					<input
						type='number'
						className='max-interval-input'
						defaultValue={ maxInterval }
						onChange={ (e) => onMaxIntervalChange(e, id) }/>
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