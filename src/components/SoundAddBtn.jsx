import React from 'react';
import './css/SoundAddBtn.css';

function SoundAddBtn({ onClick }) {
	return (
		<span className='sound_add_btn' onClick={ onClick }>
			<p>Add Sound</p>
		</span>
	);
}

export default SoundAddBtn;