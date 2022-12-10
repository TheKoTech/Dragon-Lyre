import React from 'react';
import * as Icons from '../assets/icons';
import './css/IconButton.css';

function IconButton({ iconName, label, active, onClick }) {
	return (
		<button
			onClick={ (e) => onClick(e) }
			className={ `icon-button${ active ? ` active` : `` }` }
		>
			{ Icons[iconName] }
			{ label ? <label>label</label> : '' }
		</button>
	);
}

export default IconButton;