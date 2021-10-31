import React, { FC, useEffect, useMemo, useState } from "react"
import { Map } from "immutable"
import { dateFormat, dateFormatDate } from "./date-format"
import { Code } from "./code"
import { nextTick } from 'process'
import { Period } from "./Period"
import classNames from "classnames"
import * as AlertDialog from '@radix-ui/react-alert-dialog'

const n = (val: any) => val === "" ? null : val
const nNumber = (val: any) => val === "" ? null : Number(val)

const d = new Date()

d.setMonth(d.getMonth() - 4)

export const InputSelectRepeats: FC<{ defaultValue?: any, onChange?: (v: any) => void }> = ({ defaultValue, onChange }) => {
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
            <option value="-1">Ultimo dia del mes</option>
            <option value="-2">Anteultimo dia del mes</option>
            <option value="-3">Tres dias ante del fin de mes</option>
            <option value="-4">Cuatro dias ante del fin de mes</option>
            <option value="-5">Cinco dias ante del fin de mes</option>
            <option value="-6">Seis dias ante del fin de mes</option>
            <option value="-7">Siete dias ante del fin de mes</option>
            {/* <option value="-3">Tercer dia del mes</option> */}
            <option value="1">Primer dia del mes</option>
            <option value="2">Segundo dia del mes</option>
            <option value="3">Tercer dia del mes</option>
            <option value="4">Cuarto dia del mes</option>
            <option value="5">Quinto dia del mes</option>
            <option value="6">Sexto dia del mes</option>
            <option value="7">Septimo dia del mes</option>
            <option value="8">Octavo dia del mes</option>
            <option value="9">Noveno dia del mes</option>
            <option value="10">Decimo dia del mes</option>
            <option value="11">Onceavo dia del mes</option>
            <option value="12">Doceavo dia del mes</option>
            <option value="13">Treceavo dia del mes</option>
            <option value="14">Catorceavo dia del mes</option>
            <option value="15">Quinceavo dia del mes</option>
            <option value="16">Diciseisavo dia del mes</option>
            <option value="17">Dicisieteavo dia del mes</option>
            <option value="18">Diciochoavo dia del mes</option>
            <option value="19">Diciennoveavo dia del mes</option>
            <option value="20">Veinteavo dia del mes</option>
            <option value="21">Veintiunoavo dia del mes</option>
            <option value="22">Veintidosavo dia del mes</option>
            <option value="23">Veintitresavo dia del mes</option>
            <option value="24">Veinticuatroavo dia del mes</option>
            <option value="25">Veinticincoavo dia del mes</option>
            <option value="26">Veintiseisavo dia del mes</option>
            <option value="27">Veintisieteavo dia del mes</option>
            <option value="28">Veintiochoavo dia del mes</option>
          </select>
        }
      </div>

      {period && <>
        <div>Siguiente pago el {period && dateFormatDate.format(period.nextDate())}</div>

        <div>
          {/* <h2>Check</h2> */}
          <div className="flex flex-wrap">
            {Array.from(period?.range(d, 7) ?? []).map((e, i) => <div>
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button className={classNames(
                    "transition-all border px-4 py-2 border-gray-300 text-gray-700",
                    "hover:border-blue-500 hover:text-blue-500 hover:shadow-md"
                  )}>
                    {dateFormatDate.format(e)}
                  </button>
                </AlertDialog.Trigger>
                <AlertDialog.Content className="bg-gray-700 bg-opacity-30 w-screen h-screen flex items-center justify-center ">
                  <div style={{ minWidth: 500 }} className="bg-white p-4 space-y-4 shadow-md">
                    <AlertDialog.Title>
                      <h2 className="text-xl">
                        Fecha {dateFormatDate.format(e)}
                      </h2>
                    </AlertDialog.Title>

                    <AlertDialog.Description>

                      <div>
                        <label htmlFor={`vl-pay-${i}`}>Valor pagado</label>
                        <input id={`vl-pay-${i}`} className="border w-full p-2" />
                        <div className="flex flex-wrap">
                          {["100", "200", "3.000"].map(e =>
                            <button key={e}
                              className={classNames(
                                "border px-4 py-2 transition-all",
                                "hover:border-blue-500 hover:text-blue-500 hover:shadow-md",
                                "focus:border-blue-500 focus:text-blue-500 focus:shadow-md",
                              )}
                              onClick={() => {
                                const v = document.getElementById(`vl-pay-${i}`)
                                if (v) {
                                  // @ts-ignore
                                  v.value = e
                                }
                              }}
                            >{e}</button>
                          )}
                        </div>
                      </div>

                    </AlertDialog.Description>

                    <div className="flex justify-end space-x-2">
                      <AlertDialog.Cancel asChild>
                        <button className={classNames(
                          "border px-4 py-2 border-gray-400 transition-all",
                          "hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:shadow-md",
                          "focus:bg-blue-500 focus:text-white focus:border-blue-500 focus:shadow-md",
                        )}>Cancelar</button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button className={classNames(
                          "border px-4 py-2 border-gray-400 transition-all",
                          "hover:border-green-400 hover:bg-green-400 hover:shadow-md hover:text-white",
                          "hover:border-green-400 focus:bg-green-400 focus:shadow-md focus:text-white",
                        )}>Marcar como pagado</button>
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