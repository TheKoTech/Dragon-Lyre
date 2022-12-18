import React, { useEffect, useState } from 'react';
import PopupMenuItem from '../PopupMenu/PopupMenuItem';
import IconButton from '../IconButton';
import PopupMenu from '../PopupMenu/PopupMenu';
import EffectsList from './EffectsList';
import './Sound.css';
import Slider from '../Sliders/Slider';
import DoubleSlider from '../Sliders/DoubleSlider';
import RangeSlider from 'react-range-slider-input/dist/components/RangeSlider';

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
 * @param {function(soundId: number, effectId: number)} Sound.onEffectClick
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
	onEffectClick,
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

	const [sliderValue, setSliderValue] = useState([15, 45]);

	function handleSliderChange(e) {
		console.log(e)
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
					<Slider
						value={ volume }
						min={ 0.0 }
						max={ 1.0 }
						step={ 0.01 }
						onChange={ (e) => { onVolumeChange(e, id); console.log('slider'); } }
					/>
					<RangeSlider
						min={ 0.0 }
						max={ 1.0 }
						step={ 0.01 }
						value={ sliderValue }
						onChange={ handleSliderChange }
					/>
				</div>
			) : (
				<EffectsList effectsList={ effectsList } onClick={ (effectId) => onEffectClick(id, effectId) } />
			)
			}
		</span>
	);
}

export default Sound;