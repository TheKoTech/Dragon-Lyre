import React, { useState } from 'react';
import EffectParam from '../../modules/effectParam'
import IconButton from '../IconButton'

/**
 * @param {Object} EffectsList
 * @param {string} EffectsList.name name of the effect
 * @param {boolean} EffectsList.opened if the item is opened
 * @param {EffectParam[]} EffectsList.effectParams the changable parameters of the effect
 * @param {Function} EffectsList.onParamChange effectParams change handler
 * @param {function} EffectsList.onDeleteEffect
 */
export default function EffectsListItem({ name, opened, effectParams = [], onParamChange, onDeleteEffect, ...props }) {
	return (
		<div className='effects-list-item' { ...props }>
			<span className='effects-list-item__title-row'>
				<label>{ name }</label>
				<IconButton iconName={'TEMP_Cross'} onClick={ onDeleteEffect }/>
			</span>
			{ opened ? (
				effectParams.map(param =>
					<input
						key={ param.name }
						type='range'
						className='effects-list__slider'
						min={ param.minValue }
						max={ param.maxValue }
						step={ (param.maxValue - param.minValue) / 100 }
						value={ param.value }
						onChange={ (e) => onParamChange(e, param) }
					/>
				)
			) : (
				null
			) }
		</div>
	)
}
