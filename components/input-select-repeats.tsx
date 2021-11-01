import React, { FC, useEffect, useMemo, useState } from "react"
import { Map } from "immutable"
import { dateFormat, dateFormatDate } from "./date-format"
import { Code } from "./code"
import { nextTick } from 'process'
import { Period, PeriodDayOfMonth } from "./lib/period"
import classNames from "classnames"
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { optionsDayOfMonth } from "./statics/options-day-of-month"
import { Button } from "./button"
import { InputCurrency } from "./input"

const n = (val: any) => val === "" ? null : val
const nNumber = (val: any) => val === "" ? null : Number(val)

const d = new Date()

d.setMonth(d.getMonth() - 4)


export const InputSelectRepeats: FC<{ defaultValue?: any, onChange?: (v: any) => void }> = ({ defaultValue, onChange }) => {
  const numberformat = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    currencyDisplay: 'name',
  })

  const [value, setValue] = useState(() => Map(defaultValue ?? {}))
  const type = useMemo(() => value.getIn(["type"]), [value])
  const period = useMemo(() => Period.from(value.toJS()), [value]);

  const set = (...path: string[]) => (value: any) => setValue(v => {
    const r = v.setIn(path, value)
    nextTick(() => onChange?.(r.toJS()))
    return r;
  })

  return (
    <>
      <div>
        <select className="p-2 border border-gray-200" onChange={v => set('type')(n(v.target.value))} defaultValue={defaultValue.type}>
          <option value="">Select</option>/
          <option value="monthly">Todos los meses</option>
        </select>
        {
          type === 'monthly' &&
          <select className="p-2 border border-gray-200" onChange={v => set('day-of-month')(nNumber(v.target.value))} defaultValue={defaultValue['day-of-month']}>
            <option value="">Select</option>
            {optionsDayOfMonth.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        }
      </div>

      {period && <>
        <div>Siguiente pago el {period && dateFormatDate.format(period.nextDate())}</div>

        <div>
          <div className="flex flex-wrap">
            {Array.from(period?.range(d, 7) ?? []).map((e, i) => <div>
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <Button>{dateFormatDate.format(e)}</Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content className="bg-gray-700 bg-opacity-30 w-screen h-screen flex items-center justify-center ">
                  <div style={{ minWidth: 500 }} className="bg-white p-4 space-y-4 shadow-md border border-gray-400">
                    <AlertDialog.Title>
                      <div>Fecha de pago</div>
                      <h2 className="text-xl">
                        Fecha {dateFormatDate.format(e)}
                      </h2>
                    </AlertDialog.Title>

                    <AlertDialog.Description>

                      <div>
                        <label htmlFor={`vl-pay-${i}`}>Valor</label>
                        <InputCurrency
                          options={[
                            { value: 380_000 },
                            { value: 1_000 },
                            { value: 30_000 },
                            { value: 90_000 },
                          ]}
                        />
                      </div>

                    </AlertDialog.Description>

                    <div className="flex justify-end space-x-2">
                      <AlertDialog.Cancel asChild>
                        <Button typeStyle="secondary">Cancelar</Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <Button typeStyle="primary">Marcar como pagado</Button>
                      </AlertDialog.Action>
                    </div>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Root>

              {/* <Code key={i} src={e && dateFormatDate.format(e)} /> */}
            </div>)}
          </div>
        </div>
      </>
      }

      {/* <Code src={{
        now: new Date().toJSON(),
        a: period?.nextDate()?.toJSON(),
      }}></Code> */}
      {/* <Code src={period}></Code> */}
      {/* <Code src={value.toJSON()}></Code> */}
    </>
  )
}