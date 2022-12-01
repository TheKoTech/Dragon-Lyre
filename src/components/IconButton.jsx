import React from 'react'
import * as Icons from '../resources/icons'
import './css/IconButton.css'

export const IconButton = ({ iconName, label, onClick }) => {
	console.log(Icons[iconName]);
	return (
		<span
			onClick={ (e) => onClick(e) }
			className='icon-button'
		>
			{ Icons[iconName] }
			{ label ? <label>label</label> : '' }
		</span>
	);
}
