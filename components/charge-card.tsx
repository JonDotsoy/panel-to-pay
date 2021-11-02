import React, { FC, useMemo } from 'react'
import { inspect } from 'util'
import { Map, setIn } from 'immutable'
import { DocumentSnapshot } from 'firebase/firestore'
import { ChargeProvider, useChargeMap } from './charge.hook'
import { useValuesChanges } from './values-changes'
import { ButtonDeleteCharge } from './button-delete-charge'
import classNames from 'classnames'
import { SaveSolid } from './icons/solid/save'
import { useUpdateCharge } from './update-charge.hook'
import { SpinIcon } from './spin-icon'
import { CheckSolid } from './icons/solid/check'
import { InputSelectRepeats } from './input-select-repeats'
import { dateFormat, dateFormatDate } from './lib/date-format'
import { Code } from './code'
import { Button } from './button'
import { Period } from './lib/period'
import { PanelPay } from './panel-pay'

const d = new Date()

d.setMonth(d.getMonth() - 4)

export interface ChargeCardProps {
}

const ChargeCardContent: FC<ChargeCardProps> = ({ }) => {
  const { doc, changed, getValue, values, chargeMap, initial } = useChargeMap();
  const { loading: loadingUpdateCharge, updated, updateCharge } = useUpdateCharge(doc);
  const period = useMemo(() => Period.from(values.getPeriod()), [chargeMap]);

  const updatedAt = values.getUpdatedAt();

  const getSuggestionOptions = () => {
    return Array.from(new Set(Object.values(values.getMapHistory()).map(history => history?.currency).filter((currency): currency is Exclude<typeof currency, undefined> => !!currency)))
      .map(c => ({ value: c }))
  }

  const suggestionOptions = useMemo(getSuggestionOptions, [chargeMap]);

  return <div className="border p-4">
    <form
      onSubmit={e => {
        e.preventDefault();
        updateCharge(getValue());
      }}
    >
      <div>
        <input
          type="text"
          name="name"
          defaultValue={values.getName()}
          onChange={(e) => values.setName(e.target.value)}
          className={classNames(
            "w-full border p-2 border-gray-200",
            "hover:border-gray-300"
          )}
          placeholder="Titulo Cobro"
          autoComplete="off"
        />
      </div>
      <div>
        <InputSelectRepeats
          defaultValue={values.getPeriod()}
          onChange={(value) => {
            if (value) {
              values.period.setType(value.type);
              values.period.setDayOfMonth(value['day-of-month']);
            } else {
              values.removePeriod();
            }
          }}
        />
      </div>
      {changed && <div>* Con cambios</div>}

      {
        period &&
        <>
          <div>
            <div className="flex flex-wrap">
              {Array.from(period?.range(d, 7) ?? []).map((p, i) =>
                <PanelPay
                  key={p.toKey()}
                  historyKey={p.toKey()}
                  date={p.toDate()}
                  suggestionOptions={suggestionOptions}
                // onChange={set('history', e.toKey())}
                // defaultValues={defaultValue?.history?.[e.toKey()]}
                />
              )}
            </div>
          </div>
        </>
      }

      <div className="text-sm text-gray-500">
        Creado el {dateFormat.format(values.getCreatedAt())}
        {updatedAt && <> y actualizado por ultima vez el {dateFormat.format(updatedAt)}</>}
      </div>
      <div className="flex space-x-2">
        <Button
          className={classNames(
            "transition-all flex justify-center items-center",
          )}
          typeStyle={!changed ? 'disabled' : 'primary'}
          disabled={!changed}
        >
          {
            updated
              ? <>
                <CheckSolid className="mr-2" />
                Cambio guardados
              </>
              : <>
                <SpinIcon className="mr-2" spinning={loadingUpdateCharge}><SaveSolid className="mr-2" /></SpinIcon>
                Guardar Cambios
              </>
          }
        </Button>
        <ButtonDeleteCharge doc={doc} />
      </div>
      <Code src={{
        equal: initial.equals(chargeMap),
        initial: initial.toJS(),
        chargeMap: chargeMap.toJS()
      }}></Code>
    </form>
  </div>
}

export const ChargeCard: FC<{ doc: DocumentSnapshot } & ChargeCardProps> = ({ doc, ...props }) => {
  return <ChargeProvider doc={doc}>
    <ChargeCardContent {...props} />
  </ChargeProvider>
}