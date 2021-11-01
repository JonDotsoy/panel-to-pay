import classNames from "classnames";
import { ChangeEvent, FC, InputHTMLAttributes, useMemo, useRef, useState } from "react"
import { Button } from "./button";
import { PencilSolid } from "./icons/solid/pencil";
import { selectNumberFormat } from "./lib/select-number-format";
import { useLocale } from "./locale";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  helpStringFormat?: boolean
  locale?: string
  currency?: string
  options?: {
    value: number
  }[]
  onChangeValue?: (value: number) => void
}

let kName = 0;

export const InputCurrency: FC<Props> = ({
  helpStringFormat = true,
  defaultValue,
  onChange,
  currency = 'CLP',
  pattern = "^\d+$",
  type = "number",
  options,
  onChangeValue,
  ...props
}) => {
  const locale = useLocale();
  const k = useMemo(() => `item-${kName++}`, []);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(defaultValue)
  const [valueEditable, setValueEditable] = useState(!options)
  const valueNum = useMemo(() => Number(value), [value])
  const noValue = Number.isNaN(valueNum) || !valueNum

  const onChangeWrap = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    setValue(e.target.value);
    onChangeValue?.(Number(e.target.value));
  }

  const changeValue = (nextValue: number) => {
    setValue(nextValue.toString());
    onChangeValue?.(nextValue);
    if (inputRef.current) {
      inputRef.current.value = nextValue.toString();
    }
  }

  return (
    <>
      <div className="flex justify-start items-center text-xl pb-2">
        {noValue ? 'Selecciona un valor' : selectNumberFormat(locale, currency).format(valueNum)}
      </div>
      {options &&
        <div className="inline-flex flex-wrap" style={{ maxWidth: 600 }}>
          {options?.map(({ value: v }) => (
            <Button
              key={v}
              onClick={() => changeValue(v)}
              typeStyle={valueNum === v ? 'disabled' : 'default'}
              disabled={valueNum === v}
              className="inline-flex"
            >{selectNumberFormat(locale, currency).format(v)}</Button>
          ))}
          <Button onClick={() => setValueEditable(v => !v)} className="inline-flex justify-center items-center"><PencilSolid className="mr-2" /> Otro</Button>
        </div>
      }
      {valueEditable &&
        <div className="flex">
          <input
            className="border p-2 flex-grow"
            ref={inputRef}
            defaultValue={value}
            onChange={onChangeWrap}
            pattern={pattern}
            type={type}
            autoFocus
            {...props}
          />
        </div>
      }
    </>
  )
}
