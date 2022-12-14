import React from 'react';
import WindowControlsButton from './WindowControlsButton';
import './WindowControls.css';

export default function WindowControls() {

	const handleMinimizeBtn = () => {
		window['electronAPI'].minimize();
	}

	const handleMaximizeBtn = () => {
		window['electronAPI'].maximize();
	}

	const handleCloseBtn = () => {
		window['electronAPI'].close();
	}

	return (
		<div className='window-controls'>
			<WindowControlsButton iconName='Minimize'
			                      onClick={ handleMinimizeBtn }/>
			<WindowControlsButton iconName='Maximize'
			                      onClick={ handleMaximizeBtn }/>
			<WindowControlsButton iconName='Close'
			                      onClick={ handleCloseBtn }/>
		</div>
	);
}
