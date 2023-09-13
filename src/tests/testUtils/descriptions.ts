export function formatTestDescription(description: string = "N/A") {
	return `INDEX: %# \nDESCRIPTION: ${description} \nDATA:\n_______________\n\n%s\n\n________________________\n\n`;
}
