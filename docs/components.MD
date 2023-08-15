# Creating React Components

Docs: https://react.dev/reference/react

## Be careful with client vs server components
React has traditionally been a client-side rendering library. Next.js allows server side rendering but this can cause unexpected errors.

In general, if interactivity is needed (ex: hooks like useState / useEffect) then add "use client" to the top of the component file.

Only the highest level container component needs to be labeled with "use client".

Explanatory video: https://www.youtube.com/watch?v=3Dw6D_WuzSE

## Style Guide
Design components and pages within the components folder. Place the final product in the app folder. Use the app folder only for routing.

## Example:
An "app" component in the component folder.

```typescript
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
```

A page content component in the component folder.

```typescript
import ScaffoldButtonCounter from "./scaffoldingButtonCounter";

export default function ScaffoldPageContent() {
	return (
		<div>
			<h1 className= "text-5xl">Example scaffold page.</h1>
            <br />
			<ScaffoldButtonCounter />
		</div>
	);
}
```

Final content in app folder:

```typescript
import ScaffoldPageContent from 'src/frontend/features/scaffolding/components/scaffoldPageContent';

export default function ScaffoldPage() {
	return (
		<>
        <ScaffoldPageContent/>
        </>
	);
}
```