import React from 'react'

const AddEffectButton = ({ children, ...props }) => {
	return (
		<span className='effects-add-button' { ...props } >
			Add Effect...
			{ children }
		</span>
	)
}

export default AddEffectButton