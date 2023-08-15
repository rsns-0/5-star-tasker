export default function ScaffoldButtonCard({text}:{text:string}) {
    return (
	<div className=" py-1 px-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
		<p className="text-center font-normal text-gray-700 dark:text-gray-400">{text}</p>
	</div>
    )
}
