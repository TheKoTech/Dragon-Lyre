import React from 'react'
import { IconButton } from './IconButton'

export const Toolbar = ({ onSave }) => {
	return (
		<div>
			<IconButton onClick={ onSave } iconName='Save'/>
		</div>
	)
}
