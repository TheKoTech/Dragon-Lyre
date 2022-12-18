import React, { useState } from 'react'
import EffectsListItem from './EffectsListItem'
import AddEffectButton from './AddEffectButton'
import PopupMenu from '../PopupMenu/PopupMenu'
import PopupMenuItem from '../PopupMenu/PopupMenuItem'


/**
 * @param {Object} EffectsList
 * @param {Array[]} EffectsList.effectsList the list of effects applied to the sound
 * @param {function(effectName: string)} EffectsList.onAddEffect
 * @param {function} EffectsList.onEffectParamChange
 * @param {function} EffectsList.onDeleteEffect
 */
export default function EffectsList({ effectsList = [], onAddEffect, onEffectParamChange, onDeleteEffect }) {

	/** @type [number | undefined, React.Dispatch<React.SetStateAction<number | undefined>>] */
	const [openedEffect, setOpenedEffect] = useState(undefined);

	const [showAddEffect, setShowAddEffect] = useState(false);

	/** Sets the opened effect to effect ID */
	const handleEffectClick = (e, id) => {
		if (e.target.tagName === 'INPUT') return

		setOpenedEffect(
			openedEffect !== id ? id : undefined
		)
	}

	return (
		<div className='effects-list'>
			{ effectsList.map(effect =>
				<EffectsListItem
					key={ effect.id }
					name={ effect.name }
					effectParams={ effect.params }
					opened={ openedEffect === effect.id }
					onClick={ (e) => handleEffectClick(e, effect.id) }
					onParamChange={ (e, param) => onEffectParamChange(e, effect.id, param) }
					onDeleteEffect={ () => onDeleteEffect(effect.id)}
				/>
			) }
			<AddEffectButton onClick={ () => {
				setShowAddEffect(true)
			} }>
				{ showAddEffect ? (
					<PopupMenu show={ showAddEffect } onClickOutside={ () => { setShowAddEffect(false) } }>
						<PopupMenuItem text={ 'Echo' } onClick={ () => onAddEffect('Echo') } />
					</PopupMenu>
				) : (
					null
				) }
			</AddEffectButton>
		</div>
	)
}