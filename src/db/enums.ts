export const roles = {
	developer: "developer",
	user: "user",
} as const
export type roles = (typeof roles)[keyof typeof roles]
export const continents = {
	Africa: "Africa",
	Antarctica: "Antarctica",
	Asia: "Asia",
	Europe: "Europe",
	Oceania: "Oceania",
	North_America: "North America",
	South_America: "South America",
} as const
export type continents = (typeof continents)[keyof typeof continents]
