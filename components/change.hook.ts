import { DocumentSnapshot, Timestamp } from 'firebase/firestore'

const isObj = (val: any) => typeof val === 'object' && val !== null
const isNumber = (val: any) => typeof val === 'number'
const isTimestampObj = (val: any): val is { seconds: number, nanoseconds: number } => isObj(val) && isNumber(val.seconds) && isNumber(val.nanoseconds)
const toChangeOjb = (data: any) => {
  if (!isObj(data)) return null;
  if (!isTimestampObj(data.createdAt)) return null;

  const name = data.name;
  const period = data.period ?? {};
  const updatedAt = data.updatedAt;

  return {
    name: typeof name === 'string' ? name : undefined,
    period,
    updatedAt: isTimestampObj(updatedAt) ? new Timestamp(updatedAt.seconds, updatedAt.nanoseconds).toDate() : undefined,
    createdAt: new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds).toDate(),
  }
}

export const useChange = (doc: DocumentSnapshot) => {
  const data = toChangeOjb(doc.data());
  return data;
}
