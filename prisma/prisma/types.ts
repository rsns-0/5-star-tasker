import type { ColumnType } from "kysely"
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

import type { roles, continents } from "./enums"

export type Account = {
	id: string
	userId: string
	providerAccountId: string
	access_token: string | null
	expires_at: number | null
	id_token: string | null
	provider: string
	refresh_token: string | null
	scope: string | null
	session_state: string | null
	token_type: string | null
	type: string
}
export type combined_data = {
	id: number
	c_id: number | null
	l_id: string | null
	source: string | null
}
export type Command = {
	name: string
	description: string
	id: Generated<number>
}
export type CommandArgument = {
	name: string
	description: Generated<string>
	id: Generated<number>
	command_id: number
}
export type CongressIsoMappings = {
	id: Generated<number>
	iso_639_2: string
	iso_639_1: string | null
	english_name_of_language: string
	french_name_of_language: string
	german_name_of_language: string
	languages_id: string | null
}
export type countries = {
	id: Generated<string>
	name: string
	iso2: string
	iso3: string
	local_name: string | null
	continent: continents | null
	flag: string | null
}
export type country_aggregated = {
	id: number
	cca3: string
	cca2: string
	name: string
	weight: string
}
export type country_emoji = {
	id: Generated<number>
	iso: string
	emoji: string
	unicode: string
	name: string
	rest_countries_api_new_data_id: number
}
export type country_entries = {
	id: number
	type: string
	iso2: string
	name: string
	row_number: string
}
export type country_primary_languages = {
	country_id: number
	country_name: string | null
	primary_language: string | null
	primary_language_id: string | null
	country_name_weight: string | null
	language_name_weight: string | null
	primary_language_weight: number | null
}
export type country_primary_languages_resolved_ties = {
	country_id: number
	language_id: string | null
	weight: string | null
	country_name: string | null
	language_name: string | null
	rank: string | null
}
export type deep_l_supported_languages = {
	id: Generated<number>
	name: string
	abbreviation: string
	languages_id: string | null
}
export type discord_channels = {
	id: string
	name: Generated<string>
	created_at: Generated<Timestamp>
	discord_guild_id: string
}
export type discord_flag_emojis = {
	id: Generated<string>
	created_at: Generated<Timestamp>
	value: string
	languagesId: string | null
	country_id: number | null
}
export type discord_guilds = {
	id: string
	created_at: Generated<Timestamp>
	name: Generated<string>
	owner_id: string | null
	iconURL: string | null
}
export type discord_guilds_members = {
	A: string
	B: string
}
export type discord_messages = {
	id: string
	created_at: Generated<Timestamp>
	text: Generated<string>
	discord_channel_id: string | null
	discord_guild_id: string | null
	owner_id: string | null
}
export type discord_user = {
	id: string
	created_at: Generated<Timestamp>
	username: Generated<string | null>
	timezone_id: string | null
}
export type flag_language = {
	id: number
	flag_key: string
	flag_emoji: string
	country_name: string
	primary_language: string
	primary_language_id: number
	cca2: string
	cca3: string
	iso1: string | null
	iso2: string
	iso2b: string | null
	is_supported_by_deep_l: boolean
	country_name_weight: number
	language_name_weight: number
	primary_language_weight: number
}
export type flag_language_materialized = {
	id: number
	flag_key: string
	flag_emoji: string
	country_name: string
	primary_language: string
	primary_language_id: number
	cca2: string
	cca3: string
	iso1: string | null
	iso2: string
	iso2b: string | null
	is_supported_by_deep_l: boolean
	country_name_weight: number
	language_name_weight: number
	primary_language_weight: number
}
export type full_country_primary_languages = {
	country_id: number
	country_name: string
	primary_language: string
	primary_language_id: number
	country_name_weight: number
	language_name_weight: number
	primary_language_weight: number
	cca2: string
	cca3: string
	iso1: string | null
	iso2: string
	iso2b: string | null
}
export type full_country_primary_languages_materialized = {
	country_id: number
	country_name: string
	primary_language: string
	primary_language_id: number
	country_name_weight: number
	language_name_weight: number
	primary_language_weight: number
	cca2: string
	cca3: string
	iso1: string | null
	iso2: string
	iso2b: string | null
}
export type IBANCountryCodeData = {
	id: Generated<number>
	alpha_2_code: string
	alpha_3_code: string
	numeric: number
	country: string
	rest_countries_api_new_data_id: number | null
}
export type language_aggregated = {
	id: string
	iso_639_1: string | null
	iso_639_2: string
	name: string
	weight: string
	iso_639_2b: string | null
}
export type language_and_country_representations = {
	id: number
	type: string
	iso2: string
	names: string[]
}
export type language_entries = {
	id: string
	type: string
	iso2: string
	name: string
	row_number: string
}
export type language_entries_per_country = {
	id: number
	entries: unknown | null
	name: string | null
}
export type languages = {
	id: Generated<string>
	created_at: Generated<Timestamp>
	name: string
	iso_639_1: string | null
	iso_639_2: string | null
	is_supported_by_deep_l: Generated<boolean | null>
	iso_639_2b: string | null
}
export type languagesTorest_countries_api_new_data = {
	A: string
	B: number
}
export type LingoHubIsoMappings = {
	id: Generated<number>
	iso1: string
	language: string
	languages_id: string | null
}
export type logs = {
	id: Generated<string>
	created_at: Generated<Timestamp>
	level: Generated<number>
	message: Generated<string>
	json: unknown | null
	tags: Generated<string[]>
	unsafe_json: unknown | null
}
export type NewCiaLanguageData = {
	id: Generated<number>
	country: string
	primary_language: string
	languages_id: string | null
	rest_countries_api_new_data_id: number | null
}
export type outdated_resolve_tie_data = {
	id: number
	rest_countries_api_new_data_id: number | null
	languages_id: string | null
}
export type primary_language_raw = {
	country_id: number
	language_id: string | null
	weight: string | null
	rank: string | null
	language_name: string | null
	country_name: string | null
}
export type reminders = {
	created_at: Generated<Timestamp>
	user_id: string
	channel_id: string
	reminder_message: Generated<string>
	webhook_id: string
	id: Generated<number>
	time: Timestamp
}
export type resolve_tie_data = {
	id: Generated<number>
	created_at: Generated<Timestamp>
	updated_at: Timestamp
	rest_countries_api_new_data_id: number
	languages_id: string | null
}
export type rest_countries_api_data_languages = {
	id: Generated<number>
	name: string
	abbreviation: string
	languages_id: string | null
}
export type rest_countries_api_data_names = {
	id: Generated<number>
	common: string
	official: string
	nativeName: unknown
}
export type rest_countries_api_new_data = {
	id: Generated<number>
	cca2: string
	ccn3: string | null
	cca3: string
	cioc: string | null
	independent: boolean | null
	unMember: boolean
	capital: string[]
	altSpellings: string[]
	subregion: string | null
	translations: unknown
	latlng: number[]
	landlocked: boolean
	borders: string[]
	area: number
	flag: string
	population: number
	gini: unknown | null
	fifa: string | null
	timezones: string[]
	capitalInfo: unknown
	car: unknown
	coatOfArms: unknown
	flags: unknown
	idd: unknown
	maps: unknown
	name: string
	postalCode: unknown | null
	status: string
	region: string
	continents: string[]
	startOfWeek: unknown
	currencies: unknown | null
	demonyms: unknown | null
	rest_countries_api_data_names_id: number
	spoken_languages: unknown | null
}
export type Session = {
	id: string
	userId: string
	expires: Timestamp
	sessionToken: string
}
export type test_pagination = {
	id: Generated<string>
	created_at: Generated<Timestamp>
	name: Generated<string | null>
	value: Generated<string | null>
	text: Generated<string | null>
}
export type test_table = {
	id: Generated<string>
	created_at: Generated<Timestamp>
	name: Generated<string | null>
	value: Generated<string | null>
	text: Generated<string | null>
}
export type ties2 = {
	country_id: number
	language_id: string | null
	weight: string | null
	country_name: string | null
	language_name: string | null
}
export type timezones = {
	id: Generated<string>
	created_at: Generated<Timestamp>
	label: string
	description: string
	emoji: string
	value: string
}
export type unresolved_ties = {
	country_id: number
	country_name: string
}
export type unstructured_storage = {
	id: Generated<string>
	created_at: Generated<Timestamp>
	name: Generated<string>
	text: Generated<string>
	tags: Generated<string[]>
	json: unknown | null
}
export type up_to_date_resolve_tie_data = {
	id: number
	rest_countries_api_new_data_id: number | null
	languages_id: string | null
}
export type User = {
	id: string
	name: string | null
	email: string | null
	emailVerified: Timestamp | null
	image: string | null
	role: Generated<roles>
}
export type validate_country_primary_languages_resolved_ties = {
	country_id: number
	country_count: string
}
export type VerificationToken = {
	identifier: string
	token: string
	expires: Timestamp
}
export type WalsLanguageData = {
	id: Generated<number>
	name: string
	wals_code: string
	iso6393: string | null
	genus: string
	family: string
	macroarea: string
	latitude: string
	longitude: string
	countries: string
	languages_id: string | null
}
export type webhooks = {
	id: string
	created_at: Generated<Timestamp>
	name: Generated<string>
	url: string
	discord_channel_id: string
	token: string | null
}
export type WikiData = {
	id: Generated<number>
	widely_spoken: string
	country_or_region: string
	minority_language: string
	national_language: string
	official_language: string
	regional_language: string
	primary_language: string
	languages_id: string | null
	rest_countries_api_new_data_id: number | null
}
export type WikiIsoData = {
	id: Generated<number>
	name: string
	official_state_name: string
	sovereignty: string
	iso2: string
	iso3: string
	numeric_code: string
	subdivision_code_links: string
	internet_cc_tld: string
	rest_countries_data_id: number
}
export type DB = {
	_discord_guilds_members: discord_guilds_members
	_languagesTorest_countries_api_new_data: languagesTorest_countries_api_new_data
	Account: Account
	combined_data: combined_data
	command_arguments: CommandArgument
	commands: Command
	congress_iso_mappings: CongressIsoMappings
	countries: countries
	country_aggregated: country_aggregated
	country_emoji: country_emoji
	country_entries: country_entries
	country_primary_languages: country_primary_languages
	country_primary_languages_resolved_ties: country_primary_languages_resolved_ties
	deep_l_supported_languages: deep_l_supported_languages
	discord_channels: discord_channels
	discord_flag_emojis: discord_flag_emojis
	discord_guilds: discord_guilds
	discord_messages: discord_messages
	discord_user: discord_user
	flag_language: flag_language
	flag_language_materialized: flag_language_materialized
	full_country_primary_languages: full_country_primary_languages
	full_country_primary_languages_materialized: full_country_primary_languages_materialized
	iban_country_code_data: IBANCountryCodeData
	language_aggregated: language_aggregated
	language_and_country_representations: language_and_country_representations
	language_entries: language_entries
	language_entries_per_country: language_entries_per_country
	languages: languages
	lingohub_iso_mappings: LingoHubIsoMappings
	logs: logs
	new_cia_language_data: NewCiaLanguageData
	outdated_resolve_tie_data: outdated_resolve_tie_data
	primary_language_raw: primary_language_raw
	reminders: reminders
	resolve_tie_data: resolve_tie_data
	rest_countries_api_data_languages: rest_countries_api_data_languages
	rest_countries_api_data_names: rest_countries_api_data_names
	rest_countries_api_new_data: rest_countries_api_new_data
	Session: Session
	test_pagination: test_pagination
	test_table: test_table
	ties2: ties2
	timezones: timezones
	unresolved_ties: unresolved_ties
	unstructured_storage: unstructured_storage
	up_to_date_resolve_tie_data: up_to_date_resolve_tie_data
	User: User
	validate_country_primary_languages_resolved_ties: validate_country_primary_languages_resolved_ties
	VerificationToken: VerificationToken
	wals_language_data: WalsLanguageData
	webhooks: webhooks
	wiki_data: WikiData
	wiki_iso_data: WikiIsoData
}
