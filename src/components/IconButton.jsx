import React from 'react';
import * as Icons from '../assets/icons';
import './css/IconButton.css';

function IconButton({ iconName, label, onClick }) {
	return (
		<button
			onClick={ (e) => onClick(e) }
			className='icon-button'
		>
			{ Icons[iconName] }
			{ label ? <label>label</label> : '' }
		</button>
	);
}

export default IconButton;