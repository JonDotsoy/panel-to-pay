
const x = (assertFn: Function, constructorOpt: any) => {
  try {
    return assertFn();
  } catch (e) {
    if (e instanceof Error) Error.captureStackTrace(e, constructorOpt);
    throw e;
  }
}

export function notToBeNull<T>(val: T): asserts val is Exclude<typeof val, null> {
  x(() => expect(val).not.toBeNull(), notToBeNull);
}

export function notToBeUndefined<T>(val: T): asserts val is Exclude<typeof val, undefined> {
  x(() => expect(val).not.toBeUndefined(), notToBeUndefined);
}

export function toBeDefined<T>(val: T): asserts val is Exclude<typeof val, undefined> {
  x(() => expect(val).toBeDefined(), toBeDefined);
}
