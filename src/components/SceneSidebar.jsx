import React, { useEffect, useState } from 'react';
import './css/SceneSidebar.css';
import { SidebarSound } from './SidebarSound';

export const SceneSidebar = () => {
	/**
	 * @typedef {Object} FileParameters
	 * @property {number} id
	 * @property {string} title
	 * @property {string} path
	 */

	/**
	 * @type [FileParameters[], Dispatch<SetStateAction<FileParameters[]>>]
	 */
	const fileState = useState([]);
	const [fileList, setFileList] = fileState;

	useEffect(() => {
		const files = window['electronAPI'].getFilesFromFolder('./public/sounds');
		files.then(resolve => {
			setFileList(resolve.map(file => {
				return {
					id: file,
					title: file.substring(0, file.lastIndexOf('.')),
					path: './public/sounds/' + file
				};
			}));
		});
	}, [setFileList]);


	return (
		<div className='sidebar'>
			<div className='sidebar__content'>
				<h1>
					Sounds
				</h1>
				<div className='sidebar__content_sounds-list'>
					{ fileList.map(props =>
						<SidebarSound
							key={ props.id }
							title={ props.title }
							path={ props.path }
						/>
					) }
				</div>
			</div>
		</div>
	);
};
