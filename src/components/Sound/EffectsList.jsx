import React from 'react'
import EffectsListItem from './EffectsListItem'

export default function EffectsList({ effectsList, onClick }) {
	return (
		<div className='effects-list'>
			{ effectsList.map(effect =>
				<EffectsListItem key={ effect.id } name={ effect.name } onClick={ () => onClick(effect.id) } />
			) }
		</div>
	)
}