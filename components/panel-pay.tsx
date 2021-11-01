import React, { FC } from "react";
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { dateFormatDate } from "./date-format"
import { Button } from "./button";
import { InputCurrency } from "./input-currency";
import { Code } from "./code";
import { InputDate } from "./input-date";
import { Charge } from "./charge.hook";

type A<T> = T extends { [k: string]: infer U } ? U : never
type H = Charge['period']['history']
type T = A<H>

interface Props {
  i: number;
  date: Date;
  onChange?: (values: T | null) => void;
  defaultValues?: T;
}

export const PanelPay: FC<Props> = ({ i, date: e, onChange, defaultValues }) => {
  const [values, setValues] = React.useState<T | undefined>(defaultValues);

  const onChangeCurrencyValue = (values: number) => {
    setValues(v => {
      const r = { ...v, currency: values }

      onChange?.(r)

      return r
    })

  }

  const onChangeDateValue = (values: Date) => {
    setValues(v => {
      const r = { ...v, date: values }

      onChange?.(r)

      return r
    })
  }

  return (
    <div>
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <Button
            typeStyle={defaultValues ? "secondary" : 'default'}
          >
            {defaultValues?.date ? dateFormatDate.format(defaultValues.date) : dateFormatDate.format(e)}
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content className="bg-gray-700 bg-opacity-30 w-screen h-screen flex items-center justify-center ">
          <div style={{ minWidth: 500 }} className="bg-white p-4 space-y-4 shadow-md border border-gray-400">
            <AlertDialog.Title>
              <div>Fecha de pago</div>
              <h2 className="text-xl">
                <InputDate defaultValue={defaultValues?.date ?? e} onChange={onChangeDateValue} />
              </h2>
            </AlertDialog.Title>

            <AlertDialog.Description>

              <div>
                <label htmlFor={`vl-pay-${i}`}>Valor</label>
                <InputCurrency
                  id={`vl-pay-${i}`}
                  onChangeValue={onChangeCurrencyValue}
                  defaultValue={defaultValues?.currency}
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

      <Code src={defaultValues}></Code>
    </div>
  )
}
