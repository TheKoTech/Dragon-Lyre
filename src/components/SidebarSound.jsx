import React from 'react'
import './css/SidebarSound.css';

/**
 * The SidebarSound is the SceneSidebar's list item that the user should
 * be able to drag into the scene.
 * @returns 
 */
export const SidebarSound = ({title, path}) => {
	return (
		<div className='sidebar-sound'>
			<h3>{title}</h3>
		</div>
	)
}
