export type JSONRestCountriesAPIData = {
	name: Name;
	tld?: string[];
	cca2: string;
	ccn3?: string;
	cca3: string;
	cioc?: string;
	independent?: boolean;
	status: Status;
	unMember: boolean;
	currencies?: Currencies;
	idd: Idd;
	capital?: string[];
	altSpellings: string[];
	region: Region;
	subregion?: string;
	languages?: { [key: string]: string };
	translations: { [key: string]: Translation };
	latlng: number[];
	landlocked: boolean;
	borders?: string[];
	area: number;
	demonyms?: Demonyms;
	flag: string;
	maps: Maps;
	population: number;
	gini?: { [key: string]: number };
	fifa?: string;
	car: Car;
	timezones: string[];
	continents: Continent[];
	flags: Flags;
	coatOfArms: CoatOfArms;
	startOfWeek: StartOfWeek;
	capitalInfo: CapitalInfo;
	postalCode?: PostalCode;
};

export type CapitalInfo = {
	latlng?: number[];
};

export type Car = {
	signs?: string[];
	side: Side;
};

export type Side = 'left' | 'right';

export type CoatOfArms = {
	png?: string;
	svg?: string;
};

export type Continent = 'Asia' | 'Oceania' | 'Europe' | 'Africa' | 'North America' | 'Antarctica' | 'South America';

export type Currencies = {
	NPR?: Aed;
	AUD?: Aed;
	KID?: Aed;
	TMT?: Aed;
	NZD?: Aed;
	EUR?: Aed;
	XOF?: Aed;
	EGP?: Aed;
	HTG?: Aed;
	AZN?: Aed;
	LAK?: Aed;
	USD?: Aed;
	XCD?: Aed;
	SHP?: Aed;
	BGN?: Aed;
	TND?: Aed;
	XAF?: Aed;
	CVE?: Aed;
	MUR?: Aed;
	AED?: Aed;
	BMD?: Aed;
	BYN?: Aed;
	PEN?: Aed;
	SSP?: Aed;
	VUV?: Aed;
	KES?: Aed;
	IDR?: Aed;
	MZN?: Aed;
	DKK?: Aed;
	FOK?: Aed;
	MGA?: Aed;
	PAB?: Aed;
	BAM?: BAM;
	BBD?: Aed;
	GMD?: Aed;
	AMD?: Aed;
	LSL?: Aed;
	ZAR?: Aed;
	GBP?: Aed;
	HKD?: Aed;
	SOS?: Aed;
	COP?: Aed;
	MDL?: Aed;
	BND?: Aed;
	SGD?: Aed;
	YER?: Aed;
	RSD?: Aed;
	DJF?: Aed;
	KRW?: Aed;
	BIF?: Aed;
	UZS?: Aed;
	KMF?: Aed;
	JPY?: Aed;
	ANG?: Aed;
	MKD?: Aed;
	ALL?: Aed;
	CLP?: Aed;
	TOP?: Aed;
	ILS?: Aed;
	JOD?: Aed;
	BZD?: Aed;
	CDF?: Aed;
	ERN?: Aed;
	MXN?: Aed;
	PGK?: Aed;
	PHP?: Aed;
	CZK?: Aed;
	KHR?: Aed;
	ZMW?: Aed;
	DZD?: Aed;
	CNY?: Aed;
	INR?: Aed;
	NOK?: Aed;
	NGN?: Aed;
	AOA?: Aed;
	PYG?: Aed;
	AFN?: Aed;
	GYD?: Aed;
	KPW?: Aed;
	XPF?: Aed;
	GTQ?: Aed;
	SZL?: Aed;
	HNL?: Aed;
	ISK?: Aed;
	QAR?: Aed;
	VND?: Aed;
	KWD?: Aed;
	OMR?: Aed;
	AWG?: Aed;
	BWP?: Aed;
	UGX?: Aed;
	FKP?: Aed;
	PKR?: Aed;
	TRY?: Aed;
	WST?: Aed;
	SLL?: Aed;
	JMD?: Aed;
	TWD?: Aed;
	SDG?: BAM;
	PLN?: Aed;
	IQD?: Aed;
	KGS?: Aed;
	BRL?: Aed;
	FJD?: Aed;
	UAH?: Aed;
	BHD?: Aed;
	GEL?: Aed;
	LYD?: Aed;
	GHS?: Aed;
	UYU?: Aed;
	BTN?: Aed;
	SCR?: Aed;
	MVR?: Aed;
	LRD?: Aed;
	NIO?: Aed;
	MNT?: Aed;
	CHF?: Aed;
	GGP?: Aed;
	CRC?: Aed;
	CUC?: Aed;
	CUP?: Aed;
	HUF?: Aed;
	ETB?: Aed;
	MYR?: Aed;
	JEP?: Aed;
	TJS?: Aed;
	NAD?: Aed;
	SAR?: Aed;
	MAD?: Aed;
	MRU?: Aed;
	TTD?: Aed;
	MOP?: Aed;
	ZWL?: Aed;
	DOP?: Aed;
	ARS?: Aed;
	TVD?: Aed;
	BSD?: Aed;
	BOB?: Aed;
	IRR?: Aed;
	SRD?: Aed;
	SEK?: Aed;
	STN?: Aed;
	LKR?: Aed;
	THB?: Aed;
	TZS?: Aed;
	MMK?: Aed;
	GIP?: Aed;
	IMP?: Aed;
	SBD?: Aed;
	CAD?: Aed;
	SYP?: Aed;
	VES?: Aed;
	LBP?: Aed;
	KYD?: Aed;
	RWF?: Aed;
	RUB?: Aed;
	GNF?: Aed;
	RON?: Aed;
	KZT?: Aed;
	BDT?: Aed;
	MWK?: Aed;
	CKD?: Aed;
};

export type Aed = {
	name: string;
	symbol: string;
};

export type BAM = {
	name: string;
};

export type Demonyms = {
	eng: Eng;
	fra?: Eng;
};

export type Eng = {
	f: string;
	m: string;
};

export type Flags = {
	png: string;
	svg: string;
	alt?: string;
};

export type Idd = {
	root?: string;
	suffixes?: string[];
};

export type Maps = {
	googleMaps: string;
	openStreetMaps: string;
};

export type Name = {
	common: string;
	official: string;
	nativeName?: { [key: string]: Translation };
};

export type Translation = {
	official: string;
	common: string;
};

export type PostalCode = {
	format: string;
	regex?: string;
};

export type Region = 'Asia' | 'Oceania' | 'Europe' | 'Africa' | 'Americas' | 'Antarctic';

export type StartOfWeek = 'sunday' | 'monday' | 'saturday';

export type Status = 'officially-assigned' | 'user-assigned';
