import React, { useEffect, useState } from 'react';
import PopupMenuItem from '../PopupMenu/PopupMenuItem';
import IconButton from '../IconButton';
import PopupMenu from '../PopupMenu/PopupMenu';
import EffectsList from './EffectsList';
import './Sound.css';

/**
 * @param {Object} Sound
 * @param {number} Sound.id
 * @param {string} Sound.title
 * @param {number} Sound.volume
 * @param {number} Sound.minInterval
 * @param {number} Sound.maxInterval
 * @param {AudioBufferSourceNode} Sound.source
 * @param {Array} Sound.effectsList
 * @param {function(id: number)} Sound.onPlayBtn
 * @param {function(e: ChangeEvent<HTMLInputElement>, id: number)} Sound.onTitleChange
 * @param {function(e: ChangeEvent<HTMLInputElement>, id: number)} Sound.onVolumeChange
 * @param {function(e: ChangeEvent<HTMLInputElement>, id: number)} Sound.onMinIntervalChange
 * @param {function(e: ChangeEvent<HTMLInputElement>, id: number)} Sound.onMaxIntervalChange
 * @param {function(id: number)} Sound.onDelete
 * @param {function(id: number)} Sound.onSoundEnd
 * @param {function} Sound.onAddEffect
 * @param {function} Sound.onEffectParamChange
 * @param {function} Sound.onDeleteEffect
 */
function Sound({
	id,
	title,
	volume,
	minInterval,
	maxInterval,
	source,
	effectsList,
	onPlayBtn,
	onTitleChange,
	onVolumeChange,
	onMinIntervalChange,
	onMaxIntervalChange,
	onDelete,
	onSoundEnd,
	onAddEffect,
	onEffectParamChange,
	onDeleteEffect,
}) {

	/** @type [boolean, Dispatch<SetStateAction<boolean>>] */
	const [popupMenuIsShown, setPopupMenuIsShown] = useState(false);

	/** @type [boolean, Dispatch<SetStateAction<boolean>>]*/
	const [paramsTab, setParamsTab] = useState(true);

	/** @type [number, Dispatch<SetStateAction<number>>] */
	const [soundStartTime, setSoundStartTime] = useState();

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
			<div className='sound-title'>
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
				<IconButton iconName={ 'Effects' } onClick={ () => setParamsTab(prevState => !prevState) } />
				<IconButton iconName={ 'Options' } onClick={ () => setPopupMenuIsShown(true) } />
			</div>
			<PopupMenu
				show={ popupMenuIsShown }
				onClickOutside={ () => setPopupMenuIsShown(false) }
			>
				<PopupMenuItem
					text={ `Duplicate` }
					onClick={ () => null }
				/>
				<PopupMenuItem
					text={ `Delete` }
					onClick={ () => onDelete(id) }
				/>
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
						onChange={ (e) => onMinIntervalChange(e, id) }
					/>
					<label>
						max interval:
					</label>
					<input
						type='number'
						className='max-interval-input'
						defaultValue={ maxInterval }
						onChange={ (e) => onMaxIntervalChange(e, id) }
					/>
				</div>
			) : (
				<EffectsList
					effectsList={ effectsList }
					onAddEffect={ (effectName) => onAddEffect(id, effectName) }
					onEffectParamChange={ (e, effectId, param) => { onEffectParamChange(e, id, effectId, param) } }
					onDeleteEffect={ (effectId) => onDeleteEffect(id, effectId) }
				/>
			)
			}
		</span>
	);
}

export default Sound;