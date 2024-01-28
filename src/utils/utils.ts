import { ModalSubmitInteraction } from "discord.js"
import * as R from "remeda"
import { z } from "zod"

export function mapModalToSchema<T extends z.ZodObject<any>>(
	interaction: ModalSubmitInteraction,
	schema: T
): z.infer<T> {
	return R.pipe(
		schema.shape,
		R.mapValues((_value, key) => interaction.fields.getField(key)?.value),
		(s) => schema.parse(s)
	)
}
export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
export async function retry<R>({
	fn,
	interval = 5000,
	onError = () => {},
	timeout = 60000,
	tries = 3,
}: {
	tries?: number
	interval?: number
	fn: () => R
	timeout?: number
	onError?: (err: unknown) => void
}) {
	let triesLeft = tries
	const timeoutFn = async () => {
		await sleep(interval)
		throw new Error(`Timeout after ${timeout} ms.`)
	}
	while (triesLeft > 0) {
		try {
			return await Promise.race([fn(), timeoutFn()])
		} catch (err) {
			onError(err)
			triesLeft--
			if (triesLeft === 0) {
				throw err
			}
			await sleep(interval)
		}
	}
	throw new Error(`Tried ${tries} times but failed.`)
}

export function then<T, R>(
	fn: (a: T extends Promise<infer S> ? S : never) => R
): (a: T) => Promise<R> {
	return async (promise: any) => fn(await promise)
}

type FlattenPromises<T> = T extends Promise<infer U> ? FlattenPromises<U> : T

export async function flattenPromises<T>(p: T): Promise<FlattenPromises<T>> {
	while (p instanceof Promise) {
		p = await p
	}
	return p as FlattenPromises<T>
}

export function mergeMap<T, R>(
	fn: (item: T, index: number, collection: T[]) => R
): (a: T[]) => Promise<Awaited<R>[]> {
	return async (items: T[]) => Promise.all(items.map(fn))
}

export function thenMergeMap<T, R>(
	fn: (item: T, index: number, collection: T[]) => R
): (items: Promise<T[]>) => Promise<Awaited<R>[]> {
	const f = then(mergeMap(fn))
	return (items: Promise<T[]>) => flattenPromises(f(items))
}

export function isNotUndefined<T>(s: T): s is Exclude<T, undefined | void> {
	return s !== undefined
}
