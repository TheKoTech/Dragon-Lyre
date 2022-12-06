import React, { useEffect, useRef } from 'react';
import './PopupMenu.css';

/**
 * @param {Object} PopupMenu
 * @param {PopupMenuItem[]} PopupMenu.children
 * @param {boolean} PopupMenu.isShown Whether the PopupMenu is shown.
 * @param {Function} PopupMenu.onClickOutside Called on click outside the popup menu.
 */
function PopupMenu({ children, isShown, onClickOutside }) {

	const wrapperRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(e) {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
				onClickOutside(e);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClickOutside]);


	if (!isShown)
		return null;

	return (
		<div ref={ wrapperRef } className='popup-menu'>
			{ children }
		</div>
	);
}

export default PopupMenu;
