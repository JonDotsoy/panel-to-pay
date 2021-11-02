import React, { FC, useCallback, useEffect, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog'
import { dateFormatDate } from "./lib/date-format"
import { Button } from "./button";
import { InputCurrency } from "./input-currency";
import { Code } from "./code";
import { InputDate } from "./input-date";
import { nextTick } from 'process'
import { Charge, useChargeMap, History, toHistory } from "./charge.hook";

type A<T> = T extends { [k: string]: infer U } ? U : never
type H = Charge['history']
type T = Exclude<A<H>, undefined>

interface Props {
  historyKey: string
  date: Date;
  onChange?: (values: T | null) => void;
}

export const PanelPay: FC<Props> = ({ date: e, historyKey }) => {
  const { values } = useChargeMap();
  const history = toHistory(values.getHistory(historyKey));
  const [date, setDate] = useState(history?.date ?? e);
  const [currency, setCurrency] = useState(history?.currency ?? 0);

  const tickChange = (partialHistory?: Partial<History>) => {
    const history = toHistory({
      date,
      ...partialHistory,
    });
    if (history) {
      values.setHistory(historyKey, history);
    }
  }

  const onChangeDate = (value: Date) => {
    setDate(value);
    tickChange({ date: value });
  }

  const onChangeCurrency = (value: number) => {
    setCurrency(value);
    tickChange({ currency: value });
  }

  const onDelete = () => {
    setDate(e);
    setCurrency(0);
    values.removeHistory(historyKey);
  }

  return (
    <div>
      <Dialog.Root>
        <Dialog.Overlay className="bg-gray-800 bg-opacity-30 fixed inset-0"></Dialog.Overlay>

        <Dialog.Trigger asChild>
          <Button
            typeStyle={history ? "secondary" : 'default'}
          >
            {dateFormatDate.format(date)}
          </Button>
        </Dialog.Trigger>
        <Dialog.Content className="bg-white fixed p-4 border border-gray-400 shadow-md transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div>
            <Dialog.Title>
              <div>Fecha de pago</div>
              <h2 className="text-xl">
                <InputDate defaultValue={date} onChange={onChangeDate} />
              </h2>
            </Dialog.Title>

            <Dialog.Description>

              <div>
                <label>Valor</label>
                <InputCurrency
                  onChangeValue={onChangeCurrency}
                  defaultValue={currency}
                  options={[
                    { value: 380_000 },
                    { value: 1_000 },
                    { value: 30_000 },
                    { value: 90_000 },
                  ]}
                />
              </div>

            </Dialog.Description>

            <div className="flex justify-end space-x-2">
              <Dialog.Close asChild>
                <Button typeStyle="danger" onClick={onDelete}>Borrar</Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button typeStyle="secondary">Cerrar</Button>
              </Dialog.Close>
              {/* <Dialog.Close asChild>
                <Button typeStyle="primary">Marcar como pagado</Button>
              </Dialog.Close> */}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      {/* <Code key={i} src={e && dateFormatDate.format(e)} /> */}

      {/* <Code src={history}></Code> */}
    </div>
  )
}
