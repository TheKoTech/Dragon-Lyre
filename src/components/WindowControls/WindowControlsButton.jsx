import React from 'react'
import * as Icons from '../../assets/titlebarIcons'

export default function WindowControlsButton({ iconName, onClick }) {
	const Icon = Icons[iconName];
	return (
		<span className='window-controls-button' onClick={ onClick }>
			<Icon />
		</span>
	)
}
