"use client"

import ScaffoldButton from './scaffoldButton';
import ScaffoldButtonCard from './scaffoldButtonCard';
import { useState } from "react";

export default function ScaffoldButtonCounter() {

    const [counter, setCounter] = useState(0);

    function handleIncreaseCounter() {
        setCounter(counter + 1);
    }

	return (
		<>
            <div className = "flex space-x-20">
			<ScaffoldButton buttonText = "Scaffold Button: Increase Pressed Count" onClick={handleIncreaseCounter} />
            <ScaffoldButtonCard text={`Count: ${counter}` } /> 
            </div>
		</>
	);
}
