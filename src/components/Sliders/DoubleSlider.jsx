import React, { useState } from 'react'
import './Slider.css'
import Tooltip from '../Tooltip'

export default function DoubltSlider({ leftValue, rightValue, onChange, min = 0, max = 100, step }) {

	const [showTooltip, setShowTooltip] = useState(false);

	function handleChange(leftVal, rightVal) {
		onChange(leftVal, rightVal)
	}

	return (
		<div
			className='slider-container'
			onMouseEnter={ () => setShowTooltip(true) }
			onMouseLeave={ () => setShowTooltip(false) }
		>
			<span className='slider-track'>
				<span
					className='slider-track-fill'
					style={ {
						right: `${ ((max - rightValue) - min) / max * 100 }%`,
						left: `${ ((leftValue - min) / max * 100) }%`
					} }></span>
			</span>
			<div className='slider-input-container'>
				<input
					className='slider'
					type='range'
					min={ (leftValue + rightValue) / 2 }
					max={ max }
					value={ rightValue }
					step={ step }
					style={ {right: `${(leftValue + rightValue) / 2 / max * 100}%`} }
					onChange={ (e) => handleChange(leftValue, e.target.value) }
					draggable={ false }
				/>
				<input
					className='slider'
					type='range'
					min={ min }
					max={ (leftValue + rightValue) / 2 }
					step={ step }
					value={ leftValue }
					style={ {left: `${(leftValue + rightValue) / 2 / max * 100}%`} }
					onChange={ (e) => handleChange(e.target.value, rightValue) }
					draggable={ false }
				/>
			</div>
			<div className='slider-handle-container'>
				<span
					className='slider-handle'
					style={ { left: `${ (leftValue - min) / max * 100 }%` } }
				>
					{ showTooltip ? <Tooltip label={ leftValue } /> : null }
				</span>
				<span
					className='slider-handle'
					style={ { left: `${ (rightValue - min) / max * 100 }%` } }
				>
					{ showTooltip ? <Tooltip label={ rightValue } /> : null }
				</span>
			</div>
		</div>
	);
}
