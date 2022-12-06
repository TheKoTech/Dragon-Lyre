import React from 'react';
import IconButton from './IconButton';

function Toolbar({ onSave }) {
	return (
		<div>
			<IconButton onClick={ onSave } iconName='Save'/>
		</div>
	);
}

export default Toolbar;
