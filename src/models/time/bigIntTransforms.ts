import z from "zod";

export const bigIntToStringPipeline = z.coerce.string().refine((val) => {
	return !isNaN(Number(val));
}, "The bigInt provided resulted in NaN.");

export const stringToBigIntPipeline = z.coerce.bigint().refine((val) => {
	return !isNaN(Number(val));
}, "The string provided resulted in NaN for bigInt.");

export const numberToBigIntPipeline = z.coerce.bigint().refine((val) => {
	return !isNaN(Number(val));
}, "The number provided resulted in NaN for bigInt.");

export const bigIntToNumberPipeline = z.coerce.number().refine((val) => {
	return !isNaN(Number(val));
}, "The bigInt provided resulted in NaN for number.");

export const inputToBigIntPipeline = z.union([
	bigIntToStringPipeline,
	stringToBigIntPipeline,
	numberToBigIntPipeline,
	bigIntToNumberPipeline,
]);
