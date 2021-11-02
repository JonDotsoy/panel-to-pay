import classNames from "classnames"
import React, { FC, useState } from "react"
import { Button } from "./button"
import { dateFormatDate } from "./lib/date-format"
import { PencilSolid } from "./icons/solid/pencil"
import { Temporal } from '@js-temporal/polyfill'

// @ts-ignore
globalThis.Temporal = Temporal

interface Props {
  defaultValue: Date
  onChange?: (value: Date) => void
}

export const InputDate: FC<Props> = ({ defaultValue, onChange }) => {
  const [valueEditable, setValueEditable] = useState(false)
  const [value, setValue] = useState(defaultValue)

  const isoString = value.toISOString().substr(0, 10);

  const onChangeWrap = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value)
    const zonedDateTime = Temporal.ZonedDateTime.from({
      timeZone: 'America/Santiago',
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      day: d.getUTCDate(),
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0
    })

    const date = new Date(zonedDateTime.toPlainDateTime().toString())

    setValue(date);
    onChange?.(date);
  }

  return <>
    <div className="flex">
      {valueEditable && <input className="border p-2" type="date" defaultValue={isoString} onChange={onChangeWrap} />}
      {!valueEditable && dateFormatDate.format(value)}
      <button
        className={classNames(
          "ml-2 inline-flex justify-center items-center text-sm text-gray-500 transition-all",
          "hover:text-gray-800"
        )}
        onClick={() => setValueEditable(valueEditable => !valueEditable)}
      ><PencilSolid className="mr-2" size="4" /> Editar</button>
    </div>
  </>
}
