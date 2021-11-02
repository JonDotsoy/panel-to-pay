import React, { FC, useMemo, useState } from "react"
import { Map } from "immutable"
import { dateFormatDate } from "./lib/date-format"
import { nextTick } from 'process'
import { Period } from "./lib/period"
import { optionsDayOfMonth } from "./statics/options-day-of-month"
import { PanelPay } from "./panel-pay"
import { Charge, toHistory, toPeriod } from "./charge.hook"
import { Code } from "./code"

const n = (val: any) => val === "" ? null : val
const nNumber = (val: any) => val === "" ? null : Number(val)

const d = new Date()

d.setMonth(d.getMonth() - 4)

type Props = {
  defaultValue?: Charge['period']
  onChange?: (v: Charge['period'] | null) => void
}

export const InputSelectRepeats: FC<Props> = ({ defaultValue, onChange }) => {
  const [value, setValue] = useState(() => Map(defaultValue ?? {}))
  // const type = useMemo(() => value.getIn(["type"]) as Charge['period']['type'], [value])
  const period = useMemo(() => Period.from(value.toJS()), [value]);

  const set = (...path: string[]) => (value: any) => setValue(v => {
    const r = v.setIn(path, value)
    if (onChange) {
      const h = toPeriod(r.toJS())
      if (h) {
        onChange(h)
      } else {
        onChange(null)
      }
    }
    return r;
  })

  return (
    <>
      <div>
        <select className="p-2 border border-gray-200" onChange={v => set('type')(n(v.target.value))} defaultValue={value.get('type')}>
          <option value="">Select</option>/
          <option value="monthly">Todos los meses</option>
        </select>
        {
          value.get('type') === 'monthly' &&
          <select className="p-2 border border-gray-200" onChange={v => set('day-of-month')(nNumber(v.target.value))} defaultValue={value.get('day-of-month')}>
            <option value="">Select</option>
            {optionsDayOfMonth.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        }
      </div>

      {period &&
        <>
          <div>Siguiente pago el {period && dateFormatDate.format(period.nextDate().toDate())}</div>
        </>
      }

      {/* {period && <>
        <div>Siguiente pago el {period && dateFormatDate.format(period.nextDate().toDate())}</div>

        <div>
          <div className="flex flex-wrap">
            {Array.from(period?.range(d, 7) ?? []).map((e, i) => null
              // <PanelPay key={i} i={i} date={e.toDate()} onChange={set('history', e.toKey())} defaultValues={defaultValue?.history?.[e.toKey()]} />
            )}
          </div>
        </div>
      </>
      } */}

      {/* <Code src={{
        now: new Date().toJSON(),
        a: period?.nextDate()?.toJSON(),
      }}></Code> */}
      {/* <Code src={period}></Code> */}
      {/* <Code src={value.toJS()}></Code> */}
    </>
  )
}