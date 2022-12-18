import React, { useState } from 'react'
import './Slider.css'
import Tooltip from '../Tooltip'

export default function Slider({ value, onChange, min = 0, max = 100, ...props }) {

	const [showTooltip, setShowTooltip] = useState(false);

	function handleChange(e) {
		onChange(e)
	}

	return (
		<div
			className='slider-container'
			onMouseEnter={ () => setShowTooltip(true) }
			onMouseLeave={ () => setShowTooltip(false) }
		>
			<span className='slider-track'>
				<span className='slider-track-fill' style={ { right: `${ ((max - value) - min) / max * 100 }%` } }></span>
			</span>
			<div className='slider-input-container'>
				<input
					className='slider'
					type='range'
					min={ min }
					max={ max }
					value={ value }
					onChange={ handleChange }
					draggable={ false }
					{ ...props }
				/>
			</div>
			<div className='slider-handle-container'>
				<span
					className='slider-handle'
					style={ { left: `${ (value - min) / max * 100 }%` } }
				>
					{ showTooltip ? <Tooltip label={ value } /> : null }
				</span>
			</div>
		</div>
	);
}
