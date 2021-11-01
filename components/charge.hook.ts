import { DocumentSnapshot, Timestamp } from 'firebase/firestore'

const isObj = (val: any) => typeof val === 'object' && val !== null
const isNumber = (val: any) => typeof val === 'number'
const isTimestampObj = (val: any): val is { seconds: number, nanoseconds: number } => isObj(val) && isNumber(val.seconds) && isNumber(val.nanoseconds)
const toChangeOjb = (data: any) => {
  if (!isObj(data)) return null;
  if (!isTimestampObj(data.createdAt)) return null;

  const name = data.name;
  const updatedAt = data.updatedAt;

  return {
    name: typeof name === 'string' ? name : undefined,
    period: toPeriod(data.period),
    // history: toObjHistory(data.history),
    updatedAt: isTimestampObj(updatedAt) ? new Timestamp(updatedAt.seconds, updatedAt.nanoseconds).toDate() : undefined,
    createdAt: new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds).toDate(),
  }
}

const toPeriod = (data: any): { type?: string, ['day-of-month']?: number, history?: ReturnType<typeof toObjHistory> } => {
  if (!isObj(data)) return {};

  const type = data.type
  const dayOfMonth = data['day-of-month']

  return {
    type: typeof type === 'string' ? type : undefined,
    'day-of-month': typeof dayOfMonth === 'number' ? dayOfMonth : undefined,
    history: toObjHistory(data.history),
  }
}

const toHistory = (data: any): { currency?: number, date?: Date } => {
  if (!isObj(data)) return {};

  const currency = data.currency;
  const date = data.date;

  return {
    currency: typeof currency === 'number' ? currency : undefined,
    date: isTimestampObj(data) ? new Timestamp(date.seconds, date.nanoseconds).toDate() : undefined,
  }
}

const toObjHistory = (data: any) => {
  if (!isObj(data)) return {};

  return Object.fromEntries(Object.entries(data).map(([key, value]) => ([key, toHistory(value)])))
}

export type Charge = Exclude<ReturnType<typeof toChangeOjb>, null>

export const useCharge = (doc: DocumentSnapshot) => {
  const data = toChangeOjb(doc.data());
  return data;
}
