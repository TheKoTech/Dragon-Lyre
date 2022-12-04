import React from 'react'

export const PopupMenuItem = ({ text, ...props }) => {
	console.log(props)
	return (
		<button { ...props }>{ text }</button>
	)
}
