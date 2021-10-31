import { periodTypes } from "./constant/period-types.constant";
import { Temporal } from '@js-temporal/polyfill'


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
      return d;
    }
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

  static from(val: any) {
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
    // return new Period(val.type);
  }
}
