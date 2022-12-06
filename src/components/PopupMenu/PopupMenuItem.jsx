import React from 'react';

function PopupMenuItem({ text, ...props }) {
	return (
		<button { ...props }>{ text }</button>
	);
}

export default PopupMenuItem;
