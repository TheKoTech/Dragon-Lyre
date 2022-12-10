import React from 'react'

export default function EffectsListItem({ name, ...props }) {
	return (
		<button { ...props }>
			{ name }
		</button>
	)
}
