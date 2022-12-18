import React from 'react'
import './css/Tooltip.css'

export default function Tooltip({ label }) {
	return (
		<div className='tooltip'>
			{ label }
		</div>
	)
}
