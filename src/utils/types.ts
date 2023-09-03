

export type ValueOf<T> = T[keyof T]


export type PublicKeyOf<T> = Exclude<keyof T, `_${string}`>