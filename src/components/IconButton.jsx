import React from 'react';
import * as Icons from '../assets/icons';
import './css/IconButton.css';

export const IconButton = ({ iconName, label, onClick }) => {
	return (
		<span
			onClick={ (e) => onClick(e) }
			className='icon-button'
		>
			{ Icons[iconName] }
			{ label ? <label>label</label> : '' }
		</span>
	);
};
