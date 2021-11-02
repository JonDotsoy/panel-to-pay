import { DocumentSnapshot, Timestamp } from 'firebase/firestore'
import { createContext, createElement, FC, useContext, useMemo, useState } from 'react'
import { Map } from 'immutable'


const isObj = (val: any) => typeof val === 'object' && val !== null
const isNumber = (val: any): val is number => typeof val === 'number'
const isString = (val: any): val is string => typeof val === 'string'
const isDate = (val: any): val is Date => val instanceof Date
const isTimestampObj = (val: any): val is { seconds: number, nanoseconds: number } => isObj(val) && isNumber(val.seconds) && isNumber(val.nanoseconds)

const toChange = (data: any) => {
  if (!isObj(data)) return null;
  if (!isTimestampObj(data.createdAt)) return null;

  const name = data.name;
  const updatedAt = data.updatedAt;

  return {
    name: typeof name === 'string' ? name : undefined,
    period: toPeriod(data.period)! ?? {},
    history: toMapHistory(data.history),
    updatedAt: isTimestampObj(updatedAt) ? new Timestamp(updatedAt.seconds, updatedAt.nanoseconds).toDate() : undefined,
    createdAt: new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds).toDate(),
  }
}

export const toPeriod = (data: any) => {
  if (!isObj(data)) return undefined;

  const type = data.type
  const dayOfMonth = data['day-of-month']

  if (!isString(type) || !isNumber(dayOfMonth)) return undefined;

  return {
    type,
    'day-of-month': dayOfMonth,
  }
}

export const toHistory = (data: any): undefined | { currency?: number, date: Date } => {
  if (!isObj(data)) return undefined;

  const currency = data.currency;
  const date = data.date;

  if (!isTimestampObj(date) && !isDate(date)) return undefined;

  return {
    currency: isNumber(currency) ? currency : undefined,
    date: isDate(date) ? date : new Timestamp(date.seconds, date.nanoseconds).toDate(),
  }
}

export type History = Exclude<ReturnType<typeof toHistory>, undefined>

const toMapHistory = (data: any) => {
  if (!isObj(data)) return {};

  return Object.fromEntries(Object.entries(data).map(([key, value]) => ([key, toHistory(value)])))
}

export type Charge = Exclude<ReturnType<typeof toChange>, null>
export type ChargeMap = Map<string, any>

const Hook = (doc: DocumentSnapshot) => {
  const chargeMap = useMemo(() => {
    const charge = toChange(doc.data())
    if (!charge) return null;
    return Map<string, any>(charge)
  }, [doc]);
  const initial = useMemo(() => chargeMap, [doc])!;
  const [chargeMapValue, setChargeMapValue] = useState(chargeMap);

  if (!chargeMapValue || !chargeMap) return null

  const getIn = (...paths: string[]) => chargeMapValue?.getIn(paths);
  const setIn = (...paths: string[]) => (value: any) =>
    setChargeMapValue(chargeMapValue => chargeMapValue!.setIn(paths, value));

  const removeIn = (...paths: string[]) => () =>
    setChargeMapValue(chargeMapValue => chargeMapValue!.removeIn(paths));


  return {
    doc,
    chargeMap: chargeMapValue,
    initial,
    getIn,
    setIn,
    removeIn,
  }
}

const chargeContext = createContext<ReturnType<typeof Hook> | null>(null)

export const ChargeProvider: FC<{ doc: DocumentSnapshot }> = ({ doc, children }) => {
  const charge = Hook(doc);

  if (!charge) return null

  return createElement(chargeContext.Provider, { value: charge }, children)
}

export const useChargeMap = () => {
  const { doc, chargeMap, getIn, setIn, removeIn, initial } = useContext(chargeContext)!;

  const changed = !initial?.equals(chargeMap) ?? false

  return {
    doc,
    initial,
    chargeMap,
    changed,
    values: {
      getName: () => getIn('name') as Charge['name'],
      setName: (value: Charge['name']) => setIn('name')(value),
      getPeriod: () => getIn('period') as Charge['period'],
      removePeriod: () => setIn('period')({}),
      // setPeriod: (value: Map<any, any>) => setIn('period')(value),
      getCreatedAt: () => getIn('createdAt') as Charge['createdAt'],
      getUpdatedAt: () => getIn('updatedAt') as Charge['updatedAt'],
      period: {
        getType: () => getIn('period', 'type') as Charge['period']['type'],
        setType: (value: Charge['period']['type']) => setIn('period', 'type')(value),
        getDayOfMonth: () => getIn('period', 'day-of-month') as Charge['period']['day-of-month'],
        setDayOfMonth: (value: Charge['period']['day-of-month']) => setIn('period', 'day-of-month')(value),
      },
      getHistory: (historyKey: string) => getIn('history', historyKey) as History | undefined,
      setHistory: (historyKey: string, value: History) => {
        setIn('history', historyKey, 'date')(value.date)
        setIn('history', historyKey, 'currency')(value.currency)
      },
      removeHistory: (historyKey: string) => setIn('history', historyKey)({}),
    },
    getValue: () => chargeMap.toJS(),
  } as const;
}
