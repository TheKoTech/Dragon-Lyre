import React from 'react';
import * as Icons from '../assets/icons';
import './css/IconButton.css';

function IconButton({ iconName, label, active, onClick }) {
	const Icon = Icons[iconName];
	return (
		<button
			onClick={ (e) => onClick(e) }
			className={ `icon-button${ active ? ` active` : `` }` }
		>
			{ <Icon /> }
			{ label ? <label>label</label> : '' }
		</button>
	);
}

export default IconButton;