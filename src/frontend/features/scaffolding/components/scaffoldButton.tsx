import { ButtonHTMLAttributes } from "react";

type ScaffoldButtonProps = {
	buttonText: string;
	disableCondition?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function ScaffoldButton({
	buttonText,
	id,
	type = "button",
	className,
	disableCondition,
	...props
}: ScaffoldButtonProps) {
	const buttonId: string = id ?? buttonText;
	const disabledCSS = disableCondition ? "cursor-not-allowed opacity-50" : "";
	const disabled: boolean = disableCondition === undefined ? false : disableCondition;
	const classNameOverrides = className !== undefined ? className : "";
	return (
		<>
			<button
				type={type}
				id={buttonId}
				{...props}
				className={`${classNameOverrides} ${disabledCSS} transition duration-90 active:scale-90 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 `}
				disabled={disabled}
			>
				{buttonText}
			</button>
		</>
	);
}
