import { periodTypes } from "../constant/period-types.constant";
import { Temporal } from '@js-temporal/polyfill'

export interface PeriodDayOfMonth {
  type: 'monthly'
  'day-of-month': number
}

export type PeriodTypes = PeriodDayOfMonth

function menusOrEqualDate(date1: Date, date2: Date) {
  const dayOnMilliseconds = 1000 * 60 * 60 * 24;
  const dt1 = Math.floor(date1.getTime() / dayOnMilliseconds);
  const dt2 = Math.floor(date2.getTime() / dayOnMilliseconds);
  // console.log({dt1, dt2});
  return dt1 <= dt2
}

function setDateInMonth(month: Date, numberDate: number) {
  const date = new Date(month);
  // reset time
  date.setHours(0, 0, 0, 0);
  date.setDate(1);
  if (numberDate > 0) {
    date.setDate(numberDate);
  }
  if (numberDate < 0) {
    date.setMonth(date.getMonth() + 1);
    date.setDate(numberDate + 1);
  }
  return date;
}

class PeriodMonthlyPoint {
  private keyParts: number[];
  private str: string;
  private fullKeyParts: number[];
  private strFull: string;

  constructor(private date: Date) {
    this.keyParts = [
      date.getFullYear(),
      date.getMonth(),
      // date.getDate()
    ]

    this.fullKeyParts = [
      date.getFullYear(),
      date.getMonth(),
      // date.getDate()
    ]

    this.str = ['period-point', 'monthly', ...this.keyParts].join(':')
    this.strFull = ['period-point', 'monthly', ...this.fullKeyParts].join(':')
  }

  toDate() {
    return this.date;
  }

  toKey() {
    return this.str;
  }


  toJSON() {
    return this.toKey();
  }
}

export class Period {
  private constructor(private type: typeof periodTypes[keyof typeof periodTypes], private opts: { dayOfMonth: number; }) { }

  nextDate(from: Date = new Date()) {
    if (this.type === 'monthly') {
      let d = setDateInMonth(from, this.opts.dayOfMonth);
      // console.log(menusOrEqualDate(d, from));
      // while (menusOrEqualDate(d, from)) {
      //   d.setMonth(d.getMonth() + 1);
      //   d = setDateInMonth(d, this.opts.dayOfMonth);
      // }
      return new PeriodMonthlyPoint(d);
    }

    throw new Error(`Not implemented ${this.type}`);
  }

  * range(from: Date = new Date(), len = 10) {
    let d = new Date(from);
    for (let i = 0; i < len; i++) {
      yield this.nextDate(d);
      const nextDate = new Date(d);
      nextDate.setMonth(nextDate.getMonth() + 1);
      d = nextDate;
    }
  }

  private static fromNoTyped(val: any) {
    if (typeof val !== 'object' || val === null)
      return null;
    if (val.type === undefined)
      return null;
    if (!periodTypes.includes(val.type))
      return null;
    if (val.type === 'monthly') {
      if (typeof val['day-of-month'] !== 'number')
        return null;
      return new Period(val.type, { 'dayOfMonth': val['day-of-month'] });
    }

    return null;
  }

  static from<T>(value: T): T extends PeriodTypes ? Period : Period | null {
    return this.fromNoTyped(value) as any;
  }
}
