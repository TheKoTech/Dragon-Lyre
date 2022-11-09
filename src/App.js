import { useState } from 'react';
import './App.css';
import Scene from './components/Scene';


function App() {
	const [audioContext, setAudioContext] = useState(new AudioContext());
	return (
		<div className="App">
			<Scene audioContext={audioContext}/>
		</div>
	);
}

export default App;
