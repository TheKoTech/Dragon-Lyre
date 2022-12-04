import React from 'react';
import { useState } from 'react';
import './css/SceneSidebar.css'
import { SidebarSound } from './SidebarSound';

export const SceneSidebar = (props) => {

	const [soundsList, setSoundsList] = useState([{
		title: 'test_title.ogg',
		path: 'none',
	}]);

	return (
		<div className='sidebar'>
			<div className='sidebar__content'>
				<h1>
					Sounds
				</h1>
				<div className='sidebar__content_sounds-list'>
					{soundsList.map(props => 
						<SidebarSound 
							key={props.path}
							title={props.title}
							path={props.path}
						/>)}
				</div>
			</div>
		</div>
	)
}
