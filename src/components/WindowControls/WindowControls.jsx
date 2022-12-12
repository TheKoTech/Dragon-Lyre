import React from 'react'
import WindowControlsButton from './WindowControlsButton'
import './WindowControls.css'

export default function WindowControls() {
	return (
		<div className='window-controls'>
			<WindowControlsButton iconName='Minimize' />
			<WindowControlsButton iconName='Fullscreen' />
			<WindowControlsButton iconName='Close' />
		</div>
	)
}
