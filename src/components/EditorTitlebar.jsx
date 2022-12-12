import React from 'react';
import IconButton from './IconButton';
import WindowControls from './WindowControls/WindowControls';

function EditorTitlebar({ onSave }) {
	return (
		<div className='editor-titlebar'>
			<div className='editor-tools'>
				<IconButton iconName='Arrow' />
				<IconButton iconName='Arrow' />
				<IconButton iconName='Save' onClick={ onSave } />
			</div>
			<WindowControls />
		</div>
	);
}

export default EditorTitlebar;